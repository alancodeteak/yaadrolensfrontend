import { docLink, docStrong } from '../docsI18n';

export const dashboardContent = {
  en: {
    pageTitle: 'Dashboard',
    pageSubtitle: "Your home screen — see today's numbers at a glance.",
    sections: [
      {
        title: 'What you will see',
        paragraphs: [
          [
            'The ',
            docLink('/admin/dashboard', 'Dashboard'),
            " gives you a quick picture of your team, today's attendance, and anything that needs your attention.",
          ],
        ],
      },
      {
        title: 'Top cards',
        subtitle: 'Four summary boxes',
        list: [
          'Workforce — how many staff you have, new joiners this month, and face registration status.',
          'Today — who is present, absent, or late right now. Tap any number to see more detail.',
          'Actions — staff who still need face registration, missing profile details, or kiosk setup.',
          'Holidays — public holidays in India for today and upcoming dates (for your information).',
        ],
      },
      {
        title: 'Calendar and activity',
        list: [
          'This month — a calendar showing each day. Green means everyone was present. Orange means some people were absent.',
          'Activity — circles showing present rate, monthly attendance, and on-time arrival.',
          'Recent activity — the latest clock-in and clock-out times for today.',
        ],
        paragraphs: [
          'If you are new, you may see sample numbers until real attendance data comes in from the kiosk.',
        ],
      },
      {
        title: 'Where to go next',
        list: [
          ['Check who is in today — ', docLink('/docs/attendance', 'Live Attendance')],
          ['Manage staff — ', docLink('/docs/employees', 'Employees')],
          ['View monthly trends — ', docLink('/docs/analytics', 'Analytics')],
        ],
      },
    ],
  },
  hi: {
    pageTitle: 'Dashboard',
    pageSubtitle: 'आपकी होम स्क्रीन — आज के आँकड़े एक नजर में देखें।',
    sections: [
      {
        title: 'आपको क्या दिखेगा',
        paragraphs: [
          [
            docLink('/admin/dashboard', 'Dashboard'),
            ' आपकी टीम, आज की हाजिरी और ध्यान देने वाली बातों की तेज झलक देता है।',
          ],
        ],
      },
      {
        title: 'ऊपर के कार्ड',
        subtitle: 'चार सारांश बॉक्स',
        list: [
          'Workforce — आपके पास कितने स्टाफ हैं, इस महीने नए जुड़ने वाले लोग, और फेस रजिस्ट्रेशन की स्थिति।',
          'Today — अभी कौन मौजूद, अनुपस्थित या देर से है। अधिक जानकारी के लिए किसी भी संख्या पर टैप करें।',
          'Actions — जिन स्टाफ का फेस रजिस्ट्रेशन बाकी है, प्रोफाइल जानकारी अधूरी है, या कियोस्क सेटअप चाहिए।',
          'Holidays — आज और आने वाली तारीखों के लिए भारत की सार्वजनिक छुट्टियाँ (आपकी जानकारी के लिए)।',
        ],
      },
      {
        title: 'कैलेंडर और गतिविधि',
        list: [
          'This month — हर दिन दिखाने वाला कैलेंडर। हरा मतलब सभी उपस्थित थे। नारंगी मतलब कुछ लोग अनुपस्थित थे।',
          'Activity — उपस्थिति दर, मासिक हाजिरी और समय पर आने की स्थिति दिखाने वाले सर्कल।',
          'Recent activity — आज के सबसे नए clock-in और clock-out समय।',
        ],
        paragraphs: [
          'अगर आप नए हैं, तो कियोस्क से वास्तविक हाजिरी डेटा आने तक नमूना आँकड़े दिख सकते हैं।',
        ],
      },
      {
        title: 'आगे कहाँ जाएँ',
        list: [
          ['आज कौन अंदर है देखें — ', docLink('/docs/attendance', 'Live Attendance')],
          ['स्टाफ प्रबंधित करें — ', docLink('/docs/employees', 'Employees')],
          ['मासिक रुझान देखें — ', docLink('/docs/analytics', 'Analytics')],
        ],
      },
    ],
  },
  ml: {
    pageTitle: 'Dashboard',
    pageSubtitle: 'നിങ്ങളുടെ ഹോം സ്ക്രീൻ — ഇന്നത്തെ കണക്കുകൾ ഒറ്റനോട്ടത്തിൽ കാണാം.',
    sections: [
      {
        title: 'എന്താണ് കാണുക',
        paragraphs: [
          [
            docLink('/admin/dashboard', 'Dashboard'),
            ' നിങ്ങളുടെ ടീമിനെയും ഇന്നത്തെ ഹാജറിനെയും ശ്രദ്ധിക്കേണ്ട കാര്യങ്ങളെയും കുറിച്ചുള്ള വേഗത്തിലുള്ള ചിത്രം നൽകുന്നു.',
          ],
        ],
      },
      {
        title: 'മുകളിലെ കാർഡുകൾ',
        subtitle: 'നാല് സംഗ്രഹ ബോക്സുകൾ',
        list: [
          'Workforce — നിങ്ങൾക്ക് എത്ര സ്റ്റാഫ് ഉണ്ട്, ഈ മാസം പുതുതായി ചേർന്നവർ, ഫേസ് രജിസ്ട്രേഷൻ നില.',
          'Today — ഇപ്പോൾ ആരൊക്കെ ഹാജർ, ആരൊക്കെ ഹാജരല്ല, അല്ലെങ്കിൽ വൈകിയെത്തിയവർ. കൂടുതൽ വിവരങ്ങൾക്ക് ഏതെങ്കിലും നമ്പറിൽ ടാപ്പ് ചെയ്യുക.',
          'Actions — ഫേസ് രജിസ്ട്രേഷൻ ബാക്കിയുള്ളവർ, പ്രൊഫൈൽ വിവരങ്ങൾ പൂർത്തിയാക്കാത്തവർ, അല്ലെങ്കിൽ കിയോസ്ക് സെറ്റപ്പ് ആവശ്യമുള്ള കാര്യങ്ങൾ.',
          'Holidays — ഇന്ന്‌യും വരാനിരിക്കുന്ന തീയതികളിലും ഇന്ത്യയിലെ പൊതു അവധികൾ (നിങ്ങളുടെ അറിവിന്).',
        ],
      },
      {
        title: 'കലണ്ടറും പ്രവർത്തനവും',
        list: [
          'This month — ഓരോ ദിവസവും കാണിക്കുന്ന കലണ്ടർ. പച്ച നിറം എല്ലാവരും ഹാജരായെന്ന് സൂചിപ്പിക്കുന്നു. ഓറഞ്ച് നിറം ചിലർ ഹാജരല്ലെന്ന് സൂചിപ്പിക്കുന്നു.',
          'Activity — ഹാജർ നിരക്ക്, മാസ ഹാജർ, സമയത്ത് എത്തൽ എന്നിവ കാണിക്കുന്ന വൃത്തങ്ങൾ.',
          'Recent activity — ഇന്നത്തെ ഏറ്റവും പുതിയ clock-in, clock-out സമയങ്ങൾ.',
        ],
        paragraphs: [
          'നിങ്ങൾ പുതുതായി ആരംഭിക്കുന്നുവെങ്കിൽ, കിയോസ്കിൽ നിന്ന് യഥാർത്ഥ ഹാജർ ഡാറ്റ വരുന്നതുവരെ സാമ്പിൾ കണക്കുകൾ കാണാം.',
        ],
      },
      {
        title: 'അടുത്തത് എവിടെ പോകണം',
        list: [
          ['ഇന്ന് ആരൊക്കെ ഉണ്ടെന്ന് പരിശോധിക്കുക — ', docLink('/docs/attendance', 'Live Attendance')],
          ['സ്റ്റാഫിനെ മാനേജ് ചെയ്യുക — ', docLink('/docs/employees', 'Employees')],
          ['മാസിക ട്രെൻഡുകൾ കാണുക — ', docLink('/docs/analytics', 'Analytics')],
        ],
      },
    ],
  },
  kn: {
    pageTitle: 'Dashboard',
    pageSubtitle: 'ನಿಮ್ಮ ಹೋಮ್ ಸ್ಕ್ರೀನ್ — ಇಂದಿನ ಸಂಖ್ಯೆಗಳನ್ನೊಂದು ನೋಟದಲ್ಲಿ ನೋಡಿ.',
    sections: [
      {
        title: 'ನೀವು ಏನು ನೋಡುತ್ತೀರಿ',
        paragraphs: [
          [
            docLink('/admin/dashboard', 'Dashboard'),
            ' ನಿಮ್ಮ ತಂಡ, ಇಂದಿನ ಹಾಜರಾತಿ, ಮತ್ತು ಗಮನ ಕೊಡಬೇಕಾದ ವಿಷಯಗಳ ತ್ವರಿತ ಚಿತ್ರಣವನ್ನು ನೀಡುತ್ತದೆ.',
          ],
        ],
      },
      {
        title: 'ಮೇಲಿನ ಕಾರ್ಡ್‌ಗಳು',
        subtitle: 'ನಾಲ್ಕು ಸಾರಾಂಶ ಬಾಕ್ಸ್‌ಗಳು',
        list: [
          'Workforce — ನಿಮ್ಮಲ್ಲಿ ಎಷ್ಟು ಸಿಬ್ಬಂದಿ ಇದ್ದಾರೆ, ಈ ತಿಂಗಳು ಹೊಸದಾಗಿ ಸೇರಿದವರು, ಮತ್ತು ಮುಖ ನೋಂದಣಿ ಸ್ಥಿತಿ.',
          'Today — ಈಗ ಯಾರು ಹಾಜರಿದ್ದಾರೆ, ಗೈರುಹಾಜರಿದ್ದಾರೆ, ಅಥವಾ ತಡವಾಗಿ ಬಂದಿದ್ದಾರೆ. ಹೆಚ್ಚಿನ ವಿವರಕ್ಕೆ ಯಾವುದೇ ಸಂಖ್ಯೆಯನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ.',
          'Actions — ಇನ್ನೂ ಮುಖ ನೋಂದಣಿ ಬೇಕಿರುವ ಸಿಬ್ಬಂದಿ, ಅಪೂರ್ಣ ಪ್ರೊಫೈಲ್ ವಿವರಗಳು, ಅಥವಾ ಕಿಯೋಸ್ಕ್ ಸೆಟಪ್.',
          'Holidays — ಇಂದು ಮತ್ತು ಮುಂದಿನ ದಿನಾಂಕಗಳಿಗೆ ಭಾರತದ ಸಾರ್ವಜನಿಕ ರಜೆಗಳು (ನಿಮ್ಮ ಮಾಹಿತಿಗಾಗಿ).',
        ],
      },
      {
        title: 'ಕ್ಯಾಲೆಂಡರ್ ಮತ್ತು ಚಟುವಟಿಕೆ',
        list: [
          'This month — ಪ್ರತಿದಿನವನ್ನು ತೋರಿಸುವ ಕ್ಯಾಲೆಂಡರ್. ಹಸಿರು ಎಂದರೆ ಎಲ್ಲರೂ ಹಾಜರಿದ್ದರು. ಕಿತ್ತಳೆ ಎಂದರೆ ಕೆಲವರು ಗೈರುಹಾಜರಿದ್ದರು.',
          'Activity — ಹಾಜರಾತಿ ದರ, ಮಾಸಿಕ ಹಾಜರಾತಿ, ಮತ್ತು ಸಮಯಕ್ಕೆ ಬಂದಿರುವುದನ್ನು ತೋರಿಸುವ ವೃತ್ತಗಳು.',
          'Recent activity — ಇಂದಿನ ಇತ್ತೀಚಿನ clock-in ಮತ್ತು clock-out ಸಮಯಗಳು.',
        ],
        paragraphs: [
          'ನೀವು ಹೊಸದಾಗಿ ಪ್ರಾರಂಭಿಸುತ್ತಿದ್ದರೆ, ಕಿಯೋಸ್ಕ್‌ನಿಂದ ನಿಜವಾದ ಹಾಜರಾತಿ ಡೇಟಾ ಬರುವವರೆಗೆ ಮಾದರಿ ಸಂಖ್ಯೆಗಳು ಕಾಣಬಹುದು.',
        ],
      },
      {
        title: 'ಮುಂದೆ ಎಲ್ಲಿ ಹೋಗಬೇಕು',
        list: [
          ['ಇಂದು ಯಾರು ಒಳಗಿದ್ದಾರೆ ನೋಡಿ — ', docLink('/docs/attendance', 'Live Attendance')],
          ['ಸಿಬ್ಬಂದಿಯನ್ನು ನಿರ್ವಹಿಸಿ — ', docLink('/docs/employees', 'Employees')],
          ['ಮಾಸಿಕ ಪ್ರವೃತ್ತಿಗಳನ್ನು ನೋಡಿ — ', docLink('/docs/analytics', 'Analytics')],
        ],
      },
    ],
  },
};
