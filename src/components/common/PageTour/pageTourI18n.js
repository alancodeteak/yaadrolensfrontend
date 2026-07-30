import {
  DEFAULT_DOCS_LANGUAGE,
  DOCS_LANGUAGE_STORAGE_KEY,
  resolveDocsLanguage,
} from '../../pages/docs/docsI18n';

export function readPageTourLanguage() {
  if (typeof window === 'undefined') return DEFAULT_DOCS_LANGUAGE;
  return resolveDocsLanguage(localStorage.getItem(DOCS_LANGUAGE_STORAGE_KEY));
}

export function pickGuideSteps(stepsByLang, lang = readPageTourLanguage()) {
  if (!stepsByLang) return [];
  if (Array.isArray(stepsByLang)) return stepsByLang;
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

export const PAGE_TOUR_BUTTON_COPY = {
  en: {
    tutorial: 'Tutorial',
    info: 'Info',
    guide: 'Guide',
    infoAria: 'What is on this page?',
    guideAria: 'Open full guide for this page',
  },
  hi: {
    tutorial: 'ट्यूटोरियल',
    info: 'जानकारी',
    guide: 'गाइड',
    infoAria: 'इस पेज पर क्या है?',
    guideAria: 'इस पेज की पूरी गाइड खोलें',
  },
  ml: {
    tutorial: 'ട്യൂട്ടോറിയൽ',
    info: 'വിവരം',
    guide: 'ഗൈഡ്',
    infoAria: 'ഈ പേജിൽ എന്തുണ്ട്?',
    guideAria: 'ഈ പേജിന്റെ പൂർണ്ണ ഗൈഡ് തുറക്കുക',
  },
  kn: {
    tutorial: 'ಟ್ಯುಟೋರಿಯಲ್',
    info: 'ಮಾಹಿತಿ',
    guide: 'ಮಾರ್ಗದರ್ಶಿ',
    infoAria: 'ಈ ಪುಟದಲ್ಲಿ ಏನಿದೆ?',
    guideAria: 'ಈ ಪುಟದ ಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿ ತೆರೆಯಿರಿ',
  },
};

export function getPageTourButtonCopy(lang = readPageTourLanguage()) {
  return PAGE_TOUR_BUTTON_COPY[lang] || PAGE_TOUR_BUTTON_COPY.en;
}

export const DRIVER_TOUR_COPY = {
  en: {
    progressText: '{{current}} of {{total}}',
    nextBtnText: 'Next',
    prevBtnText: 'Back',
    doneBtnText: 'Done',
    skipBtnText: 'Skip tour',
  },
  hi: {
    progressText: '{{current}} / {{total}}',
    nextBtnText: 'आगे',
    prevBtnText: 'पीछे',
    doneBtnText: 'पूर्ण',
    skipBtnText: 'छोड़ें',
  },
  ml: {
    progressText: '{{current}} / {{total}}',
    nextBtnText: 'അടുത്തത്',
    prevBtnText: 'തിരികെ',
    doneBtnText: 'കഴിഞ്ഞു',
    skipBtnText: 'ഒഴിവാക്കുക',
  },
  kn: {
    progressText: '{{current}} / {{total}}',
    nextBtnText: 'ಮುಂದೆ',
    prevBtnText: 'ಹಿಂದೆ',
    doneBtnText: 'ಮುಗಿಯಿತು',
    skipBtnText: 'ಬಿಟ್ಟುಬಿಡಿ',
  },
};

export function getDriverTourCopy(lang = readPageTourLanguage()) {
  return DRIVER_TOUR_COPY[lang] || DRIVER_TOUR_COPY.en;
}
