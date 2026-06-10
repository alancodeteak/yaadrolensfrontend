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
    pageTitle: 'Payment',
    pageSubtitle: 'अपनी टीम के लिए भुगतान दर्ज करें और वेतन अग्रिम प्रबंधित करें।',
    sections: enSections,
  },
  ml: {
    pageTitle: 'Payment',
    pageSubtitle: 'നിങ്ങളുടെ ടീമിനായി പേയ്‌മെന്റുകൾ രേഖപ്പെടുത്തി സാലറി അഡ്വാൻസ് കൈകാര്യം ചെയ്യുക.',
    sections: enSections,
  },
  kn: {
    pageTitle: 'Payment',
    pageSubtitle: 'ನಿಮ್ಮ ತಂಡಕ್ಕಾಗಿ ಪೇಮೆಂಟ್‌ಗಳನ್ನು ದಾಖಲಿಸಿ ಮತ್ತು ಸಂಬಳ ಮುಂಗಡ ನಿರ್ವಹಿಸಿ.',
    sections: enSections,
  },
};
