const SETTINGS_ATTENDANCE_STEPS_EN = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'Settings navigation',
    body: 'Switch between Attendance rules, Shifts, Payment rules, Kiosk, and Help.',
  },
  {
    id: 'shift-schedule-mode',
    selector: '[data-tour="shift-schedule-mode"]',
    title: 'Shift schedule mode',
    body: 'Same for all uses one org start/end for everyone. Per employee uses shift templates you create under Settings → Shifts, then assign Mon–Sun on each employee.',
  },
  {
    id: 'working-hours',
    selector: '[data-tour="working-hours"]',
    title: 'Working hours',
    body: 'When mode is same for all, set start and end here. When mode is per employee, hours come from each person’s weekly shift templates.',
  },
  {
    id: 'grace-periods',
    selector: '[data-tour="grace-periods"]',
    title: 'Grace periods',
    body: 'Allow a few minutes of leeway before marking late arrival or early departure.',
  },
  {
    id: 'kiosk-scan-rules',
    selector: '[data-tour="kiosk-scan-rules"]',
    title: 'Kiosk scan',
    body: 'Minimum wait after clock-in before the kiosk can record clock-out.',
  },
  {
    id: 'manual-attendance',
    selector: '[data-tour="manual-attendance"]',
    title: 'Manual attendance',
    body: 'Turn on so admins can clock employees in or out from Live Attendance when the kiosk is unavailable. Each punch needs a typed confirmation phrase.',
  },
  {
    id: 'save-actions',
    selector: '[data-tour="save-actions"]',
    title: 'Save changes',
    body: 'Apply your attendance rule changes. Validation runs before saving.',
  },
];

const SETTINGS_ATTENDANCE_STEPS_HI = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'सेटिंग्स नेविगेशन',
    body: 'उपस्थिति नियम, शिफ्ट, भुगतान नियम, कियोस्क और सहायता के बीच स्विच करें।',
  },
  {
    id: 'shift-schedule-mode',
    selector: '[data-tour="shift-schedule-mode"]',
    title: 'शिफ्ट अनुसूची मोड',
    body: 'सभी के लिए समान — एक संगठन शुरू/समाप्ति समय। प्रति कर्मचारी — Settings → Shifts में टेम्पलेट बनाएँ, फिर प्रत्येक कर्मचारी पर सोम–रवि असाइन करें।',
  },
  {
    id: 'working-hours',
    selector: '[data-tour="working-hours"]',
    title: 'कार्य घंटे',
    body: 'सभी के लिए समान मोड में यहाँ शुरू और समाप्ति सेट करें। प्रति कर्मचारी मोड में घंटे साप्ताहिक शिफ्ट टेम्पलेट से आते हैं।',
  },
  {
    id: 'grace-periods',
    selector: '[data-tour="grace-periods"]',
    title: 'ग्रेस अवधि',
    body: 'देर से आगमन या जल्दी प्रस्थान चिह्नित करने से पहले कुछ मिनट की छूट दें।',
  },
  {
    id: 'kiosk-scan-rules',
    selector: '[data-tour="kiosk-scan-rules"]',
    title: 'कियोस्क स्कैन',
    body: 'क्लॉक-इन के बाद क्लॉक-आउट रिकॉर्ड करने से पहले न्यूनतम प्रतीक्षा।',
  },
  {
    id: 'manual-attendance',
    selector: '[data-tour="manual-attendance"]',
    title: 'मैनुअल उपस्थिति',
    body: 'कियोस्क उपलब्ध न हो तो लाइव उपस्थिति से एडमिन क्लॉक-इन/आउट कर सकें। हर पंच के लिए पुष्टि वाक्य टाइप करना ज़रूरी।',
  },
  {
    id: 'save-actions',
    selector: '[data-tour="save-actions"]',
    title: 'परिवर्तन सहेजें',
    body: 'उपस्थिति नियम लागू करें। सहेजने से पहले सत्यापन चलता है।',
  },
];

