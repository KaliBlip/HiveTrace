'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCart } from '@/lib/hooks/use-cart';
import Link from 'next/link';

export function CartOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleOpen = () => setIsOpen(!isOpen);

  if (!mounted) return (
    <button
      className="fixed bottom-8 right-8 z-[100] w-20 h-20 bg-stone-900 text-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center border-2 border-white/5"
    >
      <ShoppingCart className="w-8 h-8" />
    </button>
  );

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={toggleOpen}
        className="fixed bottom-8 right-8 z-[100] w-20 h-20 bg-stone-900 text-white rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center group transition-all duration-500 hover:scale-110 active:scale-95 border-2 border-white/5"
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
          className="fixed inset-0 bg-[#1c1917]/60 backdrop-blur-md z-[110] transition-opacity duration-500 animate-in fade-in"
          onClick={toggleOpen}
        />
      )}

      {/* Cart Drawer */}
      <div className={`fixed top-4 bottom-4 right-4 z-[120] w-[calc(100%-32px)] sm:w-[480px] bg-card border border-border/40 rounded-[48px] shadow-[0_50px_100px_rgba(0,0,0,0.2)] transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) transform ${isOpen ? 'translate-x-0' : 'translate-x-[120%]'}`}>
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-10 border-b border-border/40 flex items-center justify-between bg-stone-50/50">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-primary" />
                <h2 className="text-3xl font-heading font-bold uppercase italic tracking-tight">Your Cart</h2>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Ledger-Verified Honey</p>
            </div>
            <button 
              onClick={toggleOpen}
              className="w-12 h-12 bg-white border border-border/50 rounded-full flex items-center justify-center hover:bg-stone-50 transition-colors shadow-sm active:scale-90"
            >
              <X className="w-6 h-6 text-stone-900" />
            </button>
          </div>

          {/* Items List */}
          <ScrollArea className="flex-1 px-10 py-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8 py-24">
                <div className="w-24 h-24 bg-stone-50 rounded-[32px] flex items-center justify-center text-stone-200 border-2 border-dashed border-border/50">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <p className="font-heading font-bold text-2xl uppercase italic text-stone-900">Your cart is empty</p>
                  <p className="text-stone-500 font-normal max-w-[240px]">The ecosystem is waiting. Add some verified honey to begin.</p>
                </div>
                <Link href="/shop" onClick={toggleOpen}>
                  <Button variant="outline" className="h-14 rounded-2xl px-8 font-bold border-2 border-stone-200 hover:border-primary hover:text-primary transition-all">
                    Browse Marketplace
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-8 py-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-6 group relative">
                    <div className="w-24 h-24 bg-stone-50 rounded-[24px] overflow-hidden shrink-0 border border-border/40 shadow-sm transition-transform group-hover:scale-105">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold uppercase text-stone-300">
                          Pending
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-3 flex flex-col justify-center">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="font-heading font-bold text-xl leading-none italic group-hover:text-primary transition-colors line-clamp-1">{item.name}</h3>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{item.unit}</p>
                        </div>
                        <p className="font-heading font-bold text-xl text-stone-900">GH₵{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-stone-50 p-1.5 rounded-xl border border-border/40">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all text-stone-400 hover:text-stone-900 shadow-none hover:shadow-sm"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-10 text-center text-sm font-bold font-heading">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all text-stone-400 hover:text-stone-900 shadow-none hover:shadow-sm"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="w-10 h-10 flex items-center justify-center text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
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
            <div className="p-10 border-t border-border/40 bg-stone-50/50 space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                  <span>Cart Subtotal</span>
                  <span className="text-stone-900">GH₵{totalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                  <span>Shipping Estimate</span>
                  <span className="text-emerald-600">Dynamic Calculation</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-border/40">
                  <span className="font-heading font-bold text-xl uppercase italic">Total Balance</span>
                  <span className="font-heading font-bold text-4xl text-stone-900 tracking-tighter">GH₵{totalPrice().toLocaleString()}</span>
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
                  <p className="text-[9px] text-stone-400 uppercase tracking-[0.3em] font-bold">
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
