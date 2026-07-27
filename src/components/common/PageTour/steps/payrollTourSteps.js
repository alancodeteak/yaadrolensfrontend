const PAYROLL_GUIDE_STEPS_EN = [
  {
    id: 'payroll-period',
    selector: '[data-tour="payroll-period"]',
    title: 'Payment period',
    body: 'Choose the month and year to filter the payment ledger for that period.',
  },
  {
    id: 'payroll-stats',
    selector: '[data-tour="payroll-stats"]',
    title: 'Summary',
    body: 'See how much was paid this month, outstanding advances, and pending advance requests.',
  },
  {
    id: 'payroll-actions',
    selector: '[data-tour="payroll-actions"]',
    title: 'Actions',
    body: 'Record a new payment on the Ledger tab, or request a salary advance on the Advances tab.',
  },
  {
    id: 'payroll-table',
    selector: '[data-tour="payroll-table"]',
    title: 'Ledger & advances',
    body: 'Review payment records or manage advance requests — approve, disburse, recover, or view history.',
  },
];

const PAYROLL_GUIDE_STEPS_HI = [
  {
    id: 'payroll-period',
    selector: '[data-tour="payroll-period"]',
    title: 'भुगतान अवधि',
    body: 'उस अवधि के भुगतान लेजर को फ़िल्टर करने के लिए महीना और वर्ष चुनें।',
  },
  {
    id: 'payroll-stats',
    selector: '[data-tour="payroll-stats"]',
    title: 'सारांश',
    body: 'देखें इस महीने कितना भुगतान हुआ, बकाया अग्रिम और लंबित अग्रिम अनुरोध।',
  },
  {
    id: 'payroll-actions',
    selector: '[data-tour="payroll-actions"]',
    title: 'कार्रवाई',
    body: 'Ledger टैब पर नया भुगतान दर्ज करें, या Advances टैब पर वेतन अग्रिम का अनुरोध करें।',
  },
  {
    id: 'payroll-table',
    selector: '[data-tour="payroll-table"]',
    title: 'लेजर और अग्रिम',
    body: 'भुगतान रिकॉर्ड देखें या अग्रिम अनुरोध प्रबंधित करें — स्वीकृत करें, वितरित करें, वसूली करें, या इतिहास देखें।',
  },
];

const PAYROLL_GUIDE_STEPS_ML = [
  {
    id: 'payroll-period',
    selector: '[data-tour="payroll-period"]',
    title: 'പേയ്‌മെന്റ് കാലയളവ്',
    body: 'ആ കാലയളവിലെ പേയ്‌മെന്റ് ലെഡ്ജർ ഫിൽട്ടർ ചെയ്യാൻ മാസവും വർഷവും തിരഞ്ഞെടുക്കുക.',
  },
  {
    id: 'payroll-stats',
    selector: '[data-tour="payroll-stats"]',
    title: 'സംഗ്രഹം',
    body: 'ഈ മാസം എത്രം അടച്ചു, ബാക്കിയുള്ള അഡ്വാൻസ്, തീർപ്പാക്കാത്ത അഡ്വാൻസ് അഭ്യർത്ഥനകൾ എന്നിവ കാണുക.',
  },
  {
    id: 'payroll-actions',
    selector: '[data-tour="payroll-actions"]',
    title: 'പ്രവർത്തനങ്ങൾ',
    body: 'Ledger ടാബിൽ പുതിയ പേയ്‌മെന്റ് രേഖപ്പെടുത്തുക, അല്ലെങ്കിൽ Advances ടാബിൽ ശമ്പള അഡ്വാൻസ് അഭ്യർത്ഥിക്കുക.',
  },
  {
    id: 'payroll-table',
    selector: '[data-tour="payroll-table"]',
    title: 'ലെഡ്ജർ, അഡ്വാൻസ്',
    body: 'പേയ്‌മെന്റ് രേഖകൾ നോക്കുക അല്ലെങ്കിൽ അഡ്വാൻസ് അഭ്യർത്ഥനകൾ കൈകാര്യം ചെയ്യുക — അംഗീകരിക്കുക, വിതരണം ചെയ്യുക, തിരിച്ചടയ്ക്കുക, അല്ലെങ്കിൽ ചരിത്രം കാണുക.',
  },
];

const PAYROLL_GUIDE_STEPS_KN = [
  {
    id: 'payroll-period',
    selector: '[data-tour="payroll-period"]',
    title: 'ಪೇಮೆಂಟ್ ಅವಧಿ',
    body: 'ಆ ಅವಧಿಗೆ ಪೇಮೆಂಟ್ ಲೆಡ್ಜರ್ ಫಿಲ್ಟರ್ ಮಾಡಲು ತಿಂಗಳು ಮತ್ತು ವರ್ಷವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
  },
  {
    id: 'payroll-stats',
    selector: '[data-tour="payroll-stats"]',
    title: 'ಸಾರಾಂಶ',
    body: 'ಈ ತಿಂಗಳು ಎಷ್ಟು ಪಾವತಿಸಲಾಗಿದೆ, ಬಾಕಿ ಮುಂಗಡಗಳು ಮತ್ತು ಬಾಕಿ ಇರುವ ಮುಂಗಡ ವಿನಂತಿಗಳನ್ನು ನೋಡಿ.',
  },
  {
    id: 'payroll-actions',
    selector: '[data-tour="payroll-actions"]',
    title: 'ಕ್ರಿಯೆಗಳು',
    body: 'Ledger ಟ್ಯಾಬ್‌ನಲ್ಲಿ ಹೊಸ ಪೇಮೆಂಟ್ ದಾಖಲಿಸಿ, ಅಥವಾ Advances ಟ್ಯಾಬ್‌ನಲ್ಲಿ ಸಂಬಳ ಮುಂಗಡವನ್ನು ವಿನಂತಿಸಿ.',
  },
  {
    id: 'payroll-table',
    selector: '[data-tour="payroll-table"]',
    title: 'ಲೆಡ್ಜರ್ ಮತ್ತು ಮುಂಗಡ',
    body: 'ಪೇಮೆಂಟ್ ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಅಥವಾ ಮುಂಗಡ ವಿನಂತಿಗಳನ್ನು ನಿರ್ವಹಿಸಿ — ಅನುಮೋದಿಸಿ, ವಿತರಿಸಿ, ವಸೂಲಿ ಮಾಡಿ, ಅಥವಾ ಇತಿಹಾಸ ನೋಡಿ.',
  },
];

export const PAYROLL_PAGE_LABELS = {
  en: 'Payment',
  hi: 'भुगतान',
  ml: 'പേയ്‌മെന്റ്',
  kn: 'ಪೇಮೆಂಟ್',
};

export const PAYROLL_GUIDE_STEPS_BY_LANG = {
  en: PAYROLL_GUIDE_STEPS_EN,
  hi: PAYROLL_GUIDE_STEPS_HI,
  ml: PAYROLL_GUIDE_STEPS_ML,
  kn: PAYROLL_GUIDE_STEPS_KN,
};

export const PAYROLL_GUIDE_STEPS = PAYROLL_GUIDE_STEPS_EN;
