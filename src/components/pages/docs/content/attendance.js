import { docLink, docStrong } from '../docsI18n';

export const attendanceContent = {
  en: {
    pageTitle: 'Live Attendance',
    pageSubtitle: 'See who is in, who is late, and who has left — for any day.',
    sections: [
      {
        title: 'What this page is for',
        paragraphs: [
          [
            docLink('/admin/attendance', 'Live Attendance'),
            ' shows real-time clock-in and clock-out activity. Use it during the day to see who is on site.',
          ],
        ],
      },
      {
        title: 'How to use it',
        list: [
          'Pick a date — today or any past day.',
          'Search for someone by name or employee code.',
          'Filter by status: Present, Late, Absent, Scheduled off, or Clocked Out.',
          "Click a person's row to open their profile.",
          'Press Refresh to get the latest updates.',
        ],
      },
      {
        title: 'What each part shows',
        list: [
          'Live activity — recent clock-in and clock-out events.',
          'Summary numbers — present, absent, late, and total staff count.',
          'Staff table — status, shift label, clock-in time, and hours.',
          'Attendance timeline — markers for each punch; use Play to replay the day in order.',
        ],
      },
      {
        title: 'Manual punch in / out',
        span: 'full',
        paragraphs: [
          [
            'Enable ',
            docStrong('Manual attendance'),
            ' under ',
            docLink('/admin/settings/attendance', 'Settings → Attendance rules'),
            '. Then, on ',
            docStrong('today'),
            ' only, the table shows In / Out actions.',
          ],
        ],
        list: [
          'Choose In or Out for that employee.',
          'Pick the punch time (cannot be in the future).',
          [
            'Type ',
            docStrong('manual attendance approved'),
            ' exactly, then confirm.',
          ],
          'Prefer the kiosk for normal days. Use this when face scan is unavailable.',
        ],
      },
      {
        title: 'Shifts on this page',
        list: [
          [
            'The Shift column shows the person’s scheduled hours for the day (from org hours or ',
            docLink('/docs/settings', 'shift templates'),
            ').',
          ],
          'If a punch does not match the scheduled shift (off day, before start, after end, late), a toast alert summarizes those mismatches for admins.',
        ],
        tip: [
          'Set up templates under ',
          docLink('/admin/settings/shifts', 'Settings → Shifts'),
          ' and assign Mon–Sun on each employee when using per-employee mode.',
        ],
      },
      {
        title: 'Good to know',
        paragraphs: [
          'If no one has used the kiosk yet, you may see sample data as a preview. Real records appear once staff start clocking in.',
        ],
        footer: [
          'Also see: ',
          docLink('/docs/getting-started', 'Getting started'),
          ' · ',
          docLink('/docs/settings', 'Settings'),
          ' · ',
          docLink('/docs/dashboard', 'Dashboard'),
          ' · ',
          docLink('/docs/analytics', 'Analytics'),
        ],
      },
    ],
  },
  hi: {
    pageTitle: 'Live Attendance',
    pageSubtitle: 'किसी भी दिन देखें कौन मौजूद है, कौन देर से है और कौन जा चुका है।',
    sections: [
      {
        title: 'यह पेज किस लिए है',
        paragraphs: [
          [
            docLink('/admin/attendance', 'Live Attendance'),
            ' वास्तविक समय की clock-in और clock-out गतिविधि दिखाता है। दिन में इसका उपयोग करके देखें कि साइट पर कौन मौजूद है।',
          ],
        ],
      },
      {
        title: 'इसे कैसे इस्तेमाल करें',
        list: [
          'कोई तारीख चुनें — आज या पिछला कोई भी दिन।',
          'नाम या कर्मचारी कोड से किसी व्यक्ति को खोजें।',
          'स्थिति से फिल्टर करें: Present, Late, Absent, Scheduled off, या Clocked Out.',
          'किसी व्यक्ति की पंक्ति पर क्लिक करके उसकी प्रोफाइल खोलें।',
          'नवीनतम अपडेट पाने के लिए Refresh दबाएँ।',
        ],
      },
      {
        title: 'हर भाग क्या दिखाता है',
        list: [
          'Live activity — हाल के clock-in और clock-out इवेंट।',
          'Summary numbers — उपस्थित, अनुपस्थित, देर से आए और कुल स्टाफ संख्या।',
          'Staff table — स्थिति, शिफ्ट, clock-in समय और घंटे।',
          'Attendance timeline — पंच मार्कर; Play से दिन क्रम से देखें।',
        ],
      },
      {
        title: 'मैनुअल पंच इन / आउट',
        span: 'full',
        paragraphs: [
          [
            docLink('/admin/settings/attendance', 'Settings → Attendance rules'),
            ' में ',
            docStrong('Manual attendance'),
            ' चालू करें। फिर केवल ',
            docStrong('आज'),
            ' की टेबल में In / Out दिखता है।',
          ],
        ],
        list: [
          'कर्मचारी के लिए In या Out चुनें।',
          'पंच समय चुनें (भविष्य का समय नहीं)।',
          [
            'ठीक ',
            docStrong('manual attendance approved'),
            ' टाइप करके पुष्टि करें।',
          ],
          'सामान्य दिनों में कियोस्क प्राथमिक; फेस स्कैन न हो तब मैनुअल उपयोग करें।',
        ],
      },
      {
        title: 'इस पेज पर शिफ्ट',
        list: [
          'Shift कॉलम दिन का निर्धारित समय दिखाता है।',
          'शिफ्ट से मेल न खाने वाले पंच पर एडमिन को टोस्ट अलर्ट मिलता है।',
        ],
        tip: [
          docLink('/admin/settings/shifts', 'Settings → Shifts'),
          ' में टेम्पलेट बनाएँ; per-employee मोड में Mon–Sun असाइन करें।',
        ],
      },
      {
        title: 'जानने योग्य बातें',
        paragraphs: [
          'अगर अभी तक किसी ने कियोस्क इस्तेमाल नहीं किया है, तो पूर्वावलोकन के रूप में नमूना डेटा दिख सकता है। असली रिकॉर्ड तब दिखते हैं जब स्टाफ clock in करना शुरू करते हैं।',
        ],
        footer: [
          'यह भी देखें: ',
          docLink('/docs/getting-started', 'Getting started'),
          ' · ',
          docLink('/docs/settings', 'Settings'),
          ' · ',
          docLink('/docs/dashboard', 'Dashboard'),
          ' · ',
          docLink('/docs/analytics', 'Analytics'),
        ],
      },
    ],
  },
  ml: {
    pageTitle: 'Live Attendance',
    pageSubtitle: 'ഏത് ദിവസത്തേക്കും ആരുണ്ട്, ആരാണ് വൈകിയത്, ആരാണ് പോയത് എന്ന് കാണുക.',
    sections: [
      {
        title: 'ഈ പേജ് എന്തിനാണ്',
        paragraphs: [
          [
            docLink('/admin/attendance', 'Live Attendance'),
            ' യഥാർത്ഥ സമയത്തെ clock-in, clock-out പ്രവർത്തനം കാണിക്കുന്നു. ദിവസത്തിൽ ആരൊക്കെ സ്ഥലത്തുണ്ടെന്ന് കാണാൻ ഇത് ഉപയോഗിക്കുക.',
          ],
        ],
      },
      {
        title: 'എങ്ങനെ ഉപയോഗിക്കാം',
        list: [
          'ഒരു തീയതി തിരഞ്ഞെടുക്കുക — ഇന്ന് അല്ലെങ്കിൽ കഴിഞ്ഞ ഏതെങ്കിലും ദിവസം.',
          'പേര് അല്ലെങ്കിൽ employee code ഉപയോഗിച്ച് ഒരാളെ തിരയുക.',
          'സ്ഥിതി പ്രകാരം ഫിൽട്ടർ ചെയ്യുക: Present, Late, Absent, Scheduled off, അല്ലെങ്കിൽ Clocked Out.',
          'ആ വ്യക്തിയുടെ പ്രൊഫൈൽ തുറക്കാൻ വരിയിൽ ക്ലിക്ക് ചെയ്യുക.',
          'പുതിയ അപ്ഡേറ്റുകൾ ലഭിക്കാൻ Refresh അമർത്തുക.',
        ],
      },
      {
        title: 'ഓരോ ഭാഗവും എന്താണ് കാണിക്കുന്നത്',
        list: [
          'Live activity — അടുത്തിടെ നടന്ന clock-in, clock-out ഇവന്റുകൾ.',
          'Summary numbers — ഹാജർ, അഭാവം, വൈകിയെത്തൽ, മൊത്തം സ്റ്റാഫ് എണ്ണം.',
          'Staff table — നില, ഷിഫ്റ്റ്, clock-in സമയം, മണിക്കൂർ.',
          'Attendance timeline — പഞ്ച് മാർക്കറുകൾ; Play കൊണ്ട് ദിവസം ക്രമത്തിൽ കാണുക.',
        ],
      },
      {
        title: 'മാനുവൽ പഞ്ച് ഇൻ / ഔട്ട്',
        span: 'full',
        paragraphs: [
          [
            docLink('/admin/settings/attendance', 'Settings → Attendance rules'),
            '-ൽ ',
            docStrong('Manual attendance'),
            ' ഓണാക്കുക. പിന്നെ ',
            docStrong('ഇന്ന്'),
            ' മാത്രം ടേബിളിൽ In / Out കാണും.',
          ],
        ],
        list: [
          'ജീവനക്കാരന് In അല്ലെങ്കിൽ Out തിരഞ്ഞെടുക്കുക.',
          'പഞ്ച് സമയം തിരഞ്ഞെടുക്കുക (ഭാവി സമയമാകരുത്).',
          [
            'കൃത്യമായി ',
            docStrong('manual attendance approved'),
            ' ടൈപ്പ് ചെയ്ത് സ്ഥിരീകരിക്കുക.',
          ],
          'സാധാരണ ദിവസങ്ങളിൽ കിയോസ്ക് മുൻഗണന; ഫേസ് സ്കാൻ ലഭ്യമല്ലെങ്കിൽ മാനുവൽ ഉപയോഗിക്കുക.',
        ],
      },
      {
        title: 'ഈ പേജിലെ ഷിഫ്റ്റ്',
        list: [
          'Shift കോളം ദിവസത്തിന്റെ ഷെഡ്യൂൾഡ് സമയം കാണിക്കുന്നു.',
          'ഷിഫ്റ്റുമായി പൊരുത്തപ്പെടാത്ത പഞ്ചുകൾക്ക് അഡ്മിന് ടോസ്റ്റ് അലേർട്ട് ലഭിക്കും.',
        ],
        tip: [
          docLink('/admin/settings/shifts', 'Settings → Shifts'),
          '-ൽ ടെംപ്ലേറ്റ് ഉണ്ടാക്കുക; per-employee മോഡിൽ Mon–Sun നൽകുക.',
        ],
      },
      {
        title: 'അറിയേണ്ടത്',
        paragraphs: [
          'ഇതുവരെ ആരും കിയോസ്ക് ഉപയോഗിച്ചിട്ടില്ലെങ്കിൽ, പ്രിവ്യൂ ആയി സാമ്പിൾ ഡാറ്റ കാണാം. സ്റ്റാഫ് clock in ചെയ്യാൻ തുടങ്ങുമ്പോൾ യഥാർത്ഥ രേഖകൾ കാണും.',
        ],
        footer: [
          'ഇതും കാണുക: ',
          docLink('/docs/getting-started', 'Getting started'),
          ' · ',
          docLink('/docs/settings', 'Settings'),
          ' · ',
          docLink('/docs/dashboard', 'Dashboard'),
          ' · ',
          docLink('/docs/analytics', 'Analytics'),
        ],
      },
    ],
  },
  kn: {
    pageTitle: 'Live Attendance',
    pageSubtitle: 'ಯಾವುದೇ ದಿನಕ್ಕೆ ಯಾರು ಒಳಗಿದ್ದಾರೆ, ಯಾರು ತಡವಾಗಿ ಬಂದಿದ್ದಾರೆ, ಯಾರು ಹೊರಟಿದ್ದಾರೆ ಎಂದು ನೋಡಿ.',
    sections: [
      {
        title: 'ಈ ಪುಟದ ಉದ್ದೇಶ',
        paragraphs: [
          [
            docLink('/admin/attendance', 'Live Attendance'),
            ' ನೈಜ ಸಮಯದ clock-in ಮತ್ತು clock-out ಚಟುವಟಿಕೆಯನ್ನು ತೋರಿಸುತ್ತದೆ. ದಿನದಲ್ಲಿ ಯಾರು ಸ್ಥಳದಲ್ಲಿದ್ದಾರೆ ಎಂದು ನೋಡಲು ಇದನ್ನು ಬಳಸಿ.',
          ],
        ],
      },
      {
        title: 'ಇದನ್ನು ಹೇಗೆ ಬಳಸುವುದು',
        list: [
          'ಒಂದು ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ — ಇಂದು ಅಥವಾ ಹಿಂದಿನ ಯಾವುದೇ ದಿನ.',
          'ಹೆಸರು ಅಥವಾ employee code ಮೂಲಕ ಯಾರನ್ನಾದರೂ ಹುಡುಕಿ.',
          'ಸ್ಥಿತಿ ಮೂಲಕ ಫಿಲ್ಟರ್ ಮಾಡಿ: Present, Late, Absent, Scheduled off, ಅಥವಾ Clocked Out.',
          'ವ್ಯಕ್ತಿಯ ಸಾಲನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ಅವರ ಪ್ರೊಫೈಲ್ ತೆರೆಯಿರಿ.',
          'ಇತ್ತೀಚಿನ ಅಪ್ಡೇಟ್‌ಗಳಿಗೆ Refresh ಒತ್ತಿ.',
        ],
      },
      {
        title: 'ಪ್ರತಿ ಭಾಗ ಏನು ತೋರಿಸುತ್ತದೆ',
        list: [
          'Live activity — ಇತ್ತೀಚಿನ clock-in ಮತ್ತು clock-out ಘಟನೆಗಳು.',
          'Summary numbers — ಹಾಜರು, ಗೈರುಹಾಜರು, ತಡ, ಮತ್ತು ಒಟ್ಟು ಸಿಬ್ಬಂದಿ ಸಂಖ್ಯೆ.',
          'Staff table — ಸ್ಥಿತಿ, ಶಿಫ್ಟ್, clock-in ಸಮಯ ಮತ್ತು ಗಂಟೆಗಳು.',
          'Attendance timeline — ಪಂಚ್ ಮಾರ್ಕರ್‌ಗಳು; Play ನಿಂದ ದಿನವನ್ನು ಕ್ರಮದಲ್ಲಿ ನೋಡಿ.',
        ],
      },
      {
        title: 'ಮ್ಯಾನುವಲ್ ಪಂಚ್ ಇನ್ / ಔಟ್',
        span: 'full',
        paragraphs: [
          [
            docLink('/admin/settings/attendance', 'Settings → Attendance rules'),
            ' ನಲ್ಲಿ ',
            docStrong('Manual attendance'),
            ' ಆನ್ ಮಾಡಿ. ನಂತರ ',
            docStrong('ಇಂದು'),
            ' ಮಾತ್ರ ಟೇಬಲ್‌ನಲ್ಲಿ In / Out ಕಾಣುತ್ತದೆ.',
          ],
        ],
        list: [
          'ಉದ್ಯೋಗಿಗೆ In ಅಥವಾ Out ಆಯ್ಕೆಮಾಡಿ.',
          'ಪಂಚ್ ಸಮಯ ಆಯ್ಕೆಮಾಡಿ (ಭವಿಷ್ಯದ ಸಮಯವಲ್ಲ).',
          [
            'ನಿಖರವಾಗಿ ',
            docStrong('manual attendance approved'),
            ' ಟೈಪ್ ಮಾಡಿ ದೃಢೀಕರಿಸಿ.',
          ],
          'ಸಾಮಾನ್ಯ ದಿನಗಳಲ್ಲಿ ಕಿಯೋಸ್ಕ್ ಆದ್ಯತೆ; ಫೇಸ್ ಸ್ಕ್ಯಾನ್ ಇಲ್ಲದಿದ್ದಾಗ ಮ್ಯಾನುವಲ್ ಬಳಸಿ.',
        ],
      },
      {
        title: 'ಈ ಪುಟದಲ್ಲಿ ಶಿಫ್ಟ್',
        list: [
          'Shift ಕಾಲಮ್ ದಿನದ ನಿಗದಿತ ಸಮಯವನ್ನು ತೋರಿಸುತ್ತದೆ.',
          'ಶಿಫ್ಟ್‌ಗೆ ಹೊಂದದ ಪಂಚ್‌ಗಳಿಗೆ ಅಡ್ಮಿನ್‌ಗೆ ಟೋಸ್ಟ್ ಅಲರ್ಟ್ ಬರುತ್ತದೆ.',
        ],
        tip: [
          docLink('/admin/settings/shifts', 'Settings → Shifts'),
          ' ನಲ್ಲಿ ಟೆಂಪ್ಲೇಟ್ ರಚಿಸಿ; per-employee ಮೋಡ್‌ನಲ್ಲಿ Mon–Sun ನಿಗದಿಪಡಿಸಿ.',
        ],
      },
      {
        title: 'ತಿಳಿದುಕೊಳ್ಳಬೇಕಾದವು',
        paragraphs: [
          'ಇನ್ನೂ ಯಾರೂ ಕಿಯೋಸ್ಕ್ ಬಳಸಿಲ್ಲದಿದ್ದರೆ, ಪೂರ್ವವೀಕ್ಷಣೆಯಾಗಿ ಮಾದರಿ ಡೇಟಾ ಕಾಣಬಹುದು. ಸಿಬ್ಬಂದಿ clock in ಮಾಡಲು ಪ್ರಾರಂಭಿಸಿದ ನಂತರ ನಿಜವಾದ ದಾಖಲೆಗಳು ಕಾಣುತ್ತವೆ.',
        ],
        footer: [
          'ಇದನ್ನೂ ನೋಡಿ: ',
          docLink('/docs/getting-started', 'Getting started'),
          ' · ',
          docLink('/docs/settings', 'Settings'),
          ' · ',
          docLink('/docs/dashboard', 'Dashboard'),
          ' · ',
          docLink('/docs/analytics', 'Analytics'),
        ],
      },
    ],
  },
};
