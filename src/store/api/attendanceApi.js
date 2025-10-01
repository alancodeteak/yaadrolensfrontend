import { baseApi } from './baseApi';

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceRecords: builder.query({
      query: ({ page = 1, limit = 10, date, employee_id, department } = {}) => {
        const params = new URLSearchParams({ page, limit });
        if (date) params.append('date', date);
        if (employee_id) params.append('employee_id', employee_id);
        if (department) params.append('department', department);
        return `/attendance/?${params.toString()}`;
      },
      providesTags: ['Attendance'],
    }),
    
    getAttendanceById: builder.query({
      query: (id) => `/attendance/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Attendance', id }],
    }),
    
    createAttendanceRecord: builder.mutation({
      query: (attendanceData) => ({
        url: '/attendance/',
        method: 'POST',
        body: attendanceData,
      }),
      invalidatesTags: ['Attendance'],
    }),
    
    updateAttendanceRecord: builder.mutation({
      query: ({ id, ...attendanceData }) => ({
        url: `/attendance/${id}/`,
        method: 'PUT',
        body: attendanceData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Attendance', id }],
    }),
    
    deleteAttendanceRecord: builder.mutation({
      query: (id) => ({
        url: `/attendance/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Attendance'],
    }),
    
    clockIn: builder.mutation({
      query: (data) => ({
        url: '/attendance/clock-in/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),
    
    clockOut: builder.mutation({
      query: (data) => ({
        url: '/attendance/clock-out/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),
    
    getLiveAttendance: builder.query({
      query: () => '/attendance/live/',
      providesTags: ['Attendance'],
    }),
    
    getAttendanceSummary: builder.query({
      query: ({ employee_id, start_date, end_date } = {}) => {
        const params = new URLSearchParams();
        if (employee_id) params.append('employee_id', employee_id);
        if (start_date) params.append('start_date', start_date);
        if (end_date) params.append('end_date', end_date);
        return `/attendance/summary/?${params.toString()}`;
      },
      providesTags: ['Attendance'],
    }),
    
    exportAttendance: builder.mutation({
      query: (params) => ({
        url: '/attendance/export/',
        method: 'POST',
        body: params,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Attendance Logs API endpoint
    getAttendanceLogs: builder.query({
      query: ({ start_date, end_date, employee_id, skip = 0, limit = 100 } = {}) => {
        const params = new URLSearchParams({ skip: skip.toString(), limit: limit.toString() });
        if (start_date) params.append('start_date', start_date);
        if (end_date) params.append('end_date', end_date);
        if (employee_id) params.append('employee_id', employee_id);
        return `/attendance/logs?${params.toString()}`;
      },
      providesTags: ['Attendance'],
    }),

    // Daily Attendance Summary
    getDailySummary: builder.query({
      query: ({ date } = {}) => {
        const params = new URLSearchParams();
        if (date) params.append('date', date);
        return `/attendance/daily-summary?${params.toString()}`;
      },
      providesTags: ['Attendance'],
    }),

    // Attendance Statistics
    getAttendanceStats: builder.query({
      query: ({ start_date, end_date, department_id } = {}) => {
        const params = new URLSearchParams();
        if (start_date) params.append('start_date', start_date);
        if (end_date) params.append('end_date', end_date);
        if (department_id) params.append('department_id', department_id);
        return `/attendance/stats?${params.toString()}`;
      },
      providesTags: ['Attendance'],
    }),

    // Employee Attendance Report
    getEmployeeReport: builder.query({
      query: ({ employee_id, start_date, end_date } = {}) => {
        const params = new URLSearchParams();
        if (start_date) params.append('start_date', start_date);
        if (end_date) params.append('end_date', end_date);
        return `/attendance/report/${employee_id}?${params.toString()}`;
      },
      providesTags: ['Attendance'],
    }),

    // Mobile Optimization APIs
    getMobileDashboard: builder.query({
      query: () => '/mobile/dashboard',
      providesTags: ['Mobile'],
    }),

    getQuickStats: builder.query({
      query: () => '/mobile/quick-stats',
      providesTags: ['Mobile'],
    }),

    getMobileAttendance: builder.query({
      query: ({ employee_id, date } = {}) => {
        const params = new URLSearchParams();
        if (employee_id) params.append('employee_id', employee_id);
        if (date) params.append('date', date);
        return `/mobile/attendance?${params.toString()}`;
      },
      providesTags: ['Mobile'],
    }),

    clockInMobile: builder.mutation({
      query: ({ employee_id, location, photo } = {}) => ({
        url: '/mobile/clock-in',
        method: 'POST',
        body: { employee_id, location, photo },
        formData: true,
      }),
      invalidatesTags: ['Mobile', 'Attendance'],
    }),

    clockOutMobile: builder.mutation({
      query: ({ employee_id, location, photo } = {}) => ({
        url: '/mobile/clock-out',
        method: 'POST',
        body: { employee_id, location, photo },
        formData: true,
      }),
      invalidatesTags: ['Mobile', 'Attendance'],
    }),

    getMobileNotifications: builder.query({
      query: ({ employee_id, limit = 20 } = {}) => {
        const params = new URLSearchParams({ limit });
        if (employee_id) params.append('employee_id', employee_id);
        return `/mobile/notifications?${params.toString()}`;
      },
      providesTags: ['Mobile'],
    }),

    markNotificationRead: builder.mutation({
      query: ({ notification_id, employee_id }) => ({
        url: `/mobile/notifications/${notification_id}/read`,
        method: 'POST',
        body: { employee_id },
      }),
      invalidatesTags: ['Mobile'],
    }),
  }),
});

export const {
  useGetAttendanceRecordsQuery,
  useGetAttendanceByIdQuery,
  useCreateAttendanceRecordMutation,
  useUpdateAttendanceRecordMutation,
  useDeleteAttendanceRecordMutation,
  useClockInMutation,
  useClockOutMutation,
  useGetLiveAttendanceQuery,
  useGetAttendanceSummaryQuery,
  useExportAttendanceMutation,
  useGetAttendanceLogsQuery,
  useGetDailySummaryQuery,
  useGetAttendanceStatsQuery,
  useGetEmployeeReportQuery,
  // Mobile Optimization hooks
  useGetMobileDashboardQuery,
  useGetQuickStatsQuery,
  useGetMobileAttendanceQuery,
  useClockInMobileMutation,
  useClockOutMobileMutation,
  useGetMobileNotificationsQuery,
  useMarkNotificationReadMutation,
} = attendanceApi;
