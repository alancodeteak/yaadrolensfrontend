import { baseApi } from './baseApi';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardSummary: builder.query({
      query: ({ day } = {}) => ({
        url: '/org-admin/dashboard/summary',
        params: day ? { day } : undefined,
      }),
      providesTags: ['Dashboard'],
    }),
  }),
});

export const { useGetDashboardSummaryQuery } = dashboardApi;
