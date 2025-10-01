import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page = 1, limit = 10, search = '' } = {}) => ({
        url: `/users/?page=${page}&limit=${limit}&search=${search}`,
      }),
      providesTags: ['User'],
    }),
    
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    
    createUser: builder.mutation({
      query: (userData) => ({
        url: '/users/',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    
    getUserProfile: builder.query({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),
    
    updateUserProfile: builder.mutation({
      query: (profileData) => ({
        url: '/users/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['User'],
    }),
    
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: '/users/change-password',
        method: 'POST',
        body: passwordData,
      }),
    }),

    // Advanced User Management APIs
    getUserActivity: builder.query({
      query: (user_id) => `/users/${user_id}/activity`,
      providesTags: (result, error, user_id) => [{ type: 'User', id: user_id }],
    }),

    getUserPermissions: builder.query({
      query: (user_id) => `/users/${user_id}/permissions`,
      providesTags: (result, error, user_id) => [{ type: 'User', id: user_id }],
    }),

    updateUserPermissions: builder.mutation({
      query: ({ user_id, permissions }) => ({
        url: `/users/${user_id}/permissions`,
        method: 'PUT',
        body: { permissions },
      }),
      invalidatesTags: (result, error, { user_id }) => [{ type: 'User', id: user_id }],
    }),

    getUserSessions: builder.query({
      query: (user_id) => `/users/${user_id}/sessions`,
      providesTags: (result, error, user_id) => [{ type: 'User', id: user_id }],
    }),

    revokeUserSession: builder.mutation({
      query: ({ user_id, session_id }) => ({
        url: `/users/${user_id}/sessions/${session_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { user_id }) => [{ type: 'User', id: user_id }],
    }),

    bulkUpdateUsers: builder.mutation({
      query: (updates) => ({
        url: '/users/bulk-update',
        method: 'PUT',
        body: { updates },
      }),
      invalidatesTags: ['User'],
    }),

    exportUsers: builder.query({
      query: ({ format = 'csv', filters = {} } = {}) => {
        const params = new URLSearchParams({ format });
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        return `/users/export?${params.toString()}`;
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useChangePasswordMutation,
  useGetUserActivityQuery,
  useGetUserPermissionsQuery,
  useUpdateUserPermissionsMutation,
  useGetUserSessionsQuery,
  useRevokeUserSessionMutation,
  useBulkUpdateUsersMutation,
  useLazyExportUsersQuery,
} = userApi;
