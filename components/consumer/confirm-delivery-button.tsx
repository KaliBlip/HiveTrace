'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { confirmOrderDelivery } from '@/lib/actions/order-actions';
import { toast } from 'sonner';

export function ConfirmDeliveryButton({ orderId }: { orderId: string }) {
  const [pending, setPending] = useState(false);

  const handleConfirm = async () => {
    setPending(true);
    try {
      await confirmOrderDelivery(orderId);
      toast.success('Delivery confirmed and proof recorded.');
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to confirm delivery');
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      size="sm"
      className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
      onClick={handleConfirm}
      disabled={pending}
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
      {pending ? 'Recording...' : 'Confirm delivery'}
    </Button>
  );
}