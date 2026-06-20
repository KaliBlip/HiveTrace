'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart } from '@/lib/hooks/use-cart';
import Link from 'next/link';

export function CartOverlay() {
  const { isOpen, toggleOpen, items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Floating Cart Button (hidden on mobile, visible on desktop) */}
      <button
        onClick={toggleOpen}
        className="hidden md:flex fixed bottom-8 right-8 z-[100] w-20 h-20 bg-stone-900 text-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] items-center justify-center group transition-all duration-500 hover:scale-110 active:scale-95 border-2 border-white/5"
      >
        <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 rounded-full transition-opacity"></div>
        <ShoppingCart className="w-8 h-8 group-hover:text-primary transition-colors" />
        {totalItems() > 0 && (
          <div className="absolute -top-1 -right-1 bg-primary text-white font-bold min-w-[28px] h-7 flex items-center justify-center p-0 rounded-full text-xs shadow-lg ring-4 ring-background animate-in zoom-in duration-300">
            {totalItems()}
          </div>
        )}
      </button>

      {/* Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-[4px] z-[110] transition-opacity duration-500 animate-in fade-in"
          onClick={toggleOpen}
        />
      )}

      {/* Cart Drawer */}
      <div className={`fixed top-4 bottom-4 right-4 z-[120] w-[calc(100%-32px)] sm:w-[480px] glass-panel border rounded-[32px] overflow-hidden transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) transform ${isOpen ? 'translate-x-0' : 'translate-x-[120%]'}`}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-10 border-b border-border flex items-center justify-between bg-muted/30 backdrop-blur-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-primary" />
                <h2 className="text-3xl font-heading font-bold uppercase italic tracking-tight text-foreground">Your Cart</h2>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Ledger-Verified Honey</p>
            </div>
            <button 
              onClick={toggleOpen}
              className="w-12 h-12 bg-background border border-border rounded-full flex items-center justify-center hover:bg-muted text-foreground transition-colors shadow-sm active:scale-95"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Items List */}
          <ScrollArea className="flex-1 min-h-0 px-10 py-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-24">
                <div className="w-24 h-24 bg-muted/50 rounded-[32px] flex items-center justify-center text-muted-foreground/30 border border-dashed border-border">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <p className="font-heading font-bold text-2xl uppercase italic text-foreground">Your cart is empty</p>
                  <p className="text-muted-foreground font-normal max-w-[240px]">The ecosystem is waiting. Add some verified honey to begin.</p>
                </div>
                <Link href="/shop" onClick={toggleOpen}>
                  <Button variant="outline" className="h-14 rounded-2xl px-8 font-bold border-2 border-border hover:border-primary/50 text-foreground transition-all">
                    Browse Marketplace
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-8 py-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-6 group relative">
                    <div className="w-24 h-24 bg-muted/40 rounded-[24px] overflow-hidden shrink-0 border border-border shadow-sm transition-transform group-hover:scale-105">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold uppercase text-muted-foreground">
                          Pending
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-3 flex flex-col justify-center">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-heading font-bold text-xl leading-none italic group-hover:text-primary transition-colors text-foreground line-clamp-1">{item.name}</h3>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{item.unit}</p>
                        </div>
                        <p className="font-heading font-bold text-xl text-foreground">GH₵{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-muted/40 p-1.5 rounded-xl border border-border">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-lg transition-all text-muted-foreground hover:text-foreground shadow-none hover:shadow-sm"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-10 text-center text-sm font-bold font-heading text-foreground">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-lg transition-all text-muted-foreground hover:text-foreground shadow-none hover:shadow-sm"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="w-10 h-10 flex items-center justify-center text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
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
            <div className="p-10 border-t border-border bg-muted/30 backdrop-blur-sm space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  <span>Cart Subtotal</span>
                  <span className="text-foreground">GH₵{totalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  <span>Shipping Estimate</span>
                  <span className="text-emerald-600">Dynamic Calculation</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-border">
                  <span className="font-heading font-bold text-xl uppercase italic text-foreground">Total Price</span>
                  <span className="font-heading font-bold text-4xl text-foreground tracking-tighter">GH₵{totalPrice().toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-4">
                <Link href="/checkout" onClick={toggleOpen} className="block">
                  <Button className="w-full h-20 text-xl font-bold rounded-[24px] shadow-2xl shadow-primary/30 gap-4 group/btn">
                    Secure Checkout
                    <ArrowRight className="w-6 h-6 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
                <div className="flex items-center justify-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <p className="text-[9px] text-muted-foreground uppercase tracking-[0.3em] font-bold">
                    Authenticated by Paystack Protocol
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
