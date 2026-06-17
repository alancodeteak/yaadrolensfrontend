import { baseApi } from './baseApi';

export const leaveApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeLeaves: builder.query({
      query: ({ employeeId, year, month }) =>
        `/org-admin/employees/${employeeId}/leaves?year=${year}&month=${month}`,
      providesTags: (_result, _err, { employeeId }) => [
        { type: 'Leave', id: employeeId },
        'Attendance',
      ],
    }),

    markEmployeeLeave: builder.mutation({
      query: ({ employeeId, ...body }) => ({
        url: `/org-admin/employees/${employeeId}/leaves`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _err, { employeeId }) => [
        { type: 'Leave', id: employeeId },
        'Attendance',
      ],
    }),

    cancelEmployeeLeave: builder.mutation({
      query: ({ employeeId, leaveId }) => ({
        url: `/org-admin/employees/${employeeId}/leaves/${leaveId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _err, { employeeId }) => [
        { type: 'Leave', id: employeeId },
        'Attendance',
      ],
    }),
  }),
});

export const {
  useGetEmployeeLeavesQuery,
  useMarkEmployeeLeaveMutation,
  useCancelEmployeeLeaveMutation,
} = leaveApi;
