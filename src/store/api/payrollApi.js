import { baseApi } from './baseApi';

export const payrollApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayrolls: builder.query({
      query: ({ start_month, start_year, end_month, end_year, employee_id, skip = 0, limit = 100 } = {}) => {
        const params = new URLSearchParams({ skip: skip.toString(), limit: limit.toString() });
        if (start_month) params.append('start_month', start_month);
        if (start_year) params.append('start_year', start_year);
        if (end_month) params.append('end_month', end_month);
        if (end_year) params.append('end_year', end_year);
        if (employee_id) params.append('employee_id', employee_id);
        return `/payrolls/?${params.toString()}`;
      },
      providesTags: ['Payroll'],
    }),
    
    getPayrollById: builder.query({
      query: (id) => `/payrolls/${id}`,
      providesTags: (result, error, id) => [{ type: 'Payroll', id }],
    }),
    
    createPayroll: builder.mutation({
      query: (payrollData) => ({
        url: '/payrolls/',
        method: 'POST',
        body: payrollData,
      }),
      invalidatesTags: ['Payroll'],
    }),
    
    updatePayroll: builder.mutation({
      query: ({ id, ...payrollData }) => ({
        url: `/payrolls/${id}`,
        method: 'PUT',
        body: payrollData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Payroll', id }],
    }),
    
    deletePayroll: builder.mutation({
      query: (id) => ({
        url: `/payrolls/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Payroll'],
    }),
    
    calculatePayroll: builder.mutation({
      query: (params) => ({
        url: '/payrolls/calculate',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: ['Payroll'],
    }),
    
    getPayrollSummary: builder.query({
      query: ({ start_month, start_year, end_month, end_year } = {}) => {
        const params = new URLSearchParams();
        if (start_month) params.append('start_month', start_month);
        if (start_year) params.append('start_year', start_year);
        if (end_month) params.append('end_month', end_month);
        if (end_year) params.append('end_year', end_year);
        return `/payrolls/summary/?${params.toString()}`;
      },
      providesTags: ['Payroll'],
    }),
    
    exportPayroll: builder.mutation({
      query: (params) => ({
        url: '/payrolls/export/csv',
        method: 'GET',
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // New endpoints for individual actions
    approvePayroll: builder.mutation({
      query: (id) => ({
        url: `/payrolls/${id}/approve`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Payroll', id }],
    }),

    markPayrollPaid: builder.mutation({
      query: (id) => ({
        url: `/payrolls/${id}/mark-paid`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Payroll', id }],
    }),

    getEmployeePayrollHistory: builder.query({
      query: ({ employee_id, skip = 0, limit = 100 } = {}) => {
        const params = new URLSearchParams({ skip: skip.toString(), limit: limit.toString() });
        return `/payrolls/employee/${employee_id}?${params.toString()}`;
      },
      providesTags: ['Payroll'],
    }),
  }),
});

export const {
  useGetPayrollsQuery,
  useGetPayrollByIdQuery,
  useCreatePayrollMutation,
  useUpdatePayrollMutation,
  useDeletePayrollMutation,
  useCalculatePayrollMutation,
  useGetPayrollSummaryQuery,
  useExportPayrollMutation,
  useApprovePayrollMutation,
  useMarkPayrollPaidMutation,
  useGetEmployeePayrollHistoryQuery,
} = payrollApi;
