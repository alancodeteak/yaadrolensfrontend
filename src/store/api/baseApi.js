import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../config/apiBaseUrl';
import { refreshAccessToken } from '../../utils/authRefresh';

const getRequestUrl = (args) => (typeof args === 'string' ? args : args?.url || '');

const isAuthRequest = (args) => {
  const url = getRequestUrl(args);
  return (
    url.includes('/auth/refresh') ||
    url.includes('/auth/logout') ||
    url.includes('/auth/login') ||
    url.includes('/org-admin/auth/')
  );
};

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = getState().auth.access_token || localStorage.getItem('access_token');

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    const skipJsonContentType =
      endpoint === 'uploadEmployeeProfilePhoto' ||
      endpoint === 'uploadEmployeeDocument' ||
      endpoint === 'exportOrgReport' ||
      endpoint === 'exportUsers';
    if (!skipJsonContentType) {
      headers.set('content-type', 'application/json');
    }

    return headers;
  },
});

// Base query with re-authentication
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status !== 401 || isAuthRequest(args)) {
    return result;
  }

  const accessToken = await refreshAccessToken();
  if (accessToken) {
    api.dispatch({ type: 'auth/setToken', payload: accessToken });
    result = await baseQuery(args, api, extraOptions);
  } else if (!localStorage.getItem('access_token')) {
    api.dispatch({ type: 'auth/logout' });
  }

  return result;
};

// Create the main API slice
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Employee', 'Salary', 'Payment', 'Attendance', 'Report', 'Settings', 'Department', 'Dashboard', 'Leave', 'ShiftTemplate'],
  endpoints: () => ({}),
});

export { API_BASE_URL };
export default baseApi;
