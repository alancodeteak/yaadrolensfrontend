import { docLink, docStrong } from '../docsI18n';

export const employeesContent = {
  en: {
    pageTitle: 'Employees',
    pageSubtitle: 'Add and manage your team before they use the kiosk.',
    sections: [
      {
        title: 'What this page is for',
        paragraphs: [
          [
            'The ',
            docLink('/admin/employees', 'Employees'),
            ' page is your staff list. Add new people here first, then register their face on the kiosk.',
          ],
        ],
      },
      {
        title: 'Finding people',
        list: [
          'Search by name or employee code.',
          'Filter by department or active / inactive status.',
          'Sort the list the way you prefer.',
          "Click any row to open that person's full profile.",
        ],
      },
      {
        title: 'Adding or editing staff',
        list: [
          [
            'Name is required. Department, job title, and phone are optional. Set salary here or on the ',
            docLink('/admin/salary', 'Salary'),
            ' page for full history.',
          ],
          'You can upload a profile photo (JPEG, PNG, or WebP, up to 2 MB).',
          'Mark someone inactive when they leave. You can turn them active again later.',
          '"Face enrolled" means they have registered on the kiosk and can clock in.',
        ],
      },
      {
        title: 'Employee profile page',
        list: [
          'Personal — contact and job details.',
          'Attendance — history view (being improved).',
          'Training — face registration status.',
          "You can also see today's summary and monthly report for each person.",
        ],
      },
      {
        title: 'Tips',
        list: [
          'Always add employees here before registering them on the kiosk.',
          'Profile photos are for display only — face scanning is separate.',
          'Departments are set up by your system provider and appear in the dropdown.',
        ],
        footer: ['Ready for the kiosk? See ', docLink('/docs/kiosk', 'Kiosk setup'), '.'],
      },
    ],
  },
  hi: {
    pageTitle: 'Employees',
    pageSubtitle: 'कियोस्क इस्तेमाल करने से पहले अपनी टीम जोड़ें और प्रबंधित करें।',
    sections: [
      {
        title: 'यह पेज किस लिए है',
        paragraphs: [
          [
            docLink('/admin/employees', 'Employees'),
            ' पेज आपकी स्टाफ सूची है। नए लोगों को पहले यहाँ जोड़ें, फिर कियोस्क पर उनका चेहरा रजिस्टर करें।',
          ],
        ],
      },
      {
        title: 'लोगों को ढूँढना',
        list: [
          'नाम या कर्मचारी कोड से खोजें।',
          'विभाग या active / inactive स्थिति से फिल्टर करें।',
          'सूची को अपनी पसंद के अनुसार क्रम में लगाएँ।',
          'किसी भी पंक्ति पर क्लिक करके उस व्यक्ति की पूरी प्रोफाइल खोलें।',
        ],
      },
      {
        title: 'स्टाफ जोड़ना या संपादित करना',
        list: [
          'नाम जरूरी है। विभाग, पद, फोन और वेतन वैकल्पिक हैं।',
          'आप प्रोफाइल फोटो अपलोड कर सकते हैं (JPEG, PNG, या WebP, 2 MB तक)।',
          'जब कोई व्यक्ति छोड़कर जाए, तो उसे inactive मार्क करें। बाद में फिर active कर सकते हैं।',
          '"Face enrolled" का मतलब है कि व्यक्ति ने कियोस्क पर रजिस्ट्रेशन कर लिया है और clock in कर सकता है।',
        ],
      },
      {
        title: 'Employee profile पेज',
        list: [
          'Personal — संपर्क और नौकरी से जुड़ी जानकारी।',
          'Attendance — इतिहास दृश्य (इसमें सुधार चल रहा है)।',
          'Training — फेस रजिस्ट्रेशन की स्थिति।',
          'हर व्यक्ति के लिए आज का सारांश और मासिक रिपोर्ट भी देख सकते हैं।',
        ],
      },
      {
        title: 'सुझाव',
        list: [
          'कियोस्क पर रजिस्टर करने से पहले कर्मचारियों को हमेशा यहाँ जोड़ें।',
          'प्रोफाइल फोटो केवल दिखाने के लिए हैं — फेस स्कैनिंग अलग है।',
          'विभाग आपके सिस्टम प्रदाता द्वारा सेट किए जाते हैं और ड्रॉपडाउन में दिखते हैं।',
        ],
        footer: ['कियोस्क के लिए तैयार हैं? ', docLink('/docs/kiosk', 'Kiosk setup'), ' देखें।'],
      },
    ],
  },
  ml: {
    pageTitle: 'Employees',
    pageSubtitle: 'കിയോസ്ക് ഉപയോഗിക്കുന്നതിന് മുമ്പ് നിങ്ങളുടെ ടീമിനെ ചേർക്കുകയും മാനേജ് ചെയ്യുകയും ചെയ്യുക.',
    sections: [
      {
        title: 'ഈ പേജ് എന്തിനാണ്',
        paragraphs: [
          [
            docLink('/admin/employees', 'Employees'),
            ' പേജ് നിങ്ങളുടെ സ്റ്റാഫ് ലിസ്റ്റാണ്. പുതിയവരെ ആദ്യം ഇവിടെ ചേർക്കുക, പിന്നെ അവരുടെ മുഖം കിയോസ്കിൽ രജിസ്റ്റർ ചെയ്യുക.',
          ],
        ],
      },
      {
        title: 'ആളുകളെ കണ്ടെത്തൽ',
        list: [
          'പേര് അല്ലെങ്കിൽ employee code ഉപയോഗിച്ച് തിരയുക.',
          'വകുപ്പ് അല്ലെങ്കിൽ active / inactive നില പ്രകാരം ഫിൽട്ടർ ചെയ്യുക.',
          'ലിസ്റ്റ് നിങ്ങൾക്ക് ഇഷ്ടമുള്ള രീതിയിൽ ക്രമീകരിക്കുക.',
          'ആ വ്യക്തിയുടെ പൂർണ്ണ പ്രൊഫൈൽ തുറക്കാൻ ഏത് വരിയിലും ക്ലിക്ക് ചെയ്യുക.',
        ],
      },
      {
        title: 'സ്റ്റാഫിനെ ചേർക്കൽ അല്ലെങ്കിൽ തിരുത്തൽ',
        list: [
          'പേര് നിർബന്ധമാണ്. വകുപ്പ്, ജോലി പദവി, ഫോൺ, ശമ്പളം എന്നിവ ഐച്ഛികമാണ്.',
          'പ്രൊഫൈൽ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യാം (JPEG, PNG, അല്ലെങ്കിൽ WebP, 2 MB വരെ).',
          'ആരെങ്കിലും ജോലി വിടുമ്പോൾ inactive ആയി അടയാളപ്പെടുത്തുക. പിന്നീട് വീണ്ടും active ആക്കാം.',
          '"Face enrolled" എന്നത് ആൾ കിയോസ്കിൽ രജിസ്റ്റർ ചെയ്തിട്ടുണ്ടെന്നും clock in ചെയ്യാമെന്നും അർത്ഥമാക്കുന്നു.',
        ],
      },
      {
        title: 'Employee profile പേജ്',
        list: [
          'Personal — ബന്ധപ്പെടാനുള്ള വിവരങ്ങളും ജോലി വിവരങ്ങളും.',
          'Attendance — ചരിത്ര കാഴ്ച (മെച്ചപ്പെടുത്തിക്കൊണ്ടിരിക്കുന്നു).',
          'Training — ഫേസ് രജിസ്ട്രേഷൻ നില.',
          'ഓരോ വ്യക്തിയുടെയും ഇന്നത്തെ സംഗ്രഹവും മാസിക റിപ്പോർട്ടും കാണാം.',
        ],
      },
      {
        title: 'സൂചനകൾ',
        list: [
          'കിയോസ്കിൽ രജിസ്റ്റർ ചെയ്യുന്നതിന് മുമ്പ് ജീവനക്കാരെ എപ്പോഴും ഇവിടെ ചേർക്കുക.',
          'പ്രൊഫൈൽ ഫോട്ടോകൾ പ്രദർശനത്തിനായി മാത്രം — ഫേസ് സ്കാനിംഗ് വേറെയാണ്.',
          'വകുപ്പുകൾ നിങ്ങളുടെ സിസ്റ്റം പ്രൊവൈഡർ സജ്ജമാക്കുന്നതാണ്; അവ ഡ്രോപ്പ്ഡൗണിൽ കാണാം.',
        ],
        footer: ['കിയോസ്കിന് തയ്യാറാണോ? ', docLink('/docs/kiosk', 'Kiosk setup'), ' കാണുക.'],
      },
    ],
  },
  kn: {
    pageTitle: 'Employees',
    pageSubtitle: 'ಕಿಯೋಸ್ಕ್ ಬಳಸುವ ಮೊದಲು ನಿಮ್ಮ ತಂಡವನ್ನು ಸೇರಿಸಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ.',
    sections: [
      {
        title: 'ಈ ಪುಟದ ಉದ್ದೇಶ',
        paragraphs: [
          [
            docLink('/admin/employees', 'Employees'),
            ' ಪುಟವು ನಿಮ್ಮ ಸಿಬ್ಬಂದಿ ಪಟ್ಟಿ. ಹೊಸ ಜನರನ್ನು ಮೊದಲು ಇಲ್ಲಿ ಸೇರಿಸಿ, ನಂತರ ಅವರ ಮುಖವನ್ನು ಕಿಯೋಸ್ಕ್‌ನಲ್ಲಿ ನೋಂದಾಯಿಸಿ.',
          ],
        ],
      },
      {
        title: 'ಜನರನ್ನು ಹುಡುಕುವುದು',
        list: [
          'ಹೆಸರು ಅಥವಾ employee code ಮೂಲಕ ಹುಡುಕಿ.',
          'ವಿಭಾಗ ಅಥವಾ active / inactive ಸ್ಥಿತಿ ಮೂಲಕ ಫಿಲ್ಟರ್ ಮಾಡಿ.',
          'ನಿಮಗೆ ಇಷ್ಟವಾದ ರೀತಿಯಲ್ಲಿ ಪಟ್ಟಿಯನ್ನು ಸೋರ್ಟ್ ಮಾಡಿ.',
          'ಯಾವುದೇ ಸಾಲನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ ಆ ವ್ಯಕ್ತಿಯ ಪೂರ್ಣ ಪ್ರೊಫೈಲ್ ತೆರೆಯಿರಿ.',
        ],
      },
      {
        title: 'ಸಿಬ್ಬಂದಿಯನ್ನು ಸೇರಿಸುವುದು ಅಥವಾ ತಿದ್ದುಪಡಿ ಮಾಡುವುದು',
        list: [
          'ಹೆಸರು ಕಡ್ಡಾಯ. ವಿಭಾಗ, ಕೆಲಸದ ಹುದ್ದೆ, ಫೋನ್, ಮತ್ತು ಸಂಬಳ ಐಚ್ಛಿಕ.',
          'ನೀವು ಪ್ರೊಫೈಲ್ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಬಹುದು (JPEG, PNG, ಅಥವಾ WebP, 2 MB ವರೆಗೆ).',
          'ಯಾರಾದರೂ ಕೆಲಸ ಬಿಟ್ಟಾಗ ಅವರನ್ನು inactive ಎಂದು ಗುರುತಿಸಿ. ನಂತರ ಮತ್ತೆ active ಮಾಡಬಹುದು.',
          '"Face enrolled" ಎಂದರೆ ಅವರು ಕಿಯೋಸ್ಕ್‌ನಲ್ಲಿ ನೋಂದಾಯಿಸಿಕೊಂಡಿದ್ದಾರೆ ಮತ್ತು clock in ಮಾಡಬಹುದು.',
        ],
      },
      {
        title: 'Employee profile ಪುಟ',
        list: [
          'Personal — ಸಂಪರ್ಕ ಮತ್ತು ಕೆಲಸದ ವಿವರಗಳು.',
          'Attendance — ಇತಿಹಾಸ ವೀಕ್ಷಣೆ (ಸುಧಾರಿಸಲಾಗುತ್ತಿದೆ).',
          'Training — ಮುಖ ನೋಂದಣಿ ಸ್ಥಿತಿ.',
          'ಪ್ರತಿ ವ್ಯಕ್ತಿಗೆ ಇಂದಿನ ಸಾರಾಂಶ ಮತ್ತು ಮಾಸಿಕ ವರದಿಯನ್ನೂ ನೋಡಬಹುದು.',
        ],
      },
      {
        title: 'ಸಲಹೆಗಳು',
        list: [
          'ಕಿಯೋಸ್ಕ್‌ನಲ್ಲಿ ನೋಂದಾಯಿಸುವ ಮೊದಲು ಉದ್ಯೋಗಿಗಳನ್ನು ಸದಾ ಇಲ್ಲಿ ಸೇರಿಸಿ.',
          'ಪ್ರೊಫೈಲ್ ಫೋಟೋಗಳು ಪ್ರದರ್ಶನಕ್ಕಾಗಿ ಮಾತ್ರ — ಮುಖ ಸ್ಕ್ಯಾನಿಂಗ್ ಬೇರೆ.',
          'ವಿಭಾಗಗಳನ್ನು ನಿಮ್ಮ ಸಿಸ್ಟಮ್ ಪ್ರೊವೈಡರ್ ಸಿದ್ಧಪಡಿಸುತ್ತಾರೆ ಮತ್ತು ಅವು ಡ್ರಾಪ್‌ಡೌನ್‌ನಲ್ಲಿ ಕಾಣುತ್ತವೆ.',
        ],
        footer: ['ಕಿಯೋಸ್ಕ್‌ಗೆ ಸಿದ್ಧವೇ? ', docLink('/docs/kiosk', 'Kiosk setup'), ' ನೋಡಿ.'],
      },
    ],
  },
};
