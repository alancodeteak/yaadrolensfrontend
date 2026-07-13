import { docLink, docStrong } from '../docsI18n';

const enSections = [
  {
    title: 'What this page is for',
    paragraphs: [
      [
        'The ',
        docLink('/admin/salary', 'Salary'),
        ' page lets you set and update each employee\'s monthly salary (INR) and review a full change history.',
      ],
    ],
  },
  {
    title: 'Overview cards',
    list: [
      'See how many employees have a salary set.',
      'View total monthly payroll for your team.',
      'Spot employees who still need a salary assigned.',
    ],
  },
  {
    title: 'Updating a salary',
    list: [
      'Click the pencil icon on any row to open the edit form.',
      'Enter the new monthly amount, effective date, and an optional reason.',
      'Every change is saved to the history — nothing is overwritten silently.',
    ],
  },
  {
    title: 'Salary history',
    list: [
      'Click the history icon to see who changed a salary, when, and why.',
      'History is read-only — past entries cannot be edited or deleted.',
    ],
    tip: [
      'You can also set salary when creating or editing an employee on the ',
      docLink('/admin/employees', 'Employees'),
      ' page. That still writes a history record.',
    ],
    footer: ['See also: ', docLink('/docs/employees', 'Employees guide'), '.'],
  },
];

