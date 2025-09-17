import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reports: [],
  currentReport: null,
  reportTypes: [
    'attendance',
    'payroll',
    'user_activity',
    'department_summary',
    'monthly_summary',
    'annual_summary',
  ],
  loading: false,
  error: null,
  filters: {
    type: 'all',
    dateRange: {
      startDate: '',
      endDate: '',
    },
    department: 'all',
    status: 'all',
  },
  exportLoading: false,
};

const reportSlice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },

    // Reports management
    setReports: (state, action) => {
      state.reports = action.payload;
      state.loading = false;
    },
    addReport: (state, action) => {
      state.reports.push(action.payload);
    },
    updateReport: (state, action) => {
      const index = state.reports.findIndex(report => report.id === action.payload.id);
      if (index !== -1) {
        state.reports[index] = { ...state.reports[index], ...action.payload };
      }
    },
    deleteReport: (state, action) => {
      state.reports = state.reports.filter(report => report.id !== action.payload);
    },

    // Current report
    setCurrentReport: (state, action) => {
      state.currentReport = action.payload;
      state.loading = false;
    },

    // Generate report
    generateReport: (state, action) => {
      const newReport = {
        id: Date.now().toString(),
        ...action.payload,
        status: 'generating',
        createdAt: new Date().toISOString(),
      };
      state.reports.push(newReport);
    },
    updateReportStatus: (state, action) => {
      const { reportId, status, data } = action.payload;
      const index = state.reports.findIndex(report => report.id === reportId);
      if (index !== -1) {
        state.reports[index] = {
          ...state.reports[index],
          status,
          data: data || state.reports[index].data,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    // Export functionality
    setExportLoading: (state, action) => {
      state.exportLoading = action.payload;
    },

    // Filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setDateRange: (state, action) => {
      state.filters.dateRange = action.payload;
    },
    resetFilters: (state) => {
      state.filters = {
        type: 'all',
        dateRange: {
          startDate: '',
          endDate: '',
        },
        department: 'all',
        status: 'all',
      };
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setReports,
  addReport,
  updateReport,
  deleteReport,
  setCurrentReport,
  generateReport,
  updateReportStatus,
  setExportLoading,
  setFilters,
  setDateRange,
  resetFilters,
} = reportSlice.actions;

export default reportSlice.reducer;
