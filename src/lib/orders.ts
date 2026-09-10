import { supabase } from './supabase';
import type { CartItem } from '../context/CartContext';
import type { Order } from '../data/orders';

interface Customer {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  address: string;
  note: string;
}

type OrderLanguage = 'fr' | 'en' | 'ar';

const messageCopy = {
  fr: { order: 'COMMANDE', products: 'PRODUITS', subtotal: 'Sous-total', delivery: 'Livraison', total: 'TOTAL', payment: 'PAIEMENT', cod: 'Paiement à la livraison', customer: 'CLIENT', name: 'Nom', phone: 'Téléphone', city: 'Ville', address: 'Adresse', note: 'Note' },
  en: { order: 'ORDER', products: 'PRODUCTS', subtotal: 'Subtotal', delivery: 'Delivery', total: 'TOTAL', payment: 'PAYMENT', cod: 'Cash on Delivery', customer: 'CUSTOMER', name: 'Name', phone: 'Phone', city: 'City', address: 'Address', note: 'Note' },
  ar: { order: 'الطلب', products: 'المنتجات', subtotal: 'المجموع الفرعي', delivery: 'التوصيل', total: 'المجموع', payment: 'الدفع', cod: 'الدفع عند الاستلام', customer: 'العميل', name: 'الاسم', phone: 'الهاتف', city: 'المدينة', address: 'العنوان', note: 'ملاحظة' },
} as const;

export async function createOrder(items: CartItem[], customer: Customer, deliveryFee: number) {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  if (supabase) {
    const { data, error } = await supabase.rpc('place_order', {
      payload: {
        customer,
        items: items.map(item => ({ product_id: item.product.id, quantity: item.quantity })),
      },
    });
    if (error) throw error;
    return { orderNumber: data.order_number as string, total: Number(data.total), deliveryFee: Number(data.delivery_fee) };
  }

  const orderNumber = `AUX-${Date.now().toString(36).toUpperCase().slice(-6)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const order: Order = { id: orderNumber, createdAt: new Date().toISOString(), status: 'pending', customer, items, total: subtotal + deliveryFee };
  const current = JSON.parse(localStorage.getItem('aurex-orders') || '[]') as Order[];
  localStorage.setItem('aurex-orders', JSON.stringify([...current, order]));
  return { orderNumber, total: order.total, deliveryFee };
}

export function buildWhatsAppUrl(number: string, orderNumber: string, items: CartItem[], customer: Customer, deliveryFee: number, total: number, lang: OrderLanguage = 'en') {
  const copy = messageCopy[lang];
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const money = (value: number) => `${value.toLocaleString('fr-MA')} MAD`;
  const lines = [
    `🛍️ AUREX — ${copy.order}`,
    `#${orderNumber}`,
    '',
    copy.products,
    ...items.map((item, index) => `${index + 1}. ${item.quantity}× ${item.product.name[lang]} — ${money(item.product.price * item.quantity)}${item.product.variant ? ` (${item.product.variant})` : ''}`),
    '',
    `${copy.subtotal}: ${money(subtotal)}`,
    `${copy.delivery}: ${money(deliveryFee)}`,
    `${copy.total}: ${money(total)}`,
    '',
    `${copy.payment}: ${copy.cod}`,
    '',
    copy.customer,
    `${copy.name}: ${customer.firstName} ${customer.lastName}`,
    `${copy.phone}: ${customer.phone}`,
    `${copy.city}: ${customer.city}`,
    `${copy.address}: ${customer.address}`,
    customer.note ? `${copy.note}: ${customer.note}` : '',
  ].filter(Boolean);
  const normalizedNumber = number.replace(/[^0-9]/g, '');
  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
}
