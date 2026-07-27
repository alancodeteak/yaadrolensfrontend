import {
  DOCS_LANGUAGE_STORAGE_KEY,
  resolveDocsLanguage,
} from '../../pages/docs/docsI18n';

export function readPageTourLanguage() {
  if (typeof window === 'undefined') return 'en';
  return resolveDocsLanguage(localStorage.getItem(DOCS_LANGUAGE_STORAGE_KEY));
}

export function pickGuideSteps(stepsByLang, lang = readPageTourLanguage()) {
  if (!stepsByLang) return [];
  return stepsByLang[lang] || stepsByLang.en || [];
}

export function pickPageLabel(labelsByLang, lang = readPageTourLanguage()) {
  if (!labelsByLang) return undefined;
  return labelsByLang[lang] || labelsByLang.en;
}

export const PAGE_INFO_OVERLAY_COPY = {
  en: {
    heading: (pageLabel) => `What's on ${pageLabel}`,
    subheading: 'Brief guide to each section',
    close: 'Close',
    dialogLabel: 'Page help',
  },
  hi: {
    heading: (pageLabel) => `${pageLabel} पर क्या है`,
    subheading: 'हर सेक्शन का संक्षिप्त विवरण',
    close: 'बंद करें',
    dialogLabel: 'पेज सहायता',
  },
  ml: {
    heading: (pageLabel) => `${pageLabel} എന്നതിൽ എന്താണ്`,
    subheading: 'ഓരോ വിഭാഗത്തിന്റെയും ചുരുക്ക വിവരണം',
    close: 'അടയ്ക്കുക',
    dialogLabel: 'പേജ് സഹായം',
  },
  kn: {
    heading: (pageLabel) => `${pageLabel} ನಲ್ಲಿ ಏನಿದೆ`,
    subheading: 'ಪ್ರತಿ ವಿಭಾಗದ ಸಂಕ್ಷಿಪ್ತ ಮಾರ್ಗದರ್ಶಿ',
    close: 'ಮುಚ್ಚಿ',
    dialogLabel: 'ಪುಟ ಸಹಾಯ',
  },
};

export function getPageInfoOverlayCopy(lang = readPageTourLanguage()) {
  return PAGE_INFO_OVERLAY_COPY[lang] || PAGE_INFO_OVERLAY_COPY.en;
}
