import { Link } from 'react-router';
import { useLang } from '../context/LangContext';
import { translations } from '../i18n/translations';
import { useProducts } from '../context/ProductContext';
import ProductCarousel from '../components/ProductCarousel';

function Hero() {
  const { lang, isRtl } = useLang();
  const t = translations[lang];
  const titleLines = t.heroTitle.split('\n');

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#1A1A1A]" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1600&h=1000&fit=crop&auto=format&q=80"
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/80 to-transparent" />
      </div>
      <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-[#C4A265]/40 to-transparent hidden md:block" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 md:px-16 w-full py-20 md:py-0">
        <div className={`max-w-[560px] ${isRtl ? 'mr-auto' : ''}`}>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-10 bg-[#C4A265]" />
            <span className="text-[#C4A265] text-xs tracking-[0.3em] font-[Outfit] uppercase">
              {lang === 'ar' ? 'مجموعة ٢٠٢٥' : 'Collection 2025'}
            </span>
          </div>

          <h1
            style={{ fontFamily: 'Playfair Display, serif' }}
            className="text-[clamp(3rem,8vw,5.5rem)] font-semibold leading-[1.05] text-white mb-6"
          >
            {titleLines.map((line, i) => (
              <span key={i} className="block">
                {i === 1 ? <span className="italic text-[#C4A265]">{line}</span> : line}
              </span>
            ))}
          </h1>

          <p className="text-white/60 text-base md:text-lg font-[Outfit] font-light leading-relaxed mb-12 max-w-[420px]">
            {t.heroSubtitle}
          </p>

          <div className={`flex flex-col sm:flex-row gap-4 ${isRtl ? 'sm:flex-row-reverse' : ''}`}>
            <Link
              to="/men"
              className="inline-flex items-center justify-center gap-3 bg-[#C4A265] hover:bg-[#D4B67A] text-[#1C1C1C] px-8 py-4 text-sm tracking-[0.15em] font-[Outfit] font-medium transition-colors duration-200"
            >
              {t.shopMen}
            </Link>
            <Link
              to="/women"
              className="inline-flex items-center justify-center gap-3 border border-white/30 hover:border-[#C4A265] text-white hover:text-[#C4A265] px-8 py-4 text-sm tracking-[0.15em] font-[Outfit] font-medium transition-colors duration-200"
            >
              {t.shopWomen}
            </Link>
          </div>
        </div>
      </div>

      {/* Floating watch (desktop) */}
      <div className="absolute right-0 top-0 bottom-0 w-[48%] hidden lg:flex items-center justify-center pr-16 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&h=800&fit=crop&auto=format"
          alt="AUREX flagship timepiece"
          className="h-[72vh] w-auto object-contain drop-shadow-2xl"
        />
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
        <span className="text-[10px] tracking-[0.3em] font-[Outfit]">SCROLL</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
      </div>
    </section>
  );
}

function TrustBar() {
  const { lang, isRtl } = useLang();
  const t = translations[lang];

  const perks = [
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="m16 8 2 3h3l-1 8H6l-1-8h3l2-3"/></svg>,
      label: t.freeShipping,
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
      label: t.cashOnDelivery,
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
      label: t.authenticity,
    },
  ];

  return (
    <div className="bg-[#F0EBE1] border-y border-[#C4A265]/20" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="flex flex-col md:flex-row items-center justify-center divide-y md:divide-y-0 md:divide-x divide-[#C4A265]/20">
          {perks.map(perk => (
            <div key={perk.label} className="flex items-center gap-3 py-4 px-6 md:px-12">
              <span className="text-[#C4A265]">{perk.icon}</span>
              <span className="text-[#1C1C1C] text-sm tracking-wide font-[Outfit]">{perk.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WatchSections() {
  const { lang, isRtl } = useLang();
  const { products } = useProducts();
  const labels = lang === 'ar'
    ? { newArrival: 'وصل حديثاً', men: 'رجال', women: 'نساء', featured: 'مختارات', bestseller: 'الأكثر مبيعاً', sale: 'تخفيضات' }
    : lang === 'fr'
      ? { newArrival: 'Nouveautés', men: 'Hommes', women: 'Femmes', featured: 'Sélection', bestseller: 'Meilleures ventes', sale: 'Promotions' }
      : { newArrival: 'New Arrivals', men: 'Men', women: 'Women', featured: 'Featured', bestseller: 'Best Sellers', sale: 'On Sale' };
  const sections = [
    { label: labels.newArrival, items: products.filter(product => product.newArrival || product.badge === 'new') },
    { label: labels.men, items: products.filter(product => product.category === 'men'), href: '/men', dark: true },
    { label: labels.women, items: products.filter(product => product.category === 'women'), href: '/women' },
    { label: labels.featured, items: products.filter(product => product.featured) },
    { label: labels.bestseller, items: products.filter(product => product.bestseller || product.badge === 'bestseller') },
    { label: labels.sale, items: products.filter(product => product.originalPrice && product.originalPrice > product.price), dark: true },
  ];

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      {sections.map(section => section.items.length > 0 && <ProductCarousel key={section.label} products={section.items} label={section.label} viewAllHref={section.href} dark={section.dark} />)}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <WatchSections />
    </>
  );
}
