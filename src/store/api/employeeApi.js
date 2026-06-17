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
      query: ({ page = 1, limit = 50 } = {}) => {
        const skip = Math.max(0, (page - 1) * limit);
        return `/org-admin/employees?skip=${skip}&limit=${limit}`;
      },
      transformResponse: (response) => {
        const items = normalizeEmployees(response?.items ?? response);
        return {
          items,
          total: response?.total ?? items.length,
          skip: response?.skip ?? 0,
          limit: response?.limit ?? items.length,
        };
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

    uploadEmployeeDocument: builder.mutation({
      query: ({ id, side, file, docType, label }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('doc_type', docType);
        if (label) {
          formData.append('label', label);
        }
        return {
          url: `/org-admin/employees/${id}/document/${side}`,
          method: 'PUT',
          body: formData,
        };
      },
      transformResponse: (response) => normalizeEmployee(response),
      invalidatesTags: (result, error, { id }) => [{ type: 'Employee', id }, 'Employee'],
    }),

    deleteEmployeeDocument: builder.mutation({
      query: ({ id, side }) => ({
        url: `/org-admin/employees/${id}/document/${side}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => normalizeEmployee(response),
      invalidatesTags: (result, error, { id }) => [{ type: 'Employee', id }, 'Employee'],
    }),

    getEmployeeDocumentViewUrl: builder.query({
      query: ({ id, side }) => `/org-admin/employees/${id}/document/${side}/view-url`,
      keepUnusedDataFor: 60,
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
  useUploadEmployeeDocumentMutation,
  useDeleteEmployeeDocumentMutation,
  useGetEmployeeDocumentViewUrlQuery,
  useLazyGetEmployeeDocumentViewUrlQuery,
} = employeeApi;
