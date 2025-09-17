import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  currentUser: null,
  pendingUsers: [],
  loading: false,
  error: null,
  totalUsers: 0,
  filters: {
    search: '',
    status: 'all',
    department: 'all',
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1,
  },
};

const userSlice = createSlice({
  name: 'user',
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

    // Users management
    setUsers: (state, action) => {
      state.users = action.payload;
      state.loading = false;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
      state.totalUsers += 1;
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
      }
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
      state.totalUsers -= 1;
    },

    // Current user details
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
    },

    // Pending users
    setPendingUsers: (state, action) => {
      state.pendingUsers = action.payload;
      state.loading = false;
    },
    approveUser: (state, action) => {
      const userId = action.payload;
      state.pendingUsers = state.pendingUsers.filter(user => user.id !== userId);
      // Move to approved users
      const approvedUser = state.pendingUsers.find(user => user.id === userId);
      if (approvedUser) {
        state.users.push({ ...approvedUser, status: 'approved' });
      }
    },
    rejectUser: (state, action) => {
      state.pendingUsers = state.pendingUsers.filter(user => user.id !== action.payload);
    },

    // Filters and pagination
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        search: '',
        status: 'all',
        department: 'all',
      };
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setUsers,
  addUser,
  updateUser,
  deleteUser,
  setCurrentUser,
  setPendingUsers,
  approveUser,
  rejectUser,
  setFilters,
  setPagination,
  resetFilters,
} = userSlice.actions;

export default userSlice.reducer;
