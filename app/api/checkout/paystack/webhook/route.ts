import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { fulfillOrderByReference } from '@/lib/actions/order-actions';

export async function POST(req: Request) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json({ message: 'Not configured' }, { status: 500 });
    }

    const signature = req.headers.get('x-paystack-signature');
    const rawBody = await req.text();

    if (!signature) {
      return NextResponse.json({ message: 'Missing signature' }, { status: 400 });
    }

    const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');

    if (hash !== signature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(rawBody) as {
      event: string;
      data?: { reference?: string; status?: string };
    };

    if (event.event === 'charge.success' && event.data?.reference) {
      await fulfillOrderByReference(event.data.reference);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Paystack webhook error:', error);
    return NextResponse.json({ message: 'Webhook handler failed' }, { status: 500 });
  }
}
