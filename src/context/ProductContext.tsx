import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../data/products';
import { requireSupabase, supabase, productStatus } from '../lib/supabase';

interface ProductContextValue {
  products: Product[];
  loading: boolean;
  error: string | null;
  updateProduct: (product: Product) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextValue | null>(null);

function rowToProduct(row: any): Product {
  return {
    id: row.id, ref: row.ref, name: row.name, description: row.description,
    specs: row.specifications, category: row.category, price: Number(row.price),
    originalPrice: row.original_price == null ? undefined : Number(row.original_price),
    images: Array.isArray(row.images) ? row.images : [], stock: row.stock,
    status: row.status, inStock: row.status === 'in_stock' || row.status === 'low_stock',
    newArrival: Boolean(row.new_arrival), featured: Boolean(row.featured), bestseller: Boolean(row.bestseller),
  };
}

function rpcPayload(product: Product) {
  return {
    p_id: product.id, p_ref: product.ref, p_name: product.name,
    p_description: product.description, p_specifications: product.specs,
    p_images: product.images, p_category: product.category, p_price: product.price,
    p_original_price: product.originalPrice ?? null, p_stock: product.stock,
    p_status: product.status || productStatus(product.stock),
    p_new_arrival: Boolean(product.newArrival), p_featured: Boolean(product.featured),
    p_bestseller: Boolean(product.bestseller),
  };
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestSequence = useRef(0);

  const refreshProducts = useCallback(async () => {
    const client = requireSupabase();
    const request = ++requestSequence.current;
    setLoading(true);
    const { data, error: fetchError } = await client.from('products').select('*').order('created_at', { ascending: false });
    if (request !== requestSequence.current) return;
    if (fetchError) {
      setError(fetchError.message);
      setLoading(false);
      throw fetchError;
    }
    setProducts((data ?? []).map(rowToProduct));
    setError(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    refreshProducts().catch(() => { if (!active) return; });
    return () => { active = false; };
  }, [refreshProducts]);

  useEffect(() => {
    const client = supabase;
    if (!client) return;
    const channel = client.channel('catalog-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
      refreshProducts().catch(() => undefined);
    }).subscribe();
    return () => { client.removeChannel(channel); };
  }, [refreshProducts]);

  const updateProduct = useCallback(async (product: Product) => {
    const client = requireSupabase();
    const { error: mutationError } = await client.rpc('admin_update_product', rpcPayload(product));
    if (mutationError) throw mutationError;
    await refreshProducts();
  }, [refreshProducts]);

  const addProduct = useCallback(async (product: Product) => {
    const client = requireSupabase();
    const { error: mutationError } = await client.rpc('admin_insert_product', rpcPayload(product));
    if (mutationError) throw mutationError;
    await refreshProducts();
  }, [refreshProducts]);

  const deleteProduct = useCallback(async (productId: string) => {
    const client = requireSupabase();
    const { error: mutationError } = await client.rpc('admin_delete_product', { p_id: productId });
    if (mutationError) throw mutationError;
    await refreshProducts();
  }, [refreshProducts]);

  return <ProductContext.Provider value={{ products, loading, error, updateProduct, addProduct, deleteProduct, refreshProducts }}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used inside ProductProvider');
  return context;
}
