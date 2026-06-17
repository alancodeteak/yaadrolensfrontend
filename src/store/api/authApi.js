import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    orgAdminLogin: builder.mutation({
      query: (credentials) => ({
        url: '/org-admin/auth/login',
        method: 'POST',
        body: {
          login_id: String(credentials.login_id).trim(),
          password: credentials.password,
          ...(credentials.organization_code
            ? { organization_code: String(credentials.organization_code).trim() }
            : {}),
        },
      }),
    }),

    refreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: { refresh_token: refreshToken },
      }),
    }),

    logout: builder.mutation({
      query: (refreshToken) => ({
        url: '/auth/logout',
        method: 'POST',
        body: { refresh_token: refreshToken },
      }),
    }),
  }),
});

export const {
  useOrgAdminLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;
