import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedEmployee: null,
  filters: {
    department: 'all',
    status: 'active',
    search: '',
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
  },
  view: {
    showActiveEmployees: true,
    sortBy: 'name',
    sortOrder: 'asc',
  },
  ui: {
    isModalOpen: false,
    isEditModalOpen: false,
    isConfirmDialogOpen: false,
    loading: false,
    error: null,
  },
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    // Employee selection
    setSelectedEmployee: (state, action) => {
      state.selectedEmployee = action.payload;
    },
    clearSelectedEmployee: (state) => {
      state.selectedEmployee = null;
    },

    // Filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setDepartmentFilter: (state, action) => {
      state.filters.department = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.filters.status = action.payload;
    },
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
    },

    // Pagination
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.pagination.itemsPerPage = action.payload;
    },
    setTotalItems: (state, action) => {
      state.pagination.totalItems = action.payload;
    },

    // View settings
    setView: (state, action) => {
      state.view = { ...state.view, ...action.payload };
    },
    toggleEmployeeView: (state) => {
      state.view.showActiveEmployees = !state.view.showActiveEmployees;
      state.pagination.currentPage = 1; // Reset to first page
    },
    setSortBy: (state, action) => {
      state.view.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.view.sortOrder = action.payload;
    },
    toggleSortOrder: (state) => {
      state.view.sortOrder = state.view.sortOrder === 'asc' ? 'desc' : 'asc';
    },

    // UI state
    setUIState: (state, action) => {
      state.ui = { ...state.ui, ...action.payload };
    },
    setModalOpen: (state, action) => {
      state.ui.isModalOpen = action.payload;
    },
    setEditModalOpen: (state, action) => {
      state.ui.isEditModalOpen = action.payload;
    },
    setConfirmDialogOpen: (state, action) => {
      state.ui.isConfirmDialogOpen = action.payload;
    },
    setLoading: (state, action) => {
      state.ui.loading = action.payload;
    },
    setError: (state, action) => {
      state.ui.error = action.payload;
    },
    clearError: (state) => {
      state.ui.error = null;
    },

    // Combined actions
    resetEmployeeState: (state) => {
      return initialState;
    },
    initializeEmployeeView: (state, action) => {
      const { showActive = true } = action.payload || {};
      state.view.showActiveEmployees = showActive;
      state.pagination.currentPage = 1;
      state.filters.search = '';
    },
  },
});

export const {
  // Employee selection
  setSelectedEmployee,
  clearSelectedEmployee,

  // Filters
  setFilters,
  resetFilters,
  setDepartmentFilter,
  setStatusFilter,
  setSearchFilter,

  // Pagination
  setPagination,
  setCurrentPage,
  setItemsPerPage,
  setTotalItems,

  // View settings
  setView,
  toggleEmployeeView,
  setSortBy,
  setSortOrder,
  toggleSortOrder,

  // UI state
  setUIState,
  setModalOpen,
  setEditModalOpen,
  setConfirmDialogOpen,
  setLoading,
  setError,
  clearError,

  // Combined actions
  resetEmployeeState,
  initializeEmployeeView,
} = employeeSlice.actions;

// Selectors
export const selectSelectedEmployee = (state) => state.employee.selectedEmployee;
export const selectEmployeeFilters = (state) => state.employee.filters;
export const selectEmployeePagination = (state) => state.employee.pagination;
export const selectEmployeeView = (state) => state.employee.view;
export const selectEmployeeUI = (state) => state.employee.ui;
export const selectShowActiveEmployees = (state) => state.employee.view.showActiveEmployees;
export const selectCurrentPage = (state) => state.employee.pagination.currentPage;
export const selectItemsPerPage = (state) => state.employee.pagination.itemsPerPage;
export const selectSortBy = (state) => state.employee.view.sortBy;
export const selectIsModalOpen = (state) => state.employee.ui.isModalOpen;
export const selectIsEditModalOpen = (state) => state.employee.ui.isEditModalOpen;
export const selectIsConfirmDialogOpen = (state) => state.employee.ui.isConfirmDialogOpen;
export const selectEmployeeLoading = (state) => state.employee.ui.loading;
export const selectEmployeeError = (state) => state.employee.ui.error;

export default employeeSlice.reducer;
