import { docLink } from '../docsI18n';

const enSections = [
  {
    title: 'What this page is for',
    paragraphs: [
      [
        'The ',
        docLink('/admin/payroll', 'Payment'),
        ' page tracks money paid to employees and manages salary advances. It is separate from the Salary page, which sets monthly pay amounts.',
      ],
    ],
  },
  {
    title: 'Payment ledger',
    list: [
      'Choose a month and year to filter payments for that period.',
      'Click Record payment to log a monthly salary, bonus, or other payout.',
      'View an employee\'s full payment history from the History action on any row.',
      'Each monthly salary can only be recorded once per employee per period.',
    ],
  },
  {
    title: 'Salary advances',
    list: [
      'Switch to the Advances tab to request, approve, and disburse advances.',
      'Advance amount is limited to 50% of the employee\'s monthly salary.',
      'Workflow: pending → approved → disbursed → recoveries until fully recovered.',
      'Use Record recovery to deduct advance repayments from future pay.',
    ],
  },
  {
    title: 'Before you start',
    list: [
      'Set employee salaries on the Salary page first.',
      'Employees must have a salary set before requesting an advance.',
    ],
    footer: [
      'See also: ',
      docLink('/docs/salary', 'Salary guide'),
      ' · ',
      docLink('/docs/attendance', 'Live attendance'),
      '.',
    ],
  },
];

