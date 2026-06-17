import { baseApi } from './baseApi';

export const reportsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getReportTypes: builder.query({
      query: () => '/org-admin/reports/types',
      providesTags: ['Report'],
    }),

    exportOrgReport: builder.mutation({
      query: (params) => {
        const search = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            search.append(key, String(value));
          }
        });
        return {
          url: `/org-admin/reports/export?${search.toString()}`,
          method: 'GET',
          responseHandler: async (response) => {
            if (!response.ok) {
              const errorText = await response.text();
              let detail = errorText;
              try {
                const parsed = JSON.parse(errorText);
                detail = parsed.detail || errorText;
              } catch {
                // keep raw text
              }
              throw { status: response.status, data: { detail } };
            }
            const blob = await response.blob();
            return {
              blob,
              filename: response.headers.get('Content-Disposition'),
            };
          },
        };
      },
    }),

    getDailyAttendance: builder.query({
      query: (day) => `/org-admin/reports/daily?day=${day}`,
      providesTags: ['Report'],
    }),

    getMonthlyAttendance: builder.query({
      query: ({ year, month }) =>
        `/org-admin/reports/monthly?year=${year}&month=${month}`,
      providesTags: ['Report'],
    }),

    getLateCount: builder.query({
      query: ({ start_date, end_date }) =>
        `/org-admin/reports/late-count?start_date=${start_date}&end_date=${end_date}`,
      providesTags: ['Report'],
    }),
  }),
});

export const {
  useGetReportTypesQuery,
  useExportOrgReportMutation,
  useGetDailyAttendanceQuery,
  useGetMonthlyAttendanceQuery,
  useGetLateCountQuery,
} = reportsApi;

/** @deprecated use useExportOrgReportMutation */
export const useExportReportMutation = useExportOrgReportMutation;