const SETTINGS_ATTENDANCE_STEPS_ML = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'സെറ്റിംഗ്സ് നാവിഗേഷൻ',
    body: 'ഹാജർ നിയമങ്ങൾ, ഷിഫ്റ്റുകൾ, പേയ്മെന്റ് നിയമങ്ങൾ, കിയോസ്ക്, സഹായം എന്നിവയ്ക്കിടയിൽ മാറുക.',
  },
  {
    id: 'shift-schedule-mode',
    selector: '[data-tour="shift-schedule-mode"]',
    title: 'ഷിഫ്റ്റ് ഷെഡ്യൂൾ മോഡ്',
    body: 'എല്ലാവർക്കും ഒരേ സമയം — ഒരു ഓർഗ് ആരംഭ/അവസാനം. per employee — Settings → Shifts-ൽ ടെംപ്ലേറ്റ് ഉണ്ടാക്കി ഓരോ ജീവനക്കാരനും തിങ്കൾ–ഞായർ അസൈൻ ചെയ്യുക.',
  },
  {
    id: 'working-hours',
    selector: '[data-tour="working-hours"]',
    title: 'ജോലി സമയം',
    body: 'same for all മോഡിൽ ഇവിടെ ആരംഭ/അവസാനം സജ്ജമാക്കുക. per employee മോഡിൽ സമയം ആഴ്ച ഷിഫ്റ്റ് ടെംപ്ലേറ്റുകളിൽ നിന്ന് വരും.',
  },
  {
    id: 'grace-periods',
    selector: '[data-tour="grace-periods"]',
    title: 'ഗ്രേസ് കാലയളവ്',
    body: 'വൈകി വരവ് അല്ലെങ്കിൽ നേരത്തെ പോക്ക് അടയാളപ്പെടുത്തുന്നതിന് മുമ്പ് കുറച്ച് മിനിറ്റ് ഇളവ് അനുവദിക്കുക.',
  },
  {
    id: 'kiosk-scan-rules',
    selector: '[data-tour="kiosk-scan-rules"]',
    title: 'കിയോസ്ക് സ്കാൻ',
    body: 'ക്ലോക്ക്-ഇന് ശേഷം ക്ലോക്ക്-ഔട്ട് രേഖപ്പെടുത്തുന്നതിന് മുമ്പുള്ള കുറഞ്ഞ കാത്തിരിപ്പ്.',
  },
  {
    id: 'manual-attendance',
    selector: '[data-tour="manual-attendance"]',
    title: 'മാനുവൽ ഹാജർ',
    body: 'കിയോസ്ക് ലഭ്യമല്ലാത്തപ്പോൾ ലൈവ് ഹാജറിൽ നിന്ന് അഡ്മിൻ ക്ലോക്ക്-ഇൻ/ഔട്ട് ചെയ്യാം. ഓരോ പഞ്ചിനും സ്ഥിരീകരണ വാചകം ടൈപ്പ് വേണം.',
  },
  {
    id: 'save-actions',
    selector: '[data-tour="save-actions"]',
    title: 'മാറ്റങ്ങൾ സേവ് ചെയ്യുക',
    body: 'ഹാജർ നിയമ മാറ്റങ്ങൾ പ്രയോഗിക്കുക. സേവ് ചെയ്യുന്നതിന് മുമ്പ് വാലിഡേഷൻ നടക്കും.',
  },
];

