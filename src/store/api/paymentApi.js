import { baseApi } from './baseApi';
import {
  normalizeAdvanceDetail,
  normalizeAdvanceRow,
  normalizeAdvances,
  normalizeBalanceLedger,
  normalizeBalanceTransactions,
  normalizeBalances,
  normalizeBonuses,
  normalizeEmployeePaymentSummary,
  normalizePaymentRow,
  normalizePayments,
  normalizePaymentSummary,
  toAdvanceCreatePayload,
  toAdvanceRecoverPayload,
  toBalanceAdjustPayload,
  toBonusCreatePayload,
  toMarkPaidPayload,
  toPaymentCreatePayload,
} from './transforms';

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: ({
        employee_id,
        payment_type,
        status,
        start_date,
        end_date,
        period_year,
        period_month,
        skip = 0,
        limit = 50,
      } = {}) => {
        const params = new URLSearchParams({
          skip: String(skip),
          limit: String(limit),
        });
        if (employee_id) params.append('employee_id', employee_id);
        if (payment_type) params.append('payment_type', payment_type);
        if (status) params.append('status', status);
        if (start_date) params.append('start_date', start_date);
        if (end_date) params.append('end_date', end_date);
        if (period_year) params.append('period_year', String(period_year));
        if (period_month) params.append('period_month', String(period_month));
        return `/org-admin/payments?${params.toString()}`;
      },
      transformResponse: (response) => normalizePayments(response),
      providesTags: ['Payment'],
    }),

    getPaymentSummary: builder.query({
      query: () => '/org-admin/payments/summary',
      transformResponse: (response) => normalizePaymentSummary(response),
      providesTags: ['Payment'],
    }),

    getMonthlyGenerationStatus: builder.query({
      query: ({ period_year, period_month } = {}) => {
        const params = new URLSearchParams();
        if (period_year != null) params.append('period_year', String(period_year));
        if (period_month != null) params.append('period_month', String(period_month));
        const qs = params.toString();
        return `/org-admin/payments/monthly-generation-status${qs ? `?${qs}` : ''}`;
      },
      providesTags: ['Payment'],
    }),

    getOutstandingEmployees: builder.query({
      query: () => '/org-admin/payments/outstanding',
      providesTags: ['Payment'],
    }),

    approvePayment: builder.mutation({
      query: (paymentId) => ({
        url: `/org-admin/payments/${paymentId}/approve`,
        method: 'PATCH',
      }),
      transformResponse: (response) => normalizePaymentRow(response),
      invalidatesTags: ['Payment'],
    }),

    markPaymentPaid: builder.mutation({
      query: ({ paymentId, ...data }) => ({
        url: `/org-admin/payments/${paymentId}/mark-paid`,
        method: 'PATCH',
        body: toMarkPaidPayload(data),
      }),
      transformResponse: (response) => normalizePaymentRow(response),
      invalidatesTags: ['Payment'],
    }),

    bulkApprovePayments: builder.mutation({
      query: ({ period_year, period_month }) => ({
        url: '/org-admin/payments/bulk-approve',
        method: 'POST',
        body: { period_year, period_month },
      }),
      invalidatesTags: ['Payment'],
    }),

    adjustEmployeeBalance: builder.mutation({
      query: ({ employeeId, ...data }) => ({
        url: `/org-admin/payments/employees/${employeeId}/balance`,
        method: 'POST',
        body: toBalanceAdjustPayload(data),
      }),
      invalidatesTags: (result, error, { employeeId }) => [
        'Payment',
        { type: 'Payment', id: `employee-${employeeId}` },
      ],
    }),

    getBalanceTransactions: builder.query({
      query: ({ employeeId, skip = 0, limit = 50 }) =>
        `/org-admin/payments/employees/${employeeId}/balance?skip=${skip}&limit=${limit}`,
      transformResponse: (response) => normalizeBalanceTransactions(response),
      providesTags: (result, error, { employeeId }) => [
        { type: 'Payment', id: `balance-${employeeId}` },
      ],
    }),

    getBalanceLedger: builder.query({
      query: ({ skip = 0, limit = 50 } = {}) =>
        `/org-admin/payments/balance-ledger?skip=${skip}&limit=${limit}`,
      transformResponse: (response) => normalizeBalanceLedger(response),
      providesTags: ['Payment'],
    }),

    getEmployeeBalances: builder.query({
      query: ({ non_zero_only = false, skip = 0, limit = 50 } = {}) => {
        const params = new URLSearchParams({
          skip: String(skip),
          limit: String(limit),
          non_zero_only: String(non_zero_only),
        });
        return `/org-admin/payments/balances?${params.toString()}`;
      },
      transformResponse: (response) => normalizeBalances(response),
      providesTags: ['Payment'],
    }),

    getBonuses: builder.query({
      query: ({ employee_id, period_year, period_month, status, skip = 0, limit = 50 } = {}) => {
        const params = new URLSearchParams({ skip: String(skip), limit: String(limit) });
        if (employee_id) params.append('employee_id', employee_id);
        if (period_year) params.append('period_year', String(period_year));
        if (period_month) params.append('period_month', String(period_month));
        if (status) params.append('status', status);
        return `/org-admin/payments/bonuses?${params.toString()}`;
      },
      transformResponse: (response) => normalizeBonuses(response),
      providesTags: ['Payment'],
    }),

    createBonus: builder.mutation({
      query: (data) => ({
        url: '/org-admin/payments/bonuses',
        method: 'POST',
        body: toBonusCreatePayload(data),
      }),
      invalidatesTags: ['Payment'],
    }),

    releaseBonus: builder.mutation({
      query: (bonusId) => ({
        url: `/org-admin/payments/bonuses/${bonusId}/release`,
        method: 'POST',
      }),
      invalidatesTags: ['Payment'],
    }),

    recordPayment: builder.mutation({
      query: (data) => ({
        url: '/org-admin/payments',
        method: 'POST',
        body: toPaymentCreatePayload(data),
      }),
      transformResponse: (response) => normalizePaymentRow(response),
      invalidatesTags: ['Payment', 'Employee'],
    }),

    getEmployeePaymentSummary: builder.query({
      query: (employeeId) => `/org-admin/payments/employees/${employeeId}`,
      transformResponse: (response) => normalizeEmployeePaymentSummary(response),
      providesTags: (result, error, employeeId) => [
        { type: 'Payment', id: `employee-${employeeId}` },
      ],
    }),

    getEmployeePaymentHistory: builder.query({
      query: ({ employeeId, skip = 0, limit = 50 }) =>
        `/org-admin/payments/employees/${employeeId}/history?skip=${skip}&limit=${limit}`,
      transformResponse: (response) => normalizePayments(response),
      providesTags: (result, error, { employeeId }) => [
        { type: 'Payment', id: `${employeeId}-history` },
      ],
    }),

    getAdvances: builder.query({
      query: ({ employee_id, status, skip = 0, limit = 50 } = {}) => {
        const params = new URLSearchParams({
          skip: String(skip),
          limit: String(limit),
        });
        if (employee_id) params.append('employee_id', employee_id);
        if (status) params.append('status', status);
        return `/org-admin/payments/advances?${params.toString()}`;
      },
      transformResponse: (response) => normalizeAdvances(response),
      providesTags: ['Payment'],
    }),

    createAdvance: builder.mutation({
      query: (data) => ({
        url: '/org-admin/payments/advances',
        method: 'POST',
        body: toAdvanceCreatePayload(data),
      }),
      transformResponse: (response) => normalizeAdvanceRow(response),
      invalidatesTags: ['Payment'],
    }),

    getAdvance: builder.query({
      query: (advanceId) => `/org-admin/payments/advances/${advanceId}`,
      transformResponse: (response) => normalizeAdvanceDetail(response),
      providesTags: (result, error, advanceId) => [{ type: 'Payment', id: `advance-${advanceId}` }],
    }),

    approveAdvance: builder.mutation({
      query: (advanceId) => ({
        url: `/org-admin/payments/advances/${advanceId}/approve`,
        method: 'PATCH',
      }),
      transformResponse: (response) => normalizeAdvanceRow(response),
      invalidatesTags: ['Payment'],
    }),

    disburseAdvance: builder.mutation({
      query: (advanceId) => ({
        url: `/org-admin/payments/advances/${advanceId}/disburse`,
        method: 'PATCH',
      }),
      transformResponse: (response) => normalizeAdvanceRow(response),
      invalidatesTags: ['Payment'],
    }),

    recoverAdvance: builder.mutation({
      query: ({ advanceId, ...data }) => ({
        url: `/org-admin/payments/advances/${advanceId}/recover`,
        method: 'POST',
        body: toAdvanceRecoverPayload(data),
      }),
      transformResponse: (response) => normalizeAdvanceRow(response),
      invalidatesTags: ['Payment'],
    }),

    generateMonthlySalaries: builder.mutation({
      query: ({ period_year, period_month } = {}) => ({
        url: '/org-admin/payments/generate-monthly-salaries',
        method: 'POST',
        body: {
          ...(period_year != null ? { period_year } : {}),
          ...(period_month != null ? { period_month } : {}),
        },
      }),
      invalidatesTags: ['Payment', 'Employee'],
    }),

    runScheduledSalaries: builder.mutation({
      query: () => ({
        url: '/org-admin/payments/run-scheduled-salaries',
        method: 'POST',
      }),
      invalidatesTags: ['Payment', 'Employee'],
    }),

    cancelAdvance: builder.mutation({
      query: (advanceId) => ({
        url: `/org-admin/payments/advances/${advanceId}/cancel`,
        method: 'PATCH',
      }),
      transformResponse: (response) => normalizeAdvanceRow(response),
      invalidatesTags: ['Payment'],
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentSummaryQuery,
  useGetMonthlyGenerationStatusQuery,
  useRecordPaymentMutation,
  useGetEmployeePaymentSummaryQuery,
  useGetEmployeePaymentHistoryQuery,
  useGetAdvancesQuery,
  useCreateAdvanceMutation,
  useGetAdvanceQuery,
  useApproveAdvanceMutation,
  useDisburseAdvanceMutation,
  useRecoverAdvanceMutation,
  useCancelAdvanceMutation,
  useGenerateMonthlySalariesMutation,
  useRunScheduledSalariesMutation,
  useGetOutstandingEmployeesQuery,
  useApprovePaymentMutation,
  useMarkPaymentPaidMutation,
  useBulkApprovePaymentsMutation,
  useAdjustEmployeeBalanceMutation,
  useGetBalanceTransactionsQuery,
  useGetBalanceLedgerQuery,
  useGetEmployeeBalancesQuery,
  useGetBonusesQuery,
  useCreateBonusMutation,
  useReleaseBonusMutation,
} = paymentApi;
