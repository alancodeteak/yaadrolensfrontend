import { baseApi } from './baseApi';
import {
  normalizeEmployee,
  normalizeEmployees,
  toEmployeeCreatePayload,
  toEmployeeUpdatePayload,
} from './transforms';

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: () => '/org-admin/employees',
      transformResponse: (response, meta, arg) => {
        let employees = normalizeEmployees(response);
        const { search = '', department = 'all', is_active = true } = arg || {};

        if (search) {
          const term = search.toLowerCase();
          employees = employees.filter(
            (employee) =>
              employee.name?.toLowerCase().includes(term) ||
              employee.employee_code?.toLowerCase().includes(term) ||
              employee.phone?.toLowerCase().includes(term)
          );
        }

        if (department && department !== 'all') {
          employees = employees.filter((employee) => employee.department === department);
        }

        if (is_active !== undefined && is_active !== null && is_active !== 'all') {
          employees = employees.filter((employee) => employee.is_active === is_active);
        }

        return employees;
      },
      providesTags: ['Employee'],
    }),

    getEmployeeById: builder.query({
      query: (id) => `/org-admin/employees/${id}`,
      transformResponse: (response) => normalizeEmployee(response),
      providesTags: (result, error, id) => [{ type: 'Employee', id }],
    }),

    createEmployee: builder.mutation({
      query: (employeeData) => ({
        url: '/org-admin/employees',
        method: 'POST',
        body: toEmployeeCreatePayload(employeeData),
      }),
      transformResponse: (response) => normalizeEmployee(response),
      invalidatesTags: ['Employee', 'Dashboard'],
    }),

    updateEmployee: builder.mutation({
      query: ({ id, ...employeeData }) => ({
        url: `/org-admin/employees/${id}`,
        method: 'PUT',
        body: toEmployeeUpdatePayload(employeeData),
      }),
      transformResponse: (response) => normalizeEmployee(response),
      invalidatesTags: (result, error, { id }) => [{ type: 'Employee', id }, 'Employee', 'Dashboard'],
    }),

    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/org-admin/employees/${id}/deactivate`,
        method: 'POST',
      }),
      transformResponse: (response) => normalizeEmployee(response),
      invalidatesTags: ['Employee', 'Dashboard'],
    }),

    resetEmployeeFace: builder.mutation({
      query: (id) => ({
        url: `/org-admin/employees/${id}/face`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Employee', id }, 'Employee', 'Dashboard'],
    }),

    uploadEmployeeProfilePhoto: builder.mutation({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append('photo', file);
        return {
          url: `/org-admin/employees/${id}/profile-photo`,
          method: 'PUT',
          body: formData,
        };
      },
      transformResponse: (response) => normalizeEmployee(response),
      invalidatesTags: (result, error, { id }) => [{ type: 'Employee', id }, 'Employee', 'Dashboard'],
    }),

    deleteEmployeeProfilePhoto: builder.mutation({
      query: (id) => ({
        url: `/org-admin/employees/${id}/profile-photo`,
        method: 'DELETE',
      }),
      transformResponse: (response) => normalizeEmployee(response),
      invalidatesTags: (result, error, id) => [{ type: 'Employee', id }, 'Employee', 'Dashboard'],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useResetEmployeeFaceMutation,
  useUploadEmployeeProfilePhotoMutation,
  useDeleteEmployeeProfilePhotoMutation,
} = employeeApi;
