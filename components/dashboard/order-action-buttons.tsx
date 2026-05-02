'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Truck, CheckCircle2 } from 'lucide-react';
import { updateOrderStatus } from '@/lib/actions/order-actions';
import { toast } from 'sonner';

export function OrderActionButtons({ orderId, status }: { orderId: string; status: string }) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [pending, setPending] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    setPending(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      setCurrentStatus(newStatus);
      toast.success(`Order marked as ${newStatus.toLowerCase()}`);
    } catch {
      toast.error('Failed to update order');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 justify-center">
      <Button variant="outline" size="sm" className="gap-2">
        <Eye className="w-4 h-4" />
        View Details
      </Button>
      {currentStatus === 'PAID' && (
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          size="sm"
          disabled={pending}
          onClick={() => handleStatusUpdate('SHIPPED')}
        >
          <Truck className="w-4 h-4" />
          Mark as Shipped
        </Button>
      )}
      {currentStatus === 'SHIPPED' && (
        <Button
          variant="outline"
          className="border-green-500 text-green-600 hover:bg-green-50 gap-2"
          size="sm"
          disabled={pending}
          onClick={() => handleStatusUpdate('DELIVERED')}
        >
          <CheckCircle2 className="w-4 h-4" />
          Mark as Delivered
        </Button>
      )}
    </div>
  );
}
