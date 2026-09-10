import { Link } from 'react-router';
import { useLang } from '../context/LangContext';
import { translations } from '../i18n/translations';

export default function Footer() {
  const { lang, isRtl } = useLang();
  const t = translations[lang];

  const navLinks = [
    { label: t.men, href: '/men' },
    { label: t.women, href: '/women' },
    { label: t.about, href: '/about' },
    { label: t.contact, href: '/contact' },
  ];

  const serviceLinks = [
    { label: t.footerDelivery },
    { label: t.footerPayment },
    { label: t.footerReturns },
    { label: t.footerWhatsapp },
  ];

  return (
    <footer className="bg-[#111111] text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-[1400px] mx-auto px-5 md:px-10">
        <div className="py-14 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-flex flex-col mb-6">
              <span
                style={{ fontFamily: 'Playfair Display, serif' }}
                className="text-2xl tracking-[0.35em] text-white hover:text-[#C4A265] transition-colors"
              >
                AUREX
              </span>
              <span className="text-[9px] tracking-[0.45em] text-[#C4A265] font-[Outfit] font-light mt-0.5">
                {t.slogan}
              </span>
            </Link>
            <p className="text-white/40 text-sm font-[Outfit] font-light leading-relaxed max-w-[240px]">
              {t.footerTagline}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[#C4A265] text-xs tracking-[0.25em] font-[Outfit] mb-6 uppercase">
              {t.footerNav}
            </h4>
            <ul className="space-y-3">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/50 hover:text-[#C4A265] text-sm font-[Outfit] tracking-wide transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service */}
          <div>
            <h4 className="text-[#C4A265] text-xs tracking-[0.25em] font-[Outfit] mb-6 uppercase">
              {t.footerService}
            </h4>
            <ul className="space-y-3">
              {serviceLinks.map(link => (
                <li key={link.label} className="text-white/50 text-sm font-[Outfit] tracking-wide">
                  {link.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#C4A265]/30 to-transparent" />

        <div className="py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-white/30 text-xs font-[Outfit] tracking-wide">
          <span>{t.footerRights}</span>
          <span className="text-[#C4A265]/40">🇲🇦 Maroc · المغرب</span>
        </div>
      </div>
    </footer>
  );
}
