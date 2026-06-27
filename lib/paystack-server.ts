const PAYSTACK_BASE = 'https://api.paystack.co';

export interface PaystackInitResponse {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    status: string;
    reference: string;
    amount: number;
    currency: string;
    channel?: string;
    paid_at?: string;
    metadata?: Record<string, unknown>;
  };
}

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error('Paystack secret key is not configured');
  }
  return key;
}

export function getPaystackPublicKey(): string | undefined {
  return process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
}

export function isPaystackConfigured(): boolean {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}

export function generatePaymentReference(): string {
  return `HT-${Date.now()}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

export async function initializePaystackPayment(params: {
  email: string;
  amount: number;
  reference: string;
  metadata?: Record<string, unknown>;
  callbackUrl?: string;
}): Promise<PaystackInitResponse> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    'http://localhost:3000';

  const response = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amount * 100),
      currency: 'GHS',
      reference: params.reference,
      metadata: params.metadata,
      callback_url: params.callbackUrl ?? `${baseUrl}/checkout/success`,
    }),
  });

  return response.json();
}

export async function verifyPaystackPayment(
  reference: string
): Promise<PaystackVerifyResponse> {
  const response = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${getSecretKey()}`,
      },
    }
  );

  return response.json();
}
