import { useState } from 'react';
import { useLang } from '../context/LangContext';
import { translations } from '../i18n/translations';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

interface ContactErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactPage() {
  const { lang, isRtl } = useLang();
  const t = translations[lang];
  const [form, setForm] = useState<ContactForm>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function validate(): ContactErrors {
    const errs: ContactErrors = {};
    if (!form.name.trim()) errs.name = t.required;
    if (!form.email.trim()) errs.email = t.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = lang === 'ar' ? 'بريد إلكتروني غير صالح' : lang === 'fr' ? 'Email invalide' : 'Invalid email';
    if (!form.message.trim()) errs.message = t.required;
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    setTimeout(() => { setSent(true); setSubmitting(false); }, 800);
  }

  function handleChange(field: keyof ContactForm, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  }

  const inputClass = (field: keyof ContactErrors) =>
    `w-full bg-transparent border-b ${errors[field] ? 'border-red-400' : 'border-[#1C1C1C]/20 focus:border-[#C4A265]'} text-[#1C1C1C] placeholder-[#1C1C1C]/30 text-sm py-2.5 outline-none transition-colors font-[Outfit]`;

  return (
    <div className="bg-[#F7F4EF] min-h-screen" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="relative h-44 md:h-56 bg-[#1C1C1C] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=1400&h=400&fit=crop&auto=format" alt="" className="w-full h-full object-cover opacity-25" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5">
          <span className="text-[#C4A265] text-xs tracking-[0.3em] font-[Outfit] mb-3">AUREX</span>
          <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl md:text-4xl font-semibold text-white">{t.contactTitle}</h1>
          <p className="text-white/50 font-[Outfit] text-sm mt-2">{t.contactSubtitle}</p>
        </div>
      </div>

      <div className="max-w-[780px] mx-auto px-5 md:px-10 py-14 md:py-20">
        {sent ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full border border-[#C4A265]/40 flex items-center justify-center mx-auto mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C4A265" strokeWidth="1.5">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl text-[#1C1C1C] mb-3">{t.messageSent}</h2>
            <p className="text-[#1C1C1C]/50 font-[Outfit] font-light">{t.messageSentSub}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-12">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-7">
              <div>
                <label className="block text-[10px] tracking-[0.2em] text-[#1C1C1C]/50 font-[Outfit] uppercase mb-2">{t.yourName} *</label>
                <input type="text" value={form.name} onChange={e => handleChange('name', e.target.value)} className={inputClass('name')} placeholder={t.yourName} />
                {errors.name && <p className="text-red-400 text-xs mt-1 font-[Outfit]">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] text-[#1C1C1C]/50 font-[Outfit] uppercase mb-2">{t.yourEmail} *</label>
                <input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} className={inputClass('email')} placeholder="hello@exemple.com" dir="ltr" />
                {errors.email && <p className="text-red-400 text-xs mt-1 font-[Outfit]">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-[10px] tracking-[0.2em] text-[#1C1C1C]/50 font-[Outfit] uppercase mb-2">{t.yourMessage} *</label>
                <textarea value={form.message} onChange={e => handleChange('message', e.target.value)} className={`${inputClass('message')} resize-none`} rows={5} placeholder={t.yourMessage} />
                {errors.message && <p className="text-red-400 text-xs mt-1 font-[Outfit]">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-[#1C1C1C] hover:bg-[#C4A265] text-white hover:text-[#1C1C1C] py-4 text-sm tracking-[0.18em] font-[Outfit] font-medium transition-colors duration-200 disabled:opacity-60"
              >
                {submitting ? '...' : t.sendMessage.toUpperCase()}
              </button>
            </form>

            {/* Contact info */}
            <div className="flex flex-col gap-6 pt-1">
              {[
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4A265" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/></svg>,
                  label: 'WhatsApp',
                  value: '0603821176',
                  href: 'https://wa.me/212603821176',
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4A265" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z"/></svg>,
                  label: lang === 'ar' ? 'الهاتف' : lang === 'fr' ? 'Téléphone' : 'Phone',
                  value: '0603821176',
                  href: 'tel:0603821176',
                },
                {
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C4A265" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                  label: lang === 'ar' ? 'الموقع' : lang === 'fr' ? 'Adresse' : 'Address',
                  value: 'Casablanca, Maroc 🇲🇦',
                },
              ].map(item => (
                <div key={item.label} className={`flex items-start gap-3 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                  <span className="mt-0.5 shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-[10px] tracking-[0.2em] text-[#1C1C1C]/40 font-[Outfit] uppercase mb-0.5">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-[#C4A265] text-sm font-[Outfit] hover:underline" dir="ltr">{item.value}</a>
                    ) : (
                      <p className="text-[#1C1C1C] text-sm font-[Outfit]" dir="ltr">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
