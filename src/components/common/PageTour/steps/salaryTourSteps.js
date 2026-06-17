export const SALARY_GUIDE_STEPS = [
  {
    id: 'salary-stats',
    selector: '[data-tour="salary-stats"]',
    title: 'Salary overview',
    body: 'See how many employees have salaries set and your total monthly payroll at a glance.',
  },
  {
    id: 'salary-filters',
    selector: '[data-tour="salary-filters"]',
    title: 'Search and filter',
    body: 'Find employees by name or code. Filter by active/inactive status or show only those without a salary set.',
  },
  {
    id: 'salary-table',
    selector: '[data-tour="salary-table"]',
    title: 'Salary table',
    body: 'View each employee\'s current monthly salary, when it was last changed, and their status.',
  },
  {
    id: 'salary-actions',
    selector: '[data-tour="salary-actions"]',
    title: 'Edit and history',
    body: 'Update a salary with an effective date and reason, or open the full change history for any employee.',
  },
];
