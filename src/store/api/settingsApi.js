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
  useUpdateAttendanceRulesMutation,
  useGetDeviceStatusQuery,
  useGetDepartmentsQuery,
} = settingsApi;
