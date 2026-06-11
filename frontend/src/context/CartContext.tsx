'use client';

import { createContext, useMemo, useState, type ReactNode } from 'react';
import type { CartItem } from '@/types/cart';

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const value = useMemo<CartContextValue>(() => ({
    items,
    addItem: (item) => setItems((current) => {
      const existing = current.find((line) => line.productId === item.productId);
      if (!existing) return [...current, item];
      return current.map((line) => line.productId === item.productId ? { ...line, quantity: line.quantity + item.quantity } : line);
    }),
    removeItem: (productId) => setItems((current) => current.filter((line) => line.productId !== productId)),
    clearCart: () => setItems([]),
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
