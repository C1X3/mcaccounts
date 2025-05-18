import { CheckoutPayload, WalletDetails } from './types';
import { fAndFItems } from '@/utils/paypalNotes';
import { prisma } from '@/utils/prisma';
import { OrderStatus, PaymentType } from '@generated';

export async function createCheckoutSession(payload: CheckoutPayload): Promise<WalletDetails> {
    if (!process.env.NEXT_PUBLIC_PAYPAL_EMAIL) {
        throw new Error('PAYPAL_EMAIL is not set');
    }
    const email = process.env.NEXT_PUBLIC_PAYPAL_EMAIL;
    const amount = payload.totalPrice.toFixed(2);

    // fetch all pending PayPal orders’ notes
    const currPaypalPending = await prisma.order.findMany({
        where: {
            paymentType: PaymentType.PAYPAL,
            status: OrderStatus.PENDING,
        },
        select: { paypalNote: true },
    });
    const usedNotes = new Set(currPaypalPending.map(o => o.paypalNote));

    // try to pick an unused single note first
    let note = fAndFItems.find(item => !usedNotes.has(item));

    // if no singles left, try the first unused pair
    if (!note) {
        outer: for (let i = 0; i < fAndFItems.length; i++) {
            for (let j = i + 1; j < fAndFItems.length; j++) {
                const combo = `${fAndFItems[i]} ${fAndFItems[j]}`;
                if (!usedNotes.has(combo)) {
                    note = combo;
                    break outer;
                }
            }
        }
    }

    if (!note) {
        throw new Error('No note found—even after trying all single+pair combinations');
    }

    // persist the chosen note on the order
    await prisma.order.update({
        where: { id: payload.orderId },
        data: { paypalNote: note },
    });

    return {
        address: email,
        amount,
        url: note,
    };
}
