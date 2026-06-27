import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { retryOrderPayment } from '@/lib/actions/order-actions';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ status: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ status: false, message: 'Order ID required' }, { status: 400 });
    }

    const result = await retryOrderPayment(orderId);

    return NextResponse.json({ status: true, data: result });
  } catch (error) {
    return NextResponse.json(
      {
        status: false,
        message: error instanceof Error ? error.message : 'Retry failed',
      },
      { status: 400 }
    );
  }
}
