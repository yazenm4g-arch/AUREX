import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { requireSupabase, supabase } from '../lib/supabase';

export interface StoreSettings { deliveryFee: number; whatsappNumber: string; }
interface StoreContextValue extends StoreSettings { loading: boolean; error: string | null; refreshSettings: () => Promise<StoreSettings>; }
const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>({ deliveryFee: 0, whatsappNumber: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const settingsRef = useRef(settings);
  useEffect(() => { settingsRef.current = settings; }, [settings]);
  const sequence = useRef(0);
  const refreshSettings = useCallback(async () => {
    const client = requireSupabase(); const request = ++sequence.current;
    setLoading(true);
    const { data, error: fetchError } = await client.from('store_settings').select('delivery_fee, whatsapp_number').eq('id', true).single();
    if (request !== sequence.current) return settingsRef.current;
    if (fetchError) { setError(fetchError.message); setLoading(false); throw fetchError; }
    const next = { deliveryFee: Number(data.delivery_fee), whatsappNumber: data.whatsapp_number };
    setSettings(next); setError(null); setLoading(false); return next;
  }, []);
  useEffect(() => { refreshSettings().catch(() => undefined); }, [refreshSettings]);
  useEffect(() => {
    const client = supabase;
    if (!client) return;
    const channel = client.channel('store-settings-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'store_settings' }, () => { refreshSettings().catch(() => undefined); }).subscribe();
    return () => { client.removeChannel(channel); };
  }, [refreshSettings]);
  return <StoreContext.Provider value={{ ...settings, loading, error, refreshSettings }}>{children}</StoreContext.Provider>;
}
export function useStoreSettings() { const context = useContext(StoreContext); if (!context) throw new Error('useStoreSettings must be used inside StoreProvider'); return context; }
