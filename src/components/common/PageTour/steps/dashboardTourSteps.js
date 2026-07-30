const DASHBOARD_GUIDE_STEPS_EN = [
  {
    id: 'workforce',
    selector: '[data-tour="workforce"]',
    title: 'Workforce',
    body: 'Overview of your active employees, new hires this month, face enrollment status, and department count.',
  },
  {
    id: 'today',
    selector: '[data-tour="today"]',
    title: 'Today',
    body: "Today's attendance snapshot — present, absent, late, and present rate. Click any stat to open live attendance.",
  },
  {
    id: 'actions',
    selector: '[data-tour="actions"]',
    title: 'Actions',
    body: 'Items that need attention: employees pending face enrollment, incomplete profiles, and kiosk pairing status.',
  },
  {
    id: 'pay-schedule',
    selector: '[data-tour="pay-schedule"]',
    title: 'Pay schedule',
    body: 'Next salary pay day, days remaining, and how many monthly salaries are generated for this period.',
  },
  {
    id: 'payroll-stats',
    selector: '[data-tour="payroll-stats"]',
    title: 'Payroll overview',
    body: 'Paid this month, salary due, outstanding advances, and pending payment counts.',
  },
  {
    id: 'payment-alerts',
    selector: '[data-tour="payment-alerts"]',
    title: 'Payment alerts',
    body: 'Upcoming pay-day reminders and payroll items that need your attention. Tap an alert to open Payment.',
  },
  {
    id: 'calendar',
    selector: '[data-tour="calendar"]',
    title: 'Month calendar',
    body: 'Color-coded calendar for the current month. Green means all present; orange means some absences.',
  },
  {
    id: 'activity-rings',
    selector: '[data-tour="activity-rings"]',
    title: 'Activity rings',
    body: 'Visual summary of present rate today, average monthly attendance, and punctuality.',
  },
  {
    id: 'recent-activity',
    selector: '[data-tour="recent-activity"]',
    title: 'Recent activity',
    body: 'Latest clock-in and clock-out events across your organization for today.',
  },
];

const DASHBOARD_GUIDE_STEPS_HI = [
  {
    id: 'workforce',
    selector: '[data-tour="workforce"]',
    title: 'कार्यबल',
    body: 'सक्रिय कर्मचारी, इस महीने की नई भर्तियाँ, चेहरा पंजीकरण स्थिति और विभाग संख्या का अवलोकन।',
  },
  {
    id: 'today',
    selector: '[data-tour="today"]',
    title: 'आज',
    body: 'आज की उपस्थिति — उपस्थित, अनुपस्थित, देर से, और उपस्थिति दर। किसी भी आँकड़े पर क्लिक कर लाइव उपस्थिति खोलें।',
  },
  {
    id: 'actions',
    selector: '[data-tour="actions"]',
    title: 'कार्रवाई',
    body: 'ध्यान देने योग्य चीज़ें: चेहरा पंजीकरण बाकी कर्मचारी, अधूरे प्रोफ़ाइल, और कियोस्क पेयरिंग स्थिति।',
  },
  {
    id: 'pay-schedule',
    selector: '[data-tour="pay-schedule"]',
    title: 'वेतन अनुसूची',
    body: 'अगला वेतन दिन, शेष दिन, और इस अवधि के लिए कितने मासिक वेतन जनरेट हुए।',
  },
  {
    id: 'payroll-stats',
    selector: '[data-tour="payroll-stats"]',
    title: 'पेरोल अवलोकन',
    body: 'इस महीने भुगतान, बकाया वेतन, बकाया अग्रिम, और लंबित भुगतान संख्या।',
  },
  {
    id: 'payment-alerts',
    selector: '[data-tour="payment-alerts"]',
    title: 'भुगतान अलर्ट',
    body: 'आगामी वेतन-दिन अनुस्मारक और पेरोल आइटम जिन्हें ध्यान चाहिए। अलर्ट पर टैप कर भुगतान खोलें।',
  },
  {
    id: 'calendar',
    selector: '[data-tour="calendar"]',
    title: 'मासिक कैलेंडर',
    body: 'वर्तमान महीने का रंग-कोडित कैलेंडर। हरा = सभी उपस्थित; नारंगी = कुछ अनुपस्थित।',
  },
  {
    id: 'activity-rings',
    selector: '[data-tour="activity-rings"]',
    title: 'गतिविधि रिंग',
    body: 'आज की उपस्थिति दर, औसत मासिक उपस्थिति और समयबद्धता का दृश्य सारांश।',
  },
  {
    id: 'recent-activity',
    selector: '[data-tour="recent-activity"]',
    title: 'हाल की गतिविधि',
    body: 'आज संगठन भर में नवीनतम क्लॉक-इन और क्लॉक-आउट इवेंट।',
  },
];

