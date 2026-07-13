import { docLink } from '../docsI18n';

const enSections = [
  {
    title: 'What this page is for',
    paragraphs: [
      [
        'The ',
        docLink('/admin/reports', 'Reports'),
        ' page lets you download attendance, payroll, and workforce data as Excel or PDF files. Use it for record-keeping, sharing with managers, or offline review.',
      ],
    ],
  },
  {
    title: 'How to download a report',
    list: [
      'Open Reports from the sidebar.',
      'Choose a category tab: Attendance, Payroll, or Salary & Workforce.',
      'Set the filters for the report you need (date, month, employee, and so on).',
      'Click Excel or PDF to download the file.',
    ],
  },
  {
    title: 'Attendance reports',
    list: [
      'Daily Attendance Sheet — clock in/out and status for each employee on one day.',
      'Monthly Attendance Summary — days present, late count, hours, and incomplete days per employee.',
      'Late Arrivals — late arrival counts per employee over a date range.',
    ],
  },
  {
    title: 'Payroll reports',
    list: [
      'Payment History — payouts in a date range, with optional employee, status, or type filters.',
      'Outstanding Payments — employees with unpaid salary or outstanding advances.',
      'Bonuses — scheduled and released bonuses.',
      'Salary Advances — advance requests and recovery status.',
      'Balance Ledger — give/take balance transactions.',
      'Employee Balances — current running balance per employee.',
    ],
  },
  {
    title: 'Salary & workforce reports',
    list: [
      'Salary Roster — current monthly salary for all employees.',
      'Employee Directory — contact details, department, and face enrollment status.',
      'Dashboard Snapshot — key workforce and attendance metrics for a day.',
    ],
  },
  {
    title: 'Good to know',
    list: [
      'Exports are scoped to your organization only.',
      'Large date ranges may be limited — narrow filters if a download fails.',
      'Payment history defaults to the current month when no dates are selected.',
    ],
    footer: [
      'See also: ',
      docLink('/docs/payroll', 'Payment guide'),
      ' · ',
      docLink('/docs/salary', 'Salary guide'),
      ' · ',
      docLink('/docs/analytics', 'Analytics'),
      '.',
    ],
  },
];

