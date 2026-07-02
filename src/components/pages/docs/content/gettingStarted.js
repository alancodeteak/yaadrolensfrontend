import { docLink, docStrong } from '../docsI18n';

export const gettingStartedContent = {
  en: {
    pageTitle: 'Getting started',
    pageSubtitle: 'Welcome! Here is how YaadroLens works and what to do first.',
    sections: [
      {
        title: 'What is YaadroLens?',
        paragraphs: [
          'YaadroLens helps you track employee attendance using a face-scan kiosk. Staff clock in and out by looking at the kiosk camera — no manual punch cards needed.',
          'This website is your admin panel. From here you add employees, check who is present, view reports, and change company settings.',
        ],
      },
      {
        title: 'How to sign in',
        list: [
          [docLink('/login', 'Open the login page'), '.'],
          'Enter your admin username and password (the same ones you use for this panel).',
          'If asked, enter your company code.',
          'After login, you will see the Dashboard.',
        ],
        footer: ['Open the ', docLink('/admin/dashboard', 'Dashboard'), ' anytime from the menu on the left.'],
      },
      {
        title: 'Setup checklist',
        subtitle: 'Do these steps in order',
        listStyle: 'steps',
        span: 'full',
        list: [
          'Your company account is created by your system provider.',
          'Add your employees in the Employees section.',
          'Set employee salaries in the Salary section.',
          'Set work hours in Settings → Attendance.',
          'Connect the kiosk tablet (see Kiosk setup).',
          "Register each employee's face on the kiosk.",
          'Watch attendance on the Dashboard and Live Attendance pages.',
          'Download attendance and payroll reports from the Reports page.',
        ],
      },
      {
        title: 'Good to know',
        list: [
          'Face registration is done on the kiosk — not on this website.',
          'Each company can have one active kiosk at a time.',
          'On most pages you will see Tutorial and Info buttons for a quick walkthrough.',
        ],
        tip: [
          'New here? Start with the Dashboard, then add employees, then set up the kiosk. You can always come back to this guide from the ',
          docStrong('Get Started'),
          ' menu.',
        ],
        footer: [
          'Next: ',
          docLink('/docs/dashboard', 'Your Dashboard'),
          ' · ',
          docLink('/docs/kiosk', 'Kiosk setup'),
          ' · ',
          docLink('/docs/reports', 'Reports'),
        ],
      },
    ],
  },
  hi: {
    pageTitle: 'शुरुआत करें',
    pageSubtitle: 'स्वागत है! जानिए YaadroLens कैसे काम करता है और पहले क्या करें।',
    sections: [
      {
        title: 'YaadroLens क्या है?',
        paragraphs: [
          'YaadroLens फेस-स्कैन कियोस्क से कर्मचारी हाजिरी ट्रैक करने में मदद करता है। स्टाफ कियोस्क कैमरे की ओर देखकर इन और आउट करता है — मैनुअल पंच कार्ड की जरूरत नहीं।',
          'यह वेबसाइट आपका एडमिन पैनल है। यहाँ से आप कर्मचारी जोड़ते हैं, उपस्थिति देखते हैं, रिपोर्ट देखते हैं और कंपनी सेटिंग्स बदलते हैं।',
        ],
      },
      {
        title: 'लॉगिन कैसे करें',
        list: [
          [docLink('/login', 'लॉगिन पेज'), ' खोलें।'],
          'अपना एडमिन यूज़रनेम और पासवर्ड डालें।',
          'अगर माँगा जाए तो कंपनी कोड डालें।',
          'लॉगिन के बाद आपको डैशबोर्ड दिखेगा।',
        ],
        footer: ['बाएँ मेनू से कभी भी ', docLink('/admin/dashboard', 'डैशबोर्ड'), ' खोल सकते हैं।'],
      },
      {
        title: 'सेटअप चेकलिस्ट',
        subtitle: 'इन चरणों को क्रम से करें',
        listStyle: 'steps',
        span: 'full',
        list: [
          'आपकी कंपनी अकाउंट सिस्टम प्रदाता बनाता है।',
          'Employees सेक्शन में कर्मचारी जोड़ें।',
          'Salary सेक्शन में कर्मचारी वेतन सेट करें।',
          'Settings → Attendance में कार्य समय सेट करें।',
          'कियोस्क टैबलेट कनेक्ट करें (Kiosk setup देखें)।',
          'हर कर्मचारी का चेहरा कियोस्क पर रजिस्टर करें।',
          'डैशबोर्ड और Live Attendance पर हाजिरी देखें।',
          'Reports पेज से हाजिरी और पेरोल रिपोर्ट डाउनलोड करें।',
        ],
      },
      {
        title: 'जानने योग्य बातें',
        list: [
          'चेहरा पंजीकरण कियोस्क पर होता है — इस वेबसाइट पर नहीं।',
          'एक समय में एक कंपनी का एक सक्रिय कियोस्क हो सकता है।',
          'ज़्यादातर पेजों पर Tutorial और Info बटन मिलेंगे।',
        ],
        tip: [
          'नए हैं? पहले डैशबोर्ड देखें, फिर कर्मचारी जोड़ें, फिर कियोस्क सेट करें। आप इस गाइड पर वापस ',
          docStrong('Get Started'),
          ' मेनू से आ सकते हैं।',
        ],
        footer: [
          'आगे: ',
          docLink('/docs/dashboard', 'आपका डैशबोर्ड'),
          ' · ',
          docLink('/docs/kiosk', 'कियोस्क सेटअप'),
          ' · ',
          docLink('/docs/reports', 'रिपोर्ट'),
        ],
      },
    ],
  },
  ml: {
    pageTitle: 'ആരംഭിക്കുക',
    pageSubtitle: 'സ്വാഗതം! YaadroLens എങ്ങനെ പ്രവർത്തിക്കുന്നു എന്നും ആദ്യം എന്ത് ചെയ്യണം എന്നും ഇവിടെ.',
    sections: [
      {
        title: 'YaadroLens എന്താണ്?',
        paragraphs: [
          'YaadroLens ഫേസ്-സ്കാൻ കിയോസ്ക് ഉപയോഗിച്ച് ജീവനക്കാരുടെ ഹാജർ ട്രാക്ക് ചെയ്യാൻ സഹായിക്കുന്നു. സ്റ്റാഫ് കിയോസ്ക് ക്യാമറയിലേക്ക് നോക്കി ഇൻ, ഔട്ട് ചെയ്യുന്നു — മാനുവൽ പഞ്ച് കാർഡ് ആവശ്യമില്ല.',
          'ഈ വെബ്സൈറ്റ് നിങ്ങളുടെ അഡ്മിൻ പാനലാണ്. ഇവിടെ നിന്ന് ജീവനക്കാരെ ചേർക്കാം, ഹാജർ പരിശോധിക്കാം, റിപ്പോർട്ടുകൾ കാണാം, കമ്പനി സെറ്റിംഗ്സ് മാറ്റാം.',
        ],
      },
      {
        title: 'എങ്ങനെ ലോഗിൻ ചെയ്യാം',
        list: [
          [docLink('/login', 'ലോഗിൻ പേജ്'), ' തുറക്കുക.'],
          'അഡ്മിൻ യൂസർനെയിമും പാസ്‌വേഡും നൽകുക.',
          'ചോദിച്ചാൽ കമ്പനി കോഡ് നൽകുക.',
          'ലോഗിൻ ചെയ്ത ശേഷം ഡാഷ്‌ബോർഡ് കാണാം.',
        ],
        footer: ['ഇടത് മെനുവിൽ നിന്ന് എപ്പോഴും ', docLink('/admin/dashboard', 'ഡാഷ്‌ബോർഡ്'), ' തുറക്കാം.'],
      },
      {
        title: 'സെറ്റപ്പ് ചെക്ക്ലിസ്റ്റ്',
        subtitle: 'ഈ ഘട്ടങ്ങൾ ക്രമത്തിൽ ചെയ്യുക',
        listStyle: 'steps',
        span: 'full',
        list: [
          'നിങ്ങളുടെ കമ്പനി അക്കൗണ്ട് സിസ്റ്റം പ്രൊവൈഡർ സൃഷ്ടിക്കുന്നു.',
          'Employees വിഭാഗത്തിൽ ജീവനക്കാരെ ചേർക്കുക.',
          'Salary വിഭാഗത്തിൽ ജീവനക്കാരുടെ ശമ്പളം സെറ്റ് ചെയ്യുക.',
          'Settings → Attendance-ൽ ജോലി സമയം സെറ്റ് ചെയ്യുക.',
          'കിയോസ്ക് ടാബ്ലെറ്റ് കണക്റ്റ് ചെയ്യുക (Kiosk setup കാണുക).',
          'ഓരോ ജീവനക്കാരുടെയും മുഖം കിയോസ്കിൽ രജിസ്റ്റർ ചെയ്യുക.',
          'ഡാഷ്‌ബോർഡിലും Live Attendance-ലും ഹാജർ നിരീക്ഷിക്കുക.',
          'Reports പേജിൽ നിന്ന് ഹാജർ, പേറോൾ റിപ്പോർട്ടുകൾ ഡൗൺലോഡ് ചെയ്യുക.',
        ],
      },
      {
        title: 'അറിയേണ്ടത്',
        list: [
          'മുഖം രജിസ്ട്രേഷൻ കിയോസ്കിൽ നടക്കുന്നു — ഈ വെബ്സൈറ്റിൽ അല്ല.',
          'ഒരു സമയം ഒരു കമ്പനിക്ക് ഒരു സജീവ കിയോസ്ക് മാത്രം.',
          'മിക്ക പേജുകളിലും Tutorial, Info ബട്ടണുകൾ കാണാം.',
        ],
        tip: [
          'പുതിയവരാണോ? ആദ്യം ഡാഷ്‌ബോർഡ്, പിന്നെ ജീവനക്കാർ, പിന്നെ കിയോസ്ക് സെറ്റപ്പ്. ഈ ഗൈഡിലേക്ക് ',
          docStrong('Get Started'),
          ' മെനുവിൽ നിന്ന് എപ്പോഴും തിരിച്ച് വരാം.',
        ],
        footer: [
          'അടുത്തത്: ',
          docLink('/docs/dashboard', 'നിങ്ങളുടെ ഡാഷ്‌ബോർഡ്'),
          ' · ',
          docLink('/docs/kiosk', 'കിയോസ്ക് സെറ്റപ്പ്'),
          ' · ',
          docLink('/docs/reports', 'റിപ്പോർട്ടുകൾ'),
        ],
      },
    ],
  },
  kn: {
    pageTitle: 'ಪ್ರಾರಂಭಿಸಿ',
    pageSubtitle: 'ಸ್ವಾಗತ! YaadroLens ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ ಮತ್ತು ಮೊದಲು ಏನು ಮಾಡಬೇಕು ಎಂಬುದು ಇಲ್ಲಿ.',
    sections: [
      {
        title: 'YaadroLens ಎಂದರೇನು?',
        paragraphs: [
          'YaadroLens ಫೇಸ್-ಸ್ಕ್ಯಾನ್ ಕಿಯೋಸ್ಕ್ ಬಳಸಿ ಉದ್ಯೋಗಿಗಳ ಹಾಜರಾತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ. ಸಿಬ್ಬಂದಿ ಕಿಯೋಸ್ಕ್ ಕ್ಯಾಮೆರಾಕ್ಕೆ ನೋಡಿ ಇನ್ ಮತ್ತು ಔಟ್ ಮಾಡುತ್ತಾರೆ — ಮ್ಯಾನುವಲ್ ಪಂಚ್ ಕಾರ್ಡ್ ಬೇಕಿಲ್ಲ.',
          'ಈ ವೆಬ್‌ಸೈಟ್ ನಿಮ್ಮ ಅಡ್ಮಿನ್ ಪ್ಯಾನಲ್. ಇಲ್ಲಿಂದ ಉದ್ಯೋಗಿಗಳನ್ನು ಸೇರಿಸಿ, ಹಾಜರಾತಿ ನೋಡಿ, ವರದಿಗಳನ್ನು ವೀಕ್ಷಿಸಿ, ಕಂಪನಿ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಬದಲಾಯಿಸಿ.',
        ],
      },
      {
        title: 'ಲಾಗಿನ್ ಹೇಗೆ ಮಾಡುವುದು',
        list: [
          [docLink('/login', 'ಲಾಗಿನ್ ಪುಟ'), ' ತೆರೆಯಿರಿ.'],
          'ನಿಮ್ಮ ಅಡ್ಮಿನ್ ಯೂಸರ್‌ನೇಮ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.',
          'ಕೇಳಿದರೆ ಕಂಪನಿ ಕೋಡ್ ನಮೂದಿಸಿ.',
          'ಲಾಗಿನ್ ನಂತರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಕಾಣಿಸುತ್ತದೆ.',
        ],
        footer: ['ಎಡ ಬದಿಯ ಮೆನುವಿನಿಂದ ಯಾವಾಗಲೂ ', docLink('/admin/dashboard', 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್'), ' ತೆರೆಯಬಹುದು.'],
      },
      {
        title: 'ಸೆಟಪ್ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ',
        subtitle: 'ಈ ಹಂತಗಳನ್ನು ಕ್ರಮವಾಗಿ ಮಾಡಿ',
        listStyle: 'steps',
        span: 'full',
        list: [
          'ನಿಮ್ಮ ಕಂಪನಿ ಖಾತೆಯನ್ನು ಸಿಸ್ಟಮ್ ಪ್ರೊವೈಡರ್ ರಚಿಸುತ್ತಾರೆ.',
          'Employees ವಿಭಾಗದಲ್ಲಿ ಉದ್ಯೋಗಿಗಳನ್ನು ಸೇರಿಸಿ.',
          'Salary ವಿಭಾಗದಲ್ಲಿ ಉದ್ಯೋಗಿ ಸಂಬಳ ಹೊಂದಿಸಿ.',
          'Settings → Attendance ನಲ್ಲಿ ಕೆಲಸದ ಸಮಯ ಹೊಂದಿಸಿ.',
          'ಕಿಯೋಸ್ಕ್ ಟ್ಯಾಬ್ಲೆಟ್ ಸಂಪರ್ಕಿಸಿ (Kiosk setup ನೋಡಿ).',
          'ಪ್ರತಿ ಉದ್ಯೋಗಿಯ ಮುಖವನ್ನು ಕಿಯೋಸ್ಕ್‌ನಲ್ಲಿ ನೋಂದಾಯಿಸಿ.',
          'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಮತ್ತು Live Attendance ನಲ್ಲಿ ಹಾಜರಾತಿ ನೋಡಿ.',
          'Reports ಪುಟದಿಂದ ಹಾಜರಾತಿ ಮತ್ತು ಪೇರೋಲ್ ವರದಿಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.',
        ],
      },
      {
        title: 'ತಿಳಿದುಕೊಳ್ಳಬೇಕಾದವು',
        list: [
          'ಮುಖ ನೋಂದಣಿ ಕಿಯೋಸ್ಕ್‌ನಲ್ಲಿ ನಡೆಯುತ್ತದೆ — ಈ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಅಲ್ಲ.',
          'ಒಂದು ಸಮಯದಲ್ಲಿ ಒಂದು ಕಂಪನಿಗೆ ಒಂದು ಸಕ್ರಿಯ ಕಿಯೋಸ್ಕ್ ಮಾತ್ರ.',
          'ಹೆಚ್ಚಿನ ಪುಟಗಳಲ್ಲಿ Tutorial ಮತ್ತು Info ಬಟನ್‌ಗಳು ಕಾಣಿಸುತ್ತವೆ.',
        ],
        tip: [
          'ಹೊಸಬರೇ? ಮೊದಲು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್, ನಂತರ ಉದ್ಯೋಗಿಗಳು, ನಂತರ ಕಿಯೋಸ್ಕ್ ಸೆಟಪ್. ಈ ಮಾರ್ಗದರ್ಶಿಗೆ ',
          docStrong('Get Started'),
          ' ಮೆನುವಿನಿಂದ ಯಾವಾಗಲೂ ಹಿಂತಿರುಗಬಹುದು.',
        ],
        footer: [
          'ಮುಂದೆ: ',
          docLink('/docs/dashboard', 'ನಿಮ್ಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್'),
          ' · ',
          docLink('/docs/kiosk', 'ಕಿಯೋಸ್ಕ್ ಸೆಟಪ್'),
          ' · ',
          docLink('/docs/reports', 'ವರದಿಗಳು'),
        ],
      },
    ],
  },
};