const DASHBOARD_GUIDE_STEPS_ML = [
  {
    id: 'workforce',
    selector: '[data-tour="workforce"]',
    title: 'ജീവനക്കാർ',
    body: 'സജീവ ജീവനക്കാർ, ഈ മാസത്തെ പുതിയ നിയമനങ്ങൾ, മുഖം എൻറോൾമെന്റ് നില, വകുപ്പ് എണ്ണം എന്നിവയുടെ അവലോകനം.',
  },
  {
    id: 'today',
    selector: '[data-tour="today"]',
    title: 'ഇന്ന്',
    body: 'ഇന്നത്തെ ഹാജർ — ഹാജർ, അഹാജർ, വൈകി, ഹാജർ നിരക്ക്. ഏതെങ്കിലും സ്ഥിതിവിവരം ക്ലിക്ക് ചെയ്ത് ലൈവ് ഹാജർ തുറക്കുക.',
  },
  {
    id: 'actions',
    selector: '[data-tour="actions"]',
    title: 'പ്രവർത്തനങ്ങൾ',
    body: 'ശ്രദ്ധ വേണ്ടവ: മുഖം എൻറോൾമെന്റ് ബാക്കി, അപൂർണ്ണ പ്രൊഫൈലുകൾ, കിയോസ്ക് ജോടി നില.',
  },
  {
    id: 'pay-schedule',
    selector: '[data-tour="pay-schedule"]',
    title: 'ശമ്പള ഷെഡ്യൂൾ',
    body: 'അടുത്ത ശമ്പള ദിനം, ശേഷിക്കുന്ന ദിവസങ്ങൾ, ഈ കാലയളവിലെ മാസ ശമ്പളങ്ങളുടെ എണ്ണം.',
  },
  {
    id: 'payroll-stats',
    selector: '[data-tour="payroll-stats"]',
    title: 'പേറോൾ അവലോകനം',
    body: 'ഈ മാസം അടച്ചത്, ബാക്കി ശമ്പളം, ബാക്കി അഡ്വാൻസ്, തീർപ്പാക്കാത്ത പേയ്മെന്റ് എണ്ണം.',
  },
  {
    id: 'payment-alerts',
    selector: '[data-tour="payment-alerts"]',
    title: 'പേയ്മെന്റ് അലർട്ടുകൾ',
    body: 'വരാനിരിക്കുന്ന ശമ്പള ദിന ഓർമ്മപ്പെടുത്തലുകളും ശ്രദ്ധ വേണ്ട പേറോൾ ഇനങ്ങളും. അലർട്ട് ടാപ്പ് ചെയ്ത് പേയ്മെന്റ് തുറക്കുക.',
  },
  {
    id: 'calendar',
    selector: '[data-tour="calendar"]',
    title: 'മാസ കലണ്ടർ',
    body: 'നിലവിലെ മാസത്തിന്റെ നിറം കൊണ്ട് അടയാളപ്പെടുത്തിയ കലണ്ടർ. പച്ച = എല്ലാവരും ഹാജർ; ഓറഞ്ച് = ചിലർ അഹാജർ.',
  },
  {
    id: 'activity-rings',
    selector: '[data-tour="activity-rings"]',
    title: 'ആക്ടിവിറ്റി റിംഗുകൾ',
    body: 'ഇന്നത്തെ ഹാജർ നിരക്ക്, ശരാശരി മാസ ഹാജർ, സമയപാലനം എന്നിവയുടെ ദൃശ്യ സംഗ്രഹം.',
  },
  {
    id: 'recent-activity',
    selector: '[data-tour="recent-activity"]',
    title: 'സമീപകാല പ്രവർത്തനം',
    body: 'ഇന്ന് സംഘടനയിലെ ഏറ്റവും പുതിയ ക്ലോക്ക്-ഇൻ / ക്ലോക്ക്-ഔട്ട് ഇവന്റുകൾ.',
  },
];

