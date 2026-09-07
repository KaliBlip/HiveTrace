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

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggleOpen: () => void;
  addItem: (product: Product, quantity?: number) => void;
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
        const maxStock = typeof product.stock === 'number' ? product.stock : Infinity;

        if (existingItem) {
          const newQty = Math.min(existingItem.quantity + quantity, maxStock);
          set({
            items: currentItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: newQty, stock: product.stock ?? item.stock }
                : item
            ),
          });
        } else {
          const initialQty = Math.min(quantity, maxStock);
          if (initialQty > 0) {
            set({ items: [...currentItems, { ...product, quantity: initialQty }] });
          }
        }
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