export const reportsContent = {
  en: {
    pageTitle: 'Reports',
    pageSubtitle: 'Download attendance, payroll, and workforce data as Excel or PDF.',
    sections: enSections,
  },
  hi: {
    pageTitle: 'रिपोर्ट',
    pageSubtitle: 'हाजिरी, पेरोल और वर्कफोर्स डेटा Excel या PDF के रूप में डाउनलोड करें।',
    sections: [
      {
        title: 'यह पेज किस लिए है',
        paragraphs: [
          [
            docLink('/admin/reports', 'Reports'),
            ' पेज से हाजिरी, पेरोल और वर्कफोर्स डेटा Excel या PDF फ़ाइलों के रूप में डाउनलोड कर सकते हैं। रिकॉर्ड रखने, मैनेजरों के साथ साझा करने या ऑफ़लाइन समीक्षा के लिए उपयोग करें।',
          ],
        ],
      },
      {
        title: 'रिपोर्ट कैसे डाउनलोड करें',
        list: [
          'साइडबार से Reports खोलें।',
          'श्रेणी टैब चुनें: Attendance, Payroll, या Salary & Workforce।',
          'आवश्यक रिपोर्ट के लिए फ़िल्टर सेट करें (तारीख, महीना, कर्मचारी आदि)।',
          'फ़ाइल डाउनलोड करने के लिए Excel या PDF पर क्लिक करें।',
        ],
      },
      {
        title: 'हाजिरी रिपोर्ट',
        list: [
          'Daily Attendance Sheet — एक दिन में हर कर्मचारी का clock in/out और स्थिति।',
          'Monthly Attendance Summary — उपस्थित दिन, देरी की गिनती, घंटे और अधूरे दिन।',
          'Late Arrivals — तारीख सीमा में प्रति कर्मचारी देरी की गिनती।',
        ],
      },
      {
        title: 'पेरोल रिपोर्ट',
        list: [
          'Payment History — तारीख सीमा में भुगतान, वैकल्पिक कर्मचारी/स्थिति/प्रकार फ़िल्टर के साथ।',
          'Outstanding Payments — अवैतनिक वेतन या बकाया अग्रिम वाले कर्मचारी।',
          'Bonuses — निर्धारित और जारी बोनस।',
          'Salary Advances — अग्रिम अनुरोध और वसूली स्थिति।',
          'Balance Ledger — दे/ले बैलेंस लेनदेन।',
          'Employee Balances — प्रति कर्मचारी वर्तमान चालू बैलेंस।',
        ],
      },
      {
        title: 'वेतन और वर्कफोर्स रिपोर्ट',
        list: [
          'Salary Roster — सभी कर्मचारियों का वर्तमान मासिक वेतन।',
          'Employee Directory — संपर्क विवरण, विभाग और फेस नामांकन स्थिति।',
          'Dashboard Snapshot — एक दिन के लिए मुख्य वर्कफोर्स और हाजिरी मेट्रिक्स।',
        ],
      },
      {
        title: 'जानने योग्य बातें',
        list: [
          'निर्यात केवल आपके संगठन तक सीमित हैं।',
          'बड़ी तारीख सीमा सीमित हो सकती है — डाउनलोड विफल हो तो फ़िल्टर संकीर्ण करें।',
          'कोई तारीख न चुनने पर Payment history वर्तमान महीने पर डिफ़ॉल्ट होती है।',
        ],
        footer: [
          'यह भी देखें: ',
          docLink('/docs/payroll', 'भुगतान गाइड'),
          ' · ',
          docLink('/docs/salary', 'वेतन गाइड'),
          ' · ',
          docLink('/docs/analytics', 'Analytics'),
          '।',
        ],
      },
    ],
  },
  ml: {
    pageTitle: 'റിപ്പോർട്ടുകൾ',
    pageSubtitle: 'ഹാജറാതി, പേറോൾ, വർക്ക്‌ഫോഴ്സ് ഡാറ്റ Excel അല്ലെങ്കിൽ PDF ആയി ഡൗൺലോഡ് ചെയ്യുക.',
    sections: [
      {
        title: 'ഈ പേജ് എന്തിനാണ്',
        paragraphs: [
          [
            docLink('/admin/reports', 'Reports'),
            ' പേജിൽ നിന്ന് ഹാജറാതി, പേറോൾ, വർക്ക്‌ഫോഴ്സ് ഡാറ്റ Excel അല്ലെങ്കിൽ PDF ഫയലുകളായി ഡൗൺലോഡ് ചെയ്യാം. രേഖകൾ സൂക്ഷിക്കാനും മാനേജർമാരുമായി പങ്കിടാനും ഓഫ്‌ലൈൻ അവലോകനത്തിനും ഉപയോഗിക്കുക.',
          ],
        ],
      },
      {
        title: 'റിപ്പോർട്ട് എങ്ങനെ ഡൗൺലോഡ് ചെയ്യാം',
        list: [
          'സൈഡ്ബാറിൽ നിന്ന് Reports തുറക്കുക.',
          'വിഭാഗ ടാബ് തിരഞ്ഞെടുക്കുക: Attendance, Payroll, അല്ലെങ്കിൽ Salary & Workforce.',
          'ആവശ്യമായ റിപ്പോർട്ടിന് ഫിൽട്ടറുകൾ സജ്ജമാക്കുക (തീയതി, മാസം, ജീവനക്കാർ മുതലായവ).',
          'ഫയൽ ഡൗൺലോഡ് ചെയ്യാൻ Excel അല്ലെങ്കിൽ PDF ക്ലിക്ക് ചെയ്യുക.',
        ],
      },
      {
        title: 'ഹാജറാതി റിപ്പോർട്ടുകൾ',
        list: [
          'Daily Attendance Sheet — ഒരു ദിവസത്തിൽ ഓരോ ജീവനക്കാരുടെയും clock in/out, നില.',
          'Monthly Attendance Summary — ഹാജർ ദിവസങ്ങൾ, വൈകിയെത്തൽ എണ്ണം, മണിക്കൂറുകൾ, അപൂർണ്ണ ദിവസങ്ങൾ.',
          'Late Arrivals — തീയതി പരിധിയിൽ ജീവനക്കാരുടെ വൈകിയെത്തൽ എണ്ണം.',
        ],
      },
      {
        title: 'പേറോൾ റിപ്പോർട്ടുകൾ',
        list: [
          'Payment History — തീയതി പരിധിയിലെ പേയ്‌മെന്റുകൾ, ഓപ്ഷണൽ ജീവനക്കാർ/നില/തരം ഫിൽട്ടറുകളോടെ.',
          'Outstanding Payments — അടയ്ക്കാത്ത ശമ്പളമോ ബാക്കിയുള്ള അഡ്വാൻസോ ഉള്ള ജീവനക്കാർ.',
          'Bonuses — ഷെഡ്യൂൾ ചെയ്തതും പുറത്തിറക്കിയതുമായ ബോണസുകൾ.',
          'Salary Advances — അഡ്വാൻസ് അഭ്യർത്ഥനകളും തിരിച്ചടവ് നിലയും.',
          'Balance Ledger — കൊടുക്കൽ/എടുക്കൽ ബാലൻസ് ഇടപാടുകൾ.',
          'Employee Balances — ഓരോ ജീവനക്കാരുടെയും നിലവിലെ റണ്ണിംഗ് ബാലൻസ്.',
        ],
      },
      {
        title: 'ശമ്പള, വർക്ക്‌ഫോഴ്സ് റിപ്പോർട്ടുകൾ',
        list: [
          'Salary Roster — എല്ലാ ജീവനക്കാരുടെയും നിലവിലെ മാസ ശമ്പളം.',
          'Employee Directory — ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ, വകുപ്പ്, ഫേസ് എൻറോൾമെന്റ് നില.',
          'Dashboard Snapshot — ഒരു ദിവസത്തെ പ്രധാന വർക്ക്‌ഫോഴ്സ്, ഹാജറാതി മെട്രിക്സ്.',
        ],
      },
      {
        title: 'അറിയേണ്ടത്',
        list: [
          'എക്സ്പോർട്ടുകൾ നിങ്ങളുടെ സംഘടനയിൽ മാത്രമേ.',
          'വലിയ തീയതി പരിധി പരിമിതമായിരിക്കാം — ഡൗൺലോഡ് പരാജയപ്പെട്ടാൽ ഫിൽട്ടർ ചെറുതാക്കുക.',
          'തീയതി തിരഞ്ഞെടുക്കാത്തപ്പോൾ Payment history നിലവിലെ മാസത്തിലേക്ക് ഡിഫോൾട്ട് ചെയ്യുന്നു.',
        ],
        footer: [
          'കൂടി കാണുക: ',
          docLink('/docs/payroll', 'പേയ്‌മെന്റ് ഗൈഡ്'),
          ' · ',
          docLink('/docs/salary', 'ശമ്പള ഗൈഡ്'),
          ' · ',
          docLink('/docs/analytics', 'Analytics'),
          '.',
        ],
      },
    ],
  },
  kn: {
    pageTitle: 'ವರದಿಗಳು',
    pageSubtitle: 'ಹಾಜರಾತಿ, ಪೇರೋಲ್ ಮತ್ತು ವರ್ಕ್‌ಫೋರ್ಸ್ ಡೇಟಾವನ್ನು Excel ಅಥವಾ PDF ಆಗಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.',
    sections: [
      {
        title: 'ಈ ಪುಟ ಯಾವುದಕ್ಕಾಗಿ',
        paragraphs: [
          [
            docLink('/admin/reports', 'Reports'),
            ' ಪುಟದಿಂದ ಹಾಜರಾತಿ, ಪೇರೋಲ್ ಮತ್ತು ವರ್ಕ್‌ಫೋರ್ಸ್ ಡೇಟಾವನ್ನು Excel ಅಥವಾ PDF ಫೈಲ್‌ಗಳಾಗಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಬಹುದು. ದಾಖಲೆಗಳಿಗಾಗಿ, ಮ್ಯಾನೇಜರ್‌ಗಳೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಲು ಅಥವಾ ಆಫ್‌ಲೈನ್ ಪರಿಶೀಲನೆಗೆ ಬಳಸಿ.',
          ],
        ],
      },
      {
        title: 'ವರದಿಯನ್ನು ಹೇಗೆ ಡೌನ್‌ಲೋಡ್ ಮಾಡುವುದು',
        list: [
          'ಸೈಡ್‌ಬಾರ್‌ನಿಂದ Reports ತೆರೆಯಿರಿ.',
          'ವರ್ಗ ಟ್ಯಾಬ್ ಆಯ್ಕೆಮಾಡಿ: Attendance, Payroll, ಅಥವಾ Salary & Workforce.',
          'ಅಗತ್ಯವಿರುವ ವರದಿಗೆ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಹೊಂದಿಸಿ (ದಿನಾಂಕ, ತಿಂಗಳು, ಉದ್ಯೋಗಿ ಇತ್ಯಾದಿ).',
          'ಫೈಲ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಲು Excel ಅಥವಾ PDF ಕ್ಲಿಕ್ ಮಾಡಿ.',
        ],
      },
      {
        title: 'ಹಾಜರಾತಿ ವರದಿಗಳು',
        list: [
          'Daily Attendance Sheet — ಒಂದು ದಿನದಲ್ಲಿ ಪ್ರತಿ ಉದ್ಯೋಗಿಯ clock in/out ಮತ್ತು ಸ್ಥಿತಿ.',
          'Monthly Attendance Summary — ಹಾಜರಾದ ದಿನಗಳು, ತಡವಾದ ಎಣಿಕೆ, ಗಂಟೆಗಳು ಮತ್ತು ಅಪೂರ್ಣ ದಿನಗಳು.',
          'Late Arrivals — ದಿನಾಂಕ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಉದ್ಯೋಗಿಗಳ ತಡವಾದ ಎಣಿಕೆ.',
        ],
      },
      {
        title: 'ಪೇರೋಲ್ ವರದಿಗಳು',
        list: [
          'Payment History — ದಿನಾಂಕ ವ್ಯಾಪ್ತಿಯಲ್ಲಿ ಪೇಮೆಂಟ್‌ಗಳು, ಐಚ್ಛಿಕ ಉದ್ಯೋಗಿ/ಸ್ಥಿತಿ/ಪ್ರಕಾರ ಫಿಲ್ಟರ್‌ಗಳೊಂದಿಗೆ.',
          'Outstanding Payments — ಪಾವತಿಸದ ಸಂಬಳ ಅಥವಾ ಬಾಕಿ ಮುಂಗಡವಿರುವ ಉದ್ಯೋಗಿಗಳು.',
          'Bonuses — ನಿಗದಿಪಡಿಸಿದ ಮತ್ತು ಬಿಡುಗಡೆ ಮಾಡಿದ ಬೋನಸ್‌ಗಳು.',
          'Salary Advances — ಮುಂಗಡ ವಿನಂತಿಗಳು ಮತ್ತು ವಸೂಲಿ ಸ್ಥಿತಿ.',
          'Balance Ledger — ಕೊಡು/ತೆಗೆ ಬ್ಯಾಲೆನ್ಸ್ ವಹಿವಾಟುಗಳು.',
          'Employee Balances — ಪ್ರತಿ ಉದ್ಯೋಗಿಯ ಪ್ರಸ್ತುತ ಚಾಲೂ ಬ್ಯಾಲೆನ್ಸ್.',
        ],
      },
      {
        title: 'ಸಂಬಳ ಮತ್ತು ವರ್ಕ್‌ಫೋರ್ಸ್ ವರದಿಗಳು',
        list: [
          'Salary Roster — ಎಲ್ಲಾ ಉದ್ಯೋಗಿಗಳ ಪ್ರಸ್ತುತ ಮಾಸಿಕ ಸಂಬಳ.',
          'Employee Directory — ಸಂಪರ್ಕ ವಿವರಗಳು, ವಿಭಾಗ ಮತ್ತು ಮುಖ ನೋಂದಣಿ ಸ್ಥಿತಿ.',
          'Dashboard Snapshot — ಒಂದು ದಿನಕ್ಕೆ ಪ್ರಮುಖ ವರ್ಕ್‌ಫೋರ್ಸ್ ಮತ್ತು ಹಾಜರಾತಿ ಮೆಟ್ರಿಕ್ಸ್.',
        ],
      },
      {
        title: 'ತಿಳಿದುಕೊಳ್ಳಬೇಕಾದವು',
        list: [
          'ರಫ್ತುಗಳು ನಿಮ್ಮ ಸಂಸ್ಥೆಗೆ ಮಾತ್ರ ಸೀಮಿತವಾಗಿವೆ.',
          'ದೊಡ್ಡ ದಿನಾಂಕ ವ್ಯಾಪ್ತಿ ಪರಿಮಿತವಾಗಿರಬಹುದು — ಡೌನ್‌ಲೋಡ್ ವಿಫಲವಾದರೆ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಕುಗ್ಗಿಸಿ.',
          'ದಿನಾಂಕಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡದಿದ್ದಾಗ Payment history ಪ್ರಸ್ತುತ ತಿಂಗಳಿಗೆ ಡಿಫಾಲ್ಟ್ ಆಗುತ್ತದೆ.',
        ],
        footer: [
          'ಇದನ್ನೂ ನೋಡಿ: ',
          docLink('/docs/payroll', 'ಪೇಮೆಂಟ್ ಮಾರ್ಗದರ್ಶಿ'),
          ' · ',
          docLink('/docs/salary', 'ಸಂಬಳ ಮಾರ್ಗದರ್ಶಿ'),
          ' · ',
          docLink('/docs/analytics', 'Analytics'),
          '.',
        ],
      },
    ],
  },
};
