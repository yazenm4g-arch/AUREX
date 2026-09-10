import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useLang } from '../context/LangContext';
import { useCart } from '../context/CartContext';
import { translations } from '../i18n/translations';
import type { Lang } from '../i18n/translations';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'AR' },
];

export default function Header() {
  const { lang, setLang, isRtl } = useLang();
  const { totalItems } = useCart();
  const t = translations[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  }

  const navLinks = [
    { label: t.men, href: '/men' },
    { label: t.women, href: '/women' },
    { label: t.about, href: '/about' },
    { label: t.contact, href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#1C1C1C] text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Announcement bar */}
      <div className="bg-[#111111] text-[#C4A265] text-center text-xs tracking-[0.18em] py-2 px-4 font-[Outfit]">
        {t.cashOnDelivery} · {t.freeShipping}
      </div>

      {/* Main nav */}
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 h-16 flex items-center justify-between gap-4">

        {/* Left nav (desktop) */}
        <nav className="hidden md:flex items-center gap-8 flex-1">
          {navLinks.slice(0, 2).map(link => (
            <Link
              key={link.href}
              to={link.href}
              className="hover-gold-line text-sm tracking-[0.12em] text-white/80 hover:text-white transition-colors"
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
        </nav>

        {/* Center: Logo */}
        <div className="flex-1 md:flex-none flex justify-center">
          <Link to="/" className="flex flex-col items-center group select-none">
            <span
              style={{ fontFamily: 'Playfair Display, serif' }}
              className="text-2xl md:text-3xl font-semibold tracking-[0.35em] text-white group-hover:text-[#C4A265] transition-colors duration-300"
            >
              AUREX
            </span>
            <span className="text-[8px] tracking-[0.45em] text-[#C4A265] font-[Outfit] font-light mt-[-2px]">
              {t.slogan}
            </span>
          </Link>
        </div>

        {/* Right nav (desktop) */}
        <nav className="hidden md:flex items-center gap-8 flex-1 justify-end">
          {navLinks.slice(2).map(link => (
            <Link
              key={link.href}
              to={link.href}
              className="hover-gold-line text-sm tracking-[0.12em] text-white/80 hover:text-white transition-colors"
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Language switcher (desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {LANGS.map((l, i) => (
              <span key={l.code} className="flex items-center">
                <button
                  onClick={() => setLang(l.code)}
                  className={`text-xs tracking-widest transition-colors ${lang === l.code ? 'text-[#C4A265] font-medium' : 'text-white/50 hover:text-white/80'}`}
                >
                  {l.label}
                </button>
                {i < LANGS.length - 1 && <span className="text-white/20 mx-1 text-xs">|</span>}
              </span>
            ))}
          </div>

          {/* Search */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-white/70 hover:text-[#C4A265] transition-colors p-1"
            aria-label={t.search}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>

          {/* Cart */}
          <Link to="/cart" className="relative text-white/70 hover:text-[#C4A265] transition-colors p-1" aria-label={t.cart}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#C4A265] text-[#1C1C1C] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white/70 hover:text-white transition-colors p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {menuOpen ? <path d="M18 6 6 18M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
            </svg>
          </button>
        </div>
      </div>

      {/* Search bar (dropdown) */}
      {searchOpen && (
        <div className="border-t border-white/10 bg-[#161616] px-5 md:px-10 py-4">
          <form onSubmit={handleSearch} className="max-w-[600px] mx-auto flex gap-3">
            <input
              ref={searchRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="flex-1 bg-transparent border-b border-white/20 focus:border-[#C4A265] text-white placeholder-white/30 text-sm py-2 outline-none transition-colors font-[Outfit]"
            />
            <button
              type="submit"
              className="text-[#C4A265] text-xs tracking-[0.15em] font-[Outfit] hover:text-white transition-colors"
            >
              {t.search.toUpperCase()}
            </button>
          </form>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#161616] border-t border-white/10 px-5 py-6 flex flex-col gap-5">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm tracking-[0.12em] text-white/80 hover:text-[#C4A265] transition-colors py-1"
            >
              {link.label.toUpperCase()}
            </Link>
          ))}
          <div className="flex items-center gap-4 pt-3 border-t border-white/10">
            {LANGS.map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setMenuOpen(false); }}
                className={`text-xs tracking-widest ${lang === l.code ? 'text-[#C4A265]' : 'text-white/40'}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
