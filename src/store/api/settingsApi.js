import { baseApi } from './baseApi';
import { transformSettingsResponse } from './transforms';

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => '/org-admin/settings',
      transformResponse: transformSettingsResponse,
      providesTags: ['Settings'],
    }),

    updateSettings: builder.mutation({
      query: (settingsData) => ({
        url: '/org-admin/settings',
        method: 'PUT',
        body: settingsData,
      }),
      transformResponse: transformSettingsResponse,
      invalidatesTags: ['Settings'],
    }),

    getAttendanceRules: builder.query({
      query: () => '/org-admin/settings',
      transformResponse: transformSettingsResponse,
      providesTags: ['Settings'],
    }),

    updatePaymentSettings: builder.mutation({
      query: (data) => ({
        url: '/org-admin/settings',
        method: 'PUT',
        body: {
          ...(data.salary_pay_day != null ? { salary_pay_day: data.salary_pay_day } : {}),
          ...(data.auto_record_monthly_salary != null
            ? { auto_record_monthly_salary: data.auto_record_monthly_salary }
            : {}),
          ...(data.salary_calculation_mode != null
            ? { salary_calculation_mode: data.salary_calculation_mode }
            : {}),
          ...(data.salary_working_days_mode != null
            ? { salary_working_days_mode: data.salary_working_days_mode }
            : {}),
          ...(data.salary_working_days_fixed != null
            ? { salary_working_days_fixed: data.salary_working_days_fixed }
            : {}),
          ...(data.salary_count_half_days != null
            ? { salary_count_half_days: data.salary_count_half_days }
            : {}),
        },
      }),
      transformResponse: transformSettingsResponse,
      invalidatesTags: ['Settings'],
    }),

    updateAttendanceRules: builder.mutation({
      query: (rulesData) => ({
        url: '/org-admin/settings',
        method: 'PUT',
        body: {
          work_start_time: rulesData.work_start_time,
          work_end_time: rulesData.work_end_time,
          late_arrival_grace_minutes: rulesData.late_arrival_grace_minutes,
          early_departure_grace_minutes: rulesData.early_departure_grace_minutes,
        },
      }),
      transformResponse: transformSettingsResponse,
      invalidatesTags: ['Settings'],
    }),

    getDeviceStatus: builder.query({
      query: () => '/org-admin/device',
      providesTags: ['Settings'],
    }),

    getDepartments: builder.query({
      query: ({ active_only = true } = {}) =>
        `/org-admin/departments?active_only=${active_only}`,
      providesTags: ['Department'],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useGetAttendanceRulesQuery,
  useUpdatePaymentSettingsMutation,
  useUpdateAttendanceRulesMutation,
  useGetDeviceStatusQuery,
  useGetDepartmentsQuery,
} = settingsApi;
