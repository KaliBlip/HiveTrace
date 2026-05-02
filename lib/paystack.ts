'use client';

export interface PaystackTransactionResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export async function initializePaystackTransaction(data: {
  email: string;
  amount: number;
  metadata?: any;
}) {
  try {
    // In a real app, this would call our backend API to keep the secret key secure
    const response = await fetch('/api/checkout/paystack', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to initialize Paystack transaction');
    }

    return (await response.json()) as PaystackTransactionResponse;
  } catch (error) {
    console.error('Paystack Initialization Error:', error);
    throw error;
  }
}

// Client-side Paystack Inline (Popup) logic
export const loadPaystackScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