const SETTINGS_ATTENDANCE_STEPS_KN = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'ಸೆಟ್ಟಿಂಗ್ಸ್ ನ್ಯಾವಿಗೇಷನ್',
    body: 'ಹಾಜರಿ ನಿಯಮಗಳು, ಶಿಫ್ಟ್‌ಗಳು, ಪಾವತಿ ನಿಯಮಗಳು, ಕಿಯೋಸ್ಕ್ ಮತ್ತು ಸಹಾಯ ನಡುವೆ ಬದಲಾಯಿಸಿ.',
  },
  {
    id: 'shift-schedule-mode',
    selector: '[data-tour="shift-schedule-mode"]',
    title: 'ಶಿಫ್ಟ್ ವೇಳಾಪಟ್ಟಿ ಮೋಡ್',
    body: 'ಎಲ್ಲರಿಗೂ ಒಂದೇ — ಒಂದು ಸಂಸ್ಥೆ ಪ್ರಾರಂಭ/ಅಂತ್ಯ. ಪ್ರತಿ ಉದ್ಯೋಗಿ — Settings → Shifts ನಲ್ಲಿ ಟೆಂಪ್ಲೇಟ್ ರಚಿಸಿ, ನಂತರ ಸೋಮ–ಭಾನು ನಿಯೋಜಿಸಿ.',
  },
  {
    id: 'working-hours',
    selector: '[data-tour="working-hours"]',
    title: 'ಕೆಲಸದ ಸಮಯ',
    body: 'ಎಲ್ಲರಿಗೂ ಒಂದೇ ಮೋಡ್‌ನಲ್ಲಿ ಇಲ್ಲಿ ಪ್ರಾರಂಭ ಮತ್ತು ಅಂತ್ಯ ಹೊಂದಿಸಿ. ಪ್ರತಿ-ಉದ್ಯೋಗಿ ಮೋಡ್‌ನಲ್ಲಿ ಸಮಯ ವಾರದ ಶಿಫ್ಟ್ ಟೆಂಪ್ಲೇಟ್‌ಗಳಿಂದ ಬರುತ್ತದೆ.',
  },
  {
    id: 'grace-periods',
    selector: '[data-tour="grace-periods"]',
    title: 'ಗ್ರೇಸ್ ಅವಧಿ',
    body: 'ತಡವಾದ ಆಗಮನ ಅಥವಾ ಬೇಗ ಹೊರಡುವುದನ್ನು ಗುರುತಿಸುವ ಮೊದಲು ಕೆಲವು ನಿಮಿಷಗಳ ರಿಯಾಯಿತಿ ನೀಡಿ.',
  },
  {
    id: 'kiosk-scan-rules',
    selector: '[data-tour="kiosk-scan-rules"]',
    title: 'ಕಿಯೋಸ್ಕ್ ಸ್ಕ್ಯಾನ್',
    body: 'ಕ್ಲಾಕ್-ಇನ್ ನಂತರ ಕ್ಲಾಕ್-ಔಟ್ ದಾಖಲಿಸುವ ಮೊದಲು ಕನಿಷ್ಠ ನಿರೀಕ್ಷೆ.',
  },
  {
    id: 'manual-attendance',
    selector: '[data-tour="manual-attendance"]',
    title: 'ಮ್ಯಾನುಯಲ್ ಹಾಜರಿ',
    body: 'ಕಿಯೋಸ್ಕ್ ಲಭ್ಯವಿಲ್ಲದಾಗ ಲೈವ್ ಹಾಜರಿಯಿಂದ ಅಡ್ಮಿನ್‌ಗಳು ಕ್ಲಾಕ್-ಇನ್/ಔಟ್ ಮಾಡಬಹುದು. ಪ್ರತಿ ಪಂಚ್‌ಗೆ ದೃಢೀಕರಣ ವಾಕ್ಯ ಟೈಪ್ ಅಗತ್ಯ.',
  },
  {
    id: 'save-actions',
    selector: '[data-tour="save-actions"]',
    title: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',
    body: 'ಹಾಜರಿ ನಿಯಮ ಬದಲಾವಣೆಗಳನ್ನು ಅನ್ವಯಿಸಿ. ಉಳಿಸುವ ಮೊದಲು ಮಾನ್ಯತೆ ನಡೆಯುತ್ತದೆ.',
  },
];

const SETTINGS_SHIFTS_STEPS_EN = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'Settings navigation',
    body: 'Open Shifts to manage reusable templates with hours and breaks. Use Attendance rules to switch between same-for-all and per-employee mode.',
  },
  {
    id: 'shift-template-form',
    selector: '[data-tour="shift-template-form"]',
    title: 'Create a template',
    body: 'Name the shift (e.g. Morning), set start and end times, and optionally add lunch or tea breaks. Overnight shifts are allowed.',
  },
  {
    id: 'saved-templates',
    selector: '[data-tour="saved-templates"]',
    title: 'Saved templates',
    body: 'Edit or delete templates here. When per-employee mode is on, assign these on each employee’s Mon–Sun weekly schedule.',
  },
];

const SETTINGS_SHIFTS_STEPS_HI = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'सेटिंग्स नेविगेशन',
    body: 'घंटे और ब्रेक वाले टेम्पलेट प्रबंधित करने के लिए शिफ्ट खोलें। same-for-all और per-employee मोड के लिए उपस्थिति नियम उपयोग करें।',
  },
  {
    id: 'shift-template-form',
    selector: '[data-tour="shift-template-form"]',
    title: 'टेम्पलेट बनाएँ',
    body: 'शिफ्ट का नाम दें (जैसे Morning), शुरू/समाप्ति समय सेट करें, वैकल्पिक रूप से लंच या चाय ब्रेक जोड़ें। रात भर की शिफ्ट अनुमत हैं।',
  },
  {
    id: 'saved-templates',
    selector: '[data-tour="saved-templates"]',
    title: 'सहेजे गए टेम्पलेट',
    body: 'यहाँ टेम्पलेट संपादित या हटाएँ। per-employee मोड चालू हो तो प्रत्येक कर्मचारी के सोम–रवि शेड्यूल पर असाइन करें।',
  },
];

