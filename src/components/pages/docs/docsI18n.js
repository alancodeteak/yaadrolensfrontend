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

/** Pick translated guide content, falling back to English when a locale is incomplete. */
export const resolveDocsGuideContent = (contentByLang, language) => {
  const requested = contentByLang?.[language];
  const english = contentByLang?.en;
  if (!english) {
    return { content: requested || {}, usedFallback: false };
  }
  if (!requested) {
    return { content: english, usedFallback: language !== 'en' };
  }
  const hasSections = Array.isArray(requested.sections) && requested.sections.length > 0;
  const usesEnglishSections = requested.sections === english.sections;
  if (!hasSections || usesEnglishSections) {
    return { content: english, usedFallback: language !== 'en' };
  }
  return { content: requested, usedFallback: false };
};

export const DOCS_FALLBACK_NOTICE = {
  en: 'This page is not fully translated yet. Showing English.',
  hi: 'यह पेज अभी पूरी तरह अनुवादित नहीं है। अंग्रेज़ी में दिखाया जा रहा है।',
  ml: 'ഈ പേജ് ഇതുവരെ പൂർണ്ണമായി വിവർത്തനം ചെയ്തിട്ടില്ല. ഇംഗ്ലീഷിൽ കാണിക്കുന്നു.',
  kn: 'ಈ ಪುಟ ಇನ್ನೂ ಸಂಪೂರ್ಣವಾಗಿ ಅನುವಾದಿಸಲಾಗಿಲ್ಲ. ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ತೋರಿಸಲಾಗುತ್ತಿದೆ.',
};

/** Inline link part for translated paragraphs / list items */
export const docLink = (to, label) => ({ type: 'link', to, label });

/** Bold inline part */
export const docStrong = (text) => ({ type: 'strong', text });
