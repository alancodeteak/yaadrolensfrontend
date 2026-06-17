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
          ...(data.default_weekly_off_days != null
            ? { default_weekly_off_days: data.default_weekly_off_days }
            : {}),
          ...(data.paid_leaves_per_month != null
            ? { paid_leaves_per_month: data.paid_leaves_per_month }
            : {}),
          ...(data.excess_leave_deduction_mode != null
            ? { excess_leave_deduction_mode: data.excess_leave_deduction_mode }
            : {}),
          ...(data.allow_employee_weekly_off_override != null
            ? { allow_employee_weekly_off_override: data.allow_employee_weekly_off_override }
            : {}),
          ...(data.allow_employee_leave_quota_override != null
            ? { allow_employee_leave_quota_override: data.allow_employee_leave_quota_override }
            : {}),
          ...(data.block_leave_on_weekly_off != null
            ? { block_leave_on_weekly_off: data.block_leave_on_weekly_off }
            : {}),
          ...(data.leave_on_clock_in != null ? { leave_on_clock_in: data.leave_on_clock_in } : {}),
          ...(data.max_future_leave_days != null
            ? { max_future_leave_days: data.max_future_leave_days }
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
          minimum_clock_out_minutes: rulesData.minimum_clock_out_minutes,
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
