const EMPLOYEES_GUIDE_STEPS_EN = [
  {
    id: 'header-actions',
    selector: '[data-tour="header-actions"]',
    title: 'Search & actions',
    body: 'Search employees by name, switch between active and deactivated lists, and add new employees.',
  },
  {
    id: 'filter-sort',
    selector: '[data-tour="filter-sort"]',
    title: 'Filter & sort',
    body: 'Filter by department and sort the list by name, department, status, or date added.',
  },
  {
    id: 'employee-table',
    selector: '[data-tour="employee-table"]',
    title: 'Employee table',
    body: 'Browse employees with department, status, and face enrollment. Edit to update details, photo, documents, or Mon–Sun weekly shift templates when per-employee mode is on.',
  },
  {
    id: 'pagination',
    selector: '[data-tour="pagination"]',
    title: 'Pagination',
    body: 'Navigate between pages when you have more employees than fit on one screen.',
  },
];

const EMPLOYEES_GUIDE_STEPS_HI = [
  {
    id: 'header-actions',
    selector: '[data-tour="header-actions"]',
    title: 'खोज और कार्रवाई',
    body: 'नाम से कर्मचारी खोजें, सक्रिय और निष्क्रिय सूचियों के बीच स्विच करें, और नए कर्मचारी जोड़ें।',
  },
  {
    id: 'filter-sort',
    selector: '[data-tour="filter-sort"]',
    title: 'फ़िल्टर और सॉर्ट',
    body: 'विभाग से फ़िल्टर करें और नाम, विभाग, स्थिति या जोड़ी गई तारीख से सूची सॉर्ट करें।',
  },
  {
    id: 'employee-table',
    selector: '[data-tour="employee-table"]',
    title: 'कर्मचारी तालिका',
    body: 'विभाग, स्थिति और चेहरा पंजीकरण के साथ कर्मचारी देखें। विवरण, फ़ोटो, दस्तावेज़ अपडेट करें, या प्रति-कर्मचारी मोड में सोम–रवि साप्ताहिक शिफ्ट असाइन करें।',
  },
  {
    id: 'pagination',
    selector: '[data-tour="pagination"]',
    title: 'पेजिंग',
    body: 'एक स्क्रीन में फ़िट न होने पर पृष्ठों के बीच नेविगेट करें।',
  },
];

const EMPLOYEES_GUIDE_STEPS_ML = [
  {
    id: 'header-actions',
    selector: '[data-tour="header-actions"]',
    title: 'തിരയൽ & പ്രവർത്തനങ്ങൾ',
    body: 'പേര് കൊണ്ട് ജീവനക്കാരെ തിരയുക, സജീവ/നിർജ്ജീവ ലിസ്റ്റുകൾക്കിടയിൽ മാറുക, പുതിയ ജീവനക്കാരെ ചേർക്കുക.',
  },
  {
    id: 'filter-sort',
    selector: '[data-tour="filter-sort"]',
    title: 'ഫിൽട്ടർ & സോർട്ട്',
    body: 'വകുപ്പ് പ്രകാരം ഫിൽട്ടർ ചെയ്യുക; പേര്, വകുപ്പ്, നില, അല്ലെങ്കിൽ ചേർത്ത തീയതി പ്രകാരം സോർട്ട് ചെയ്യുക.',
  },
  {
    id: 'employee-table',
    selector: '[data-tour="employee-table"]',
    title: 'ജീവനക്കാരൻ പട്ടിക',
    body: 'വകുപ്പ്, നില, മുഖം എൻറോൾമെന്റ് എന്നിവയോടെ ജീവനക്കാരെ കാണുക. വിശദാംശങ്ങൾ, ഫോട്ടോ, ഡോക്യുമെന്റുകൾ അപ്ഡേറ്റ് ചെയ്യുക, അല്ലെങ്കിൽ per-employee മോഡിൽ തിങ്കൾ–ഞായർ ഷിഫ്റ്റ് അസൈൻ ചെയ്യുക.',
  },
  {
    id: 'pagination',
    selector: '[data-tour="pagination"]',
    title: 'പേജിനേഷൻ',
    body: 'ഒരു സ്ക്രീനിൽ ഒതുങ്ങാത്തപ്പോൾ പേജുകൾക്കിടയിൽ നാവിഗേറ്റ് ചെയ്യുക.',
  },
];

