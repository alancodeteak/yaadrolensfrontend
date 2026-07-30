const ANALYTICS_GUIDE_STEPS_EN = [
  {
    id: 'month-picker',
    selector: '[data-tour="month-picker"]',
    title: 'Month selector',
    body: 'Pick any day in a month to load analytics for that month. Use the arrows to move to the previous or next month.',
  },
  {
    id: 'kpi-month',
    selector: '[data-tour="kpi-month"]',
    title: 'This month',
    body: 'Month-level KPIs: average attendance rate, punctuality, total hours worked, and total late arrivals.',
  },
  {
    id: 'kpi-snapshot',
    selector: '[data-tour="kpi-snapshot"]',
    title: 'Day snapshot',
    body: 'A quick look at the selected day — how many employees were present, absent, late, and the present rate.',
  },
  {
    id: 'heatmap',
    selector: '[data-tour="heatmap"]',
    title: 'Month heatmap',
    body: 'A calendar view of the month. Green days mean everyone was present; orange means some absences. Hover a day for details.',
  },
  {
    id: 'month-overview',
    selector: '[data-tour="month-overview"]',
    title: 'Month overview',
    body: 'Activity rings summarizing month health: average attendance, punctuality, and hours utilization.',
  },
  {
    id: 'daily-trend',
    selector: '[data-tour="daily-trend"]',
    title: 'Daily trend',
    body: 'Stacked bars showing present vs absent headcount for each day of the month. Scroll horizontally when needed.',
  },
  {
    id: 'top-late',
    selector: '[data-tour="top-late"]',
    title: 'Top late arrivals',
    body: 'Employees with the most late clock-ins this month, ranked in a horizontal bar chart.',
  },
  {
    id: 'hours-worked',
    selector: '[data-tour="hours-worked"]',
    title: 'Hours worked',
    body: 'Top employees by total hours logged this month.',
  },
  {
    id: 'employee-table',
    selector: '[data-tour="employee-table"]',
    title: 'Employee summary',
    body: 'Per-employee monthly breakdown: days present, late count, hours worked, and incomplete days.',
  },
];

const ANALYTICS_GUIDE_STEPS_HI = [
  {
    id: 'month-picker',
    selector: '[data-tour="month-picker"]',
    title: 'महीना चुनें',
    body: 'उस महीने का विश्लेषण लोड करने के लिए किसी भी दिन चुनें। पिछले या अगले महीने के लिए तीर उपयोग करें।',
  },
  {
    id: 'kpi-month',
    selector: '[data-tour="kpi-month"]',
    title: 'इस महीने',
    body: 'मासिक KPI: औसत उपस्थिति दर, समयबद्धता, कुल काम के घंटे, और कुल देर से आगमन।',
  },
  {
    id: 'kpi-snapshot',
    selector: '[data-tour="kpi-snapshot"]',
    title: 'दिन का स्नैपशॉट',
    body: 'चयनित दिन की झलक — कितने कर्मचारी उपस्थित, अनुपस्थित, देर से, और उपस्थिति दर।',
  },
  {
    id: 'heatmap',
    selector: '[data-tour="heatmap"]',
    title: 'मासिक हीटमैप',
    body: 'महीने का कैलेंडर दृश्य। हरा = सभी उपस्थित; नारंगी = कुछ अनुपस्थित। विवरण के लिए दिन पर होवर करें।',
  },
  {
    id: 'month-overview',
    selector: '[data-tour="month-overview"]',
    title: 'मासिक अवलोकन',
    body: 'माह स्वास्थ्य का सारांश: औसत उपस्थिति, समयबद्धता, और घंटों का उपयोग।',
  },
  {
    id: 'daily-trend',
    selector: '[data-tour="daily-trend"]',
    title: 'दैनिक रुझान',
    body: 'महीने के प्रत्येक दिन के लिए उपस्थित बनाम अनुपस्थित संख्या। ज़रूरत हो तो क्षैतिज स्क्रॉल करें।',
  },
  {
    id: 'top-late',
    selector: '[data-tour="top-late"]',
    title: 'सबसे अधिक देर',
    body: 'इस महीने सबसे अधिक देर से क्लॉक-इन वाले कर्मचारी, क्षैतिज बार चार्ट में।',
  },
  {
    id: 'hours-worked',
    selector: '[data-tour="hours-worked"]',
    title: 'काम के घंटे',
    body: 'इस महीने कुल दर्ज घंटों के आधार पर शीर्ष कर्मचारी।',
  },
  {
    id: 'employee-table',
    selector: '[data-tour="employee-table"]',
    title: 'कर्मचारी सारांश',
    body: 'प्रति कर्मचारी मासिक विवरण: उपस्थित दिन, देर गिनती, काम के घंटे, और अधूरे दिन।',
  },
];