const DASHBOARD_GUIDE_STEPS_KN = [
  {
    id: 'workforce',
    selector: '[data-tour="workforce"]',
    title: 'ಕೆಲಸಗಾರರು',
    body: 'ಸಕ್ರಿಯ ಉದ್ಯೋಗಿಗಳು, ಈ ತಿಂಗಳ ಹೊಸ ನೇಮಕಾತಿಗಳು, ಮುಖ ನೋಂದಣಿ ಸ್ಥಿತಿ ಮತ್ತು ವಿಭಾಗ ಎಣಿಕೆಯ ಅವಲೋಕನ.',
  },
  {
    id: 'today',
    selector: '[data-tour="today"]',
    title: 'ಇಂದು',
    body: 'ಇಂದಿನ ಹಾಜರಿ — ಹಾಜರು, ಗೈರು, ತಡವಾಗಿ, ಹಾಜರಿ ದರ. ಯಾವುದೇ ಅಂಕಿ ಕ್ಲಿಕ್ ಮಾಡಿ ಲೈವ್ ಹಾಜರಿ ತೆರೆಯಿರಿ.',
  },
  {
    id: 'actions',
    selector: '[data-tour="actions"]',
    title: 'ಕ್ರಮಗಳು',
    body: 'ಗಮನ ಬೇಕಾದವು: ಮುಖ ನೋಂದಣಿ ಬಾಕಿ, ಅಪೂರ್ಣ ಪ್ರೊಫೈಲ್‌ಗಳು, ಕಿಯೋಸ್ಕ್ ಜೋಡಣೆ ಸ್ಥಿತಿ.',
  },
  {
    id: 'pay-schedule',
    selector: '[data-tour="pay-schedule"]',
    title: 'ವೇತನ ವೇಳಾಪಟ್ಟಿ',
    body: 'ಮುಂದಿನ ಸಂಬಳ ದಿನ, ಉಳಿದ ದಿನಗಳು, ಮತ್ತು ಈ ಅವಧಿಗೆ ಎಷ್ಟು ಮಾಸಿಕ ಸಂಬಳಗಳು ರಚಿಸಲಾಗಿದೆ.',
  },
  {
    id: 'payroll-stats',
    selector: '[data-tour="payroll-stats"]',
    title: 'ಪೇರೋಲ್ ಅವಲೋಕನ',
    body: 'ಈ ತಿಂಗಳು ಪಾವತಿ, ಬಾಕಿ ಸಂಬಳ, ಬಾಕಿ ಮುಂಗಡ, ಮತ್ತು ಬಾಕಿ ಪಾವತಿ ಎಣಿಕೆಗಳು.',
  },
  {
    id: 'payment-alerts',
    selector: '[data-tour="payment-alerts"]',
    title: 'ಪಾವತಿ ಎಚ್ಚರಿಕೆಗಳು',
    body: 'ಮುಂಬರುವ ಸಂಬಳ-ದಿನ ಜ್ಞಾಪನೆಗಳು ಮತ್ತು ಗಮನ ಬೇಕಾದ ಪೇರೋಲ್ ಐಟಂಗಳು. ಎಚ್ಚರಿಕೆ ಟ್ಯಾಪ್ ಮಾಡಿ ಪಾವತಿ ತೆರೆಯಿರಿ.',
  },
  {
    id: 'calendar',
    selector: '[data-tour="calendar"]',
    title: 'ತಿಂಗಳ ಕ್ಯಾಲೆಂಡರ್',
    body: 'ಪ್ರಸ್ತುತ ತಿಂಗಳ ಬಣ್ಣ-ಕೋಡ್ ಕ್ಯಾಲೆಂಡರ್. ಹಸಿರು = ಎಲ್ಲರೂ ಹಾಜರು; ಕಿತ್ತಳೆ = ಕೆಲವು ಗೈರು.',
  },
  {
    id: 'activity-rings',
    selector: '[data-tour="activity-rings"]',
    title: 'ಚಟುವಟಿಕೆ ರಿಂಗ್‌ಗಳು',
    body: 'ಇಂದಿನ ಹಾಜರಿ ದರ, ಸರಾಸರಿ ಮಾಸಿಕ ಹಾಜರಿ ಮತ್ತು ಸಮಯಪಾಲನೆಯ ದೃಶ್ಯ ಸಾರಾಂಶ.',
  },
  {
    id: 'recent-activity',
    selector: '[data-tour="recent-activity"]',
    title: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ',
    body: 'ಇಂದು ಸಂಸ್ಥೆಯಾದ್ಯಂತ ಇತ್ತೀಚಿನ ಕ್ಲಾಕ್-ಇನ್ ಮತ್ತು ಕ್ಲಾಕ್-ಔಟ್ ಈವೆಂಟ್‌ಗಳು.',
  },
];

export const DASHBOARD_PAGE_LABELS = {
  en: 'Dashboard',
  hi: 'डैशबोर्ड',
  ml: 'ഡാഷ്ബോർഡ്',
  kn: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
};

export const DASHBOARD_GUIDE_STEPS_BY_LANG = {
  en: DASHBOARD_GUIDE_STEPS_EN,
  hi: DASHBOARD_GUIDE_STEPS_HI,
  ml: DASHBOARD_GUIDE_STEPS_ML,
  kn: DASHBOARD_GUIDE_STEPS_KN,
};

export const DASHBOARD_GUIDE_STEPS = DASHBOARD_GUIDE_STEPS_EN;
