import { baseApi } from './baseApi';

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query({
      query: ({ page = 1, limit = 10, search = '', department = 'all', is_active = true } = {}) => ({
        url: `/employees/?page=${page}&limit=${limit}&search=${search}&department=${department}&is_active=${is_active}`,
      }),
      providesTags: ['Employee'],
    }),

    getEmployeeById: builder.query({
      query: (id) => `/employees/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Employee', id }],
    }),

    createEmployee: builder.mutation({
      query: (employeeData) => ({
        url: '/employees/',
        method: 'POST',
        body: employeeData,
      }),
      transformResponse: (response) => {
        // The API returns the created employee directly
        return response;
      },
      invalidatesTags: ['Employee'],
    }),

    updateEmployee: builder.mutation({
      query: ({ id, ...employeeData }) => ({
        url: `/employees/${id}/`,
        method: 'PUT',
        body: employeeData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Employee', id }],
    }),

    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/employees/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Employee'],
    }),

    enrollEmployee: builder.mutation({
      query: (formData) => ({
        url: '/employees/enroll',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['Employee'],
    }),

    registerFace: builder.mutation({
      query: (formData) => ({
        url: '/employees/register_face',
        method: 'POST',
        body: formData,
        formData: true,
      }),
    }),

    finalizeRegistration: builder.mutation({
      query: (formData) => ({
        url: '/employees/finalize_registration',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['Employee'],
    }),

    getEmployeeTraining: builder.query({
      query: (id) => `/employees/${id}/training/`,
      providesTags: (result, error, id) => [{ type: 'Employee', id }],
    }),

    uploadTrainingPhoto: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/employees/${id}/training/upload/`,
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Employee', id }],
    }),

    getEmployeeToday: builder.query({
      query: (employee_id) => `/employees/${employee_id}/today`,
      providesTags: (result, error, employee_id) => [{ type: 'Employee', id: employee_id }],
    }),

    // Training APIs
    startTraining: builder.mutation({
      query: (employee_id) => ({
        url: `/employees/${employee_id}/start-training`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, employee_id) => [{ type: 'Employee', id: employee_id }],
    }),

    addTrainingPhoto: builder.mutation({
      query: ({ employee_id, formData }) => ({
        url: `/employees/${employee_id}/add-training-photo`,
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: (result, error, { employee_id }) => [{ type: 'Employee', id: employee_id }],
    }),

    getTrainingProgress: builder.query({
      query: (employee_id) => `/employees/${employee_id}/training-progress`,
      providesTags: (result, error, employee_id) => [{ type: 'Employee', id: employee_id }],
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useEnrollEmployeeMutation,
  useRegisterFaceMutation,
  useFinalizeRegistrationMutation,
  useGetEmployeeTrainingQuery,
  useUploadTrainingPhotoMutation,
  useGetEmployeeTodayQuery,
  useStartTrainingMutation,
  useAddTrainingPhotoMutation,
  useGetTrainingProgressQuery,
} = employeeApi;
