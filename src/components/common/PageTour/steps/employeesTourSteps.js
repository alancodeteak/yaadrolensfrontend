export const EMPLOYEES_GUIDE_STEPS = [
  {
    id: 'header-actions',
    selector: '[data-tour="header-actions"]',
    title: 'Search & actions',
    body: 'Search employees by name, switch between active and deactivated lists, and add new employees.',
  },
  {
    id: 'filter-sort',
    selector: '[data-tour="filter-sort"]',
    title: 'Filter & sort',
    body: 'Filter by department and sort the list by name, department, status, or date added.',
  },
  {
    id: 'employee-table',
    selector: '[data-tour="employee-table"]',
    title: 'Employee table',
    body: 'Browse all employees with department, status, and face enrollment. Edit or deactivate from the row actions.',
  },
  {
    id: 'pagination',
    selector: '[data-tour="pagination"]',
    title: 'Pagination',
    body: 'Navigate between pages when you have more employees than fit on one screen.',
  },
];
