import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Lang } from '../i18n';
import { t as translate, type TranslationKey } from '../i18n';

type Theme = 'light' | 'dark';

interface SettingsContextType {
  lang: Lang;
  theme: Theme;
  toggleLang: () => void;
  toggleTheme: () => void;
  t: (key: TranslationKey) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('lang') as Lang) || 'zh');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const toggleLang = () => setLang(l => l === 'zh' ? 'en' : 'zh');
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const t = (key: TranslationKey) => translate(key, lang);

  return (
    <SettingsContext.Provider value={{ lang, theme, toggleLang, toggleTheme, t }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
