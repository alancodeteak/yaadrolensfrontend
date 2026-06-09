import { baseApi } from './baseApi';
import {
  normalizeSalaryHistory,
  normalizeSalaryRow,
  normalizeSalaries,
  toSalaryUpdatePayload,
} from './transforms';

export const salaryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSalaries: builder.query({
      query: () => '/org-admin/salary/employees',
      transformResponse: (response) => normalizeSalaries(response),
      providesTags: ['Salary'],
    }),

    getSalary: builder.query({
      query: (employeeId) => `/org-admin/salary/employees/${employeeId}`,
      transformResponse: (response) => normalizeSalaryRow(response),
      providesTags: (result, error, employeeId) => [{ type: 'Salary', id: employeeId }],
    }),

    updateSalary: builder.mutation({
      query: ({ employeeId, ...data }) => ({
        url: `/org-admin/salary/employees/${employeeId}`,
        method: 'PUT',
        body: toSalaryUpdatePayload(data),
      }),
      transformResponse: (response) => normalizeSalaryRow(response),
      invalidatesTags: (result, error, { employeeId }) => [
        { type: 'Salary', id: employeeId },
        'Salary',
        'Employee',
      ],
    }),

    getSalaryHistory: builder.query({
      query: ({ employeeId, skip = 0, limit = 50 }) =>
        `/org-admin/salary/employees/${employeeId}/history?skip=${skip}&limit=${limit}`,
      transformResponse: (response) => normalizeSalaryHistory(response),
      providesTags: (result, error, { employeeId }) => [
        { type: 'Salary', id: `${employeeId}-history` },
      ],
    }),
  }),
});

export const {
  useGetSalariesQuery,
  useGetSalaryQuery,
  useUpdateSalaryMutation,
  useGetSalaryHistoryQuery,
} = salaryApi;
