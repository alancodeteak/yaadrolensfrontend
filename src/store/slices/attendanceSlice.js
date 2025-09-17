import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  liveAttendance: [],
  attendanceHistory: [],
  attendanceStats: {
    present: 0,
    absent: 0,
    late: 0,
    total: 0,
  },
  currentUserAttendance: null,
  loading: false,
  error: null,
  filters: {
    date: new Date().toISOString().split('T')[0],
    department: 'all',
    status: 'all',
  },
  isLiveMode: false,
};

const attendanceSlice = createSlice({
  name: 'attendance',
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

    // Live attendance
    setLiveAttendance: (state, action) => {
      state.liveAttendance = action.payload;
      state.loading = false;
    },
    updateLiveAttendance: (state, action) => {
      const { userId, status, timestamp } = action.payload;
      const existingIndex = state.liveAttendance.findIndex(
        attendance => attendance.userId === userId
      );
      
      if (existingIndex !== -1) {
        state.liveAttendance[existingIndex] = {
          ...state.liveAttendance[existingIndex],
          status,
          timestamp,
        };
      } else {
        state.liveAttendance.push(action.payload);
      }
    },

    // Attendance history
    setAttendanceHistory: (state, action) => {
      state.attendanceHistory = action.payload;
      state.loading = false;
    },
    addAttendanceRecord: (state, action) => {
      state.attendanceHistory.push(action.payload);
    },

    // Attendance statistics
    setAttendanceStats: (state, action) => {
      state.attendanceStats = action.payload;
    },
    updateAttendanceStats: (state) => {
      const stats = state.liveAttendance.reduce(
        (acc, attendance) => {
          acc.total += 1;
          switch (attendance.status) {
            case 'present':
              acc.present += 1;
              break;
            case 'absent':
              acc.absent += 1;
              break;
            case 'late':
              acc.late += 1;
              break;
            default:
              break;
          }
          return acc;
        },
        { present: 0, absent: 0, late: 0, total: 0 }
      );
      state.attendanceStats = stats;
    },

    // Current user attendance
    setCurrentUserAttendance: (state, action) => {
      state.currentUserAttendance = action.payload;
      state.loading = false;
    },

    // Live mode toggle
    toggleLiveMode: (state) => {
      state.isLiveMode = !state.isLiveMode;
    },
    setLiveMode: (state, action) => {
      state.isLiveMode = action.payload;
    },

    // Filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        date: new Date().toISOString().split('T')[0],
        department: 'all',
        status: 'all',
      };
    },

    // Mark attendance
    markAttendance: (state, action) => {
      const { userId, status } = action.payload;
      const timestamp = new Date().toISOString();
      
      // Update live attendance
      const liveIndex = state.liveAttendance.findIndex(
        attendance => attendance.userId === userId
      );
      
      if (liveIndex !== -1) {
        state.liveAttendance[liveIndex] = {
          ...state.liveAttendance[liveIndex],
          status,
          timestamp,
        };
      }
      
      // Add to history
      state.attendanceHistory.push({
        userId,
        status,
        timestamp,
        date: new Date().toISOString().split('T')[0],
      });
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setLiveAttendance,
  updateLiveAttendance,
  setAttendanceHistory,
  addAttendanceRecord,
  setAttendanceStats,
  updateAttendanceStats,
  setCurrentUserAttendance,
  toggleLiveMode,
  setLiveMode,
  setFilters,
  resetFilters,
  markAttendance,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
