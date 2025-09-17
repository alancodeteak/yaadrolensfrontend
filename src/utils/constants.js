// API Endpoints
export const API_ENDPOINTS = {
  AUTH: '/auth',
  USERS: '/users',
  PAYROLL: '/payroll',
  ATTENDANCE: '/attendance',
  REPORTS: '/reports',
  SETTINGS: '/settings',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
  HR: 'hr',
};

// User Status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  SUSPENDED: 'suspended',
};

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  HALF_DAY: 'half_day',
  HOLIDAY: 'holiday',
  LEAVE: 'leave',
};

// Payroll Status
export const PAYROLL_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PROCESSED: 'processed',
  PAID: 'paid',
  CANCELLED: 'cancelled',
};

// Report Types
export const REPORT_TYPES = {
  ATTENDANCE: 'attendance',
  PAYROLL: 'payroll',
  USER_ACTIVITY: 'user_activity',
  DEPARTMENT_SUMMARY: 'department_summary',
  MONTHLY_SUMMARY: 'monthly_summary',
  ANNUAL_SUMMARY: 'annual_summary',
};

// Departments
export const DEPARTMENTS = [
  'IT',
  'HR',
  'Finance',
  'Marketing',
  'Operations',
  'Sales',
  'Support',
  'Management',
];

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'DD/MM/YYYY HH:mm',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  PREFERENCES: 'preferences',
};

// Theme Options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};