export const salaryContent = {
  en: {
    pageTitle: 'Salary',
    pageSubtitle: 'Set monthly pay and review salary change history.',
    sections: enSections,
  },
  hi: {
    pageTitle: 'वेतन',
    pageSubtitle: 'मासिक वेतन सेट करें और बदलाव का इतिहास देखें।',
    sections: [
      {
        title: 'यह पेज किस लिए है',
        paragraphs: [
          [
            docLink('/admin/salary', 'Salary'),
            ' पेज से आप हर कर्मचारी का मासिक वेतन (INR) सेट और अपडेट कर सकते हैं और पूरा बदलाव इतिहास देख सकते हैं।',
          ],
        ],
      },
      {
        title: 'अवलोकन कार्ड',
        list: [
          'देखें कितने कर्मचारियों का वेतन सेट है।',
          'अपनी टीम का कुल मासिक पेरोल देखें।',
          'ऐसे कर्मचारी पहचानें जिनका वेतन अभी सेट नहीं है।',
        ],
      },
      {
        title: 'वेतन अपडेट करना',
        list: [
          'संपादन फ़ॉर्म खोलने के लिए किसी भी पंक्ति पर पेंसिल आइकन पर क्लिक करें।',
          'नई मासिक राशि, प्रभावी तारीख और वैकल्पिक कारण दर्ज करें।',
          'हर बदलाव इतिहास में सहेजा जाता है — कुछ भी चुपचाप ओवरराइट नहीं होता।',
        ],
      },
      {
        title: 'वेतन इतिहास',
        list: [
          'देखें किसने वेतन बदला, कब और क्यों — इतिहास आइकन पर क्लिक करें।',
          'इतिहास केवल पढ़ने योग्य है — पुरानी प्रविष्टियाँ संपादित या हटाई नहीं जा सकतीं।',
        ],
        tip: [
          docLink('/admin/employees', 'Employees'),
          ' पेज पर कर्मचारी बनाते या संपादित करते समय भी वेतन सेट कर सकते हैं। वह भी इतिहास रिकॉर्ड लिखता है।',
        ],
        footer: ['यह भी देखें: ', docLink('/docs/employees', 'कर्मचारी गाइड'), '।'],
      },
    ],
  },
  ml: {
    pageTitle: 'ശമ്പളം',
    pageSubtitle: 'മാസ ശമ്പളം സജ്ജമാക്കുക, മാറ്റ ചരിത്രം കാണുക.',
    sections: [
      {
        title: 'ഈ പേജ് എന്തിനാണ്',
        paragraphs: [
          [
            docLink('/admin/salary', 'Salary'),
            ' പേജിൽ നിന്ന് ഓരോ ജീവനക്കാരുടെയും മാസ ശമ്പളം (INR) സജ്ജമാക്കാനും അപ്ഡേറ്റ് ചെയ്യാനും മുഴുവൻ മാറ്റ ചരിത്രവും കാണാനും കഴിയും.',
          ],
        ],
      },
      {
        title: 'അവലോകന കാർഡുകൾ',
        list: [
          'എത്ര ജീവനക്കാർക്ക് ശമ്പളം സജ്ജമാക്കിയിട്ടുണ്ട് എന്ന് കാണുക.',
          'നിങ്ങളുടെ ടീമിന്റെ മൊത്തം മാസിക പേറോൾ കാണുക.',
          'ശമ്പളം ഇനിയും സജ്ജമാക്കാത്ത ജീവനക്കാരെ കണ്ടെത്തുക.',
        ],
      },
      {
        title: 'ശമ്പളം അപ്ഡേറ്റ് ചെയ്യൽ',
        list: [
          'എഡിറ്റ് ഫോം തുറക്കാൻ ഏതെങ്കിലും വരിയിലെ പെൻസിൽ ഐക്കണിൽ ക്ലിക്ക് ചെയ്യുക.',
          'പുതിയ മാസ തുക, പ്രാബല്യ തീയതി, ഓപ്ഷണൽ കാരണം നൽകുക.',
          'ഓരോ മാറ്റവും ചരിത്രത്തിൽ സേവ് ചെയ്യുന്നു — ഒന്നും നിശബ്ദമായി മാറ്റിഎഴുതപ്പെടില്ല.',
        ],
      },
      {
        title: 'ശമ്പള ചരിത്രം',
        list: [
          'ആരാണ് ശമ്പളം മാറ്റിയത്, എപ്പോൾ, എന്തുകൊണ്ട് എന്ന് കാണാൻ ചരിത്ര ഐക്കണിൽ ക്ലിക്ക് ചെയ്യുക.',
          'ചരിത്രം വായിക്കാൻ മാത്രമേ — പഴയ എൻട്രികൾ എഡിറ്റ് ചെയ്യാനോ ഇല്ലാതാക്കാനോ കഴിയില്ല.',
        ],
        tip: [
          docLink('/admin/employees', 'Employees'),
          ' പേജിൽ ജീവനക്കാരെ സൃഷ്ടിക്കുമ്പോഴോ എഡിറ്റ് ചെയ്യുമ്പോഴോ ശമ്പളം സജ്ജമാക്കാം. അതും ചരിത്ര രേഖ എഴുതുന്നു.',
        ],
        footer: ['കൂടി കാണുക: ', docLink('/docs/employees', 'ജീവനക്കാർ ഗൈഡ്'), '.'],
      },
    ],
  },
  kn: {
    pageTitle: 'ಸಂಬಳ',
    pageSubtitle: 'ಮಾಸಿಕ ಸಂಬಳ ಹೊಂದಿಸಿ ಮತ್ತು ಬದಲಾವಣೆ ಇತಿಹಾಸ ನೋಡಿ.',
    sections: [
      {
        title: 'ಈ ಪುಟ ಯಾವುದಕ್ಕಾಗಿ',
        paragraphs: [
          [
            docLink('/admin/salary', 'Salary'),
            ' ಪುಟದಿಂದ ಪ್ರತಿ ಉದ್ಯೋಗಿಯ ಮಾಸಿಕ ಸಂಬಳ (INR) ಹೊಂದಿಸಿ, ನವೀಕರಿಸಿ ಮತ್ತು ಸಂಪೂರ್ಣ ಬದಲಾವಣೆ ಇತಿಹಾಸವನ್ನು ನೋಡಬಹುದು.',
          ],
        ],
      },
      {
        title: 'ಅವಲೋಕನ ಕಾರ್ಡ್‌ಗಳು',
        list: [
          'ಎಷ್ಟು ಉದ್ಯೋಗಿಗಳಿಗೆ ಸಂಬಳ ಹೊಂದಿಸಲಾಗಿದೆ ಎಂಬುದನ್ನು ನೋಡಿ.',
          'ನಿಮ್ಮ ತಂಡದ ಒಟ್ಟು ಮಾಸಿಕ ಪೇರೋಲ್ ನೋಡಿ.',
          'ಇನ್ನೂ ಸಂಬಳ ನಿಗದಿಪಡಿಸದ ಉದ್ಯೋಗಿಗಳನ್ನು ಗುರುತಿಸಿ.',
        ],
      },
      {
        title: 'ಸಂಬಳ ನವೀಕರಣ',
        list: [
          'ಸಂಪಾದನಾ ಫಾರ್ಮ್ ತೆರೆಯಲು ಯಾವುದೇ ಸಾಲಿನ ಪೆನ್ಸಿಲ್ ಐಕಾನ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.',
          'ಹೊಸ ಮಾಸಿಕ ಮೊತ್ತ, ಜಾರಿ ದಿನಾಂಕ ಮತ್ತು ಐಚ್ಛಿಕ ಕಾರಣವನ್ನು ನಮೂದಿಸಿ.',
          'ಪ್ರತಿ ಬದಲಾವಣೆಯನ್ನು ಇತಿಹಾಸದಲ್ಲಿ ಉಳಿಸಲಾಗುತ್ತದೆ — ಏನನ್ನೂ ನಿಶ್ಶಬ್ದವಾಗಿ ಮೇಲೆ ಬರೆಯಲಾಗುವುದಿಲ್ಲ.',
        ],
      },
      {
        title: 'ಸಂಬಳ ಇತಿಹಾಸ',
        list: [
          'ಯಾರು ಸಂಬಳ ಬದಲಾಯಿಸಿದರು, ಯಾವಾಗ, ಏಕೆ ಎಂಬುದನ್ನು ನೋಡಲು ಇತಿಹಾಸ ಐಕಾನ್ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.',
          'ಇತಿಹಾಸ ಓದಲು ಮಾತ್ರ — ಹಳೆಯ ನಮೂದುಗಳನ್ನು ಸಂಪಾದಿಸಲು ಅಥವಾ ಅಳಿಸಲು ಸಾಧ್ಯವಿಲ್ಲ.',
        ],
        tip: [
          docLink('/admin/employees', 'Employees'),
          ' ಪುಟದಲ್ಲಿ ಉದ್ಯೋಗಿಯನ್ನು ರಚಿಸುವಾಗ ಅಥವಾ ಸಂಪಾದಿಸುವಾಗ ಸಂಬಳವನ್ನು ಹೊಂದಿಸಬಹುದು. ಅದೂ ಇತಿಹಾಸ ದಾಖಲೆಯನ್ನು ಬರೆಯುತ್ತದೆ.',
        ],
        footer: ['ಇದನ್ನೂ ನೋಡಿ: ', docLink('/docs/employees', 'ಉದ್ಯೋಗಿಗಳ ಮಾರ್ಗದರ್ಶಿ'), '.'],
      },
    ],
  },
};
