import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  generalSettings: {
    companyName: '',
    companyLogo: '',
    timezone: 'UTC',
    dateFormat: 'DD/MM/YYYY',
    currency: 'USD',
    language: 'en',
  },
  attendanceSettings: {
    workingHours: {
      start: '09:00',
      end: '17:00',
    },
    lateThreshold: 15, // minutes
    overtimeThreshold: 8, // hours
    weekendWork: false,
    holidays: [],
  },
  payrollSettings: {
    payrollCycle: 'monthly', // weekly, bi-weekly, monthly
    payDay: 1, // day of month or week
    taxSettings: {
      incomeTax: 0,
      socialSecurity: 0,
      medicare: 0,
    },
    allowances: [],
    deductions: [],
  },
  notificationSettings: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    notificationTypes: {
      attendance: true,
      payroll: true,
      userRegistration: true,
      systemUpdates: false,
    },
  },
  securitySettings: {
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    sessionTimeout: 30, // minutes
    twoFactorAuth: false,
    loginAttempts: 3,
  },
  backupSettings: {
    autoBackup: true,
    backupFrequency: 'daily', // daily, weekly, monthly
    backupRetention: 30, // days
    lastBackup: null,
  },
  loading: false,
  error: null,
  saveStatus: 'idle', // idle, saving, saved, error
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.saveStatus = 'error';
    },
    clearError: (state) => {
      state.error = null;
    },

    // Save status
    setSaveStatus: (state, action) => {
      state.saveStatus = action.payload;
    },

    // General settings
    updateGeneralSettings: (state, action) => {
      state.generalSettings = { ...state.generalSettings, ...action.payload };
      state.saveStatus = 'saving';
    },

    // Attendance settings
    updateAttendanceSettings: (state, action) => {
      state.attendanceSettings = { ...state.attendanceSettings, ...action.payload };
      state.saveStatus = 'saving';
    },
    updateWorkingHours: (state, action) => {
      state.attendanceSettings.workingHours = { ...state.attendanceSettings.workingHours, ...action.payload };
      state.saveStatus = 'saving';
    },
    addHoliday: (state, action) => {
      state.attendanceSettings.holidays.push(action.payload);
      state.saveStatus = 'saving';
    },
    removeHoliday: (state, action) => {
      state.attendanceSettings.holidays = state.attendanceSettings.holidays.filter(
        holiday => holiday.id !== action.payload
      );
      state.saveStatus = 'saving';
    },

    // Payroll settings
    updatePayrollSettings: (state, action) => {
      state.payrollSettings = { ...state.payrollSettings, ...action.payload };
      state.saveStatus = 'saving';
    },
    updateTaxSettings: (state, action) => {
      state.payrollSettings.taxSettings = { ...state.payrollSettings.taxSettings, ...action.payload };
      state.saveStatus = 'saving';
    },
    addAllowance: (state, action) => {
      state.payrollSettings.allowances.push(action.payload);
      state.saveStatus = 'saving';
    },
    removeAllowance: (state, action) => {
      state.payrollSettings.allowances = state.payrollSettings.allowances.filter(
        allowance => allowance.id !== action.payload
      );
      state.saveStatus = 'saving';
    },
    addDeduction: (state, action) => {
      state.payrollSettings.deductions.push(action.payload);
      state.saveStatus = 'saving';
    },
    removeDeduction: (state, action) => {
      state.payrollSettings.deductions = state.payrollSettings.deductions.filter(
        deduction => deduction.id !== action.payload
      );
      state.saveStatus = 'saving';
    },

    // Notification settings
    updateNotificationSettings: (state, action) => {
      state.notificationSettings = { ...state.notificationSettings, ...action.payload };
      state.saveStatus = 'saving';
    },
    updateNotificationTypes: (state, action) => {
      state.notificationSettings.notificationTypes = {
        ...state.notificationSettings.notificationTypes,
        ...action.payload
      };
      state.saveStatus = 'saving';
    },

    // Security settings
    updateSecuritySettings: (state, action) => {
      state.securitySettings = { ...state.securitySettings, ...action.payload };
      state.saveStatus = 'saving';
    },
    updatePasswordPolicy: (state, action) => {
      state.securitySettings.passwordPolicy = {
        ...state.securitySettings.passwordPolicy,
        ...action.payload
      };
      state.saveStatus = 'saving';
    },

    // Backup settings
    updateBackupSettings: (state, action) => {
      state.backupSettings = { ...state.backupSettings, ...action.payload };
      state.saveStatus = 'saving';
    },
    setLastBackup: (state, action) => {
      state.backupSettings.lastBackup = action.payload;
    },

    // Load all settings
    loadSettings: (state, action) => {
      const settings = action.payload;
      state.generalSettings = settings.generalSettings || state.generalSettings;
      state.attendanceSettings = settings.attendanceSettings || state.attendanceSettings;
      state.payrollSettings = settings.payrollSettings || state.payrollSettings;
      state.notificationSettings = settings.notificationSettings || state.notificationSettings;
      state.securitySettings = settings.securitySettings || state.securitySettings;
      state.backupSettings = settings.backupSettings || state.backupSettings;
      state.loading = false;
    },

    // Reset settings
    resetToDefaults: (state) => {
      return { ...initialState, loading: false, error: null };
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setSaveStatus,
  updateGeneralSettings,
  updateAttendanceSettings,
  updateWorkingHours,
  addHoliday,
  removeHoliday,
  updatePayrollSettings,
  updateTaxSettings,
  addAllowance,
  removeAllowance,
  addDeduction,
  removeDeduction,
  updateNotificationSettings,
  updateNotificationTypes,
  updateSecuritySettings,
  updatePasswordPolicy,
  updateBackupSettings,
  setLastBackup,
  loadSettings,
  resetToDefaults,
} = settingsSlice.actions;

export default settingsSlice.reducer;
