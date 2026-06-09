export const ATTENDANCE_GUIDE_STEPS = [
  {
    id: 'live-activity',
    selector: '[data-tour="live-activity"]',
    title: 'Live activity',
    body: 'Real-time feed of clock-in and clock-out events for the selected date.',
  },
  {
    id: 'today-kpis',
    selector: '[data-tour="today-kpis"]',
    title: 'Today',
    body: 'Quick counts for present, absent, late, and total employees on the selected day.',
  },
  {
    id: 'filters',
    selector: '[data-tour="filters"]',
    title: 'Filters',
    body: 'Pick a date, search by name or employee code, filter by status, and refresh data manually.',
  },
  {
    id: 'employee-table',
    selector: '[data-tour="employee-table"]',
    title: 'Employee status',
    body: 'Full list of employees with status, clock-in time, and last seen. Click a row to view employee details.',
  },
  {
    id: 'hourly-chart',
    selector: '[data-tour="hourly-chart"]',
    title: 'Clock-ins by hour',
    body: 'Bar chart showing when employees arrived throughout the day — useful for spotting peak arrival times.',
  },
];
