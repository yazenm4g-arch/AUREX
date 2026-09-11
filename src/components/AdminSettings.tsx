import { useEffect, useState } from 'react';
import { requireSupabase } from '../lib/supabase';
import { useStoreSettings } from '../context/StoreContext';

export default function AdminSettings() {
  const store = useStoreSettings();
  const [deliveryFee, setDeliveryFee] = useState('0');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  useEffect(() => { if (!store.loading) { setDeliveryFee(String(store.deliveryFee)); setWhatsappNumber(store.whatsappNumber); } }, [store.loading, store.deliveryFee, store.whatsappNumber]);
  async function save() {
    setNotice(''); const fee = Number(deliveryFee);
    if (!Number.isFinite(fee) || fee < 0) { setNotice('Delivery fee must be zero or higher.'); return; }
    if (!whatsappNumber.replace(/\D/g, '')) { setNotice('Enter a WhatsApp number.'); return; }
    setSaving(true);
    try {
      const { error } = await requireSupabase().rpc('admin_upsert_store_settings', { p_delivery_fee: fee, p_whatsapp_number: whatsappNumber.replace(/\D/g, '') });
      if (error) throw error;
      await store.refreshSettings(); setNotice('Settings saved to the store.');
    } catch (err) { setNotice(err instanceof Error ? err.message : 'Could not save settings.'); }
    finally { setSaving(false); }
  }
  return <section className="mb-12 bg-white border border-black/10 p-5 md:p-6"><h2 className="text-xl mb-5">Store Settings</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"><label className="text-sm">Delivery fee<input type="number" min="0" value={deliveryFee} onChange={event => setDeliveryFee(event.target.value)} className="block w-full border p-3 mt-2" /></label><label className="text-sm">WhatsApp number<input type="tel" inputMode="numeric" value={whatsappNumber} onChange={event => setWhatsappNumber(event.target.value)} placeholder="0603821176" className="block w-full border p-3 mt-2" /></label><div className="md:col-span-2 flex items-center gap-4"><button type="button" disabled={saving} onClick={save} className="bg-[#1C1C1C] text-white px-5 py-3 disabled:opacity-60">{saving ? 'SAVING…' : 'SAVE SETTINGS'}</button>{notice && <span role="status" className="text-sm">{notice}</span>}</div></div></section>;
}
