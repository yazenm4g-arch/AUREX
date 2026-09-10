import { Link, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useLang } from '../context/LangContext';
import { useCart } from '../context/CartContext';
import { translations } from '../i18n/translations';
import { supabase } from '../lib/supabase';

export default function CartPage() {
  const { lang, isRtl } = useLang();
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();
  const t = translations[lang];
  const navigate = useNavigate();
  const [deliveryFee, setDeliveryFee] = useState(0);

  useEffect(() => {
    if (supabase) supabase.from('store_settings').select('delivery_fee').eq('id', true).maybeSingle().then(({ data }) => { if (data) setDeliveryFee(Number(data.delivery_fee) || 0); });
  }, []);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F7F4EF] flex flex-col items-center justify-center gap-6 px-5 text-center" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="w-20 h-20 rounded-full border border-[#C4A265]/30 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#C4A265" strokeWidth="1">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>
        <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#1C1C1C]">{t.cartEmpty}</h1>
        <p className="text-[#1C1C1C]/50 font-[Outfit] font-light max-w-xs">{t.cartEmptySub}</p>
        <Link
          to="/"
          className="bg-[#1C1C1C] text-white px-8 py-4 text-sm tracking-[0.15em] font-[Outfit] hover:bg-[#C4A265] hover:text-[#1C1C1C] transition-colors"
        >
          {t.continueShopping.toUpperCase()}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4EF]" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-10 md:py-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px w-8 bg-[#C4A265]" />
          <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl md:text-4xl font-semibold text-[#1C1C1C]">
            {t.cart}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          {/* Items */}
          <div className="flex flex-col gap-6">
            {items.map(item => {
              const name = item.product.name[lang];
              const priceLabel = `${(item.product.price * item.quantity).toLocaleString('fr-MA')} ${t.currency}`;

              return (
                <div key={item.product.id} className={`flex gap-5 pb-6 border-b border-[#1C1C1C]/10 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <Link to={`/product/${item.product.id}`} className="shrink-0">
                    <div className="w-24 h-28 md:w-28 md:h-36 bg-[#EDE8E0] overflow-hidden">
                      <img
                        src={item.product.images[0]}
                        alt={name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  </Link>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <p className="text-[#C4A265]/70 text-[10px] tracking-[0.2em] font-[Outfit] mb-1">{item.product.ref}</p>
                      <Link to={`/product/${item.product.id}`}>
                        <h3 style={{ fontFamily: 'Playfair Display, serif' }} className="text-base md:text-lg font-medium text-[#1C1C1C] hover:text-[#C4A265] transition-colors truncate">
                          {name}
                        </h3>
                      </Link>
                      <p className="text-[#1C1C1C]/50 text-sm font-[Outfit] mt-0.5">
                        {item.product.price.toLocaleString('fr-MA')} {t.currency}
                      </p>
                    </div>

                    <div className={`flex items-center justify-between mt-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                      {/* Qty controls */}
                      <div className="flex items-center border border-[#1C1C1C]/15">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#1C1C1C]/50 hover:text-[#1C1C1C] transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg>
                        </button>
                        <span className="w-10 text-center text-sm font-[Outfit]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#1C1C1C]/50 hover:text-[#1C1C1C] transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                        </button>
                      </div>

                      <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                        <span className="font-[Outfit] font-medium text-[#1C1C1C]">{priceLabel}</span>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[#1C1C1C]/30 hover:text-red-400 transition-colors"
                          aria-label={t.remove}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M18 6 6 18M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-[#1C1C1C] text-white p-8">
              <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-xl font-semibold mb-6 pb-4 border-b border-white/10">
                {t.orderSummary}
              </h2>

              <div className="flex flex-col gap-3 mb-6">
                <div className={`flex justify-between text-sm font-[Outfit] ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <span className="text-white/60">{t.subtotal}</span>
                  <span>{subtotal.toLocaleString('fr-MA')} {t.currency}</span>
                </div>
                <div className={`flex justify-between text-sm font-[Outfit] ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <span className="text-white/60">{t.shippingFree}</span>
                  <span className="text-[#C4A265]">{deliveryFee.toLocaleString('fr-MA')} {t.currency}</span>
                </div>
              </div>

              <div className={`flex justify-between text-lg font-[Outfit] font-medium pt-4 border-t border-white/10 mb-8 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <span>{t.total}</span>
                <span className="text-[#C4A265]">{(subtotal + deliveryFee).toLocaleString('fr-MA')} {t.currency}</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#C4A265] hover:bg-[#D4B67A] text-[#1C1C1C] py-4 text-sm tracking-[0.15em] font-[Outfit] font-medium transition-colors"
              >
                {t.proceedCheckout.toUpperCase()}
              </button>

              <Link
                to="/"
                className="block text-center mt-4 text-white/40 hover:text-white text-xs font-[Outfit] tracking-wide transition-colors"
              >
                {t.continueShopping}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
