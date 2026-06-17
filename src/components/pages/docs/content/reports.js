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
    pageTitle: 'Reports',
    pageSubtitle: 'हाजिरी, पेरोल और वर्कफोर्स डेटा Excel या PDF के रूप में डाउनलोड करें।',
    sections: enSections,
  },
  ml: {
    pageTitle: 'Reports',
    pageSubtitle: 'ഹാജറാതി, പേറോൾ, വർക്ക്‌ഫോഴ്സ് ഡാറ്റ Excel അല്ലെങ്കിൽ PDF ആയി ഡൗൺലോഡ് ചെയ്യുക.',
    sections: enSections,
  },
  kn: {
    pageTitle: 'Reports',
    pageSubtitle: 'ಹಾಜರಾತಿ, ಪೇರೋಲ್ ಮತ್ತು ವರ್ಕ್‌ಫೋರ್ಸ್ ಡೇಟಾವನ್ನು Excel ಅಥವಾ PDF ಆಗಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ.',
    sections: enSections,
  },
};
