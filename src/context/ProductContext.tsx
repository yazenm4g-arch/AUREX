import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { products as defaultProducts } from '../data/products';
import type { Product } from '../data/products';
import { supabase, hasSupabase, productStatus } from '../lib/supabase';

interface ProductContextValue {
  products: Product[];
  updateProduct: (product: Product) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
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
    });
    return () => { active = false; };
  }, []);

  const updateProduct = (product: Product) => {
    setProducts(prev => prev.map(item => item.id === product.id ? product : item));
    if (supabase) supabase.from('products').update({ ref: product.ref, name: product.name, description: product.description, specifications: product.specs, images: product.images, category: product.category, price: product.price, original_price: product.originalPrice ?? null, stock: product.stock, status: product.status || productStatus(product.stock), new_arrival: product.newArrival || false, featured: product.featured || false, bestseller: product.bestseller || false }).eq('id', product.id);
  };
  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
    if (supabase) supabase.from('products').insert({ id: product.id, ref: product.ref, name: product.name, description: product.description, specifications: product.specs, images: product.images, category: product.category, price: product.price, original_price: product.originalPrice ?? null, stock: product.stock, status: product.status || productStatus(product.stock), new_arrival: product.newArrival || false, featured: product.featured || false, bestseller: product.bestseller || false });
  };
  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(item => item.id !== productId));
    if (supabase) supabase.from('products').delete().eq('id', productId);
  };

  return <ProductContext.Provider value={{ products, updateProduct, addProduct, deleteProduct }}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used inside ProductProvider');
  return context;
}