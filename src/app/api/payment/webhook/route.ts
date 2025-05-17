import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.orderId) {
            return NextResponse.json(
                { success: false, message: 'Missing order ID' },
                { status: 400 }
            );
        }

        const order = await prisma.order.update({
            where: { id: body.orderId },
            data: { status: 'PAID' },
        });

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error('Payment webhook error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
        return NextResponse.json(
            { success: false, message: 'Missing order ID' },
            { status: 400 }
        );
    }

    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order) {
            return NextResponse.json(
                { success: false, message: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.redirect(new URL(`/order/${orderId}`, request.url));
    } catch (error) {
        console.error('Payment return error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
} 