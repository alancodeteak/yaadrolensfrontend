import { baseApi } from './baseApi';

const formatTimeForApi = (value) => {
  if (!value) return value;
  const str = String(value);
  return str.length === 5 ? `${str}:00` : str;
};

export const shiftApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShiftTemplates: builder.query({
      query: () => '/org-admin/shifts/templates',
      providesTags: ['ShiftTemplate'],
    }),

    createShiftTemplate: builder.mutation({
      query: (body) => ({
        url: '/org-admin/shifts/templates',
        method: 'POST',
        body: {
          name: body.name,
          work_start_time: formatTimeForApi(body.work_start_time),
          work_end_time: formatTimeForApi(body.work_end_time),
          breaks: (body.breaks || []).map((b, i) => ({
            name: b.name,
            start_time: formatTimeForApi(b.start_time),
            end_time: formatTimeForApi(b.end_time),
            is_paid: Boolean(b.is_paid),
            sort_order: b.sort_order ?? i,
          })),
        },
      }),
      invalidatesTags: ['ShiftTemplate', 'Attendance'],
    }),

    updateShiftTemplate: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/org-admin/shifts/templates/${id}`,
        method: 'PATCH',
        body: {
          ...(body.name != null ? { name: body.name } : {}),
          ...(body.work_start_time != null
            ? { work_start_time: formatTimeForApi(body.work_start_time) }
            : {}),
          ...(body.work_end_time != null
            ? { work_end_time: formatTimeForApi(body.work_end_time) }
            : {}),
          ...(body.is_active != null ? { is_active: body.is_active } : {}),
          ...(body.breaks != null
            ? {
                breaks: body.breaks.map((b, i) => ({
                  name: b.name,
                  start_time: formatTimeForApi(b.start_time),
                  end_time: formatTimeForApi(b.end_time),
                  is_paid: Boolean(b.is_paid),
                  sort_order: b.sort_order ?? i,
                })),
              }
            : {}),
        },
      }),
      invalidatesTags: ['ShiftTemplate', 'Attendance'],
    }),

    deleteShiftTemplate: builder.mutation({
      query: (id) => ({
        url: `/org-admin/shifts/templates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ShiftTemplate', 'Attendance'],
    }),

    unassignAndDeleteShiftTemplate: builder.mutation({
      query: (id) => ({
        url: `/org-admin/shifts/templates/${id}/unassign-and-delete`,
        method: 'POST',
      }),
      invalidatesTags: ['ShiftTemplate', 'Employee', 'Dashboard'],
    }),

    clearWeeklyShiftAssignments: builder.mutation({
      query: () => ({
        url: '/org-admin/shifts/clear-weekly-assignments',
        method: 'POST',
      }),
      invalidatesTags: ['ShiftTemplate', 'Employee', 'Settings', 'Dashboard'],
    }),

    getEmployeeWeeklyShifts: builder.query({
      query: (employeeId) => `/org-admin/employees/${employeeId}/weekly-shifts`,
      providesTags: (_r, _e, employeeId) => [{ type: 'Employee', id: employeeId }],
    }),

    putEmployeeWeeklyShifts: builder.mutation({
      query: ({ employeeId, days }) => ({
        url: `/org-admin/employees/${employeeId}/weekly-shifts`,
        method: 'PUT',
        body: { days },
      }),
      invalidatesTags: (_r, _e, { employeeId }) => [
        { type: 'Employee', id: employeeId },
        'ShiftTemplate',
        'Attendance',
      ],
    }),
  }),
});

export const {
  useGetShiftTemplatesQuery,
  useCreateShiftTemplateMutation,
  useUpdateShiftTemplateMutation,
  useDeleteShiftTemplateMutation,
  useUnassignAndDeleteShiftTemplateMutation,
  useClearWeeklyShiftAssignmentsMutation,
  useGetEmployeeWeeklyShiftsQuery,
  usePutEmployeeWeeklyShiftsMutation,
} = shiftApi;
