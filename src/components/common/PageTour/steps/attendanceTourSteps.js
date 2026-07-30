const ATTENDANCE_GUIDE_STEPS_EN = [
  {
    id: 'live-activity',
    selector: '[data-tour="live-activity"]',
    title: 'Live activity',
    body: 'Real-time feed of clock-in and clock-out events for the selected date.',
  },
  {
    id: 'today-kpis',
    selector: '[data-tour="today-kpis"]',
    title: 'Today',
    body: 'Quick counts for present, absent, late, and total employees on the selected day.',
  },
  {
    id: 'filters',
    selector: '[data-tour="filters"]',
    title: 'Filters',
    body: 'Pick a date, search by name or employee code, filter by status, and refresh data manually.',
  },
  {
    id: 'employee-table',
    selector: '[data-tour="employee-table"]',
    title: 'Employee status',
    body: 'Full list with shift label, status, clock-in, and hours. Click a row for details. If Manual attendance is enabled in Settings, use In / Out for today’s punches (requires typing the confirmation phrase).',
  },
  {
    id: 'hourly-chart',
    selector: '[data-tour="hourly-chart"]',
    title: 'Attendance timeline',
    body: 'Clock-in (green) and clock-out (red) markers on a day timeline. Press Play to replay events in order; Stop restores the full day view. Amber dashed lines mark configured work start and end.',
  },
];

const ATTENDANCE_GUIDE_STEPS_HI = [
  {
    id: 'live-activity',
    selector: '[data-tour="live-activity"]',
    title: 'लाइव गतिविधि',
    body: 'चयनित तारीख के क्लॉक-इन और क्लॉक-आउट इवेंट का रीयल-टाइम फ़ीड।',
  },
  {
    id: 'today-kpis',
    selector: '[data-tour="today-kpis"]',
    title: 'आज',
    body: 'चयनित दिन के लिए उपस्थित, अनुपस्थित, देर से, और कुल कर्मचारियों की त्वरित गिनती।',
  },
  {
    id: 'filters',
    selector: '[data-tour="filters"]',
    title: 'फ़िल्टर',
    body: 'तारीख चुनें, नाम या कर्मचारी कोड से खोजें, स्थिति से फ़िल्टर करें, और डेटा मैन्युअल रूप से रिफ़्रेश करें।',
  },
  {
    id: 'employee-table',
    selector: '[data-tour="employee-table"]',
    title: 'कर्मचारी स्थिति',
    body: 'शिफ्ट लेबल, स्थिति, क्लॉक-इन और घंटों के साथ पूरी सूची। विवरण के लिए पंक्ति पर क्लिक करें। सेटिंग्स में मैनुअल उपस्थिति चालू हो तो आज के पंच के लिए In / Out उपयोग करें (पुष्टि वाक्य टाइप करना ज़रूरी)।',
  },
  {
    id: 'hourly-chart',
    selector: '[data-tour="hourly-chart"]',
    title: 'उपस्थिति टाइमलाइन',
    body: 'दिन की टाइमलाइन पर क्लॉक-इन (हरा) और क्लॉक-आउट (लाल) चिह्न। क्रम में देखने के लिए Play दबाएँ; Stop से पूरा दिन वापस आता है। अंबर डैश लाइनें काम शुरू/समाप्ति दर्शाती हैं।',
  },
];

const ATTENDANCE_GUIDE_STEPS_ML = [
  {
    id: 'live-activity',
    selector: '[data-tour="live-activity"]',
    title: 'ലൈവ് പ്രവർത്തനം',
    body: 'തിരഞ്ഞെടുത്ത തീയതിയിലെ ക്ലോക്ക്-ഇൻ / ക്ലോക്ക്-ഔട്ട് ഇവന്റുകളുടെ റിയൽ-ടൈം ഫീഡ്.',
  },
  {
    id: 'today-kpis',
    selector: '[data-tour="today-kpis"]',
    title: 'ഇന്ന്',
    body: 'തിരഞ്ഞെടുത്ത ദിവസത്തെ ഹാജർ, അഹാജർ, വൈകി, മൊത്തം ജീവനക്കാർ എന്നിവയുടെ എണ്ണം.',
  },
  {
    id: 'filters',
    selector: '[data-tour="filters"]',
    title: 'ഫിൽട്ടറുകൾ',
    body: 'തീയതി തിരഞ്ഞെടുക്കുക, പേര് അല്ലെങ്കിൽ ജീവനക്കാരൻ കോഡ് കൊണ്ട് തിരയുക, നില പ്രകാരം ഫിൽട്ടർ ചെയ്യുക, ഡാറ്റ മാനുവലായി റിഫ്രഷ് ചെയ്യുക.',
  },
  {
    id: 'employee-table',
    selector: '[data-tour="employee-table"]',
    title: 'ജീവനക്കാരൻ നില',
    body: 'ഷിഫ്റ്റ് ലേബൽ, നില, ക്ലോക്ക്-ഇൻ, മണിക്കൂറുകൾ ഉള്ള പൂർണ്ണ ലിസ്റ്റ്. വിശദാംശങ്ങൾക്ക് വരി ക്ലിക്ക് ചെയ്യുക. സെറ്റിംഗ്സിൽ മാനുവൽ ഹാജർ ഓണാണെങ്കിൽ ഇന്നത്തെ പഞ്ചിന് In / Out ഉപയോഗിക്കുക (സ്ഥിരീകരണ വാചകം ടൈപ്പ് വേണം).',
  },
  {
    id: 'hourly-chart',
    selector: '[data-tour="hourly-chart"]',
    title: 'ഹാജർ ടൈംലൈൻ',
    body: 'ദിവസ ടൈംലൈനിൽ ക്ലോക്ക്-ഇൻ (പച്ച) / ക്ലോക്ക്-ഔട്ട് (ചുവപ്പ്) മാർക്കറുകൾ. ക്രമത്തിൽ കാണാൻ Play അമർത്തുക; Stop മുഴുവൻ ദിവസ വീക്ഷണം തിരികെ നൽകും. ആമ്പർ ഡാഷ് ലൈനുകൾ ജോലി ആരംഭ/അവസാനം കാണിക്കുന്നു.',
  },
];

