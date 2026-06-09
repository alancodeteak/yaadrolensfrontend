import { baseApi } from './baseApi';
import { normalizePayrollRun, normalizePayrollRuns } from './transforms';

export const payrollApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayrolls: builder.query({
      query: ({ year, month, employee_id, skip = 0, limit = 100 } = {}) => {
        const params = new URLSearchParams({ skip: skip.toString(), limit: limit.toString() });
        if (year) params.append('year', year);
        if (month) params.append('month', month);
        if (employee_id) params.append('employee_id', employee_id);
        return `/org-admin/payroll?${params.toString()}`;
      },
      transformResponse: (response) => normalizePayrollRuns(response?.items || response),
      providesTags: ['Payroll'],
    }),

    getPayrollById: builder.query({
      query: (id) => `/org-admin/payroll/${id}`,
      transformResponse: (response) => normalizePayrollRun(response),
      providesTags: (result, error, id) => [{ type: 'Payroll', id }],
    }),

    calculatePayroll: builder.mutation({
      query: (params) => ({
        url: '/org-admin/payroll/calculate',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: ['Payroll'],
    }),

    getPayrollSummary: builder.query({
      query: ({ year, month } = {}) => {
        const params = new URLSearchParams();
        if (year) params.append('year', year);
        if (month) params.append('month', month);
        return `/org-admin/payroll/summary?${params.toString()}`;
      },
      providesTags: ['Payroll'],
    }),

    exportPayroll: builder.mutation({
      query: (params) => ({
        url: '/org-admin/payroll/export/csv',
        method: 'GET',
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),

    approvePayroll: builder.mutation({
      query: (id) => ({
        url: `/org-admin/payroll/${id}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Payroll', id }, 'Payroll'],
    }),

    markPayrollPaid: builder.mutation({
      query: (id) => ({
        url: `/org-admin/payroll/${id}/mark-paid`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Payroll', id }, 'Payroll'],
    }),
  }),
});

export const {
  useGetPayrollsQuery,
  useGetPayrollByIdQuery,
  useCalculatePayrollMutation,
  useGetPayrollSummaryQuery,
  useExportPayrollMutation,
  useApprovePayrollMutation,
  useMarkPayrollPaidMutation,
} = payrollApi;
