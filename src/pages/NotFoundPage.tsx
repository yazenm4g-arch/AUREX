import { Link } from 'react-router';
import { useLang } from '../context/LangContext';
import { translations } from '../i18n/translations';

export default function NotFoundPage() {
  const { lang, isRtl } = useLang();
  const t = translations[lang];

  return (
    <div className="min-h-[70vh] bg-[#F7F4EF] flex flex-col items-center justify-center gap-6 px-5 text-center" dir={isRtl ? 'rtl' : 'ltr'}>
      <span style={{ fontFamily: 'Playfair Display, serif' }} className="text-[120px] leading-none text-[#1C1C1C]/8 font-semibold select-none">
        404
      </span>
      <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#1C1C1C] -mt-8">{t.notFound}</h1>
      <p className="text-[#1C1C1C]/50 font-[Outfit] font-light max-w-xs">{t.notFoundSub}</p>
      <Link
        to="/"
        className="bg-[#1C1C1C] text-white px-8 py-4 text-sm tracking-[0.15em] font-[Outfit] hover:bg-[#C4A265] hover:text-[#1C1C1C] transition-colors"
      >
        {t.backHome.toUpperCase()}
      </Link>
    </div>
  );
}
