import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { fulfillOrderByReference } from '@/lib/actions/order-actions';
import { isPaystackConfigured } from '@/lib/paystack-server';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { status: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!isPaystackConfigured()) {
      return NextResponse.json(
        { status: false, message: 'Payment gateway not configured' },
        { status: 500 }
      );
    }

    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json(
        { status: false, message: 'Payment reference is required' },
        { status: 400 }
      );
    }

    const result = await fulfillOrderByReference(reference);

    if (result.order.consumerId !== session.user.id) {
      return NextResponse.json(
        { status: false, message: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      status: true,
      message: result.alreadyPaid ? 'Order already paid' : 'Payment verified successfully',
      data: {
        orderId: result.order.id,
        orderStatus: result.order.status,
        reference,
        alreadyPaid: result.alreadyPaid,
      },
    });
  } catch (error) {
    console.error('Paystack verify error:', error);
    return NextResponse.json(
      {
        status: false,
        message: error instanceof Error ? error.message : 'Payment verification failed',
      },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get('reference');
  if (!reference) {
    return NextResponse.json(
      { status: false, message: 'Reference query param required' },
      { status: 400 }
    );
  }

  const postReq = new Request(req.url, {
    method: 'POST',
    headers: req.headers,
    body: JSON.stringify({ reference }),
  });

  return POST(postReq);
}
