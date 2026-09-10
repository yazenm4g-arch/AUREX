import type { Product } from './products';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: { firstName: string; lastName: string; phone: string; city: string; address: string; note: string };
  items: { product: Product; quantity: number }[];
  total: number;
  whatsappUrl?: string;
}

export function readOrders(): Order[] {
  try { return JSON.parse(localStorage.getItem('aurex-orders') || '[]'); } catch { return []; }
}

export function writeOrders(orders: Order[]) {
  localStorage.setItem('aurex-orders', JSON.stringify(orders));
}