const ANALYTICS_GUIDE_STEPS_ML = [
  {
    id: 'month-picker',
    selector: '[data-tour="month-picker"]',
    title: 'മാസം തിരഞ്ഞെടുക്കുക',
    body: 'ആ മാസത്തിന്റെ അനലിറ്റിക്സ് ലോഡ് ചെയ്യാൻ ഏതെങ്കിലും ദിവസം തിരഞ്ഞെടുക്കുക. മുമ്പത്തെ / അടുത്ത മാസത്തിലേക്ക് അമ്പുകൾ ഉപയോഗിക്കുക.',
  },
  {
    id: 'kpi-month',
    selector: '[data-tour="kpi-month"]',
    title: 'ഈ മാസം',
    body: 'മാസ KPI: ശരാശരി ഹാജർ നിരക്ക്, സമയപാലനം, മൊത്തം മണിക്കൂറുകൾ, മൊത്തം വൈകിയെത്തൽ.',
  },
  {
    id: 'kpi-snapshot',
    selector: '[data-tour="kpi-snapshot"]',
    title: 'ദിവസ സ്നാപ്ഷോട്ട്',
    body: 'തിരഞ്ഞെടുത്ത ദിവസത്തിന്റെ ദ്രുത കാഴ്ച — ഹാജർ, അഹാജർ, വൈകി, ഹാജർ നിരക്ക്.',
  },
  {
    id: 'heatmap',
    selector: '[data-tour="heatmap"]',
    title: 'മാസ ഹീറ്റ്മാപ്പ്',
    body: 'മാസത്തിന്റെ കലണ്ടർ കാഴ്ച. പച്ച = എല്ലാവരും ഹാജർ; ഓറഞ്ച് = ചിലർ അഹാജർ. വിശദാംശങ്ങൾക്ക് ദിവസത്തിൽ ഹോവർ ചെയ്യുക.',
  },
  {
    id: 'month-overview',
    selector: '[data-tour="month-overview"]',
    title: 'മാസ അവലോകനം',
    body: 'മാസ ആരോഗ്യ സംഗ്രഹം: ശരാശരി ഹാജർ, സമയപാലനം, മണിക്കൂർ ഉപയോഗം.',
  },
  {
    id: 'daily-trend',
    selector: '[data-tour="daily-trend"]',
    title: 'ദൈനംദിന ട്രെൻഡ്',
    body: 'മാസത്തിലെ ഓരോ ദിവസത്തെയും ഹാജർ vs അഹാജർ. ആവശ്യമെങ്കിൽ തിരശ്ചീനമായി സ്ക്രോൾ ചെയ്യുക.',
  },
  {
    id: 'top-late',
    selector: '[data-tour="top-late"]',
    title: 'ഏറ്റവും കൂടുതൽ വൈകിയവർ',
    body: 'ഈ മാസം ഏറ്റവും കൂടുതൽ വൈകി ക്ലോക്ക്-ഇൻ ചെയ്ത ജീവനക്കാർ, തിരശ്ചീന ബാർ ചാർട്ടിൽ.',
  },
  {
    id: 'hours-worked',
    selector: '[data-tour="hours-worked"]',
    title: 'ജോലി മണിക്കൂറുകൾ',
    body: 'ഈ മാസം മൊത്തം മണിക്കൂറുകൾ പ്രകാരം മുൻനിര ജീവനക്കാർ.',
  },
  {
    id: 'employee-table',
    selector: '[data-tour="employee-table"]',
    title: 'ജീവനക്കാരൻ സംഗ്രഹം',
    body: 'ഓരോ ജീവനക്കാരന്റെയും മാസ വിശദാംശം: ഹാജർ ദിവസങ്ങൾ, വൈകി എണ്ണം, മണിക്കൂറുകൾ, അപൂർണ്ണ ദിവസങ്ങൾ.',
  },
];

