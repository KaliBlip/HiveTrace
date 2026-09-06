'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Truck, CheckCircle2 } from 'lucide-react';
import { updateOrderStatus } from '@/lib/actions/order-actions';
import { toast } from 'sonner';

type OrderDetails = {
  consumerName: string;
  consumerEmail: string;
  shippingAddress: string;
  totalAmount: number;
};

export function OrderActionButtons({
  orderId,
  status,
  details,
}: {
  orderId: string;
  status: string;
  details: OrderDetails;
}) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [pending, setPending] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    setPending(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      setCurrentStatus(newStatus);
      toast.success(`Order marked as ${newStatus.toLowerCase()}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update order');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 justify-center">
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => setShowDetails((visible) => !visible)}
      >
        <Eye className="w-4 h-4" />
        {showDetails ? 'Hide Details' : 'View Details'}
      </Button>
      {showDetails && (
        <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3 text-xs">
          <p><span className="font-semibold">Customer:</span> {details.consumerName}</p>
          <p><span className="font-semibold">Email:</span> {details.consumerEmail}</p>
          <p><span className="font-semibold">Delivery address:</span> {details.shippingAddress}</p>
          <p><span className="font-semibold">Order total:</span> GH₵{details.totalAmount.toLocaleString()}</p>
        </div>
      )}
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