const SETTINGS_SHIFTS_STEPS_ML = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'സെറ്റിംഗ്സ് നാവിഗേഷൻ',
    body: 'മണിക്കൂറും ബ്രേക്കും ഉള്ള ടെംപ്ലേറ്റുകൾ നിയന്ത്രിക്കാൻ ഷിഫ്റ്റുകൾ തുറക്കുക. same-for-all / per-employee മോഡ് മാറ്റാൻ ഹാജർ നിയമങ്ങൾ ഉപയോഗിക്കുക.',
  },
  {
    id: 'shift-template-form',
    selector: '[data-tour="shift-template-form"]',
    title: 'ടെംപ്ലേറ്റ് ഉണ്ടാക്കുക',
    body: 'ഷിഫ്റ്റിന് പേര് നൽകുക (ഉദാ. Morning), ആരംഭ/അവസാന സമയം സജ്ജമാക്കുക, ഐച്ഛികമായി ലഞ്ച്/ടീ ബ്രേക്ക് ചേർക്കുക. രാത്രി ഷിഫ്റ്റുകൾ അനുവദനീയം.',
  },
  {
    id: 'saved-templates',
    selector: '[data-tour="saved-templates"]',
    title: 'സേവ് ചെയ്ത ടെംപ്ലേറ്റുകൾ',
    body: 'ഇവിടെ ടെംപ്ലേറ്റ് എഡിറ്റ് അല്ലെങ്കിൽ ഇല്ലാതാക്കുക. per-employee മോഡ് ഓണാണെങ്കിൽ ഓരോ ജീവനക്കാരന്റെ തിങ്കൾ–ഞായർ ഷെഡ്യൂളിൽ അസൈൻ ചെയ്യുക.',
  },
];

const SETTINGS_SHIFTS_STEPS_KN = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'ಸೆಟ್ಟಿಂಗ್ಸ್ ನ್ಯಾವಿಗೇಷನ್',
    body: 'ಗಂಟೆಗಳು ಮತ್ತು ವಿರಾಮಗಳೊಂದಿಗೆ ಮರುಬಳಕೆ ಟೆಂಪ್ಲೇಟ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸಲು ಶಿಫ್ಟ್‌ಗಳನ್ನು ತೆರೆಯಿರಿ. same-for-all / ಪ್ರತಿ-ಉದ್ಯೋಗಿ ಮೋಡ್‌ಗೆ ಹಾಜರಿ ನಿಯಮಗಳನ್ನು ಬಳಸಿ.',
  },
  {
    id: 'shift-template-form',
    selector: '[data-tour="shift-template-form"]',
    title: 'ಟೆಂಪ್ಲೇಟ್ ರಚಿಸಿ',
    body: 'ಶಿಫ್ಟ್‌ಗೆ ಹೆಸರು ನೀಡಿ (ಉದಾ. Morning), ಪ್ರಾರಂಭ/ಅಂತ್ಯ ಸಮಯ ಹೊಂದಿಸಿ, ಐಚ್ಛಿಕವಾಗಿ ಊಟ/ಚಹಾ ವಿರಾಮ ಸೇರಿಸಿ. ರಾತ್ರಿ ಶಿಫ್ಟ್‌ಗಳು ಅನುಮತಿಸಲಾಗಿದೆ.',
  },
  {
    id: 'saved-templates',
    selector: '[data-tour="saved-templates"]',
    title: 'ಉಳಿಸಿದ ಟೆಂಪ್ಲೇಟ್‌ಗಳು',
    body: 'ಇಲ್ಲಿ ಟೆಂಪ್ಲೇಟ್‌ಗಳನ್ನು ಸಂಪಾದಿಸಿ ಅಥವಾ ಅಳಿಸಿ. ಪ್ರತಿ-ಉದ್ಯೋಗಿ ಮೋಡ್ ಆನ್ ಆಗಿದ್ದರೆ ಪ್ರತಿ ಉದ್ಯೋಗಿಯ ಸೋಮ–ಭಾನು ವೇಳಾಪಟ್ಟಿಯಲ್ಲಿ ನಿಯೋಜಿಸಿ.',
  },
];

const SETTINGS_PAYMENT_STEPS_EN = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'Settings navigation',
    body: 'Switch between Attendance rules, Shifts, Payment rules, Kiosk, and Help.',
  },
  {
    id: 'payment-monthly-salary',
    selector: '[data-tour="payment-monthly-salary"]',
    title: 'Monthly salary',
    body: 'Enable automatic salary generation and choose the pay day of each month.',
  },
  {
    id: 'payment-weekly-off',
    selector: '[data-tour="payment-weekly-off"]',
    title: 'Weekly off',
    body: 'Default off days for all employees. You can allow per-employee overrides.',
  },
  {
    id: 'payment-leave-policy',
    selector: '[data-tour="payment-leave-policy"]',
    title: 'Leave policy',
    body: 'Paid leave quota, excess-leave deductions, and how far ahead leave can be scheduled.',
  },
  {
    id: 'payment-salary-calculation',
    selector: '[data-tour="payment-salary-calculation"]',
    title: 'Salary calculation',
    body: 'How monthly pay is computed: fixed, attendance-based, leave-aware with deductions, or hourly-based (hours × rate).',
  },
  {
    id: 'save-actions',
    selector: '[data-tour="save-actions"]',
    title: 'Save changes',
    body: 'Apply your payment rule changes. Validation runs before saving.',
  },
];

