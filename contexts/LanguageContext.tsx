import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, TranslationKey } from '../types';
import { allTranslations } from '../translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, ...args: any[]) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

const STORAGE_LANG_KEY = 'promptmatrix_language_pref';

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LANG_KEY);
      if (saved === 'en' || saved === 'id') return saved;
    } catch {
      // ignore
    }
    return 'id'; // Default to Indonesian
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_LANG_KEY, lang);
    } catch {
      // ignore
    }
  };

  const t = (key: string, ...args: any[]): string => {
    const translations = allTranslations[language] || allTranslations['id'];
    const value = (translations as any)[key];
    
    if (typeof value === 'string') {
      return value;
    } else if (typeof value === 'function') {
      return value(...args);
    } else if (Array.isArray(value)) {
      return value.join(' ');
    }
    
    // Check fallback in 'en' or 'id'
    const fallbackVal = (allTranslations['en'] as any)?.[key] || (allTranslations['id'] as any)?.[key];
    if (fallbackVal && typeof fallbackVal === 'string') {
      return fallbackVal;
    }

    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};