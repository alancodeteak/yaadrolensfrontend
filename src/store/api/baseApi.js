import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base URL for your API
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = getState().auth.access_token || localStorage.getItem('access_token');

    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }

    const skipJsonContentType = endpoint === 'uploadEmployeeProfilePhoto';
    if (!skipJsonContentType) {
      headers.set('content-type', 'application/json');
    }

    return headers;
  },
});

// Base query with re-authentication
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // If we get a 401, try to refresh the token
  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (refreshToken) {
      // Try to get a new token
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refresh_token: refreshToken },
        },
        api,
        extraOptions
      );
      
      if (refreshResult.data) {
        const { access_token, refresh_token } = refreshResult.data;
        localStorage.setItem('access_token', access_token);
        if (refresh_token) {
          localStorage.setItem('refresh_token', refresh_token);
        }
        
        // Update the auth state
        api.dispatch({ type: 'auth/setToken', payload: access_token });
        
        // Retry the original query
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed - logout the user
        api.dispatch({ type: 'auth/logout' });
      }
    } else {
      // No refresh token - logout the user
      api.dispatch({ type: 'auth/logout' });
    }
  }
  
  return result;
};

// Create the main API slice
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Employee', 'Payroll', 'Attendance', 'Report', 'Settings', 'Department', 'Dashboard'],
  endpoints: () => ({}),
});

export default baseApi;

