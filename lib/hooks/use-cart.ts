'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  imageUrl?: string | null;
  isActive: boolean;
  batchId: string;
  producerId: string;
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface AddItemResult {
  success: boolean;
  addedQuantity: number;
  totalInCart: number;
  stock: number;
  reason?: 'out_of_stock' | 'capped_at_stock' | 'already_max_stock';
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggleOpen: () => void;
  addItem: (product: Product, quantity?: number) => AddItemResult;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
      
      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);
        const currentQty = existingItem?.quantity ?? 0;
        const stock = typeof product.stock === 'number' ? Math.max(0, product.stock) : Infinity;

        // Out of stock
        if (stock <= 0) {
          return { success: false, addedQuantity: 0, totalInCart: currentQty, stock, reason: 'out_of_stock' };
        }

        // Already at max stock
        if (currentQty >= stock) {
          return { success: false, addedQuantity: 0, totalInCart: currentQty, stock, reason: 'already_max_stock' };
        }

        const remainingCapacity = stock - currentQty;
        const actualToAdd = Math.min(Math.max(1, quantity), remainingCapacity);
        const newTotalQty = currentQty + actualToAdd;

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: newTotalQty, stock: product.stock ?? item.stock }
                : item
            ),
          });
        } else {
          set({ items: [...currentItems, { ...product, quantity: actualToAdd }] });
        }

        const isCapped = actualToAdd < quantity;
        return {
          success: true,
          addedQuantity: actualToAdd,
          totalInCart: newTotalQty,
          stock,
          reason: isCapped ? 'capped_at_stock' : undefined,
        };
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const item = get().items.find((i) => i.id === productId);
        const maxStock = typeof item?.stock === 'number' && item.stock >= 0 ? item.stock : Infinity;
        const finalQuantity = Math.min(quantity, maxStock);

        set({
          items: get().items.map((item) =>
            item.id === productId ? { ...item, quantity: finalQuantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      totalPrice: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'hivetrace-cart',
    }
  )
);
