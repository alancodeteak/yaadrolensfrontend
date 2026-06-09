import { docLink, docStrong } from '../docsI18n';

const enSections = [
  {
    title: 'What this page is for',
    paragraphs: [
      [
        'The ',
        docLink('/admin/salary', 'Salary'),
        ' page lets you set and update each employee\'s monthly salary (USD) and review a full change history.',
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
    pageTitle: 'Salary',
    pageSubtitle: 'मासिक वेतन सेट करें और बदलाव का इतिहास देखें।',
    sections: enSections,
  },
  ml: {
    pageTitle: 'Salary',
    pageSubtitle: 'മാസ ശമ്പളം സജ്ജമാക്കുക, മാറ്റ ചരിത്രം കാണുക.',
    sections: enSections,
  },
  kn: {
    pageTitle: 'Salary',
    pageSubtitle: 'ಮಾಸಿಕ ಸಂಬಳ ಹೊಂದಿಸಿ ಮತ್ತು ಬದಲಾವಣೆ ಇತಿಹಾಸ ನೋಡಿ.',
    sections: enSections,
  },
};