const EMPLOYEES_GUIDE_STEPS_KN = [
  {
    id: 'header-actions',
    selector: '[data-tour="header-actions"]',
    title: 'ಹುಡುಕಾಟ ಮತ್ತು ಕ್ರಮಗಳು',
    body: 'ಹೆಸರಿನಿಂದ ಉದ್ಯೋಗಿಗಳನ್ನು ಹುಡುಕಿ, ಸಕ್ರಿಯ/ನಿಷ್ಕ್ರಿಯ ಪಟ್ಟಿಗಳ ನಡುವೆ ಬದಲಾಯಿಸಿ, ಮತ್ತು ಹೊಸ ಉದ್ಯೋಗಿಗಳನ್ನು ಸೇರಿಸಿ.',
  },
  {
    id: 'filter-sort',
    selector: '[data-tour="filter-sort"]',
    title: 'ಫಿಲ್ಟರ್ ಮತ್ತು ವಿಂಗಡಣೆ',
    body: 'ವಿಭಾಗದಿಂದ ಫಿಲ್ಟರ್ ಮಾಡಿ ಮತ್ತು ಹೆಸರು, ವಿಭಾಗ, ಸ್ಥಿತಿ ಅಥವಾ ಸೇರಿಸಿದ ದಿನಾಂಕದಿಂದ ಪಟ್ಟಿಯನ್ನು ವಿಂಗಡಿಸಿ.',
  },
  {
    id: 'employee-table',
    selector: '[data-tour="employee-table"]',
    title: 'ಉದ್ಯೋಗಿ ಪಟ್ಟಿ',
    body: 'ವಿಭಾಗ, ಸ್ಥಿತಿ ಮತ್ತು ಮುಖ ನೋಂದಣಿಯೊಂದಿಗೆ ಉದ್ಯೋಗಿಗಳನ್ನು ನೋಡಿ. ವಿವರಗಳು, ಫೋಟೋ, ದಾಖಲೆಗಳನ್ನು ನವೀಕರಿಸಿ, ಅಥವಾ ಪ್ರತಿ-ಉದ್ಯೋಗಿ ಮೋಡ್‌ನಲ್ಲಿ ಸೋಮ–ಭಾನು ವಾರದ ಶಿಫ್ಟ್ ನಿಯೋಜಿಸಿ.',
  },
  {
    id: 'pagination',
    selector: '[data-tour="pagination"]',
    title: 'ಪುಟೀಕರಣ',
    body: 'ಒಂದು ಪರದೆಯಲ್ಲಿ ಹೊಂದದಿದ್ದಾಗ ಪುಟಗಳ ನಡುವೆ ನ್ಯಾವಿಗೇಟ್ ಮಾಡಿ.',
  },
];

export const EMPLOYEES_PAGE_LABELS = {
  en: 'Employees',
  hi: 'कर्मचारी',
  ml: 'ജീവനക്കാർ',
  kn: 'ಉದ್ಯೋಗಿಗಳು',
};

export const EMPLOYEES_GUIDE_STEPS_BY_LANG = {
  en: EMPLOYEES_GUIDE_STEPS_EN,
  hi: EMPLOYEES_GUIDE_STEPS_HI,
  ml: EMPLOYEES_GUIDE_STEPS_ML,
  kn: EMPLOYEES_GUIDE_STEPS_KN,
};

export const EMPLOYEES_GUIDE_STEPS = EMPLOYEES_GUIDE_STEPS_EN;
