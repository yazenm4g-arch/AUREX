import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useLang } from '../context/LangContext';
import { translations } from '../i18n/translations';
import { useProducts } from '../context/ProductContext';
import type { Product } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function SearchPage() {
  const { lang, isRtl } = useLang();
  const t = translations[lang];
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const { products } = useProducts();

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    const normalized = q.toLowerCase().trim();
    setResults(normalized ? products.filter(p => [p.name.fr, p.name.en, p.name.ar, p.ref, p.description.fr, p.description.en].some(value => value.toLowerCase().includes(normalized))) : []);
  }, [searchParams, products]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  }

  const currentQuery = searchParams.get('q') || '';

  return (
    <div className="min-h-screen bg-[#F7F4EF]" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 py-12 md:py-20">
        {/* Search bar */}
        <div className="max-w-[600px] mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#C4A265]" />
            <span className="text-[#C4A265] text-xs tracking-[0.3em] font-[Outfit] uppercase">{t.search}</span>
          </div>
          <form onSubmit={handleSearch} className="flex gap-3 border-b-2 border-[#1C1C1C]/20 pb-2">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="flex-1 bg-transparent text-[#1C1C1C] placeholder-[#1C1C1C]/30 text-xl md:text-2xl font-[Outfit] font-light outline-none"
              style={{ fontFamily: 'Playfair Display, serif' }}
              autoFocus
            />
            <button type="submit" className="text-[#1C1C1C]/40 hover:text-[#C4A265] transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </form>
        </div>

        {/* Results */}
        {currentQuery && (
          <div>
            {results.length > 0 ? (
              <>
                <p className="text-[#1C1C1C]/50 font-[Outfit] text-sm mb-8">
                  {results.length} {lang === 'ar' ? 'نتيجة لـ' : lang === 'fr' ? 'résultat(s) pour' : 'result(s) for'} «{currentQuery}»
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
                  {results.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full border border-[#C4A265]/30 flex items-center justify-center mx-auto mb-6">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C4A265" strokeWidth="1">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
                <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl text-[#1C1C1C] mb-3">{t.noResults}</h2>
                <p className="text-[#1C1C1C]/50 font-[Outfit] font-light">{t.noResultsSub}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
