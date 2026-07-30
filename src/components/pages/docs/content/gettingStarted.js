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
          [
            'Configure ',
            docStrong('Settings'),
            ' first — timezone, work hours, grace, weekly offs, leave, and salary calculation. See the ',
            docLink('/docs/settings', 'Settings guide'),
            ' for what each option means.',
          ],
          'Add your employees in the Employees section.',
          'Set employee salaries in the Salary section.',
          'Connect the kiosk tablet (see Kiosk setup).',
          "Register each employee's face on the kiosk.",
          'Optional: create shift templates and enable manual punch under Settings if you need them.',
          'Watch attendance on the Dashboard and Live Attendance pages.',
          'Download attendance and payroll reports from the Reports page.',
        ],
      },
      {
        title: 'Configure Settings (important)',
        span: 'full',
        paragraphs: [
          [
            'Most “late / leave / salary looks wrong” issues come from Settings. Open ',
            docLink('/admin/settings/attendance', 'Attendance rules'),
            ', ',
            docLink('/admin/settings/shifts', 'Shifts'),
            ', ',
            docLink('/admin/settings/payment', 'Payment rules'),
            ', and ',
            docLink('/admin/settings/cameras', 'Kiosk'),
            ' and set them before relying on live attendance or payroll.',
          ],
        ],
        list: [
          [
            docStrong('Kiosk → Timezone'),
            ' — Usually Asia/Kolkata for India. Controls “today” and late detection.',
          ],
          [
            docStrong('Attendance → Work start / end + grace'),
            ' — Defines late and early leave. Choose same-for-all or per-employee shifts.',
          ],
          [
            docStrong('Shifts'),
            ' — Create templates (Morning/Night + breaks) under Settings → Shifts; assign Mon–Sun on each employee when per-employee mode is on.',
          ],
          [
            docStrong('Attendance → Manual punch'),
            ' — Optional. Lets admins clock someone in or out from Live Attendance if the kiosk is down. Requires typing a confirmation phrase.',
          ],
          [
            docStrong('Attendance → Minimum clock-out wait'),
            ' — Stops accidental immediate clock-out after clock-in.',
          ],
          [
            docStrong('Payment → Weekly off, leave quota, calculation mode, pay day'),
            ' — Controls how monthly salary is generated.',
          ],
        ],
        tip: [
          'Need every field explained? Read the full ',
          docLink('/docs/settings', 'Settings guide'),
          '.',
        ],
      },
      {
        title: 'Shifts & manual punch (new)',
        span: 'full',
        paragraphs: [
          [
            'Two attendance tools you will use often after basic setup: ',
            docStrong('shift templates'),
            ' and ',
            docStrong('manual punch'),
            '.',
          ],
        ],
        list: [
          [
            'Open ',
            docLink('/admin/settings/shifts', 'Settings → Shifts'),
            ' to create Morning, Evening, or Night templates with start/end and optional breaks.',
          ],
          [
            'Under ',
            docLink('/admin/settings/attendance', 'Attendance rules'),
            ', pick ',
            docStrong('Per employee'),
            ', then assign Mon–Sun templates on each person’s profile.',
          ],
          [
            'Turn on ',
            docStrong('Manual attendance'),
            ' in Attendance rules. On ',
            docLink('/admin/attendance', 'Live Attendance'),
            ' (today only), use In / Out, pick a time (not in the future), and type ',
            docStrong('manual attendance approved'),
            ' to confirm.',
          ],
          'Prefer the kiosk for normal days. Use manual punch only when face scan is unavailable.',
        ],
        footer: [
          'Details: ',
          docLink('/docs/settings', 'Settings guide'),
          ' · ',
          docLink('/docs/attendance', 'Live Attendance'),
          '.',
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
          'New here? Start with the Dashboard, then configure Settings, then add employees, then set up the kiosk. You can always come back to this guide from the ',
          docStrong('Get Started'),
          ' menu.',
        ],
        footer: [
          'Next: ',
          docLink('/docs/settings', 'Settings guide'),
          ' · ',
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
          [
            'पहले ',
            docStrong('Settings'),
            ' कॉन्फ़िगर करें — टाइमज़ोन, कार्य समय, ग्रेस, साप्ताहिक छुट्टी, लीव और सैलरी गणना। हर विकल्प का मतलब: ',
            docLink('/docs/settings', 'Settings गाइड'),
            '।',
          ],
          'Employees सेक्शन में कर्मचारी जोड़ें।',
          'Salary सेक्शन में कर्मचारी वेतन सेट करें।',
          'कियोस्क टैबलेट कनेक्ट करें (Kiosk setup देखें)।',
          'हर कर्मचारी का चेहरा कियोस्क पर रजिस्टर करें।',
          'वैकल्पिक: जरूरत हो तो Settings में shift templates बनाएँ और manual punch चालू करें।',
          'डैशबोर्ड और Live Attendance पर हाजिरी देखें।',
          'Reports पेज से हाजिरी और पेरोल रिपोर्ट डाउनलोड करें।',
        ],
      },
      {
        title: 'सेटिंग्स कॉन्फ़िगर करें (ज़रूरी)',
        span: 'full',
        paragraphs: [
          [
            'ज़्यादातर “late / leave / salary गलत लगना” समस्याएँ Settings से आती हैं। लाइव हाजिरी या पेरोल पर भरोसा करने से पहले ',
            docLink('/admin/settings/attendance', 'Attendance rules'),
            ', ',
            docLink('/admin/settings/shifts', 'Shifts'),
            ', ',
            docLink('/admin/settings/payment', 'Payment rules'),
            ', और ',
            docLink('/admin/settings/cameras', 'Kiosk'),
            ' खोलकर सेट करें।',
          ],
        ],
        list: [
          [
            docStrong('Kiosk → Timezone'),
            ' — भारत के लिए आमतौर पर Asia/Kolkata। “आज” और लेट डिटेक्शन नियंत्रित करता है।',
          ],
          [
            docStrong('Attendance → Work start / end + grace'),
            ' — late और early leave तय करता है। same-for-all या per-employee शिफ्ट चुनें।',
          ],
          [
            docStrong('Shifts'),
            ' — Settings → Shifts में टेम्पलेट बनाएँ; per-employee मोड में कर्मचारी पर Mon–Sun असाइन करें।',
          ],
          [
            docStrong('Attendance → Manual punch'),
            ' — वैकल्पिक। कियोस्क न हो तो Live Attendance से In/Out। पुष्टि वाक्य टाइप करना ज़रूरी है।',
          ],
          [
            docStrong('Attendance → Minimum clock-out wait'),
            ' — क्लॉक-इन के तुरंत बाद आकस्मिक क्लॉक-आउट रोकता है।',
          ],
          [
            docStrong('Payment → Weekly off, leave quota, calculation mode, pay day'),
            ' — मासिक सैलरी कैसे बनेगी नियंत्रित करता है।',
          ],
        ],
        tip: [
          'हर फ़ील्ड की व्याख्या चाहिए? पूरी ',
          docLink('/docs/settings', 'Settings गाइड'),
          ' पढ़ें।',
        ],
      },
      {
        title: 'शिफ्ट और मैनुअल पंच (नया)',
        span: 'full',
        paragraphs: [
          [
            'बेसिक सेटअप के बाद अक्सर इस्तेमाल: ',
            docStrong('shift templates'),
            ' और ',
            docStrong('manual punch'),
            '।',
          ],
        ],
        list: [
          [
            docLink('/admin/settings/shifts', 'Settings → Shifts'),
            ' में Morning/Evening टेम्पलेट बनाएँ।',
          ],
          [
            docLink('/admin/settings/attendance', 'Attendance rules'),
            ' में ',
            docStrong('Per employee'),
            ' चुनें, फिर कर्मचारी प्रोफ़ाइल पर Mon–Sun असाइन करें।',
          ],
          [
            'Manual attendance चालू करें। ',
            docLink('/admin/attendance', 'Live Attendance'),
            ' (आज) पर In/Out से समय चुनें और ',
            docStrong('manual attendance approved'),
            ' टाइप करें।',
          ],
          'सामान्य दिनों में कियोस्क प्राथमिक रखें; मैनुअल पंच केवल जरूरत पर।',
        ],
        footer: [
          'विवरण: ',
          docLink('/docs/settings', 'Settings गाइड'),
          ' · ',
          docLink('/docs/attendance', 'Live Attendance'),
          '।',
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
          'नए हैं? पहले डैशबोर्ड, फिर Settings, फिर कर्मचारी, फिर कियोस्क। इस गाइड पर वापस ',
          docStrong('Get Started'),
          ' मेनू से आ सकते हैं।',
        ],
        footer: [
          'आगे: ',
          docLink('/docs/settings', 'Settings गाइड'),
          ' · ',
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
          [
            'ആദ്യം ',
            docStrong('Settings'),
            ' ക്രമീകരിക്കുക — ടൈംസോൺ, ജോലി സമയം, ഗ്രേസ്, ആഴ്ച അവധി, ലീവ്, ശമ്പള കണക്കുകൂട്ടൽ. ഓരോ ഓപ്ഷന്റെയും അർത്ഥം: ',
            docLink('/docs/settings', 'Settings ഗൈഡ്'),
            '.',
          ],
          'Employees വിഭാഗത്തിൽ ജീവനക്കാരെ ചേർക്കുക.',
          'Salary വിഭാഗത്തിൽ ജീവനക്കാരുടെ ശമ്പളം സെറ്റ് ചെയ്യുക.',
          'കിയോസ്ക് ടാബ്ലെറ്റ് കണക്റ്റ് ചെയ്യുക (Kiosk setup കാണുക).',
          'ഓരോ ജീവനക്കാരുടെയും മുഖം കിയോസ്കിൽ രജിസ്റ്റർ ചെയ്യുക.',
          'ഓപ്ഷണൽ: ആവശ്യമെങ്കിൽ Settings-ൽ shift templates ഉണ്ടാക്കി manual punch ഓണാക്കുക.',
          'ഡാഷ്‌ബോർഡിലും Live Attendance-ലും ഹാജർ നിരീക്ഷിക്കുക.',
          'Reports പേജിൽ നിന്ന് ഹാജർ, പേറോൾ റിപ്പോർട്ടുകൾ ഡൗൺലോഡ് ചെയ്യുക.',
        ],
      },
      {
        title: 'Settings ക്രമീകരിക്കുക (പ്രധാനം)',
        span: 'full',
        paragraphs: [
          [
            'മിക്ക “late / leave / salary തെറ്റായി തോന്നുന്നു” പ്രശ്നങ്ങളും Settings-ൽ നിന്നാണ്. ലൈവ് ഹാജറിലോ പേറോളിലോ ആശ്രയിക്കുന്നതിന് മുമ്പ് ',
            docLink('/admin/settings/attendance', 'Attendance rules'),
            ', ',
            docLink('/admin/settings/shifts', 'Shifts'),
            ', ',
            docLink('/admin/settings/payment', 'Payment rules'),
            ', കൂടാതെ ',
            docLink('/admin/settings/cameras', 'Kiosk'),
            ' തുറന്ന് സെറ്റ് ചെയ്യുക.',
          ],
        ],
        list: [
          [
            docStrong('Kiosk → Timezone'),
            ' — ഇന്ത്യയ്ക്ക് സാധാരണ Asia/Kolkata. “ഇന്ന്”യും ലേറ്റ് ഡിറ്റക്ഷനും നിയന്ത്രിക്കുന്നു.',
          ],
          [
            docStrong('Attendance → Work start / end + grace'),
            ' — late / early leave നിർണയിക്കുന്നു. same-for-all അല്ലെങ്കിൽ per-employee ഷിഫ്റ്റ് തിരഞ്ഞെടുക്കുക.',
          ],
          [
            docStrong('Shifts'),
            ' — Settings → Shifts-ൽ ടെംപ്ലേറ്റ് ഉണ്ടാക്കുക; per-employee മോഡിൽ Mon–Sun നൽകുക.',
          ],
          [
            docStrong('Attendance → Manual punch'),
            ' — ഓപ്ഷണൽ. കിയോസ്ക് ലഭ്യമല്ലെങ്കിൽ Live Attendance-ൽ In/Out. സ്ഥിരീകരണ വാക്യം ടൈപ്പ് ചെയ്യണം.',
          ],
          [
            docStrong('Attendance → Minimum clock-out wait'),
            ' — ക്ലോക്ക്-ഇന് ശേഷമുള്ള ആകസ്മിക ഉടൻ ക്ലോക്ക്-ഔട്ട് തടയുന്നു.',
          ],
          [
            docStrong('Payment → Weekly off, leave quota, calculation mode, pay day'),
            ' — മാസ ശമ്പളം എങ്ങനെ ജനറേറ്റ് ചെയ്യപ്പെടുന്നു നിയന്ത്രിക്കുന്നു.',
          ],
        ],
        tip: [
          'ഓരോ ഫീൽഡും വിശദീകരിക്കണോ? പൂർണ്ണ ',
          docLink('/docs/settings', 'Settings ഗൈഡ്'),
          ' വായിക്കുക.',
        ],
      },
      {
        title: 'ഷിഫ്റ്റും മാനുവൽ പഞ്ചും (പുതിയത്)',
        span: 'full',
        paragraphs: [
          [
            'അടിസ്ഥാന സെറ്റപ്പിന് ശേഷം പതിവായി ഉപയോഗിക്കുന്നവ: ',
            docStrong('shift templates'),
            ', ',
            docStrong('manual punch'),
            '.',
          ],
        ],
        list: [
          [
            docLink('/admin/settings/shifts', 'Settings → Shifts'),
            '-ൽ Morning/Evening ടെംപ്ലേറ്റ് ഉണ്ടാക്കുക.',
          ],
          [
            docLink('/admin/settings/attendance', 'Attendance rules'),
            '-ൽ ',
            docStrong('Per employee'),
            ' തിരഞ്ഞെടുത്ത് ജീവനക്കാരുടെ പ്രൊഫൈലിൽ Mon–Sun നൽകുക.',
          ],
          [
            'Manual attendance ഓണാക്കുക. ',
            docLink('/admin/attendance', 'Live Attendance'),
            ' (ഇന്ന്) In/Out ഉപയോഗിച്ച് സമയം തിരഞ്ഞെടുത്ത് ',
            docStrong('manual attendance approved'),
            ' ടൈപ്പ് ചെയ്യുക.',
          ],
          'സാധാരണ ദിവസങ്ങളിൽ കിയോസ്ക് മുൻഗണന; മാനുവൽ പഞ്ച് ആവശ്യമുള്ളപ്പോൾ മാത്രം.',
        ],
        footer: [
          'വിശദാംശം: ',
          docLink('/docs/settings', 'Settings ഗൈഡ്'),
          ' · ',
          docLink('/docs/attendance', 'Live Attendance'),
          '.',
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
          'പുതിയവരാണോ? ആദ്യം ഡാഷ്‌ബോർഡ്, പിന്നെ Settings, പിന്നെ ജീവനക്കാർ, പിന്നെ കിയോസ്ക്. ഈ ഗൈഡിലേക്ക് ',
          docStrong('Get Started'),
          ' മെനുവിൽ നിന്ന് എപ്പോഴും തിരിച്ച് വരാം.',
        ],
        footer: [
          'അടുത്തത്: ',
          docLink('/docs/settings', 'Settings ഗൈഡ്'),
          ' · ',
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
          [
            'ಮೊದಲು ',
            docStrong('Settings'),
            ' ಹೊಂದಿಸಿ — ಟೈಮ್‌ಝೋನ್, ಕೆಲಸದ ಸಮಯ, ಗ್ರೇಸ್, ವಾರದ ರಜೆ, ಲೀವ್ ಮತ್ತು ಸಂಬಳ ಲೆಕ್ಕಾಚಾರ. ಪ್ರತಿ ಆಯ್ಕೆಯ ಅರ್ಥ: ',
            docLink('/docs/settings', 'Settings ಮಾರ್ಗದರ್ಶಿ'),
            '.',
          ],
          'Employees ವಿಭಾಗದಲ್ಲಿ ಉದ್ಯೋಗಿಗಳನ್ನು ಸೇರಿಸಿ.',
          'Salary ವಿಭಾಗದಲ್ಲಿ ಉದ್ಯೋಗಿ ಸಂಬಳ ಹೊಂದಿಸಿ.',
          'ಕಿಯೋಸ್ಕ್ ಟ್ಯಾಬ್ಲೆಟ್ ಸಂಪರ್ಕಿಸಿ (Kiosk setup ನೋಡಿ).',
          'ಪ್ರತಿ ಉದ್ಯೋಗಿಯ ಮುಖವನ್ನು ಕಿಯೋಸ್ಕ್‌ನಲ್ಲಿ ನೋಂದಾಯಿಸಿ.',
          'ಐಚ್ಛಿಕ: ಅಗತ್ಯವಿದ್ದರೆ Settings ನಲ್ಲಿ shift templates ರಚಿಸಿ ಮತ್ತು manual punch ಆನ್ ಮಾಡಿ.',
          'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಮತ್ತು Live Attendance ನಲ್ಲಿ ಹಾಜರಾತಿ ನೋಡಿ.',
          'Reports ಪುಟದಿಂದ ಹಾಜರಾತಿ ಮತ್ತು ಪೇರೋಲ್ ವರದಿಗಳನ್ನು ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.',
        ],
      },
      {
        title: 'Settings ಹೊಂದಿಸಿ (ಮುಖ್ಯ)',
        span: 'full',
        paragraphs: [
          [
            'ಹೆಚ್ಚಿನ “late / leave / salary ತಪ್ಪಾಗಿ ಕಾಣುವ” ಸಮಸ್ಯೆಗಳು Settings ನಿಂದ ಬರುತ್ತವೆ. ಲೈವ್ ಹಾಜರಾತಿ ಅಥವಾ ಪೇರೋಲ್ ಮೇಲೆ ಅವಲಂಬಿಸುವ ಮೊದಲು ',
            docLink('/admin/settings/attendance', 'Attendance rules'),
            ', ',
            docLink('/admin/settings/shifts', 'Shifts'),
            ', ',
            docLink('/admin/settings/payment', 'Payment rules'),
            ', ಮತ್ತು ',
            docLink('/admin/settings/cameras', 'Kiosk'),
            ' ತೆರೆದು ಹೊಂದಿಸಿ.',
          ],
        ],
        list: [
          [
            docStrong('Kiosk → Timezone'),
            ' — ಭಾರತಕ್ಕೆ ಸಾಮಾನ್ಯವಾಗಿ Asia/Kolkata. “ಇಂದು” ಮತ್ತು ಲೇಟ್ ಡಿಟೆಕ್ಷನ್ ನಿಯಂತ್ರಿಸುತ್ತದೆ.',
          ],
          [
            docStrong('Attendance → Work start / end + grace'),
            ' — late / early leave ನಿರ್ಧರಿಸುತ್ತದೆ. same-for-all ಅಥವಾ per-employee ಶಿಫ್ಟ್ ಆಯ್ಕೆಮಾಡಿ.',
          ],
          [
            docStrong('Shifts'),
            ' — Settings → Shifts ನಲ್ಲಿ ಟೆಂಪ್ಲೇಟ್ ರಚಿಸಿ; per-employee ಮೋಡ್‌ನಲ್ಲಿ Mon–Sun ನಿಗದಿಪಡಿಸಿ.',
          ],
          [
            docStrong('Attendance → Manual punch'),
            ' — ಐಚ್ಛಿಕ. ಕಿಯೋಸ್ಕ್ ಇಲ್ಲದಿದ್ದರೆ Live Attendance ನಲ್ಲಿ In/Out. ದೃಢೀಕರಣ ವಾಕ್ಯ ಟೈಪ್ ಮಾಡಬೇಕು.',
          ],
          [
            docStrong('Attendance → Minimum clock-out wait'),
            ' — ಕ್ಲಾಕ್-ಇನ್ ನಂತರ ಆಕಸ್ಮಿಕ ತಕ್ಷಣ ಕ್ಲಾಕ್-ಔಟ್ ತಡೆಯುತ್ತದೆ.',
          ],
          [
            docStrong('Payment → Weekly off, leave quota, calculation mode, pay day'),
            ' — ಮಾಸಿಕ ಸಂಬಳ ಹೇಗೆ ರಚನೆಯಾಗುತ್ತದೆ ನಿಯಂತ್ರಿಸುತ್ತದೆ.',
          ],
        ],
        tip: [
          'ಪ್ರತಿ ಫೀಲ್ಡ್ ವಿವರ ಬೇಕೇ? ಪೂರ್ಣ ',
          docLink('/docs/settings', 'Settings ಮಾರ್ಗದರ್ಶಿ'),
          ' ಓದಿ.',
        ],
      },
      {
        title: 'ಶಿಫ್ಟ್ ಮತ್ತು ಮ್ಯಾನುವಲ್ ಪಂಚ್ (ಹೊಸದು)',
        span: 'full',
        paragraphs: [
          [
            'ಮೂಲ ಸೆಟಪ್ ನಂತರ ಆಗಾಗ್ಗೆ ಬಳಸುವವು: ',
            docStrong('shift templates'),
            ' ಮತ್ತು ',
            docStrong('manual punch'),
            '.',
          ],
        ],
        list: [
          [
            docLink('/admin/settings/shifts', 'Settings → Shifts'),
            ' ನಲ್ಲಿ Morning/Evening ಟೆಂಪ್ಲೇಟ್ ರಚಿಸಿ.',
          ],
          [
            docLink('/admin/settings/attendance', 'Attendance rules'),
            ' ನಲ್ಲಿ ',
            docStrong('Per employee'),
            ' ಆಯ್ಕೆಮಾಡಿ, ನಂತರ ಉದ್ಯೋಗಿ ಪ್ರೊಫೈಲ್‌ನಲ್ಲಿ Mon–Sun ನಿಗದಿಪಡಿಸಿ.',
          ],
          [
            'Manual attendance ಆನ್ ಮಾಡಿ. ',
            docLink('/admin/attendance', 'Live Attendance'),
            ' (ಇಂದು) In/Out ಬಳಸಿ ಸಮಯ ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ',
            docStrong('manual attendance approved'),
            ' ಟೈಪ್ ಮಾಡಿ.',
          ],
          'ಸಾಮಾನ್ಯ ದಿನಗಳಲ್ಲಿ ಕಿಯೋಸ್ಕ್ ಆದ್ಯತೆ; ಮ್ಯಾನುವಲ್ ಪಂಚ್ ಅಗತ್ಯವಿದ್ದಾಗ ಮಾತ್ರ.',
        ],
        footer: [
          'ವಿವರ: ',
          docLink('/docs/settings', 'Settings ಮಾರ್ಗದರ್ಶಿ'),
          ' · ',
          docLink('/docs/attendance', 'Live Attendance'),
          '.',
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
          'ಹೊಸಬರೇ? ಮೊದಲು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್, ನಂತರ Settings, ನಂತರ ಉದ್ಯೋಗಿಗಳು, ನಂತರ ಕಿಯೋಸ್ಕ್. ಈ ಮಾರ್ಗದರ್ಶಿಗೆ ',
          docStrong('Get Started'),
          ' ಮೆನುವಿನಿಂದ ಯಾವಾಗಲೂ ಹಿಂತಿರುಗಬಹುದು.',
        ],
        footer: [
          'ಮುಂದೆ: ',
          docLink('/docs/settings', 'Settings ಮಾರ್ಗದರ್ಶಿ'),
          ' · ',
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