const ANALYTICS_GUIDE_STEPS_KN = [
  {
    id: 'month-picker',
    selector: '[data-tour="month-picker"]',
    title: 'ತಿಂಗಳು ಆಯ್ಕೆ',
    body: 'ಆ ತಿಂಗಳ ಅನಾಲಿಟಿಕ್ಸ್ ಲೋಡ್ ಮಾಡಲು ಯಾವುದೇ ದಿನ ಆಯ್ಕೆಮಾಡಿ. ಹಿಂದಿನ ಅಥವಾ ಮುಂದಿನ ತಿಂಗಳಿಗೆ ಬಾಣಗಳನ್ನು ಬಳಸಿ.',
  },
  {
    id: 'kpi-month',
    selector: '[data-tour="kpi-month"]',
    title: 'ಈ ತಿಂಗಳು',
    body: 'ತಿಂಗಳ KPI: ಸರಾಸರಿ ಹಾಜರಿ ದರ, ಸಮಯಪಾಲನೆ, ಒಟ್ಟು ಕೆಲಸದ ಗಂಟೆಗಳು, ಮತ್ತು ಒಟ್ಟು ತಡವಾದ ಆಗಮನಗಳು.',
  },
  {
    id: 'kpi-snapshot',
    selector: '[data-tour="kpi-snapshot"]',
    title: 'ದಿನದ ಸ್ನ್ಯಾಪ್‌ಶಾಟ್',
    body: 'ಆಯ್ದ ದಿನದ ತ್ವರಿತ ನೋಟ — ಹಾಜರು, ಗೈರು, ತಡವಾಗಿ, ಮತ್ತು ಹಾಜರಿ ದರ.',
  },
  {
    id: 'heatmap',
    selector: '[data-tour="heatmap"]',
    title: 'ತಿಂಗಳ ಹೀಟ್‌ಮ್ಯಾಪ್',
    body: 'ತಿಂಗಳ ಕ್ಯಾಲೆಂಡರ್ ನೋಟ. ಹಸಿರು = ಎಲ್ಲರೂ ಹಾಜರು; ಕಿತ್ತಳೆ = ಕೆಲವು ಗೈರು. ವಿವರಗಳಿಗೆ ದಿನದ ಮೇಲೆ ಹೋವರ್ ಮಾಡಿ.',
  },
  {
    id: 'month-overview',
    selector: '[data-tour="month-overview"]',
    title: 'ತಿಂಗಳ ಅವಲೋಕನ',
    body: 'ತಿಂಗಳ ಆರೋಗ್ಯ ಸಾರಾಂಶ: ಸರಾಸರಿ ಹಾಜರಿ, ಸಮಯಪಾಲನೆ, ಮತ್ತು ಗಂಟೆಗಳ ಬಳಕೆ.',
  },
  {
    id: 'daily-trend',
    selector: '[data-tour="daily-trend"]',
    title: 'ದೈನಂದಿನ ಪ್ರವೃತ್ತಿ',
    body: 'ತಿಂಗಳ ಪ್ರತಿ ದಿನದ ಹಾಜರು vs ಗೈರು. ಅಗತ್ಯವಿದ್ದರೆ ಅಡ್ಡವಾಗಿ ಸ್ಕ್ರಾಲ್ ಮಾಡಿ.',
  },
  {
    id: 'top-late',
    selector: '[data-tour="top-late"]',
    title: 'ಹೆಚ್ಚು ತಡವಾದವರು',
    body: 'ಈ ತಿಂಗಳು ಹೆಚ್ಚು ತಡವಾಗಿ ಕ್ಲಾಕ್-ಇನ್ ಮಾಡಿದ ಉದ್ಯೋಗಿಗಳು, ಅಡ್ಡ ಬಾರ್ ಚಾರ್ಟ್‌ನಲ್ಲಿ.',
  },
  {
    id: 'hours-worked',
    selector: '[data-tour="hours-worked"]',
    title: 'ಕೆಲಸದ ಗಂಟೆಗಳು',
    body: 'ಈ ತಿಂಗಳು ಒಟ್ಟು ದಾಖಲಾದ ಗಂಟೆಗಳ ಪ್ರಕಾರ ಉನ್ನತ ಉದ್ಯೋಗಿಗಳು.',
  },
  {
    id: 'employee-table',
    selector: '[data-tour="employee-table"]',
    title: 'ಉದ್ಯೋಗಿ ಸಾರಾಂಶ',
    body: 'ಪ್ರತಿ ಉದ್ಯೋಗಿಯ ತಿಂಗಳ ವಿವರ: ಹಾಜರು ದಿನಗಳು, ತಡವಾದ ಎಣಿಕೆ, ಕೆಲಸದ ಗಂಟೆಗಳು, ಅಪೂರ್ಣ ದಿನಗಳು.',
  },
];

export const ANALYTICS_PAGE_LABELS = {
  en: 'Analytics',
  hi: 'एनालिटिक्स',
  ml: 'അനലിറ്റിക്സ്',
  kn: 'ಅನಾಲಿಟಿಕ್ಸ್',
};

export const ANALYTICS_GUIDE_STEPS_BY_LANG = {
  en: ANALYTICS_GUIDE_STEPS_EN,
  hi: ANALYTICS_GUIDE_STEPS_HI,
  ml: ANALYTICS_GUIDE_STEPS_ML,
  kn: ANALYTICS_GUIDE_STEPS_KN,
};

export const ANALYTICS_GUIDE_STEPS = ANALYTICS_GUIDE_STEPS_EN;