const SETTINGS_PAYMENT_STEPS_HI = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'सेटिंग्स नेविगेशन',
    body: 'उपस्थिति नियम, शिफ्ट, भुगतान नियम, कियोस्क और सहायता के बीच स्विच करें।',
  },
  {
    id: 'payment-monthly-salary',
    selector: '[data-tour="payment-monthly-salary"]',
    title: 'मासिक वेतन',
    body: 'स्वचालित वेतन जनरेशन चालू करें और हर महीने का भुगतान दिन चुनें।',
  },
  {
    id: 'payment-weekly-off',
    selector: '[data-tour="payment-weekly-off"]',
    title: 'साप्ताहिक छुट्टी',
    body: 'सभी कर्मचारियों के लिए डिफ़ॉल्ट छुट्टी के दिन। प्रति कर्मचारी ओवरराइड की अनुमति दे सकते हैं।',
  },
  {
    id: 'payment-leave-policy',
    selector: '[data-tour="payment-leave-policy"]',
    title: 'छुट्टी नीति',
    body: 'सवेतन छुट्टी कोटा, अतिरिक्त छुट्टी कटौती, और कितने दिन पहले छुट्टी शेड्यूल हो सकती है।',
  },
  {
    id: 'payment-salary-calculation',
    selector: '[data-tour="payment-salary-calculation"]',
    title: 'वेतन गणना',
    body: 'मासिक वेतन कैसे गणना हो: निश्चित, उपस्थिति-आधारित, छुट्टी कटौती सहित, या घंटे × दर।',
  },
  {
    id: 'save-actions',
    selector: '[data-tour="save-actions"]',
    title: 'परिवर्तन सहेजें',
    body: 'भुगतान नियम लागू करें। सहेजने से पहले सत्यापन चलता है।',
  },
];

const SETTINGS_PAYMENT_STEPS_ML = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'സെറ്റിംഗ്സ് നാവിഗേഷൻ',
    body: 'ഹാജർ നിയമങ്ങൾ, ഷിഫ്റ്റുകൾ, പേയ്മെന്റ് നിയമങ്ങൾ, കിയോസ്ക്, സഹായം എന്നിവയ്ക്കിടയിൽ മാറുക.',
  },
  {
    id: 'payment-monthly-salary',
    selector: '[data-tour="payment-monthly-salary"]',
    title: 'മാസ ശമ്പളം',
    body: 'സ്വയം ശമ്പള ജനറേഷൻ ഓണാക്കി ഓരോ മാസത്തെയും പേ ദിനം തിരഞ്ഞെടുക്കുക.',
  },
  {
    id: 'payment-weekly-off',
    selector: '[data-tour="payment-weekly-off"]',
    title: 'ആഴ്ച അവധി',
    body: 'എല്ലാ ജീവനക്കാർക്കുമുള്ള ഡിഫോൾട്ട് അവധി ദിനങ്ങൾ. per-employee ഓവർറൈഡ് അനുവദിക്കാം.',
  },
  {
    id: 'payment-leave-policy',
    selector: '[data-tour="payment-leave-policy"]',
    title: 'ലീവ് നയം',
    body: 'പണമടച്ച ലീവ് കോട്ട, അധിക ലീവ് കിഴിവ്, എത്ര മുമ്പ് ലീവ് ഷെഡ്യൂൾ ചെയ്യാം.',
  },
  {
    id: 'payment-salary-calculation',
    selector: '[data-tour="payment-salary-calculation"]',
    title: 'ശമ്പള കണക്കുകൂട്ടൽ',
    body: 'മാസ ശമ്പളം എങ്ങനെ കണക്കാക്കും: ഫിക്സഡ്, ഹാജർ അടിസ്ഥാനം, ലീവ് കിഴിവോടെ, അല്ലെങ്കിൽ മണിക്കൂർ × നിരക്ക്.',
  },
  {
    id: 'save-actions',
    selector: '[data-tour="save-actions"]',
    title: 'മാറ്റങ്ങൾ സേവ് ചെയ്യുക',
    body: 'പേയ്മെന്റ് നിയമ മാറ്റങ്ങൾ പ്രയോഗിക്കുക. സേവ് ചെയ്യുന്നതിന് മുമ്പ് വാലിഡേഷൻ നടക്കും.',
  },
];

