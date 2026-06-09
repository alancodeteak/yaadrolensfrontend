export const ANALYTICS_GUIDE_STEPS = [
  {
    id: 'month-picker',
    selector: '[data-tour="month-picker"]',
    title: 'Month selector',
    body: 'Pick any day in a month to load analytics for that month. Use the arrows to move to the previous or next month.',
  },
  {
    id: 'kpi-month',
    selector: '[data-tour="kpi-month"]',
    title: 'This month',
    body: 'Month-level KPIs: average attendance rate, punctuality, total hours worked, and total late arrivals.',
  },
  {
    id: 'kpi-snapshot',
    selector: '[data-tour="kpi-snapshot"]',
    title: 'Day snapshot',
    body: 'A quick look at the selected day — how many employees were present, absent, late, and the present rate.',
  },
  {
    id: 'heatmap',
    selector: '[data-tour="heatmap"]',
    title: 'Month heatmap',
    body: 'A calendar view of the month. Green days mean everyone was present; orange means some absences. Hover a day for details.',
  },
  {
    id: 'month-overview',
    selector: '[data-tour="month-overview"]',
    title: 'Month overview',
    body: 'Activity rings summarizing month health: average attendance, punctuality, and hours utilization.',
  },
  {
    id: 'daily-trend',
    selector: '[data-tour="daily-trend"]',
    title: 'Daily trend',
    body: 'Stacked bars showing present vs absent headcount for each day of the month. Scroll horizontally when needed.',
  },
  {
    id: 'top-late',
    selector: '[data-tour="top-late"]',
    title: 'Top late arrivals',
    body: 'Employees with the most late clock-ins this month, ranked in a horizontal bar chart.',
  },
  {
    id: 'hours-worked',
    selector: '[data-tour="hours-worked"]',
    title: 'Hours worked',
    body: 'Top employees by total hours logged this month.',
  },
  {
    id: 'employee-table',
    selector: '[data-tour="employee-table"]',
    title: 'Employee summary',
    body: 'Per-employee monthly breakdown: days present, late count, hours worked, and incomplete days.',
  },
];
