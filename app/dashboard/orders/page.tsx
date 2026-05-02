'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Truck, CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getOrdersByProducerId, getProductById, getUserById } from '@/lib/store';

export default function ProducerOrdersPage() {
  // In a real app, we would get the producer ID from the session
  const orders = getOrdersByProducerId('producer-1');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
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
        <div className="flex gap-2">
          <Button variant="outline">All Status</Button>
          <Button variant="outline">Pending</Button>
          <Button variant="outline">Shipped</Button>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const consumer = getUserById(order.consumerId);
          return (
            <Card key={order.id} className="border-border">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-6">
                  {/* Order Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">#{order.id.slice(-6).toUpperCase()}</span>
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="font-medium">{consumer?.name || 'Unknown Customer'}</p>
                  </div>

                  {/* Items Summary */}
                  <div className="lg:col-span-2 space-y-3">
                    <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Items</p>
                    {order.items.map((item) => {
                      const product = getProductById(item.productId);
                      return (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                          <span>{product?.name || 'Deleted Product'} x {item.quantity}</span>
                          <span className="font-medium">₦{(item.priceAtPurchase * item.quantity).toLocaleString()}</span>
                        </div>
                      );
                    })}
                    <div className="pt-2 border-t border-border flex justify-between font-bold">
                      <span>Total</span>
                      <span>₦{order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 justify-center">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                    {order.status === 'paid' && (
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2" size="sm">
                        <Truck className="w-4 h-4" />
                        Mark as Shipped
                      </Button>
                    )}
                    {order.status === 'shipped' && (
                      <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50 gap-2" size="sm">
                        <CheckCircle2 className="w-4 h-4" />
                        Mark as Delivered
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {orders.length === 0 && (
          <Card className="border-border p-12 text-center text-muted-foreground">
            No orders found.
          </Card>
        )}
      </div>
    </div>
  );
}