const SETTINGS_PAYMENT_STEPS_KN = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'ಸೆಟ್ಟಿಂಗ್ಸ್ ನ್ಯಾವಿಗೇಷನ್',
    body: 'ಹಾಜರಿ ನಿಯಮಗಳು, ಶಿಫ್ಟ್‌ಗಳು, ಪಾವತಿ ನಿಯಮಗಳು, ಕಿಯೋಸ್ಕ್ ಮತ್ತು ಸಹಾಯ ನಡುವೆ ಬದಲಾಯಿಸಿ.',
  },
  {
    id: 'payment-monthly-salary',
    selector: '[data-tour="payment-monthly-salary"]',
    title: 'ಮಾಸಿಕ ಸಂಬಳ',
    body: 'ಸ್ವಯಂ ಸಂಬಳ ರಚನೆಯನ್ನು ಆನ್ ಮಾಡಿ ಮತ್ತು ಪ್ರತಿ ತಿಂಗಳ ಪಾವತಿ ದಿನ ಆಯ್ಕೆಮಾಡಿ.',
  },
  {
    id: 'payment-weekly-off',
    selector: '[data-tour="payment-weekly-off"]',
    title: 'ವಾರದ ರಜೆ',
    body: 'ಎಲ್ಲಾ ಉದ್ಯೋಗಿಗಳಿಗೆ ಡೀಫಾಲ್ಟ್ ರಜೆ ದಿನಗಳು. ಪ್ರತಿ-ಉದ್ಯೋಗಿ ಓವರ್‌ರೈಡ್ ಅನುಮತಿಸಬಹುದು.',
  },
  {
    id: 'payment-leave-policy',
    selector: '[data-tour="payment-leave-policy"]',
    title: 'ರಜೆ ನೀತಿ',
    body: 'ಪಾವತಿತ ರಜೆ ಕೋಟಾ, ಹೆಚ್ಚುವರಿ ರಜೆ ಕಡಿತ, ಮತ್ತು ಎಷ್ಟು ಮುಂಚಿತವಾಗಿ ರಜೆ ನಿಗದಿಪಡಿಸಬಹುದು.',
  },
  {
    id: 'payment-salary-calculation',
    selector: '[data-tour="payment-salary-calculation"]',
    title: 'ಸಂಬಳ ಲೆಕ್ಕಾಚಾರ',
    body: 'ಮಾಸಿಕ ವೇತನ ಹೇಗೆ ಲೆಕ್ಕ: ನಿಗದಿತ, ಹಾಜರಿ-ಆಧಾರಿತ, ರಜೆ ಕಡಿತದೊಂದಿಗೆ, ಅಥವಾ ಗಂಟೆ × ದರ.',
  },
  {
    id: 'save-actions',
    selector: '[data-tour="save-actions"]',
    title: 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',
    body: 'ಪಾವತಿ ನಿಯಮ ಬದಲಾವಣೆಗಳನ್ನು ಅನ್ವಯಿಸಿ. ಉಳಿಸುವ ಮೊದಲು ಮಾನ್ಯತೆ ನಡೆಯುತ್ತದೆ.',
  },
];

const SETTINGS_KIOSK_STEPS_EN = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'Settings navigation',
    body: 'Switch between Attendance rules, Payment rules, Kiosk, and Help.',
  },
  {
    id: 'device-status',
    selector: '[data-tour="device-status"]',
    title: 'Device status',
    body: 'See whether a kiosk is paired and view the device ID and pairing time.',
  },
  {
    id: 'pairing-info',
    selector: '[data-tour="pairing-info"]',
    title: 'How to pair',
    body: 'Download the kiosk app from Google Play, then sign in with your org admin credentials to pair the tablet.',
  },
];

const SETTINGS_KIOSK_STEPS_HI = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'सेटिंग्स नेविगेशन',
    body: 'उपस्थिति नियम, भुगतान नियम, कियोस्क और सहायता के बीच स्विच करें।',
  },
  {
    id: 'device-status',
    selector: '[data-tour="device-status"]',
    title: 'डिवाइस स्थिति',
    body: 'कियोस्क पेयर है या नहीं देखें, डिवाइस ID और पेयरिंग समय देखें।',
  },
  {
    id: 'pairing-info',
    selector: '[data-tour="pairing-info"]',
    title: 'पेयर कैसे करें',
    body: 'Google Play से कियोस्क ऐप डाउनलोड करें, फिर टैबलेट पेयर करने के लिए org एडमिन क्रेडेंशियल से साइन इन करें।',
  },
];

