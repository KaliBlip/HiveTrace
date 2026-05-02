import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, amount, metadata } = await req.json();

    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

    if (!PAYSTACK_SECRET_KEY) {
      // For development when keys aren't provided yet, return a mock response
      return NextResponse.json({
        status: true,
        message: "Mock Transaction Initialized (Keys Missing)",
        data: {
          authorization_url: "#",
          access_code: "mock_code",
          reference: `HT-${Date.now()}`
        }
      });
    }

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Paystack expects amount in kobo
        metadata,
        callback_url: `${process.env.NEXTAUTH_URL}/checkout/success`,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Paystack Route Error:', error);
    return NextResponse.json({ status: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
