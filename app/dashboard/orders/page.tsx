import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Truck, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getProducerOrders } from '@/lib/actions/order-actions';
import { OrderActionButtons } from '@/components/dashboard/order-action-buttons';

export default async function ProducerOrdersPage() {
  const orders = await getProducerOrders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PAID': return 'bg-blue-100 text-blue-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold">Incoming Orders</h1>
        <p className="text-muted-foreground">Manage and fulfill your customer orders</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search orders..." className="pl-10" />
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="border-border">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-6">
                {/* Order Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">#{order.id.slice(-6).toUpperCase()}</span>
                    <Badge className={getStatusColor(order.status)}>{order.status.toLowerCase()}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  <p className="font-medium">{(order as any).consumer?.name || 'Unknown Customer'}</p>
                </div>

                {/* Items Summary */}
                <div className="lg:col-span-2 space-y-3">
                  <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Items</p>
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span>{item.product?.name || 'Deleted Product'} x {item.quantity}</span>
                      <span className="font-medium">₦{(item.priceAtPurchase * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-border flex justify-between font-bold">
                    <span>Total</span>
                    <span>₦{order.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <OrderActionButtons orderId={order.id} status={order.status} />
              </div>
            </CardContent>
          </Card>
        ))}

        {orders.length === 0 && (
          <Card className="border-border p-12 text-center text-muted-foreground">
            No orders found.
          </Card>
        )}
      </div>
    </div>
  );
}
