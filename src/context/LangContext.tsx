import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Lang } from '../i18n/translations';

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  isRtl: boolean;
}

const LangContext = createContext<LangContextValue>({
  lang: 'fr',
  setLang: () => {},
  isRtl: false,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem('aurex-lang') as Lang) || 'fr';
  });

  const isRtl = lang === 'ar';

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem('aurex-lang', l);
  }

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  return (
    <LangContext.Provider value={{ lang, setLang, isRtl }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