const SETTINGS_KIOSK_STEPS_ML = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'സെറ്റിംഗ്സ് നാവിഗേഷൻ',
    body: 'ഹാജർ നിയമങ്ങൾ, പേയ്മെന്റ് നിയമങ്ങൾ, കിയോസ്ക്, സഹായം എന്നിവയ്ക്കിടയിൽ മാറുക.',
  },
  {
    id: 'device-status',
    selector: '[data-tour="device-status"]',
    title: 'ഡിവൈസ് നില',
    body: 'കിയോസ്ക് ജോടിയാക്കിയിട്ടുണ്ടോ എന്ന് കാണുക; ഡിവൈസ് ID, ജോടി സമയം കാണുക.',
  },
  {
    id: 'pairing-info',
    selector: '[data-tour="pairing-info"]',
    title: 'എങ്ങനെ ജോടിയാക്കാം',
    body: 'Google Play-ൽ നിന്ന് കിയോസ്ക് ആപ്പ് ഡൗൺലോഡ് ചെയ്ത് org അഡ്മിൻ ക്രെഡൻഷ്യലുകൾ കൊണ്ട് സൈൻ ഇൻ ചെയ്ത് ടാബ്‌ലെറ്റ് ജോടിയാക്കുക.',
  },
];

const SETTINGS_KIOSK_STEPS_KN = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'ಸೆಟ್ಟಿಂಗ್ಸ್ ನ್ಯಾವಿಗೇಷನ್',
    body: 'ಹಾಜರಿ ನಿಯಮಗಳು, ಪಾವತಿ ನಿಯಮಗಳು, ಕಿಯೋಸ್ಕ್ ಮತ್ತು ಸಹಾಯ ನಡುವೆ ಬದಲಾಯಿಸಿ.',
  },
  {
    id: 'device-status',
    selector: '[data-tour="device-status"]',
    title: 'ಸಾಧನ ಸ್ಥಿತಿ',
    body: 'ಕಿಯೋಸ್ಕ್ ಜೋಡಿಯಾಗಿದೆಯೇ ಎಂದು ನೋಡಿ; ಸಾಧನ ID ಮತ್ತು ಜೋಡಣೆ ಸಮಯವನ್ನು ವೀಕ್ಷಿಸಿ.',
  },
  {
    id: 'pairing-info',
    selector: '[data-tour="pairing-info"]',
    title: 'ಹೇಗೆ ಜೋಡಿಸುವುದು',
    body: 'Google Play ನಿಂದ ಕಿಯೋಸ್ಕ್ ಆ್ಯಪ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ, ನಂತರ ಟ್ಯಾಬ್ಲೆಟ್ ಜೋಡಿಸಲು org ಅಡ್ಮಿನ್ ರುಜುವಾತುಗಳೊಂದಿಗೆ ಸೈನ್ ಇನ್ ಮಾಡಿ.',
  },
];

const SETTINGS_HELP_STEPS_EN = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'Settings navigation',
    body: 'Switch between Attendance rules, Payment rules, Kiosk, and Help.',
  },
  {
    id: 'help-contact',
    selector: '[data-tour="help-contact"]',
    title: 'Contact',
    body: 'Email and phone for CodeTeak support — tap to call or send a message.',
  },
  {
    id: 'help-offices',
    selector: '[data-tour="help-offices"]',
    title: 'Offices',
    body: 'Our Bengaluru office address for visits and correspondence.',
  },
];

const SETTINGS_HELP_STEPS_HI = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'सेटिंग्स नेविगेशन',
    body: 'उपस्थिति नियम, भुगतान नियम, कियोस्क और सहायता के बीच स्विच करें।',
  },
  {
    id: 'help-contact',
    selector: '[data-tour="help-contact"]',
    title: 'संपर्क',
    body: 'CodeTeak सहायता के लिए ईमेल और फ़ोन — कॉल या संदेश के लिए टैप करें।',
  },
  {
    id: 'help-offices',
    selector: '[data-tour="help-offices"]',
    title: 'कार्यालय',
    body: 'भेंट और पत्राचार के लिए हमारा बेंगलुरु कार्यालय पता।',
  },
];

