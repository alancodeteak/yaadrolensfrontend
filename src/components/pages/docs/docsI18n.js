export const DOCS_LANGUAGES = [
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'हिंदी' },
  { id: 'ml', label: 'മലയാളം' },
  { id: 'kn', label: 'ಕನ್ನಡ' },
];

export const DOCS_LANGUAGE_STORAGE_KEY = 'docs-language';

export const DOCS_LANGUAGE_LABEL = {
  en: 'Choose your language',
  hi: 'अपनी भाषा चुनें',
  ml: 'നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക',
  kn: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
};

export const resolveDocsLanguage = (langId) => {
  if (langId && DOCS_LANGUAGES.some((lang) => lang.id === langId)) {
    return langId;
  }
  return 'en';
};

/** Inline link part for translated paragraphs / list items */
export const docLink = (to, label) => ({ type: 'link', to, label });

/** Bold inline part */
export const docStrong = (text) => ({ type: 'strong', text });
