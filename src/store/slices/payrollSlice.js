import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  payrolls: [],
  currentPayroll: null,
  payrollSummary: {
    totalEmployees: 0,
    totalSalary: 0,
    totalDeductions: 0,
    netPayroll: 0,
  },
  loading: false,
  error: null,
  filters: {
    month: new Date().getMonth() + 1, // Current month (1-12)
    year: new Date().getFullYear(),   // Current year
    department: 'all',
    status: 'all',
  },
  currentPeriod: {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    monthName: new Date().toLocaleString('en-US', { month: 'long' })
  },
};

const payrollSlice = createSlice({
  name: 'payroll',
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

    // Payroll management
    setPayrolls: (state, action) => {
      state.payrolls = action.payload;
      state.loading = false;
    },
    addPayroll: (state, action) => {
      state.payrolls.push(action.payload);
    },
    updatePayroll: (state, action) => {
      const index = state.payrolls.findIndex(payroll => payroll.id === action.payload.id);
      if (index !== -1) {
        state.payrolls[index] = { ...state.payrolls[index], ...action.payload };
      }
    },
    deletePayroll: (state, action) => {
      state.payrolls = state.payrolls.filter(payroll => payroll.id !== action.payload);
    },

    // Current payroll details
    setCurrentPayroll: (state, action) => {
      state.currentPayroll = action.payload;
      state.loading = false;
    },

    // Payroll summary
    setPayrollSummary: (state, action) => {
      state.payrollSummary = action.payload;
    },

    // Process payroll
    processPayroll: (state, action) => {
      const { payrollIds } = action.payload;
      state.payrolls = state.payrolls.map(payroll => 
        payrollIds.includes(payroll.id) 
          ? { ...payroll, status: 'processed', processedDate: new Date().toISOString() }
          : payroll
      );
    },

    // Filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      const currentDate = new Date();
      state.filters = {
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        department: 'all',
        status: 'all',
      };
      state.currentPeriod = {
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        monthName: currentDate.toLocaleString('en-US', { month: 'long' })
      };
    },
    
    // Set current period
    setCurrentPeriod: (state, action) => {
      const { month, year } = action.payload;
      state.currentPeriod = {
        month,
        year,
        monthName: new Date(year, month - 1).toLocaleString('en-US', { month: 'long' })
      };
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setPayrolls,
  addPayroll,
  updatePayroll,
  deletePayroll,
  setCurrentPayroll,
  setPayrollSummary,
  processPayroll,
  setFilters,
  resetFilters,
  setCurrentPeriod,
} = payrollSlice.actions;

export default payrollSlice.reducer;
