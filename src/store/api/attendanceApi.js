import { baseApi } from './baseApi';
import {
  transformDailyReport,
  transformDailyRowsToLogs,
  transformMonthlyReport,
} from './transforms';

const today = () => new Date().toISOString().split('T')[0];

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDailySummary: builder.query({
      query: ({ date } = {}) => ({
        url: '/org-admin/reports/daily',
        params: { day: date || today() },
      }),
      transformResponse: transformDailyReport,
      providesTags: ['Attendance'],
    }),

    getAttendanceStats: builder.query({
      query: ({ start_date, end_date } = {}) => {
        const end = end_date || today();
        const date = new Date(end);
        return {
          url: '/org-admin/reports/monthly',
          params: {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
          },
        };
      },
      transformResponse: transformMonthlyReport,
      providesTags: ['Attendance'],
    }),

    getAttendanceLogs: builder.query({
      query: ({ start_date, end_date, limit = 100 } = {}) => ({
        url: '/org-admin/reports/daily',
        params: { day: end_date || start_date || today() },
      }),
      transformResponse: (response, meta, arg) =>
        transformDailyRowsToLogs(response).slice(0, arg?.limit ?? 100),
      providesTags: ['Attendance'],
    }),

    getLiveAttendance: builder.query({
      query: () => ({
        url: '/org-admin/reports/daily',
        params: { day: today() },
      }),
      transformResponse: (response) => transformDailyReport(response).rows || [],
      providesTags: ['Attendance'],
    }),

    getEmployeeReport: builder.query({
      query: ({ employee_id, start_date, end_date } = {}) => {
        const end = end_date || today();
        const date = new Date(end);
        return {
          url: '/org-admin/reports/monthly',
          params: {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
          },
        };
      },
      transformResponse: (response, meta, arg) => {
        const row = (response?.rows || []).find(
          (item) => String(item.employee_id) === String(arg?.employee_id)
        );
        return row || null;
      },
      providesTags: ['Attendance'],
    }),

    getLateCountReport: builder.query({
      query: ({ start_date, end_date } = {}) => ({
        url: '/org-admin/reports/late-count',
        params: {
          start_date: start_date || today(),
          end_date: end_date || today(),
        },
      }),
      providesTags: ['Attendance'],
    }),
  }),
});

export const {
  useGetDailySummaryQuery,
  useGetAttendanceStatsQuery,
  useGetAttendanceLogsQuery,
  useGetLiveAttendanceQuery,
  useGetEmployeeReportQuery,
  useGetLateCountReportQuery,
} = attendanceApi;
