import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import { getConsumerOrders } from '@/lib/actions/consumer-actions';

export default async function ConsumerOrdersPage() {
  const orders = await getConsumerOrders();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'PAID': return <ShoppingBag className="w-4 h-4" />;
      case 'SHIPPED': return <Truck className="w-4 h-4" />;
      case 'DELIVERED': return <CheckCircle2 className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'PAID': return 'bg-blue-100 text-blue-800';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">Track your honey purchases and delivery status</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="border-border overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Order Placed</p>
                    <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Total</p>
                    <p className="text-sm font-bold text-primary">GH₵{order.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Order #{order.id.slice(-8).toUpperCase()}</span>
                  <Badge className={getStatusColor(order.status) + " gap-1"}>
                    {getStatusIcon(order.status)}
                    {order.status.toLowerCase()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden shrink-0">
                      {item.product?.imageUrl && <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{item.product?.name || 'Deleted Product'}</p>
                      <p className="text-xs text-muted-foreground">Quantity: {item.quantity}</p>
                      <p className="text-xs font-medium">GH₵{item.priceAtPurchase.toLocaleString()}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge variant="outline" className="text-[10px] border-primary/20 text-primary">Verified</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {orders.length === 0 && (
          <Card className="border-border p-12 text-center space-y-4">
            <div className="text-4xl">📦</div>
            <p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
            <Link href="/shop">
              <Button variant="outline">Start Shopping</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
