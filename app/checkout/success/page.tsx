'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShoppingBag, LayoutDashboard, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/hooks/use-cart';
import { verifyPaystackTransaction } from '@/lib/paystack';
import { ConsumerHeader } from '@/components/consumer/header';

function CheckoutShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ConsumerHeader />
      <div className="min-h-screen bg-background pt-28 pb-20 px-4">{children}</div>
    </>
  );
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const { clearCart } = useCart();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your payment with Paystack...');

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    if (!reference) {
      setStatus('error');
      setMessage('Missing payment reference. If you completed payment, check your orders page.');
      return;
    }

    let cancelled = false;

    async function verify() {
      try {
        const result = await verifyPaystackTransaction(reference!);
        if (cancelled) return;
        setStatus('success');
        setMessage(
          result.data?.alreadyPaid
            ? 'Your order was already confirmed.'
            : 'Payment verified successfully. Your order is confirmed.'
        );
      } catch (error) {
        if (cancelled) return;
        setStatus('error');
        setMessage(
          error instanceof Error
            ? error.message
            : 'We could not verify your payment. Please contact support if you were charged.'
        );
      }
    }

    verify();

    return () => {
      cancelled = true;
    };
  }, [reference]);

  if (status === 'loading') {
    return (
      <CheckoutShell>
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <h1 className="text-3xl font-bold">Confirming Payment</h1>
          <p className="text-muted-foreground">{message}</p>
        </div>
      </CheckoutShell>
    );
  }

  if (status === 'error') {
    return (
      <CheckoutShell>
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Payment Verification Failed</h1>
            <p className="text-lg text-muted-foreground">{message}</p>
            {reference && (
              <p className="text-xs font-mono text-muted-foreground">Reference: {reference}</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/checkout">
              <Button variant="outline">Try Checkout Again</Button>
            </Link>
            <Link href="/consumer/orders">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                View Orders
              </Button>
            </Link>
          </div>
        </div>
      </CheckoutShell>
    );
  }

  return (
    <CheckoutShell>
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Payment Successful!</h1>
          <p className="text-xl text-muted-foreground">{message}</p>
          {reference && (
            <p className="text-xs font-mono text-muted-foreground">Reference: {reference}</p>
          )}
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
    </CheckoutShell>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center pt-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
