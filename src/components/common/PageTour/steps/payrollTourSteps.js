export const PAYROLL_GUIDE_STEPS = [
  {
    id: 'payroll-period',
    selector: '[data-tour="payroll-period"]',
    title: 'Payroll period',
    body: 'Choose the month and year to view or calculate payroll for that period.',
  },
  {
    id: 'payroll-stats',
    selector: '[data-tour="payroll-stats"]',
    title: 'Period summary',
    body: 'See total gross pay, deductions, net pay, and approval status for the selected period.',
  },
  {
    id: 'payroll-actions',
    selector: '[data-tour="payroll-actions"]',
    title: 'Payroll actions',
    body: 'Calculate payroll from attendance and salaries, approve runs, mark as paid, or export to CSV.',
  },
  {
    id: 'payroll-table',
    selector: '[data-tour="payroll-table"]',
    title: 'Employee payroll',
    body: 'Review each employee\'s payroll line. Open details to approve or mark individual runs as paid.',
  },
];
