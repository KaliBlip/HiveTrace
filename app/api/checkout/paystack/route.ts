import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createPendingOrderFromCart } from '@/lib/actions/order-actions';
import {
  initializePaystackPayment,
  isPaystackConfigured,
  getPaystackPublicKey,
} from '@/lib/paystack-server';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { status: false, message: 'You must be logged in to checkout' },
        { status: 401 }
      );
    }

    if (!isPaystackConfigured()) {
      return NextResponse.json(
        {
          status: false,
          message: 'Payment gateway not configured. Add PAYSTACK_SECRET_KEY to your environment.',
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { email, amount, metadata, items, shippingAddress, customerName } = body;

    if (!email || !amount || !items?.length) {
      return NextResponse.json(
        { status: false, message: 'Email, amount, and cart items are required' },
        { status: 400 }
      );
    }

    const { order, reference } = await createPendingOrderFromCart({
      items: items.map(
        (item: { id: string; quantity: number; price: number }) => ({
          productId: item.id,
          quantity: item.quantity,
          priceAtPurchase: item.price,
        })
      ),
      totalAmount: amount,
      shippingAddress,
      customerEmail: email,
      customerName,
    });

    const paystack = await initializePaystackPayment({
      email,
      amount,
      reference,
      metadata: {
        orderId: order.id,
        consumerId: session.user.id,
        customerName: customerName ?? session.user.name,
        ...metadata,
      },
    });

    if (!paystack.status || !paystack.data) {
      await prismaCleanupFailedOrder(order.id);
      return NextResponse.json(
        { status: false, message: paystack.message || 'Failed to initialize payment' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      status: true,
      message: paystack.message,
      data: {
        authorization_url: paystack.data.authorization_url,
        access_code: paystack.data.access_code,
        reference: paystack.data.reference,
        orderId: order.id,
        publicKey: getPaystackPublicKey(),
        amount: Math.round(amount * 100),
      },
    });
  } catch (error) {
    console.error('Paystack Route Error:', error);
    return NextResponse.json(
      {
        status: false,
        message: error instanceof Error ? error.message : 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}

async function prismaCleanupFailedOrder(orderId: string) {
  try {
    await prisma.order.delete({ where: { id: orderId } });
  } catch {
    // Order may already be cascaded or missing
  }
}
