import { Stripe } from 'stripe';
import { CheckoutPayload } from './types';
import { calculatePaymentFee, formatFeePercentage } from '@/utils/fees';
import { PaymentType } from '@generated';
<<<<<<< HEAD

// Initialize Stripe with the secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

=======
import { prisma } from '@/utils/prisma';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

async function getOrCreateStripeProduct(item: { productId: string; name: string; price: number }): Promise<string> {
    try {
        const dbProduct = await prisma.product.findUnique({
            where: { id: item.productId },
        });

        if (!dbProduct) {
            throw new Error(`Product ${item.productId} not found in database`);
        }

        if (dbProduct.stripeId) {
            const prices = await stripe.prices.list({
                product: dbProduct.stripeId,
                active: true,
            });

            const matchingPrice = prices.data.find(price =>
                Math.abs((price.unit_amount || 0) / 100 - dbProduct.price) < 0.01
            );

            if (matchingPrice) {
                return dbProduct.stripeId;
            } else {
                await stripe.prices.create({
                    product: dbProduct.stripeId,
                    unit_amount: Math.round(dbProduct.price * 100),
                    currency: 'usd',
                });
                return dbProduct.stripeId;
            }
        }

        const stripeProduct = await stripe.products.create({
            name: dbProduct.name,
            description: dbProduct.description,
            metadata: {
                productId: dbProduct.id,
                slug: dbProduct.slug,
                category: dbProduct.category,
            },
        });

        await stripe.prices.create({
            product: stripeProduct.id,
            unit_amount: Math.round(dbProduct.price * 100),
            currency: 'usd',
        });

        await prisma.product.update({
            where: { id: item.productId },
            data: { stripeId: stripeProduct.id },
        });

        return stripeProduct.id;
    } catch (error) {
        console.error('Error creating/retrieving Stripe product:', error);
        throw new Error(`Failed to get or create product for ${item.name}`);
    }
}

async function getProductPrice(productId: string): Promise<string> {
    try {
        const prices = await stripe.prices.list({
            product: productId,
            active: true,
            limit: 1,
        });

        if (prices.data.length === 0) {
            throw new Error(`No active price found for product ${productId}`);
        }

        return prices.data[0].id;
    } catch (error) {
        console.error('Error retrieving product price:', error);
        throw new Error(`Failed to get price for product ${productId}`);
    }
}

>>>>>>> 4fe6dbf (All of version 2)
export async function createCheckoutSession(payload: CheckoutPayload): Promise<string> {
    try {
        // Calculate subtotal and fee
        const subtotal = payload.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discountAmount = payload.discountAmount || 0;
        const discountedSubtotal = subtotal - discountAmount;
        const paymentFee = calculatePaymentFee(PaymentType.STRIPE, discountedSubtotal);
        const feePercentageText = formatFeePercentage(PaymentType.STRIPE);
<<<<<<< HEAD
        
        // Create line items for products
        const productLineItems = payload.items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        // Add line items array
        const lineItems = [...productLineItems];
        
        // Add a discount line item if applicable
=======

        // Create or get Stripe products for each item
        const productLineItems = await Promise.all(
            payload.items.map(async (item) => {
                const stripeProductId = await getOrCreateStripeProduct(item);
                const priceId = await getProductPrice(stripeProductId);

                return {
                    price: priceId,
                    quantity: item.quantity,
                };
            })
        );

        // Start with product line items
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [...productLineItems];

        // Add a discount line item if applicable (using inline price_data for dynamic discounts)
>>>>>>> 4fe6dbf (All of version 2)
        if (discountAmount > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Discount${payload.couponCode ? ` (${payload.couponCode})` : ''}`,
                    },
                    unit_amount: -Math.round(discountAmount * 100),
                },
                quantity: 1,
            });
        }
<<<<<<< HEAD
        
        // Add a fee line item
=======

        // Add a fee line item (using inline price_data for dynamic fees)
>>>>>>> 4fe6dbf (All of version 2)
        lineItems.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: `Processing Fee (${feePercentageText})`,
                },
                unit_amount: Math.round(paymentFee * 100),
            },
            quantity: 1,
        });
<<<<<<< HEAD
        
=======

>>>>>>> 4fe6dbf (All of version 2)
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            customer_email: payload.customerInfo.email,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/${payload.orderId}?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/${payload.orderId}?canceled=true`,
            metadata: {
                orderId: payload.orderId,
                couponCode: payload.couponCode || '',
                discountAmount: discountAmount.toString(),
            },
        });

        return session.url || '';
    } catch (error) {
        console.error('Stripe checkout error:', error);
        throw new Error('Failed to create Stripe checkout session');
    }
}
