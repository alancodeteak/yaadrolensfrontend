import { createContext, useContext, useMemo, useState } from 'react';
import {
  DEFAULT_DOCS_LANGUAGE,
  DOCS_LANGUAGE_STORAGE_KEY,
  resolveDocsLanguage,
} from './docsI18n';

const DocsLanguageContext = createContext(null);

const LEGACY_LANGUAGE_STORAGE_KEY = 'docs-getting-started-lang';

const readInitialLanguage = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_DOCS_LANGUAGE;
  }

  const saved = localStorage.getItem(DOCS_LANGUAGE_STORAGE_KEY);
  if (saved) {
    return resolveDocsLanguage(saved);
  }

  const legacy = localStorage.getItem(LEGACY_LANGUAGE_STORAGE_KEY);
  if (legacy) {
    const resolved = resolveDocsLanguage(legacy);
    localStorage.setItem(DOCS_LANGUAGE_STORAGE_KEY, resolved);
    localStorage.removeItem(LEGACY_LANGUAGE_STORAGE_KEY);
    return resolved;
  }

  localStorage.setItem(DOCS_LANGUAGE_STORAGE_KEY, DEFAULT_DOCS_LANGUAGE);
  return DEFAULT_DOCS_LANGUAGE;
};

export const DocsLanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(readInitialLanguage);

  const setLanguage = (langId) => {
    const next = resolveDocsLanguage(langId);
    setLanguageState(next);
    localStorage.setItem(DOCS_LANGUAGE_STORAGE_KEY, next);
  };

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return (
    <DocsLanguageContext.Provider value={value}>{children}</DocsLanguageContext.Provider>
  );
};

export const useDocsLanguage = () => {
  const context = useContext(DocsLanguageContext);
  if (!context) {
    throw new Error('useDocsLanguage must be used within DocsLanguageProvider');
  }
  return context;
};
