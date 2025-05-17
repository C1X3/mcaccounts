import { z } from 'zod';
import { prisma } from '@/utils/prisma';
import { baseProcedure, createTRPCRouter } from '../init';
import { TRPCError } from '@trpc/server';
import { OrderStatus } from '@generated';

export const checkoutRouter = createTRPCRouter({
    processPayment: baseProcedure
        .input(
            z.object({
                items: z.array(
                    z.object({
                        productId: z.string(),
                        quantity: z.number().int().positive(),
                        price: z.number().positive(),
                    })
                ),
                customerInfo: z.object({
                    name: z.string().min(1),
                    email: z.string().email(),
                }),
                paymentType: z.enum(['STRIPE', 'CRYPTO', 'PAYPAL', 'CASH_APP', 'VENMO']),
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
                        OrderItem: {
                            createMany: {
                                data: input.items.map(item => ({
                                    productId: item.productId,
                                    quantity: item.quantity,
                                    price: item.price,
                                }))
                            }
                        }
                    }
                });

                // 2. Generate payment link based on the selected payment method
                let paymentUrl = '';
                const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/order/${order.id}`;

                switch (input.paymentType) {
                    case 'STRIPE':
                        // In a real implementation, you'd call Stripe API
                        paymentUrl = `https://checkout.stripe.com/c/pay/cs_test_${order.id}?redirect_url=${encodeURIComponent(redirectUrl)}`;
                        break;
                    case 'PAYPAL':
                        // In a real implementation, you'd call PayPal API
                        paymentUrl = `https://www.paypal.com/checkoutnow?token=${order.id}&redirect_url=${encodeURIComponent(redirectUrl)}`;
                        break;
                    case 'CRYPTO':
                        // In a real implementation, you'd generate a crypto payment address
                        paymentUrl = `https://crypto-payment-gateway.com/pay/${order.id}?redirect_url=${encodeURIComponent(redirectUrl)}`;
                        break;
                    case 'CASH_APP':
                        // In a real implementation, you'd call Cash App API
                        paymentUrl = `https://cash.app/pay/${order.id}?redirect_url=${encodeURIComponent(redirectUrl)}`;
                        break;
                    case 'VENMO':
                        // In a real implementation, you'd call Venmo API
                        paymentUrl = `https://venmo.com/checkout/${order.id}?redirect_url=${encodeURIComponent(redirectUrl)}`;
                        break;
                    default:
                        throw new TRPCError({
                            code: 'BAD_REQUEST',
                            message: 'Invalid payment method',
                        });
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
                include: {
                    OrderItem: {
                        include: {
                            product: true,
                        },
                    },
                    CustomerInformation: true,
                },
            });

            if (!order) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Order not found',
                });
            }

            return order;
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