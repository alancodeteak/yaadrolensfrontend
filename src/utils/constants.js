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

// Live Activity Types
export const ACTIVITY_TYPES = {
  FACE_SCAN: 'Face Scan',
  MOVEMENT_DETECTED: 'Movement Detected',
  CLOCK_IN: 'Clock In',
  CLOCK_OUT: 'Clock Out',
};

// Live Activity Status Colors
export const ACTIVITY_STATUS_COLORS = {
  'Present': 'bg-green-50 text-green-700 ring-1 ring-green-200',
  'Present (Late)': 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
  'Absent': 'bg-red-50 text-red-700 ring-1 ring-red-200',
  'On Leave': 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
};

// Live Activity Status Dot Colors
export const ACTIVITY_DOT_COLORS = {
  'Present': 'bg-green-500',
  'Present (Late)': 'bg-yellow-500',
  'Absent': 'bg-red-500',
  'On Leave': 'bg-blue-500',
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
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
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
