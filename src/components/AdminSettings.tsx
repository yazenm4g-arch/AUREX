import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminSettings() {
  const [deliveryFee, setDeliveryFee] = useState('0');
  const [whatsappNumber, setWhatsappNumber] = useState('0603821176');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.from('store_settings').select('delivery_fee, whatsapp_number').eq('id', true).maybeSingle().then(({ data }) => {
      if (data) { setDeliveryFee(String(data.delivery_fee ?? 0)); setWhatsappNumber(data.whatsapp_number || '0603821176'); }
    });
  }, []);

  async function save() {
    if (supabase) {
      await supabase.from('store_settings').upsert({ id: true, delivery_fee: Number(deliveryFee) || 0, whatsapp_number: whatsappNumber.replace(/[^0-9]/g, ''), updated_at: new Date().toISOString() });
    }
    setSaved(true); window.setTimeout(() => setSaved(false), 1800);
  }

  return <section className="mb-12 bg-white border border-black/10 p-5 md:p-6"><h2 className="text-xl mb-5">Store Settings</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end"><label className="text-sm">Delivery fee<input type="number" min="0" value={deliveryFee} onChange={event => setDeliveryFee(event.target.value)} className="block w-full border p-3 mt-2" /></label><label className="text-sm">WhatsApp number<input type="tel" inputMode="numeric" value={whatsappNumber} onChange={event => setWhatsappNumber(event.target.value)} placeholder="0603821176" className="block w-full border p-3 mt-2" /></label><div className="md:col-span-2 flex items-center gap-4"><button type="button" onClick={save} className="bg-[#1C1C1C] text-white px-5 py-3">{saved ? 'SAVED' : 'SAVE SETTINGS'}</button></div></div></section>;
}