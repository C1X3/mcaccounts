import { z } from 'zod';
import { prisma } from '@/utils/prisma';
import { baseProcedure, createTRPCRouter } from '../init';
import { TRPCError } from '@trpc/server';
import { OrderStatus, PaymentType } from '@generated';
import { createCheckoutSession as createStripeCheckout } from '../providers/stripe';
import { createCheckoutSession as createPaypalCheckout } from '../providers/paypal';
import { createCheckoutSession as createCoinbaseCheckout } from '../providers/coinbase';

export const checkoutRouter = createTRPCRouter({
    processPayment: baseProcedure
        .input(
            z.object({
                items: z.array(
                    z.object({
                        productId: z.string(),
                        quantity: z.number().int().positive(),
                        price: z.number().positive(),
                        name: z.string(),
                    })
                ),
                customerInfo: z.object({
                    name: z.string().min(1),
                    email: z.string().email(),
                }),
                paymentType: z.nativeEnum(PaymentType),
                totalPrice: z.number().positive(),
            })
        )
        .mutation(async ({ input }) => {
            try {
                // 1. Create a pending order in the database
                const order = await prisma.order.create({
                    data: {
                        totalPrice: input.totalPrice,
                        paymentType: input.paymentType,
                        status: OrderStatus.PENDING,
                        CustomerInformation: {
                            create: {
                                name: input.customerInfo.name,
                                email: input.customerInfo.email,
                            }
                        },
                    }
                });

                // 2. Generate payment link based on the selected payment method
                let paymentUrl = '';

                const payloadForProviders = {
                    orderId: order.id,
                    items: input.items,
                    customerInfo: input.customerInfo,
                    totalPrice: input.totalPrice
                };

                switch (input.paymentType) {
                    case PaymentType.STRIPE:
                        paymentUrl = await createStripeCheckout(payloadForProviders);
                        break;
                    case PaymentType.PAYPAL:
                        paymentUrl = await createPaypalCheckout(payloadForProviders);
                        break;
                    case PaymentType.CRYPTO:
                        paymentUrl = await createCoinbaseCheckout(payloadForProviders);
                        break;
                    case PaymentType.CASH_APP:
                        // In a real implementation, you'd call Cash App API
                        paymentUrl = `https://cash.app/pay/${order.id}?redirect_url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/order/${order.id}`)}`;
                        break;
                    case PaymentType.VENMO:
                        // In a real implementation, you'd call Venmo API
                        paymentUrl = `https://venmo.com/checkout/${order.id}?redirect_url=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL}/order/${order.id}`)}`;
                        break;
                    default:
                        throw new TRPCError({
                            code: 'BAD_REQUEST',
                            message: 'Invalid payment method',
                        });
                }

                if (paymentUrl) {
                    for (const item of input.items) {
                        const product = await prisma.product.findUnique({
                            where: { id: item.productId },
                            select: {
                                stock: true,
                            }
                        });

                        if (!product) {
                            throw new TRPCError({
                                code: 'NOT_FOUND',
                                message: 'Product not found',
                            });
                        }

                        if (product.stock.length < item.quantity) {
                            throw new TRPCError({
                                code: 'BAD_REQUEST',
                                message: 'Not enough stock for product',
                            });
                        }

                        const oldestStock = product.stock.slice(0, item.quantity);
                        const filteredStock = product.stock.filter(stock => !oldestStock.includes(stock));
                        await prisma.product.update({
                            where: { id: item.productId },
                            data: { stock: filteredStock },
                        });

                        await prisma.orderItem.create({
                            data: {
                                orderId: order.id,
                                productId: item.productId,
                                quantity: item.quantity,
                                price: item.price,
                                codes: oldestStock,
                            }
                        });
                    }
                }

                return {
                    orderId: order.id,
                    paymentUrl,
                    success: true,
                };
            } catch (err) {
                console.error('Payment processing error:', err);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to process payment',
                });
            }
        }),

    getOrderStatus: baseProcedure
        .input(z.object({ orderId: z.string() }))
        .query(async ({ input }) => {
            const order = await prisma.order.findUnique({
                where: { id: input.orderId },
            });

            if (!order) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Order not found',
                });
            }

            if (order.status === OrderStatus.PAID || order.status === OrderStatus.DELIVERED) {
                return prisma.order.findUnique({
                    where: { id: input.orderId },
                    include: {
                        OrderItem: {
                            include: {
                                product: true,
                            },
                        },
                        CustomerInformation: true,
                    },
                });
            } else {
                return prisma.order.findUnique({
                    where: { id: input.orderId },
                    include: {
                        OrderItem: {
                            include: {
                                product: true,
                            },
                            select: {
                                quantity: true,
                                price: true,
                                product: true,
                                codes: false
                            }
                        },
                        CustomerInformation: true,
                    },
                });
            }
        }),

    updateOrderStatus: baseProcedure
        .input(
            z.object({
                orderId: z.string(),
                status: z.enum(['PENDING', 'PAID', 'DELIVERED', 'CANCELLED']),
            })
        )
        .mutation(async ({ input }) => {
            try {
                const order = await prisma.order.update({
                    where: { id: input.orderId },
                    data: { status: input.status },
                });

                return { success: true, order };
            } catch {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to update order status',
                });
            }
        }),
}); 