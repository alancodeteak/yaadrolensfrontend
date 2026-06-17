import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../config/apiBaseUrl';

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Get the token from the auth state or localStorage
    const token = getState().auth.access_token || localStorage.getItem('access_token');
    
    // If we have a token, set the authorization header
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    headers.set('content-type', 'application/json');
    return headers;
  },
});

// Base query with re-authentication
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // If we get a 401, try to refresh the token
  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (refreshToken) {
      // Try to refresh the token
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refresh_token: refreshToken },
        },
        api,
        extraOptions
      );
      
      if (refreshResult.data) {
        // Store the new token
        const { access_token } = refreshResult.data;
        localStorage.setItem('access_token', access_token);
        api.dispatch({ type: 'auth/setToken', payload: access_token });
        
        // Retry the original query with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, logout user
        api.dispatch({ type: 'auth/logout' });
      }
    } else {
      // No refresh token, logout user
      api.dispatch({ type: 'auth/logout' });
    }
  }
  
  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Employee', 'Payroll', 'Attendance', 'Report', 'Settings'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response) => {
        // Store tokens in localStorage
        if (response.access_token) {
          localStorage.setItem('access_token', response.access_token);
        }
        if (response.refresh_token) {
          localStorage.setItem('refresh_token', response.refresh_token);
        }
        return response;
      },
    }),
    
    // User endpoints
    getUsers: builder.query({
      query: ({ page = 1, limit = 10, search = '', status = 'all' } = {}) => ({
        url: `/users?page=${page}&limit=${limit}&search=${search}&status=${status}`,
      }),
      providesTags: ['User'],
    }),

    // Employee endpoints
    getEmployees: builder.query({
      query: ({ page = 1, limit = 10, search = '', department = 'all', is_active = true } = {}) => ({
        url: `/employees/?page=${page}&limit=${limit}&search=${search}&department=${department}&is_active=${is_active}`,
      }),
      providesTags: ['Employee'],
    }),

    getEmployeeById: builder.query({
      query: (id) => `/employees/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Employee', id }],
    }),

    createEmployee: builder.mutation({
      query: (employeeData) => ({
        url: '/employees/',
        method: 'POST',
        body: employeeData,
      }),
      transformResponse: (response) => {
        // The API returns the created employee directly
        return response;
      },
      invalidatesTags: ['Employee'],
    }),

    updateEmployee: builder.mutation({
      query: ({ id, ...employeeData }) => ({
        url: `/employees/${id}/`,
        method: 'PUT',
        body: employeeData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Employee', id }],
    }),

    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/employees/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Employee'],
    }),
    
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    
    createUser: builder.mutation({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    
    getPendingUsers: builder.query({
      query: () => '/users/pending',
      providesTags: ['User'],
    }),
    
    approveUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    
    rejectUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/reject`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    
    // Payroll endpoints
    getPayrolls: builder.query({
      query: ({ month, year, department = 'all' } = {}) => ({
        url: `/payroll?month=${month}&year=${year}&department=${department}`,
      }),
      providesTags: ['Payroll'],
    }),
    
    getPayrollById: builder.query({
      query: (id) => `/payroll/${id}`,
      providesTags: (result, error, id) => [{ type: 'Payroll', id }],
    }),
    
    createPayroll: builder.mutation({
      query: (payrollData) => ({
        url: '/payroll',
        method: 'POST',
        body: payrollData,
      }),
      invalidatesTags: ['Payroll'],
    }),
    
    updatePayroll: builder.mutation({
      query: ({ id, ...payrollData }) => ({
        url: `/payroll/${id}`,
        method: 'PUT',
        body: payrollData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Payroll', id }],
    }),
    
    processPayroll: builder.mutation({
      query: (payrollIds) => ({
        url: '/payroll/process',
        method: 'POST',
        body: { payrollIds },
      }),
      invalidatesTags: ['Payroll'],
    }),
    
    // Attendance endpoints
    getLiveAttendance: builder.query({
      query: ({ date = new Date().toISOString().split('T')[0] } = {}) => ({
        url: `/attendance/live?date=${date}`,
      }),
      providesTags: ['Attendance'],
    }),
    
    getAttendanceHistory: builder.query({
      query: ({ startDate, endDate, userId } = {}) => ({
        url: `/attendance/history?startDate=${startDate}&endDate=${endDate}&userId=${userId || ''}`,
      }),
      providesTags: ['Attendance'],
    }),
    
    markAttendance: builder.mutation({
      query: ({ userId, status }) => ({
        url: '/attendance/mark',
        method: 'POST',
        body: { userId, status },
      }),
      invalidatesTags: ['Attendance'],
    }),
    
    getAttendanceStats: builder.query({
      query: ({ date = new Date().toISOString().split('T')[0] } = {}) => ({
        url: `/attendance/stats?date=${date}`,
      }),
      providesTags: ['Attendance'],
    }),
    
    // Organization Settings endpoints
    getSettings: builder.query({
      query: () => '/organization/settings',
      providesTags: ['Settings'],
    }),
    
    updateSettings: builder.mutation({
      query: (settings) => ({
        url: '/organization/settings',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['Settings'],
    }),
    
    getAttendanceRules: builder.query({
      query: () => '/organization/attendance-rules',
      providesTags: ['Settings'],
    }),
    
    updateAttendanceRules: builder.mutation({
      query: (rulesData) => ({
        url: '/organization/attendance-rules',
        method: 'PUT',
        body: rulesData,
      }),
      invalidatesTags: ['Settings'],
    }),
    
    createBackup: builder.mutation({
      query: () => ({
        url: '/organization/backup',
        method: 'POST',
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  // Auth hooks
  useLoginMutation,
  
  // User hooks
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetPendingUsersQuery,
  useApproveUserMutation,
  useRejectUserMutation,

  // Employee hooks
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  
  // Payroll hooks
  useGetPayrollsQuery,
  useGetPayrollByIdQuery,
  useCreatePayrollMutation,
  useUpdatePayrollMutation,
  useProcessPayrollMutation,
  
  // Attendance hooks
  useGetLiveAttendanceQuery,
  useGetAttendanceHistoryQuery,
  useMarkAttendanceMutation,
  useGetAttendanceStatsQuery,
  
  // Organization Settings hooks
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useGetAttendanceRulesQuery,
  useUpdateAttendanceRulesMutation,
  useCreateBackupMutation,
} = apiSlice;
