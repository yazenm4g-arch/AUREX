import { createClient } from '@supabase/supabase-js';
import type { ProductStatus } from '../data/products';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;
export const hasSupabase = Boolean(supabase);

export function requireSupabase() {
  if (!supabase) throw new Error('Store data service is not configured.');
  return supabase;
}

export function productStatus(stock: number, status?: ProductStatus) {
	if (status) return status;
	if (stock <= 0) return 'out_of_stock';
	return stock <= 2 ? 'low_stock' : 'in_stock';
}
