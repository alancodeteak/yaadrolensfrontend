import { docLink } from '../docsI18n';

const enSections = [
  {
    title: 'What this page is for',
    paragraphs: [
      [
        'The ',
        docLink('/admin/payroll', 'Payment'),
        ' page is for monthly payroll runs — calculate pay from salaries and attendance, review totals, approve, and export.',
      ],
    ],
  },
  {
    title: 'Workflow',
    list: [
      'Choose the month and year, then click Load.',
      'Click Calculate payroll to generate runs for active employees with salaries set.',
      'Review gross pay, deductions, and net pay in the table.',
      'Approve runs when totals look correct, then mark as paid after payment.',
      'Export CSV for your records or accounting system.',
    ],
  },
  {
    title: 'Before you start',
    list: [
      'Set employee salaries on the Salary page first.',
      'Attendance for the period should be recorded via the kiosk.',
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
    pageTitle: 'Payment / Payroll',
    pageSubtitle: 'Calculate and approve monthly payroll for your team.',
    sections: enSections,
  },
  hi: {
    pageTitle: 'Payment / Payroll',
    pageSubtitle: 'अपनी टीम के लिए मासिक पेरोल की गणना और अनुमोदन करें।',
    sections: enSections,
  },
  ml: {
    pageTitle: 'Payment / Payroll',
    pageSubtitle: 'നിങ്ങളുടെ ടീമിനായി മാസ പേറോൾ കണക്കാക്കി അംഗീകരിക്കുക.',
    sections: enSections,
  },
  kn: {
    pageTitle: 'Payment / Payroll',
    pageSubtitle: 'ನಿಮ್ಮ ತಂಡಕ್ಕಾಗಿ ಮಾಸಿಕ ಪೇರೋಲ್ ಲೆಕ್ಕಾಚಾರ ಮಾಡಿ ಅನುಮೋದಿಸಿ.',
    sections: enSections,
  },
};
