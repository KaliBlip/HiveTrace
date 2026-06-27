'use client';

export interface PaystackTransactionResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
    orderId?: string;
    publicKey?: string;
    amount?: number;
  };
}

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data?: {
    orderId: string;
    orderStatus: string;
    reference: string;
    alreadyPaid?: boolean;
  };
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: {
        key: string;
        email: string;
        amount: number;
        currency?: string;
        ref: string;
        metadata?: Record<string, unknown>;
        callback: (response: { reference: string; status: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

export async function initializePaystackTransaction(data: {
  email: string;
  amount: number;
  items: { id: string; quantity: number; price: number; name?: string }[];
  shippingAddress?: string;
  customerName?: string;
  metadata?: Record<string, unknown>;
}) {
  const response = await fetch('/api/checkout/paystack', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const payload = await response.json();

  if (!response.ok || !payload.status) {
    throw new Error(payload.message || 'Failed to initialize Paystack transaction');
  }

  return payload as PaystackTransactionResponse;
}

export async function verifyPaystackTransaction(reference: string) {
  const response = await fetch('/api/checkout/paystack/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reference }),
  });

  const payload = await response.json();

  if (!response.ok || !payload.status) {
    throw new Error(payload.message || 'Payment verification failed');
  }

  return payload as PaystackVerifyResponse;
}

export const loadPaystackScript = () => {
  if (typeof window === 'undefined') {
    return Promise.resolve(false);
  }

  if (window.PaystackPop) {
    return Promise.resolve(true);
  }

  return new Promise<boolean>((resolve) => {
    const existing = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');
    if (existing) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export async function openPaystackPopup(options: {
  publicKey: string;
  email: string;
  amount: number;
  reference: string;
  metadata?: Record<string, unknown>;
  onSuccess: (reference: string) => void;
  onClose?: () => void;
}) {
  const loaded = await loadPaystackScript();
  if (!loaded || !window.PaystackPop) {
    throw new Error('Failed to load Paystack checkout');
  }

  const handler = window.PaystackPop.setup({
    key: options.publicKey,
    email: options.email,
    amount: options.amount,
    currency: 'GHS',
    ref: options.reference,
    metadata: options.metadata,
    callback: (response) => {
      options.onSuccess(response.reference);
    },
    onClose: () => {
      options.onClose?.();
    },
  });

  handler.openIframe();
}
