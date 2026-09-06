'use client';

import { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { reportOrderNotReceived } from '@/lib/actions/order-actions';
import { toast } from 'sonner';

export function ReportOrderButton({ orderId }: { orderId: string }) {
  const [pending, setPending] = useState(false);

  const handleReport = async () => {
    const reason = window.prompt('Please explain why the paid order was not received:');
    if (reason === null) return;

    setPending(true);
    try {
      await reportOrderNotReceived(orderId, reason);
      toast.success('Report submitted to HiveTrace admin for investigation.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to submit report');
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      className="gap-2 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400"
      onClick={handleReport}
      disabled={pending}
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <AlertTriangle className="size-4" />}
      {pending ? 'Submitting...' : 'Report not received'}
    </Button>
  );
}