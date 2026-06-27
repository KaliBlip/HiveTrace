'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { openPaystackPopup } from '@/lib/paystack';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function RetryPaymentButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRetry = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/checkout/paystack/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();

      if (!data.status) {
        throw new Error(data.message || 'Failed to retry payment');
      }

      const { publicKey, amount, reference, email, authorization_url } = data.data;

      if (publicKey && amount) {
        await openPaystackPopup({
          publicKey,
          email,
          amount,
          reference,
          onSuccess: (paidRef) => {
            router.push(`/checkout/success?reference=${encodeURIComponent(paidRef)}`);
          },
          onClose: () => setLoading(false),
        });
      } else {
        window.location.href = authorization_url;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to retry payment');
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      className="gap-2 text-amber-700 border-amber-200 hover:bg-amber-50"
      disabled={loading}
      onClick={handleRetry}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
      Retry Payment
    </Button>
  );
}
