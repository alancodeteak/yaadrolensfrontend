import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import { buildUserFromToken } from '../api/transforms';
import { clearLocalAuth, revokeRefreshToken } from '../../utils/authSession';

const clearAuthState = (state) => {
  state.user = null;
  state.access_token = null;
  state.refresh_token = null;
  state.isAuthenticated = false;
  state.error = null;
  clearLocalAuth();
};

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { getState }) => {
  const refreshToken =
    getState().auth?.refresh_token || localStorage.getItem('refresh_token');
  const accessToken =
    getState().auth?.access_token || localStorage.getItem('access_token');
  await revokeRefreshToken(refreshToken, accessToken);
});

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const result = await dispatch(
        authApi.endpoints.orgAdminLogin.initiate(credentials)
      ).unwrap();

      const { access_token, refresh_token, token_type } = result;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);

      const user = buildUserFromToken(access_token, credentials);
      localStorage.setItem('user', JSON.stringify(user));

      return {
        user,
        access_token,
        refresh_token,
        token_type: token_type || 'bearer',
      };
    } catch (error) {
      if (error?.status === 'FETCH_ERROR' || error?.status === undefined) {
        return rejectWithValue(
          'Cannot reach the server. Check that the backend is running.'
        );
      }
      const detail = error?.data?.detail;
      const message = typeof detail === 'string' ? detail : 'Invalid user ID or password';
      return rejectWithValue(message);
    }
  }
);

const initialState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  access_token: localStorage.getItem('access_token'),
  refresh_token: localStorage.getItem('refresh_token'),
  isAuthenticated: !!localStorage.getItem('access_token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.error = null;
      localStorage.setItem('access_token', action.payload.access_token);
      localStorage.setItem('refresh_token', action.payload.refresh_token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.access_token = null;
      state.refresh_token = null;
      state.error = action.payload;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    },
    logout: (state) => {
      clearAuthState(state);
    },
    setToken: (state, action) => {
      state.access_token = action.payload;
      state.isAuthenticated = true;
      const user = localStorage.getItem('user');
      if (user) {
        try {
          state.user = JSON.parse(user);
        } catch {
          state.user = null;
        }
      }
      localStorage.setItem('access_token', action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.access_token = null;
        state.refresh_token = null;
        state.error = action.payload;
        clearLocalAuth();
      })
      .addCase(logoutUser.fulfilled, (state) => {
        clearAuthState(state);
      })
      .addCase(logoutUser.rejected, (state) => {
        clearAuthState(state);
      });
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setToken,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
