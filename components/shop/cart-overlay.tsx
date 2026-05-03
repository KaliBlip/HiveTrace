'use client';

import { useState } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart } from '@/lib/hooks/use-cart';
import Link from 'next/link';

export function CartOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={toggleOpen}
        className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center group transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <ShoppingCart className="w-7 h-7" />
        {totalItems() > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-red-500 text-white border-2 border-primary min-w-[24px] h-6 flex items-center justify-center p-0">
            {totalItems()}
          </Badge>
        )}
      </button>

      {/* Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={toggleOpen}
        />
      )}

      {/* Cart Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-card border-l border-border z-[60] shadow-2xl transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Your Cart</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleOpen}>
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Items List */}
          <ScrollArea className="flex-1 p-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-lg">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground">Add some verified honey to get started!</p>
                </div>
                <Link href="/shop" onClick={toggleOpen}>
                  <Button variant="outline" className="mt-4">
                    Browse Shop
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden shrink-0 border border-border">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-sm leading-tight line-clamp-1">{item.name}</h3>
                        <p className="font-bold text-sm shrink-0 ml-2">GH₵{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{item.unit}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border rounded-md">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-muted transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-muted transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-border bg-muted/30 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>GH₵{totalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600 font-medium">Calculated at checkout</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl">GH₵{totalPrice().toLocaleString()}</span>
                </div>
              </div>
              <Link href="/checkout" onClick={toggleOpen}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-14 text-lg gap-3 shadow-lg">
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
                Payments secured by Paystack
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