const SETTINGS_HELP_STEPS_ML = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'സെറ്റിംഗ്സ് നാവിഗേഷൻ',
    body: 'ഹാജർ നിയമങ്ങൾ, പേയ്മെന്റ് നിയമങ്ങൾ, കിയോസ്ക്, സഹായം എന്നിവയ്ക്കിടയിൽ മാറുക.',
  },
  {
    id: 'help-contact',
    selector: '[data-tour="help-contact"]',
    title: 'ബന്ധപ്പെടുക',
    body: 'CodeTeak സപ്പോർട്ടിനുള്ള ഇമെയിൽ, ഫോൺ — വിളിക്കാനോ സന്ദേശം അയയ്ക്കാനോ ടാപ്പ് ചെയ്യുക.',
  },
  {
    id: 'help-offices',
    selector: '[data-tour="help-offices"]',
    title: 'ഓഫീസുകൾ',
    body: 'സന്ദർശനത്തിനും കത്തിടപാടുകൾക്കുമുള്ള ബെംഗളൂരു ഓഫീസ് വിലാസം.',
  },
];

const SETTINGS_HELP_STEPS_KN = [
  {
    id: 'settings-nav',
    selector: '[data-tour="settings-nav"]',
    title: 'ಸೆಟ್ಟಿಂಗ್ಸ್ ನ್ಯಾವಿಗೇಷನ್',
    body: 'ಹಾಜರಿ ನಿಯಮಗಳು, ಪಾವತಿ ನಿಯಮಗಳು, ಕಿಯೋಸ್ಕ್ ಮತ್ತು ಸಹಾಯ ನಡುವೆ ಬದಲಾಯಿಸಿ.',
  },
  {
    id: 'help-contact',
    selector: '[data-tour="help-contact"]',
    title: 'ಸಂಪರ್ಕ',
    body: 'CodeTeak ಬೆಂಬಲಕ್ಕಾಗಿ ಇಮೇಲ್ ಮತ್ತು ಫೋನ್ — ಕರೆ ಮಾಡಲು ಅಥವಾ ಸಂದೇಶ ಕಳುಹಿಸಲು ಟ್ಯಾಪ್ ಮಾಡಿ.',
  },
  {
    id: 'help-offices',
    selector: '[data-tour="help-offices"]',
    title: 'ಕಚೇರಿಗಳು',
    body: 'ಭೇಟಿ ಮತ್ತು ಪತ್ರವ್ಯವಹಾರಕ್ಕಾಗಿ ನಮ್ಮ ಬೆಂಗಳೂರು ಕಚೇರಿ ವಿಳಾಸ.',
  },
];

export const SETTINGS_PAGE_LABELS = {
  en: 'Settings',
  hi: 'सेटिंग्स',
  ml: 'സെറ്റിംഗ്സ്',
  kn: 'ಸೆಟ್ಟಿಂಗ್ಸ್',
};

export const SETTINGS_ATTENDANCE_STEPS_BY_LANG = {
  en: SETTINGS_ATTENDANCE_STEPS_EN,
  hi: SETTINGS_ATTENDANCE_STEPS_HI,
  ml: SETTINGS_ATTENDANCE_STEPS_ML,
  kn: SETTINGS_ATTENDANCE_STEPS_KN,
};

export const SETTINGS_SHIFTS_STEPS_BY_LANG = {
  en: SETTINGS_SHIFTS_STEPS_EN,
  hi: SETTINGS_SHIFTS_STEPS_HI,
  ml: SETTINGS_SHIFTS_STEPS_ML,
  kn: SETTINGS_SHIFTS_STEPS_KN,
};

export const SETTINGS_PAYMENT_STEPS_BY_LANG = {
  en: SETTINGS_PAYMENT_STEPS_EN,
  hi: SETTINGS_PAYMENT_STEPS_HI,
  ml: SETTINGS_PAYMENT_STEPS_ML,
  kn: SETTINGS_PAYMENT_STEPS_KN,
};

export const SETTINGS_KIOSK_STEPS_BY_LANG = {
  en: SETTINGS_KIOSK_STEPS_EN,
  hi: SETTINGS_KIOSK_STEPS_HI,
  ml: SETTINGS_KIOSK_STEPS_ML,
  kn: SETTINGS_KIOSK_STEPS_KN,
};

export const SETTINGS_HELP_STEPS_BY_LANG = {
  en: SETTINGS_HELP_STEPS_EN,
  hi: SETTINGS_HELP_STEPS_HI,
  ml: SETTINGS_HELP_STEPS_ML,
  kn: SETTINGS_HELP_STEPS_KN,
};

export const SETTINGS_ATTENDANCE_STEPS = SETTINGS_ATTENDANCE_STEPS_EN;
export const SETTINGS_SHIFTS_STEPS = SETTINGS_SHIFTS_STEPS_EN;
export const SETTINGS_PAYMENT_STEPS = SETTINGS_PAYMENT_STEPS_EN;
export const SETTINGS_KIOSK_STEPS = SETTINGS_KIOSK_STEPS_EN;
export const SETTINGS_HELP_STEPS = SETTINGS_HELP_STEPS_EN;
