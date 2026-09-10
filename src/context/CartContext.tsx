import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../data/products';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  subtotal: 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('aurex-cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('aurex-cart', JSON.stringify(items));
  }, [items]);

  function addToCart(product: Product, qty = 1) {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      const requested = (existing?.quantity || 0) + qty;
      const allowed = Math.min(product.stock, requested);
      if (allowed <= 0) return prev;
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: allowed }
            : i
        );
      }
      return [...prev, { product, quantity: allowed }];
    });
  }

  function removeFromCart(productId: string) {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  }

  function updateQuantity(productId: string, qty: number) {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(i => i.product.id === productId ? { ...i, quantity: Math.min(i.product.stock, qty) } : i)
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
