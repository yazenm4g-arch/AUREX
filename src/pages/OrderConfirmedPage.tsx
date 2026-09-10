import { useLocation, Link, Navigate } from 'react-router';
import { useLang } from '../context/LangContext';
import { translations } from '../i18n/translations';

export default function OrderConfirmedPage() {
  const { lang, isRtl } = useLang();
  const t = translations[lang];
  const location = useLocation();
  const stored = (() => { try { return JSON.parse(localStorage.getItem('aurex-last-order') || 'null'); } catch { return null; } })();
  const state = (location.state as { orderNumber?: string; form?: { firstName: string; lastName: string }; whatsappUrl?: string } | null) || stored;

  if (!state?.orderNumber) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F7F4EF] flex items-center justify-center px-5 py-16" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-[520px] w-full text-center">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full border border-[#C4A265]/40 flex items-center justify-center mx-auto mb-8">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C4A265" strokeWidth="1.5">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        </div>

        <h1
          style={{ fontFamily: 'Playfair Display, serif' }}
          className="text-3xl md:text-4xl font-semibold text-[#1C1C1C] mb-4"
        >
          {t.orderConfirmed}
        </h1>

        <p className="text-[#1C1C1C]/60 font-[Outfit] font-light leading-relaxed mb-10 text-sm md:text-base">
          {t.orderConfirmedSub}
        </p>

        <div className="bg-[#1C1C1C] text-white p-8 mb-8 text-left" dir={isRtl ? 'rtl' : 'ltr'}>
          <div className={`flex justify-between py-3 border-b border-white/10 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <span className="text-white/50 text-sm font-[Outfit]">{t.orderNumber}</span>
            <span className="text-[#C4A265] font-[Outfit] font-medium">{state.orderNumber}</span>
          </div>
          <div className={`flex justify-between py-3 border-b border-white/10 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <span className="text-white/50 text-sm font-[Outfit]">
              {lang === 'ar' ? 'الاسم' : lang === 'fr' ? 'Nom' : 'Name'}
            </span>
            <span className="text-white font-[Outfit]">{state.form?.firstName} {state.form?.lastName}</span>
          </div>
          <div className={`flex justify-between py-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <span className="text-white/50 text-sm font-[Outfit]">{t.orderDelivery}</span>
            <span className="text-white font-[Outfit] text-right text-sm max-w-[60%]">{t.orderDeliveryTime}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {state.whatsappUrl && <a href={state.whatsappUrl} className="bg-[#25D366] text-[#0b2d18] px-8 py-4 text-sm tracking-[0.12em] font-[Outfit] font-medium hover:bg-[#1fb85a] transition-colors">{t.openWhatsapp.toUpperCase()}</a>}
          <Link
            to="/"
            className="bg-[#1C1C1C] text-white px-8 py-4 text-sm tracking-[0.15em] font-[Outfit] hover:bg-[#C4A265] hover:text-[#1C1C1C] transition-colors"
          >
            {t.backHome.toUpperCase()}
          </Link>
        </div>
      </div>
    </div>
  );
}
