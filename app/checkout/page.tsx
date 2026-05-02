'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShoppingBag, Lock, CreditCard, ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/hooks/use-cart';
import { useAuth } from '@/lib/hooks/use-auth';
import { initializePaystackTransaction } from '@/lib/paystack';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await initializePaystackTransaction({
        email: formData.email,
        amount: totalPrice(),
        metadata: {
          items: items.map(i => ({ id: i.id, name: i.name, qty: i.quantity })),
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.state}`
        }
      });

      if (response.status) {
        if (response.data.authorization_url === "#") {
          // Mock success for development
          setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            clearCart();
          }, 2000);
        } else {
          // Redirect to Paystack
          window.location.href = response.data.authorization_url;
        }
      }
    } catch (error) {
      alert('Checkout failed. Please try again.');
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Your Cart is Empty</h1>
          <p className="text-muted-foreground">Add some honey to your cart before checking out.</p>
          <Link href="/shop">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Order Placed Successfully!</h1>
            <p className="text-xl text-muted-foreground">
              Thank you for supporting verified producers. Your honey will be on its way soon.
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Link href="/shop">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                View Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/shop" className="flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>Where should we send your verified honey?</CardDescription>
              </CardHeader>
              <CardContent>
                <form id="checkout-form" onSubmit={handleCheckout} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        value={formData.fullName} 
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input 
                      id="address" 
                      value={formData.address} 
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        value={formData.city} 
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input 
                        id="state" 
                        value={formData.state} 
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        required 
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>All payments are securely processed via Paystack</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 border border-primary/20 bg-primary/5 rounded-lg">
                  <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center shadow-sm">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">Paystack Secure Payment</p>
                    <p className="text-xs text-muted-foreground">Card, Bank Transfer, USSD, and more</p>
                  </div>
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <Card className="border-border sticky top-28">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} <span className="font-bold">x{item.quantity}</span>
                      </span>
                      <span className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₦{totalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-2xl text-primary">₦{totalPrice().toLocaleString()}</span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  form="checkout-form"
                  disabled={isProcessing}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-lg gap-3 mt-4"
                >
                  {isProcessing ? 'Initializing Payment...' : 'Pay with Paystack'}
                  <CreditCard className="w-5 h-5" />
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                  <Lock className="w-3 h-3" />
                  Secure SSL Encryption
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
