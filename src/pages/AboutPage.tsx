import { Link } from 'react-router';
import { useLang } from '../context/LangContext';
import { translations } from '../i18n/translations';

export default function AboutPage() {
  const { lang, isRtl } = useLang();
  const t = translations[lang];

  const content = {
    fr: {
      story: "AUREX est née d'une conviction simple : le Maroc mérite une marque de montres à la hauteur de son histoire et de son raffinement. Fondée par des passionnés d'horlogerie, AUREX propose des garde-temps alliant héritage artisanal et modernité contemporaine.",
      mission: "Notre mission est de rendre accessible l'excellence horlogère aux femmes et aux hommes du Maroc, sans compromis sur la qualité, le style ou l'authenticité. Chaque montre AUREX est sélectionnée avec soin, livrée directement chez vous.",
      values: [
        { title: 'Excellence', text: 'Chaque pièce est rigoureusement sélectionnée pour sa qualité de fabrication et la fiabilité de son mouvement.' },
        { title: 'Authenticité', text: 'Nous n\'utilisons que des composants authentiques avec des certificats de qualité vérifiables.' },
        { title: 'Service', text: 'Paiement à la livraison, retours faciles, et accompagnement personnalisé via WhatsApp.' },
      ],
    },
    en: {
      story: "AUREX was born from a simple conviction: Morocco deserves a watch brand worthy of its history and refinement. Founded by horology enthusiasts, AUREX offers timepieces combining artisan heritage with contemporary modernity.",
      mission: "Our mission is to make horological excellence accessible to the women and men of Morocco, without compromise on quality, style, or authenticity. Every AUREX watch is carefully selected and delivered directly to your door.",
      values: [
        { title: 'Excellence', text: 'Every piece is rigorously selected for its manufacturing quality and movement reliability.' },
        { title: 'Authenticity', text: 'We use only authentic components with verifiable quality certificates.' },
        { title: 'Service', text: 'Cash on delivery, easy returns, and personalised support via WhatsApp.' },
      ],
    },
    ar: {
      story: "وُلدت AUREX من قناعة بسيطة: يستحق المغرب علامة ساعات على مستوى تاريخه ورقيّه. أسسها عشاق لصناعة الساعات، تقدم AUREX قطعاً تجمع بين الإرث الحرفي والحداثة المعاصرة.",
      mission: "مهمتنا هي إتاحة التميز الساعاتي للمرأة والرجل في المغرب، دون تنازل عن الجودة أو الأسلوب أو الأصالة. كل ساعة AUREX مختارة بعناية وتُوصَّل مباشرة إلى باب منزلك.",
      values: [
        { title: 'التميز', text: 'تُختار كل قطعة بصرامة بناءً على جودة تصنيعها وموثوقية حركتها.' },
        { title: 'الأصالة', text: 'نستخدم فقط مكونات أصيلة مع شهادات جودة قابلة للتحقق.' },
        { title: 'الخدمة', text: 'الدفع عند الاستلام، إرجاع سهل، ودعم شخصي عبر واتساب.' },
      ],
    },
  };

  const c = content[lang];

  return (
    <div className="bg-[#F7F4EF] min-h-screen" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Hero */}
      <div className="relative h-60 md:h-80 bg-[#1C1C1C] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1400&h=600&fit=crop&auto=format"
          alt=""
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5">
          <span className="text-[#C4A265] text-xs tracking-[0.3em] font-[Outfit] mb-4">AUREX</span>
          <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl md:text-5xl font-semibold text-white mb-3">
            {t.aboutTitle}
          </h1>
          <p className="text-white/50 font-[Outfit] font-light text-sm max-w-md">{t.aboutSubtitle}</p>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-5 md:px-10 py-16 md:py-24">
        {/* Story */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#C4A265]" />
            <span className="text-[#C4A265] text-xs tracking-[0.3em] font-[Outfit] uppercase">
              {lang === 'ar' ? 'قصتنا' : lang === 'fr' ? 'Notre histoire' : 'Our Story'}
            </span>
          </div>
          <p className="text-[#1C1C1C]/70 font-[Outfit] font-light leading-relaxed text-base md:text-lg">{c.story}</p>
        </div>

        {/* Mission */}
        <div className="mb-14 bg-[#1C1C1C] text-white p-8 md:p-12">
          <p style={{ fontFamily: 'Playfair Display, serif' }} className="text-xl md:text-2xl font-medium leading-relaxed italic text-[#C4A265]">
            "{c.mission}"
          </p>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {c.values.map(val => (
            <div key={val.title}>
              <div className="h-px w-8 bg-[#C4A265] mb-4" />
              <h3 style={{ fontFamily: 'Playfair Display, serif' }} className="text-lg font-semibold text-[#1C1C1C] mb-3">
                {val.title}
              </h3>
              <p className="text-[#1C1C1C]/60 font-[Outfit] font-light text-sm leading-relaxed">{val.text}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center pt-6 border-t border-[#1C1C1C]/10">
          <Link
            to="/"
            className="inline-block bg-[#1C1C1C] text-white px-10 py-4 text-sm tracking-[0.18em] font-[Outfit] hover:bg-[#C4A265] hover:text-[#1C1C1C] transition-colors"
          >
            {lang === 'ar' ? 'اكتشف المجموعة' : lang === 'fr' ? 'Découvrir la collection' : 'Explore the collection'}
          </Link>
        </div>
      </div>
    </div>
  );
}
