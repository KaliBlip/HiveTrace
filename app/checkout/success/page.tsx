'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShoppingBag, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/hooks/use-cart';

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Payment Successful!</h1>
          <p className="text-xl text-muted-foreground">
            Thank you for supporting verified producers. Your honey will be on its way soon.
          </p>
        </div>
        <Card className="border-border text-left">
          <CardHeader>
            <CardTitle className="text-lg">What&apos;s Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You can track your order status and view your purchase history from your orders page.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/consumer/orders">
                <Button variant="outline" className="w-full gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  View My Orders
                </Button>
              </Link>
              <Link href="/shop">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
