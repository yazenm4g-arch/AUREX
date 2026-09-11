import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { products as defaultProducts } from '../data/products';
import type { Product } from '../data/products';
import { supabase, hasSupabase, productStatus } from '../lib/supabase';

interface ProductContextValue {
  products: Product[];
  updateProduct: (product: Product) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextValue | null>(null);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('aurex-products');
      const source: Product[] = stored ? JSON.parse(stored) : defaultProducts;
      return source.map(product => ({
        ...product,
        newArrival: product.newArrival ?? product.badge === 'new',
        bestseller: product.bestseller ?? product.badge === 'bestseller',
        featured: product.featured ?? (product.id === 'p1' || product.id === 'p6'),
        originalPrice: product.originalPrice ?? (product.id === 'p4' ? 4290 : undefined),
      }));
    } catch {
      return defaultProducts;
    }
  });

  const [loadedFromSupabase, setLoadedFromSupabase] = useState(false);

  useEffect(() => {
    localStorage.setItem('aurex-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (!hasSupabase || !supabase) return;
    let active = true;
    supabase.from('products').select('*, product_images(storage_path, sort_order)').order('created_at', { ascending: false }).then(({ data, error }) => {
      if (error || !data || !active) return;
      setProducts(data.map(row => ({
        id: row.id,
        ref: row.ref,
        name: row.name,
        description: row.description,
        specs: row.specifications,
        category: row.category,
        price: Number(row.price),
        originalPrice: row.original_price ? Number(row.original_price) : undefined,
        images: row.images?.length ? row.images : (row.product_images || []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order).map((image: { storage_path: string }) => supabase.storage.from('product-images').getPublicUrl(image.storage_path).data.publicUrl),
        stock: row.stock,
        status: row.status,
        inStock: row.status === 'in_stock' || row.status === 'low_stock',
        newArrival: row.new_arrival,
        featured: row.featured,
        bestseller: row.bestseller,
      })));
      setLoadedFromSupabase(true);
    });
    return () => { active = false; };
  }, []);

  async function refreshProducts() {
    if (!hasSupabase || !supabase) return;
    const { data, error } = await supabase.from('products').select('*, product_images(storage_path, sort_order)').order('created_at', { ascending: false });
    if (error || !data) return;
    setProducts(data.map(row => ({
      id: row.id,
      ref: row.ref,
      name: row.name,
      description: row.description,
      specs: row.specifications,
      category: row.category,
      price: Number(row.price),
      originalPrice: row.original_price ? Number(row.original_price) : undefined,
      images: row.images?.length ? row.images : (row.product_images || []).sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order).map((image: { storage_path: string }) => supabase.storage.from('product-images').getPublicUrl(image.storage_path).data.publicUrl),
      stock: row.stock,
      status: row.status,
      inStock: row.status === 'in_stock' || row.status === 'low_stock',
      newArrival: row.new_arrival,
      featured: row.featured,
      bestseller: row.bestseller,
    })));
  }

  const updateProduct = async (product: Product) => {
    setProducts(prev => prev.map(item => item.id === product.id ? product : item));
    if (supabase) {
      const { error } = await supabase.rpc('admin_update_product', {
        p_id: product.id,
        p_ref: product.ref,
        p_name: product.name,
        p_description: product.description,
        p_specifications: product.specs,
        p_images: product.images,
        p_category: product.category,
        p_price: product.price,
        p_original_price: product.originalPrice ?? null,
        p_stock: product.stock,
        p_status: product.status || productStatus(product.stock),
        p_new_arrival: product.newArrival || false,
        p_featured: product.featured || false,
        p_bestseller: product.bestseller || false,
      });
      if (error) console.error('admin_update_product failed:', error.message);
    }
  };

  const addProduct = async (product: Product) => {
    setProducts(prev => [...prev, product]);
    if (supabase) {
      const { error } = await supabase.rpc('admin_insert_product', {
        p_id: product.id,
        p_ref: product.ref,
        p_name: product.name,
        p_description: product.description,
        p_specifications: product.specs,
        p_images: product.images,
        p_category: product.category,
        p_price: product.price,
        p_original_price: product.originalPrice ?? null,
        p_stock: product.stock,
        p_status: product.status || productStatus(product.stock),
        p_new_arrival: product.newArrival || false,
        p_featured: product.featured || false,
        p_bestseller: product.bestseller || false,
      });
      if (error) console.error('admin_insert_product failed:', error.message);
    }
  };

  const deleteProduct = async (productId: string) => {
    setProducts(prev => prev.filter(item => item.id !== productId));
    if (supabase) {
      const { error } = await supabase.rpc('admin_delete_product', { p_id: productId });
      if (error) console.error('admin_delete_product failed:', error.message);
    }
  };

  return (
    <ProductContext.Provider value={{ products, updateProduct, addProduct, deleteProduct, refreshProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used inside ProductProvider');
  return context;
}