export const payrollContent = {
  en: {
    pageTitle: 'Payment',
    pageSubtitle: 'Record payouts and manage salary advances for your team.',
    sections: enSections,
  },
  hi: {
    pageTitle: 'भुगतान',
    pageSubtitle: 'अपनी टीम के लिए भुगतान दर्ज करें और वेतन अग्रिम प्रबंधित करें।',
    sections: [
      {
        title: 'यह पेज किस लिए है',
        paragraphs: [
          [
            docLink('/admin/payroll', 'Payment'),
            ' पेज कर्मचारियों को दिए गए पैसे ट्रैक करता है और वेतन अग्रिम प्रबंधित करता है। यह Salary पेज से अलग है, जो मासिक वेतन राशि सेट करता है।',
          ],
        ],
      },
      {
        title: 'भुगतान लेजर',
        list: [
          'उस अवधि के भुगतान फ़िल्टर करने के लिए महीना और वर्ष चुनें।',
          'मासिक वेतन, बोनस या अन्य भुगतान दर्ज करने के लिए Record payment पर क्लिक करें।',
          'किसी भी पंक्ति पर History कार्रवाई से कर्मचारी का पूरा भुगतान इतिहास देखें।',
          'प्रति कर्मचारी प्रति अवधि मासिक वेतन केवल एक बार दर्ज किया जा सकता है।',
        ],
      },
      {
        title: 'वेतन अग्रिम',
        list: [
          'अग्रिम अनुरोध, स्वीकृति और वितरण के लिए Advances टैब पर जाएँ।',
          'अग्रिम राशि कर्मचारी के मासिक वेतन के 50% तक सीमित है।',
          'कार्यप्रवाह: pending → approved → disbursed → पूर्ण वसूली तक recoveries।',
          'भविष्य के वेतन से अग्रिम वापसी काटने के लिए Record recovery उपयोग करें।',
        ],
      },
      {
        title: 'शुरू करने से पहले',
        list: [
          'पहले Salary पेज पर कर्मचारी वेतन सेट करें।',
          'अग्रिम अनुरोध करने से पहले कर्मचारी का वेतन सेट होना चाहिए।',
        ],
        footer: [
          'यह भी देखें: ',
          docLink('/docs/salary', 'वेतन गाइड'),
          ' · ',
          docLink('/docs/attendance', 'लाइव हाजिरी'),
          '।',
        ],
      },
    ],
  },
  ml: {
    pageTitle: 'പേയ്‌മെന്റ്',
    pageSubtitle: 'നിങ്ങളുടെ ടീമിനായി പേയ്‌മെന്റുകൾ രേഖപ്പെടുത്തി സാലറി അഡ്വാൻസ് കൈകാര്യം ചെയ്യുക.',
    sections: [
      {
        title: 'ഈ പേജ് എന്തിനാണ്',
        paragraphs: [
          [
            docLink('/admin/payroll', 'Payment'),
            ' പേജ് ജീവനക്കാർക്ക് അടച്ച പണം ട്രാക്ക് ചെയ്യുകയും ശമ്പള അഡ്വാൻസ് കൈകാര്യം ചെയ്യുകയും ചെയ്യുന്നു. മാസ ശമ്പള തുക സജ്ജമാക്കുന്ന Salary പേജിൽ നിന്ന് ഇത് വേറെയാണ്.',
          ],
        ],
      },
      {
        title: 'പേയ്‌മെന്റ് ലെഡ്ജർ',
        list: [
          'ആ കാലയളവിലെ പേയ്‌മെന്റുകൾ ഫിൽട്ടർ ചെയ്യാൻ മാസവും വർഷവും തിരഞ്ഞെടുക്കുക.',
          'മാസ ശമ്പളം, ബോണസ് അല്ലെങ്കിൽ മറ്റ് പേയ്‌മെന്റ് രേഖപ്പെടുത്താൻ Record payment ക്ലിക്ക് ചെയ്യുക.',
          'ഏതെങ്കിലും വരിയിലെ History പ്രവർത്തനത്തിൽ നിന്ന് ജീവനക്കാരുടെ മുഴുവൻ പേയ്‌മെന്റ് ചരിത്രം കാണുക.',
          'ഓരോ ജീവനക്കാരുടെയും മാസ ശമ്പളം ഒരു കാലയളവിൽ ഒരിക്കൽ മാത്രമേ രേഖപ്പെടുത്താൻ കഴിയൂ.',
        ],
      },
      {
        title: 'ശമ്പള അഡ്വാൻസ്',
        list: [
          'അഡ്വാൻസ് അഭ്യർത്ഥിക്കാനും അംഗീകരിക്കാനും വിതരണം ചെയ്യാനും Advances ടാബിലേക്ക് മാറുക.',
          'അഡ്വാൻസ് തുക ജീവനക്കാരുടെ മാസ ശമ്പളത്തിന്റെ 50% വരെ മാത്രമേ.',
          'വർക്ക്ഫ്ലോ: pending → approved → disbursed → പൂർണ്ണമായി തിരിച്ചടയ്ക്കുന്നത് വരെ recoveries.',
          'ഭാവി ശമ്പളത്തിൽ നിന്ന് അഡ്വാൻസ് തിരിച്ചടവ് കുറയ്ക്കാൻ Record recovery ഉപയോഗിക്കുക.',
        ],
      },
      {
        title: 'ആരംഭിക്കുന്നതിന് മുമ്പ്',
        list: [
          'ആദ്യം Salary പേജിൽ ജീവനക്കാരുടെ ശമ്പളം സജ്ജമാക്കുക.',
          'അഡ്വാൻസ് അഭ്യർത്ഥിക്കുന്നതിന് മുമ്പ് ജീവനക്കാർക്ക് ശമ്പളം സജ്ജമാക്കിയിരിക്കണം.',
        ],
        footer: [
          'കൂടി കാണുക: ',
          docLink('/docs/salary', 'ശമ്പള ഗൈഡ്'),
          ' · ',
          docLink('/docs/attendance', 'ലൈവ് ഹാജറാതി'),
          '.',
        ],
      },
    ],
  },
  kn: {
    pageTitle: 'ಪೇಮೆಂಟ್',
    pageSubtitle: 'ನಿಮ್ಮ ತಂಡಕ್ಕಾಗಿ ಪೇಮೆಂಟ್‌ಗಳನ್ನು ದಾಖಲಿಸಿ ಮತ್ತು ಸಂಬಳ ಮುಂಗಡ ನಿರ್ವಹಿಸಿ.',
    sections: [
      {
        title: 'ಈ ಪುಟ ಯಾವುದಕ್ಕಾಗಿ',
        paragraphs: [
          [
            docLink('/admin/payroll', 'Payment'),
            ' ಪುಟವು ಉದ್ಯೋಗಿಗಳಿಗೆ ಪಾವತಿಸಿದ ಹಣವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡುತ್ತದೆ ಮತ್ತು ಸಂಬಳ ಮುಂಗಡಗಳನ್ನು ನಿರ್ವಹಿಸುತ್ತದೆ. ಮಾಸಿಕ ಸಂಬಳ ಮೊತ್ತವನ್ನು ಹೊಂದಿಸುವ Salary ಪುಟದಿಂದ ಇದು ಬೇರೆಯಾಗಿದೆ.',
          ],
        ],
      },
      {
        title: 'ಪೇಮೆಂಟ್ ಲೆಡ್ಜರ್',
        list: [
          'ಆ ಅವಧಿಗೆ ಪೇಮೆಂಟ್‌ಗಳನ್ನು ಫಿಲ್ಟರ್ ಮಾಡಲು ತಿಂಗಳು ಮತ್ತು ವರ್ಷವನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
          'ಮಾಸಿಕ ಸಂಬಳ, ಬೋನಸ್ ಅಥವಾ ಇತರ ಪೇಮೆಂಟ್ ದಾಖಲಿಸಲು Record payment ಕ್ಲಿಕ್ ಮಾಡಿ.',
          'ಯಾವುದೇ ಸಾಲಿನ History ಕ್ರಿಯೆಯಿಂದ ಉದ್ಯೋಗಿಯ ಸಂಪೂರ್ಣ ಪೇಮೆಂಟ್ ಇತಿಹಾಸವನ್ನು ನೋಡಿ.',
          'ಪ್ರತಿ ಉದ್ಯೋಗಿ ಪ್ರತಿ ಅವಧಿಗೆ ಮಾಸಿಕ ಸಂಬಳವನ್ನು ಒಮ್ಮೆ ಮಾತ್ರ ದಾಖಲಿಸಬಹುದು.',
        ],
      },
      {
        title: 'ಸಂಬಳ ಮುಂಗಡ',
        list: [
          'ಮುಂಗಡ ವಿನಂತಿಸಲು, ಅನುಮೋದಿಸಲು ಮತ್ತು ವಿತರಿಸಲು Advances ಟ್ಯಾಬ್‌ಗೆ ಬದಲಾಯಿಸಿ.',
          'ಮುಂಗಡ ಮೊತ್ತವು ಉದ್ಯೋಗಿಯ ಮಾಸಿಕ ಸಂಬಳದ 50% ವರೆಗೆ ಮಾತ್ರ.',
          'ವರ್ಕ್‌ಫ್ಲೋ: pending → approved → disbursed → ಸಂಪೂರ್ಣ ವಸೂಲಿ ವರೆಗೆ recoveries.',
          'ಭವಿಷ್ಯದ ಪೇಯಿಂದ ಮುಂಗಡ ಮರುಪಾವತಿಯನ್ನು ಕಡಿತಗೊಳಿಸಲು Record recovery ಬಳಸಿ.',
        ],
      },
      {
        title: 'ಪ್ರಾರಂಭಿಸುವ ಮೊದಲು',
        list: [
          'ಮೊದಲು Salary ಪುಟದಲ್ಲಿ ಉದ್ಯೋಗಿ ಸಂಬಳವನ್ನು ಹೊಂದಿಸಿ.',
          'ಮುಂಗಡ ವಿನಂತಿಸುವ ಮೊದಲು ಉದ್ಯೋಗಿಗೆ ಸಂಬಳ ಹೊಂದಿಸಿರಬೇಕು.',
        ],
        footer: [
          'ಇದನ್ನೂ ನೋಡಿ: ',
          docLink('/docs/salary', 'ಸಂಬಳ ಮಾರ್ಗದರ್ಶಿ'),
          ' · ',
          docLink('/docs/attendance', 'ಲೈವ್ ಹಾಜರಾತಿ'),
          '.',
        ],
      },
    ],
  },
};
