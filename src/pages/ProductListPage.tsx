import { useLocation } from 'react-router';
import { useLang } from '../context/LangContext';
import { translations } from '../i18n/translations';
import { useProducts } from '../context/ProductContext';
import type { Category } from '../data/products';
import ProductCarousel from '../components/ProductCarousel';

export default function ProductListPage() {
  const { lang, isRtl } = useLang();
  const t = translations[lang];
  const location = useLocation();
  const { products } = useProducts();

  const cat: Category = location.pathname.includes('women') ? 'women' : 'men';
  const filtered = products.filter(p => p.category === cat);

  const heroImg = cat === 'men'
    ? 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=1400&h=500&fit=crop&auto=format'
    : 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1400&h=500&fit=crop&auto=format';

  const catLabel = cat === 'men' ? t.men : t.women;
  const watchWord = lang === 'ar' ? 'ساعة' : lang === 'fr' ? 'montres' : 'watches';

  return (
    <div className="bg-[#F7F4EF] min-h-screen" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Category hero banner */}
      <div className="relative h-44 md:h-64 bg-[#1C1C1C] overflow-hidden">
        <img src={heroImg} alt={catLabel} className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5">
          <span className="text-[#C4A265] text-xs tracking-[0.3em] font-[Outfit] mb-3">AUREX</span>
          <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-4xl md:text-5xl font-semibold text-white">
            {catLabel}
          </h1>
          <p className="text-white/50 text-sm font-[Outfit] mt-3">{filtered.length} {watchWord}</p>
        </div>
      </div>

      {/* Horizontal category carousel */}
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-14 md:py-20">
        <ProductCarousel products={filtered} label={catLabel} />
      </div>
    </div>
  );
}