const ATTENDANCE_GUIDE_STEPS_KN = [
  {
    id: 'live-activity',
    selector: '[data-tour="live-activity"]',
    title: 'ಲೈವ್ ಚಟುವಟಿಕೆ',
    body: 'ಆಯ್ದ ದಿನಾಂಕದ ಕ್ಲಾಕ್-ಇನ್ ಮತ್ತು ಕ್ಲಾಕ್-ಔಟ್ ಈವೆಂಟ್‌ಗಳ ರಿಯಲ್-ಟೈಮ್ ಫೀಡ್.',
  },
  {
    id: 'today-kpis',
    selector: '[data-tour="today-kpis"]',
    title: 'ಇಂದು',
    body: 'ಆಯ್ದ ದಿನದ ಹಾಜರು, ಗೈರು, ತಡವಾಗಿ ಮತ್ತು ಒಟ್ಟು ಉದ್ಯೋಗಿಗಳ ತ್ವರಿತ ಎಣಿಕೆ.',
  },
  {
    id: 'filters',
    selector: '[data-tour="filters"]',
    title: 'ಫಿಲ್ಟರ್‌ಗಳು',
    body: 'ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ, ಹೆಸರು ಅಥವಾ ಉದ್ಯೋಗಿ ಕೋಡ್‌ನಿಂದ ಹುಡುಕಿ, ಸ್ಥಿತಿಯಿಂದ ಫಿಲ್ಟರ್ ಮಾಡಿ, ಮತ್ತು ಡೇಟಾವನ್ನು ಹಸ್ತಚಾಲಿತವಾಗಿ ರಿಫ್ರೆಶ್ ಮಾಡಿ.',
  },
  {
    id: 'employee-table',
    selector: '[data-tour="employee-table"]',
    title: 'ಉದ್ಯೋಗಿ ಸ್ಥಿತಿ',
    body: 'ಶಿಫ್ಟ್ ಲೇಬಲ್, ಸ್ಥಿತಿ, ಕ್ಲಾಕ್-ಇನ್ ಮತ್ತು ಗಂಟೆಗಳೊಂದಿಗೆ ಪೂರ್ಣ ಪಟ್ಟಿ. ವಿವರಗಳಿಗೆ ಸಾಲು ಕ್ಲಿಕ್ ಮಾಡಿ. ಸೆಟ್ಟಿಂಗ್ಸ್‌ನಲ್ಲಿ ಮ್ಯಾನುಯಲ್ ಹಾಜರಿ ಆನ್ ಆಗಿದ್ದರೆ ಇಂದಿನ ಪಂಚ್‌ಗೆ In / Out ಬಳಸಿ (ದೃಢೀಕರಣ ವಾಕ್ಯ ಟೈಪ್ ಅಗತ್ಯ).',
  },
  {
    id: 'hourly-chart',
    selector: '[data-tour="hourly-chart"]',
    title: 'ಹಾಜರಿ ಟೈಮ್‌ಲೈನ್',
    body: 'ದಿನದ ಟೈಮ್‌ಲೈನ್‌ನಲ್ಲಿ ಕ್ಲಾಕ್-ಇನ್ (ಹಸಿರು) ಮತ್ತು ಕ್ಲಾಕ್-ಔಟ್ (ಕೆಂಪು) ಗುರುತುಗಳು. ಕ್ರಮದಲ್ಲಿ ನೋಡಲು Play ಒತ್ತಿ; Stop ಪೂರ್ಣ ದಿನ ನೋಟವನ್ನು ಹಿಂತಿರುಗಿಸುತ್ತದೆ. ಅಂಬರ್ ಡ್ಯಾಶ್ ರೇಖೆಗಳು ಕೆಲಸ ಪ್ರಾರಂಭ/ಅಂತ್ಯವನ್ನು ತೋರಿಸುತ್ತವೆ.',
  },
];

export const ATTENDANCE_PAGE_LABELS = {
  en: 'Live Attendance',
  hi: 'लाइव उपस्थिति',
  ml: 'ലൈവ് ഹാജർ',
  kn: 'ಲೈವ್ ಹಾಜರಿ',
};

export const ATTENDANCE_GUIDE_STEPS_BY_LANG = {
  en: ATTENDANCE_GUIDE_STEPS_EN,
  hi: ATTENDANCE_GUIDE_STEPS_HI,
  ml: ATTENDANCE_GUIDE_STEPS_ML,
  kn: ATTENDANCE_GUIDE_STEPS_KN,
};

export const ATTENDANCE_GUIDE_STEPS = ATTENDANCE_GUIDE_STEPS_EN;
