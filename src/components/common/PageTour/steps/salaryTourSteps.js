const SALARY_GUIDE_STEPS_EN = [
  {
    id: 'salary-stats',
    selector: '[data-tour="salary-stats"]',
    title: 'Salary overview',
    body: 'See how many employees have salaries set and your total monthly payroll at a glance.',
  },
  {
    id: 'salary-filters',
    selector: '[data-tour="salary-filters"]',
    title: 'Search and filter',
    body: 'Find employees by name or code. Filter by active/inactive status or show only those without a salary set.',
  },
  {
    id: 'salary-table',
    selector: '[data-tour="salary-table"]',
    title: 'Salary table',
    body: "View each employee's current monthly salary, when it was last changed, and their status.",
  },
  {
    id: 'salary-actions',
    selector: '[data-tour="salary-actions"]',
    title: 'Edit and history',
    body: 'Update a salary with an effective date and reason, or open the full change history for any employee.',
  },
];

const SALARY_GUIDE_STEPS_HI = [
  {
    id: 'salary-stats',
    selector: '[data-tour="salary-stats"]',
    title: 'वेतन अवलोकन',
    body: 'देखें कितने कर्मचारियों का वेतन सेट है और आपका कुल मासिक पेरोल एक नज़र में।',
  },
  {
    id: 'salary-filters',
    selector: '[data-tour="salary-filters"]',
    title: 'खोजें और फ़िल्टर करें',
    body: 'नाम या कोड से कर्मचारी खोजें। सक्रिय/निष्क्रिय स्थिति से फ़िल्टर करें या केवल बिना वेतन वाले दिखाएँ।',
  },
  {
    id: 'salary-table',
    selector: '[data-tour="salary-table"]',
    title: 'वेतन तालिका',
    body: 'हर कर्मचारी का वर्तमान मासिक वेतन, अंतिम बदलाव की तारीख और स्थिति देखें।',
  },
  {
    id: 'salary-actions',
    selector: '[data-tour="salary-actions"]',
    title: 'संपादन और इतिहास',
    body: 'प्रभावी तारीख और कारण के साथ वेतन अपडेट करें, या किसी भी कर्मचारी का पूरा बदलाव इतिहास खोलें।',
  },
];

const SALARY_GUIDE_STEPS_ML = [
  {
    id: 'salary-stats',
    selector: '[data-tour="salary-stats"]',
    title: 'ശമ്പള അവലോകനം',
    body: 'എത്ര ജീവനക്കാർക്ക് ശമ്പളം സജ്ജമാക്കിയിട്ടുണ്ട്, മൊത്തം മാസിക പേറോൾ എന്നിവ ഒറ്റനോട്ടത്തിൽ കാണുക.',
  },
  {
    id: 'salary-filters',
    selector: '[data-tour="salary-filters"]',
    title: 'തിരയുക, ഫിൽട്ടർ ചെയ്യുക',
    body: 'പേര് അല്ലെങ്കിൽ കോഡ് ഉപയോഗിച്ച് ജീവനക്കാരെ കണ്ടെത്തുക. സജീവ/നിഷ്ക്രിയ നില പ്രകാരം ഫിൽട്ടർ ചെയ്യുക, അല്ലെങ്കിൽ ശമ്പളമില്ലാത്തവരെ മാത്രം കാണിക്കുക.',
  },
  {
    id: 'salary-table',
    selector: '[data-tour="salary-table"]',
    title: 'ശമ്പള പട്ടിക',
    body: 'ഓരോ ജീവനക്കാരുടെയും നിലവിലെ മാസ ശമ്പളം, അവസാനം മാറ്റിയ തീയതി, നില എന്നിവ കാണുക.',
  },
  {
    id: 'salary-actions',
    selector: '[data-tour="salary-actions"]',
    title: 'എഡിറ്റ്, ചരിത്രം',
    body: 'പ്രാബല്യ തീയതിയും കാരണവും ഉപയോഗിച്ച് ശമ്പളം അപ്ഡേറ്റ് ചെയ്യുക, അല്ലെങ്കിൽ ഏതെങ്കിലും ജീവനക്കാരുടെ മുഴുവൻ മാറ്റ ചരിത്രം തുറക്കുക.',
  },
];

const SALARY_GUIDE_STEPS_KN = [
  {
    id: 'salary-stats',
    selector: '[data-tour="salary-stats"]',
    title: 'ಸಂಬಳ ಅವಲೋಕನ',
    body: 'ಎಷ್ಟು ಉದ್ಯೋಗಿಗಳಿಗೆ ಸಂಬಳ ಹೊಂದಿಸಲಾಗಿದೆ ಮತ್ತು ನಿಮ್ಮ ಒಟ್ಟು ಮಾಸಿಕ ಪೇರೋಲ್ ಅನ್ನು ಒಂದೇ ನೋಟದಲ್ಲಿ ನೋಡಿ.',
  },
  {
    id: 'salary-filters',
    selector: '[data-tour="salary-filters"]',
    title: 'ಹುಡುಕಿ ಮತ್ತು ಫಿಲ್ಟರ್',
    body: 'ಹೆಸರು ಅಥವಾ ಕೋಡ್ ಮೂಲಕ ಉದ್ಯೋಗಿಗಳನ್ನು ಹುಡುಕಿ. ಸಕ್ರಿಯ/ನಿಷ್ಕ್ರಿಯ ಸ್ಥಿತಿಯಿಂದ ಫಿಲ್ಟರ್ ಮಾಡಿ ಅಥವಾ ಸಂಬಳವಿಲ್ಲದವರನ್ನು ಮಾತ್ರ ತೋರಿಸಿ.',
  },
  {
    id: 'salary-table',
    selector: '[data-tour="salary-table"]',
    title: 'ಸಂಬಳ ಪಟ್ಟಿ',
    body: 'ಪ್ರತಿ ಉದ್ಯೋಗಿಯ ಪ್ರಸ್ತುತ ಮಾಸಿಕ ಸಂಬಳ, ಕೊನೆಯ ಬದಲಾವಣೆಯ ದಿನಾಂಕ ಮತ್ತು ಸ್ಥಿತಿಯನ್ನು ನೋಡಿ.',
  },
  {
    id: 'salary-actions',
    selector: '[data-tour="salary-actions"]',
    title: 'ಸಂಪಾದನೆ ಮತ್ತು ಇತಿಹಾಸ',
    body: 'ಜಾರಿ ದಿನಾಂಕ ಮತ್ತು ಕಾರಣದೊಂದಿಗೆ ಸಂಬಳವನ್ನು ನವೀಕರಿಸಿ, ಅಥವಾ ಯಾವುದೇ ಉದ್ಯೋಗಿಯ ಸಂಪೂರ್ಣ ಬದಲಾವಣೆ ಇತಿಹಾಸವನ್ನು ತೆರೆಯಿರಿ.',
  },
];

export const SALARY_PAGE_LABELS = {
  en: 'Salary',
  hi: 'वेतन',
  ml: 'ശമ്പളം',
  kn: 'ಸಂಬಳ',
};

export const SALARY_GUIDE_STEPS_BY_LANG = {
  en: SALARY_GUIDE_STEPS_EN,
  hi: SALARY_GUIDE_STEPS_HI,
  ml: SALARY_GUIDE_STEPS_ML,
  kn: SALARY_GUIDE_STEPS_KN,
};

export const SALARY_GUIDE_STEPS = SALARY_GUIDE_STEPS_EN;
