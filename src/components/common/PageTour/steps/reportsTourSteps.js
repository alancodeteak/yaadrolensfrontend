const REPORTS_GUIDE_STEPS_EN = [
  {
    id: 'reports-categories',
    selector: '[data-tour="reports-categories"]',
    title: 'Report categories',
    body: 'Switch between Attendance, Payroll, and Salary & Workforce. Each tab shows the reports available in that group.',
  },
  {
    id: 'reports-category-info',
    selector: '[data-tour="reports-category-info"]',
    title: 'Category summary',
    body: 'See a short description of the active category and how many reports you can download.',
  },
  {
    id: 'reports-filters',
    selector: '[data-tour="reports-filters"]',
    title: 'Set filters',
    body: 'Choose dates, employees, departments, or other options for each report. Required fields are marked with an asterisk.',
  },
  {
    id: 'reports-download',
    selector: '[data-tour="reports-download"]',
    title: 'Download',
    body: 'Export the report as Excel (.xlsx) or PDF. The file downloads immediately to your device.',
  },
];

const REPORTS_GUIDE_STEPS_HI = [
  {
    id: 'reports-categories',
    selector: '[data-tour="reports-categories"]',
    title: 'रिपोर्ट श्रेणियाँ',
    body: 'Attendance, Payroll और Salary & Workforce के बीच स्विच करें। हर टैब उस समूह की उपलब्ध रिपोर्ट दिखाता है।',
  },
  {
    id: 'reports-category-info',
    selector: '[data-tour="reports-category-info"]',
    title: 'श्रेणी सारांश',
    body: 'सक्रिय श्रेणी का संक्षिप्त विवरण और आप कितनी रिपोर्ट डाउनलोड कर सकते हैं, यह देखें।',
  },
  {
    id: 'reports-filters',
    selector: '[data-tour="reports-filters"]',
    title: 'फ़िल्टर सेट करें',
    body: 'हर रिपोर्ट के लिए तारीख, कर्मचारी, विभाग या अन्य विकल्प चुनें। आवश्यक फ़ील्ड तारांकन (*) से चिह्नित हैं।',
  },
  {
    id: 'reports-download',
    selector: '[data-tour="reports-download"]',
    title: 'डाउनलोड',
    body: 'रिपोर्ट Excel (.xlsx) या PDF के रूप में निर्यात करें। फ़ाइल तुरंत आपके डिवाइस पर डाउनलोड होगी।',
  },
];

const REPORTS_GUIDE_STEPS_ML = [
  {
    id: 'reports-categories',
    selector: '[data-tour="reports-categories"]',
    title: 'റിപ്പോർട്ട് വിഭാഗങ്ങൾ',
    body: 'Attendance, Payroll, Salary & Workforce എന്നിവയ്ക്കിടയിൽ മാറുക. ഓരോ ടാബും ആ ഗ്രൂപ്പിലെ ലഭ്യമായ റിപ്പോർട്ടുകൾ കാണിക്കുന്നു.',
  },
  {
    id: 'reports-category-info',
    selector: '[data-tour="reports-category-info"]',
    title: 'വിഭാഗ സംഗ്രഹം',
    body: 'സജീവ വിഭാഗത്തിന്റെ ചുരുക്ക വിവരണവും എത്ര റിപ്പോർട്ടുകൾ ഡൗൺലോഡ് ചെയ്യാം എന്നും കാണുക.',
  },
  {
    id: 'reports-filters',
    selector: '[data-tour="reports-filters"]',
    title: 'ഫിൽട്ടറുകൾ സജ്ജമാക്കുക',
    body: 'ഓരോ റിപ്പോർട്ടിനും തീയതി, ജീവനക്കാർ, വകുപ്പ് അല്ലെങ്കിൽ മറ്റ് ഓപ്ഷനുകൾ തിരഞ്ഞെടുക്കുക. ആവശ്യമായ ഫീൽഡുകൾ നക്ഷത്ര ചിഹ്നം (*) കൊണ്ട് അടയാളപ്പെടുത്തിയിട്ടുണ്ട്.',
  },
  {
    id: 'reports-download',
    selector: '[data-tour="reports-download"]',
    title: 'ഡൗൺലോഡ്',
    body: 'റിപ്പോർട്ട് Excel (.xlsx) അല്ലെങ്കിൽ PDF ആയി എക്സ്പോർട്ട് ചെയ്യുക. ഫയൽ ഉടൻ നിങ്ങളുടെ ഉപകരണത്തിൽ ഡൗൺലോഡ് ആകും.',
  },
];

const REPORTS_GUIDE_STEPS_KN = [
  {
    id: 'reports-categories',
    selector: '[data-tour="reports-categories"]',
    title: 'ವರದಿ ವರ್ಗಗಳು',
    body: 'Attendance, Payroll ಮತ್ತು Salary & Workforce ನಡುವೆ ಬದಲಾಯಿಸಿ. ಪ್ರತಿ ಟ್ಯಾಬ್ ಆ ಗುಂಪಿನ ಲಭ್ಯವಿರುವ ವರದಿಗಳನ್ನು ತೋರಿಸುತ್ತದೆ.',
  },
  {
    id: 'reports-category-info',
    selector: '[data-tour="reports-category-info"]',
    title: 'ವರ್ಗ ಸಾರಾಂಶ',
    body: 'ಸಕ್ರಿಯ ವರ್ಗದ ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆ ಮತ್ತು ಎಷ್ಟು ವರದಿಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಬಹುದು ಎಂಬುದನ್ನು ನೋಡಿ.',
  },
  {
    id: 'reports-filters',
    selector: '[data-tour="reports-filters"]',
    title: 'ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಹೊಂದಿಸಿ',
    body: 'ಪ್ರತಿ ವರದಿಗೆ ದಿನಾಂಕ, ಉದ್ಯೋಗಿಗಳು, ವಿಭಾಗ ಅಥವಾ ಇತರ ಆಯ್ಕೆಗಳನ್ನು ಆರಿಸಿ. ಅಗತ್ಯ ಫೀಲ್ಡ್‌ಗಳನ್ನು ನಕ್ಷತ್ರ (*) ಚಿಹ್ನೆಯಿಂದ ಗುರುತಿಸಲಾಗಿದೆ.',
  },
  {
    id: 'reports-download',
    selector: '[data-tour="reports-download"]',
    title: 'ಡೌನ್‌ಲೋಡ್',
    body: 'ವರದಿಯನ್ನು Excel (.xlsx) ಅಥವಾ PDF ಆಗಿ ರಫ್ತು ಮಾಡಿ. ಫೈಲ್ ತಕ್ಷಣ ನಿಮ್ಮ ಸಾಧನಕ್ಕೆ ಡೌನ್‌ಲೋಡ್ ಆಗುತ್ತದೆ.',
  },
];

export const REPORTS_PAGE_LABELS = {
  en: 'Reports',
  hi: 'रिपोर्ट',
  ml: 'റിപ്പോർട്ടുകൾ',
  kn: 'ವರದಿಗಳು',
};

export const REPORTS_GUIDE_STEPS_BY_LANG = {
  en: REPORTS_GUIDE_STEPS_EN,
  hi: REPORTS_GUIDE_STEPS_HI,
  ml: REPORTS_GUIDE_STEPS_ML,
  kn: REPORTS_GUIDE_STEPS_KN,
};

export const REPORTS_GUIDE_STEPS = REPORTS_GUIDE_STEPS_EN;
