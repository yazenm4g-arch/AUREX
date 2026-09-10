import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useLang } from '../context/LangContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { createOrder, buildWhatsAppUrl } from '../lib/orders';
import { supabase } from '../lib/supabase';
import { translations } from '../i18n/translations';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  address: string;
  note: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  city?: string;
  address?: string;
}

const MOROCCAN_CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès',
  'Oujda', 'Kénitra', 'Tétouan', 'Safi', 'El Jadida', 'Beni Mellal',
  'Nador', 'Mohammédia', 'Khouribga', 'Berrechid', 'Taza', 'Settat',
];

function validate(data: FormData, t: Record<string, string>): FormErrors {
  const errors: FormErrors = {};
  if (!data.firstName.trim()) errors.firstName = t.required;
  if (!data.lastName.trim()) errors.lastName = t.required;
  if (!data.phone.trim()) errors.phone = t.required;
  else if (!/^(\+212|0)[5-7]\d{8}$/.test(data.phone.replace(/\s/g, ''))) errors.phone = t.phoneInvalid;
  if (!data.city.trim()) errors.city = t.required;
  if (!data.address.trim()) errors.address = t.required;
  return errors;
}

export default function CheckoutPage() {
  const { lang, isRtl } = useLang();
  const { items, subtotal, clearCart } = useCart();
  const { products, updateProduct } = useProducts();
  const t = translations[lang];
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', phone: '', city: '', address: '', note: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [whatsappNumber, setWhatsappNumber] = useState(import.meta.env.VITE_WHATSAPP_NUMBER || '0603821176');

  useEffect(() => {
    if (supabase) supabase.from('store_settings').select('delivery_fee, whatsapp_number').eq('id', true).maybeSingle().then(({ data }) => { if (data) { setDeliveryFee(Number(data.delivery_fee) || 0); setWhatsappNumber(data.whatsapp_number || ''); } });
  }, []);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F4EF] flex flex-col items-center justify-center gap-4" dir={isRtl ? 'rtl' : 'ltr'}>
        <p style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl text-[#1C1C1C]">{t.cartEmpty}</p>
        <Link to="/" className="text-[#C4A265] text-sm font-[Outfit] underline">{t.continueShopping}</Link>
      </div>
    );
  }

  function handleChange(field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form, t);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const currentItems = items.map(item => ({ ...item, product: products.find(product => product.id === item.product.id) || item.product }));
    if (currentItems.some(item => item.quantity > item.product.stock || !item.product.inStock)) {
      setSubmitError(lang === 'ar' ? 'بعض المنتجات لم تعد متوفرة.' : lang === 'fr' ? 'Certains articles ne sont plus disponibles.' : 'Some items are no longer available.');
      return;
    }
    setSubmitError('');
    setSubmitting(true);
    createOrder(currentItems, form, deliveryFee).then(result => {
      currentItems.forEach(item => updateProduct({ ...item.product, stock: item.product.stock - item.quantity, inStock: item.product.stock - item.quantity > 0 }));
      const whatsappUrl = buildWhatsAppUrl(whatsappNumber, result.orderNumber, currentItems, form, result.deliveryFee, result.total, lang);
      localStorage.setItem('aurex-last-order', JSON.stringify({ orderNumber: result.orderNumber, form, whatsappUrl }));
      clearCart();
      if (whatsappNumber) {
        window.location.href = whatsappUrl;
      } else {
        navigate('/order-confirmed', { state: { orderNumber: result.orderNumber, form, whatsappUrl } });
      }
    }).catch(() => {
      setSubmitError(lang === 'ar' ? 'تعذر حفظ الطلب.' : lang === 'fr' ? 'Impossible d’enregistrer la commande.' : 'Could not save the order.');
      setSubmitting(false);
    });
  }

  const inputClass = (field: keyof FormErrors) =>
    `w-full bg-transparent border-b ${errors[field] ? 'border-red-400' : 'border-[#1C1C1C]/20 focus:border-[#C4A265]'} text-[#1C1C1C] placeholder-[#1C1C1C]/30 text-sm py-2.5 outline-none transition-colors font-[Outfit]`;

  return (
    <div className="min-h-screen bg-[#F7F4EF]" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-[1100px] mx-auto px-5 md:px-10 py-10 md:py-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px w-8 bg-[#C4A265]" />
          <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl md:text-4xl font-semibold text-[#1C1C1C]">
            {t.checkout}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
            {/* Personal info */}
            <div>
              <h2 className="text-[#C4A265] text-xs tracking-[0.25em] font-[Outfit] uppercase mb-6">{t.personalInfo}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* First name */}
                <div>
                  <label className="block text-[10px] tracking-[0.2em] text-[#1C1C1C]/50 font-[Outfit] uppercase mb-2">{t.firstName} *</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={e => handleChange('firstName', e.target.value)}
                    className={inputClass('firstName')}
                    placeholder={t.firstName}
                  />
                  {errors.firstName && <p className="text-red-400 text-xs mt-1 font-[Outfit]">{errors.firstName}</p>}
                </div>

                {/* Last name */}
                <div>
                  <label className="block text-[10px] tracking-[0.2em] text-[#1C1C1C]/50 font-[Outfit] uppercase mb-2">{t.lastName} *</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={e => handleChange('lastName', e.target.value)}
                    className={inputClass('lastName')}
                    placeholder={t.lastName}
                  />
                  {errors.lastName && <p className="text-red-400 text-xs mt-1 font-[Outfit]">{errors.lastName}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[10px] tracking-[0.2em] text-[#1C1C1C]/50 font-[Outfit] uppercase mb-2">{t.phone} *</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                    className={inputClass('phone')}
                    placeholder="+212 6XX XXX XXX"
                    dir="ltr"
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-1 font-[Outfit]">{errors.phone}</p>}
                </div>

                {/* City */}
                <div>
                  <label className="block text-[10px] tracking-[0.2em] text-[#1C1C1C]/50 font-[Outfit] uppercase mb-2">{t.city} *</label>
                  <select
                    value={form.city}
                    onChange={e => handleChange('city', e.target.value)}
                    className={`${inputClass('city')} bg-transparent cursor-pointer`}
                  >
                    <option value="" disabled>{t.city}</option>
                    {MOROCCAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                  </select>
                  {errors.city && <p className="text-red-400 text-xs mt-1 font-[Outfit]">{errors.city}</p>}
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] tracking-[0.2em] text-[#1C1C1C]/50 font-[Outfit] uppercase mb-2">{t.address} *</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={e => handleChange('address', e.target.value)}
                    className={inputClass('address')}
                    placeholder={t.address}
                  />
                  {errors.address && <p className="text-red-400 text-xs mt-1 font-[Outfit]">{errors.address}</p>}
                </div>

                {/* Note */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] tracking-[0.2em] text-[#1C1C1C]/50 font-[Outfit] uppercase mb-2">{t.note}</label>
                  <textarea
                    value={form.note}
                    onChange={e => handleChange('note', e.target.value)}
                    className="w-full bg-transparent border-b border-[#1C1C1C]/20 focus:border-[#C4A265] text-[#1C1C1C] placeholder-[#1C1C1C]/30 text-sm py-2.5 outline-none transition-colors font-[Outfit] resize-none"
                    rows={2}
                    placeholder={t.notePlaceholder}
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div>
              <h2 className="text-[#C4A265] text-xs tracking-[0.25em] font-[Outfit] uppercase mb-6">{t.paymentMethod}</h2>
              <div className="border border-[#C4A265]/40 p-5 bg-[#F0EBE1]/50">
                <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <div className="w-5 h-5 rounded-full border-2 border-[#C4A265] flex items-center justify-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#C4A265]" />
                  </div>
                  <div>
                    <p className="text-[#1C1C1C] text-sm font-[Outfit] font-medium">{t.cashOnDelivery}</p>
                    <p className="text-[#1C1C1C]/50 text-xs font-[Outfit] mt-0.5">{t.cashOnDeliveryDesc}</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#1C1C1C] hover:bg-[#C4A265] text-white hover:text-[#1C1C1C] py-4 text-sm tracking-[0.18em] font-[Outfit] font-medium transition-colors duration-200 disabled:opacity-60"
            >
              {submitting
                ? (lang === 'ar' ? 'جارٍ المعالجة...' : lang === 'fr' ? 'Traitement...' : 'Processing...')
                : t.confirmOrder.toUpperCase()
              }
            </button>
            <p className="text-center text-[#1C1C1C]/50 text-xs font-[Outfit] -mt-5">{t.whatsappOrderHint}</p>
            {submitError && <p role="alert" className="text-red-500 text-sm font-[Outfit]">{submitError}</p>}
          </form>

          {/* Order summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-[#1C1C1C] text-white p-6">
              <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-lg font-semibold mb-5 pb-4 border-b border-white/10">
                {t.orderSummary}
              </h2>

              <div className="flex flex-col gap-4 mb-5">
                {items.map(item => (
                  <div key={item.product.id} className={`flex gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <div className="w-14 h-16 bg-[#2a2a2a] overflow-hidden shrink-0">
                      <img src={item.product.images[0]} alt="" className="w-full h-full object-cover opacity-80" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontFamily: 'Playfair Display, serif' }} className="text-sm text-white truncate">{item.product.name[lang]}</p>
                      <p className="text-white/40 text-xs font-[Outfit] mt-0.5">× {item.quantity}</p>
                      <p className="text-[#C4A265] text-sm font-[Outfit] mt-1">{(item.product.price * item.quantity).toLocaleString('fr-MA')} {t.currency}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={`flex justify-between text-sm font-[Outfit] text-white/50 mb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span>{t.shippingFree}</span><span className="text-[#C4A265]">{deliveryFee.toLocaleString('fr-MA')} {t.currency}</span>
              </div>
              <div className={`flex justify-between text-base font-[Outfit] font-medium pt-3 border-t border-white/10 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span>{t.total}</span>
                <span className="text-[#C4A265]">{(subtotal + deliveryFee).toLocaleString('fr-MA')} {t.currency}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
