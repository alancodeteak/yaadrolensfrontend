export const PAYROLL_GUIDE_STEPS = [
  {
    id: 'payroll-period',
    selector: '[data-tour="payroll-period"]',
    title: 'Payment period',
    body: 'Choose the month and year to filter the payment ledger for that period.',
  },
  {
    id: 'payroll-stats',
    selector: '[data-tour="payroll-stats"]',
    title: 'Summary',
    body: 'See how much was paid this month, outstanding advances, and pending advance requests.',
  },
  {
    id: 'payroll-actions',
    selector: '[data-tour="payroll-actions"]',
    title: 'Actions',
    body: 'Record a new payment on the Ledger tab, or request a salary advance on the Advances tab.',
  },
  {
    id: 'payroll-table',
    selector: '[data-tour="payroll-table"]',
    title: 'Ledger & advances',
    body: 'Review payment records or manage advance requests — approve, disburse, recover, or view history.',
  },
];
