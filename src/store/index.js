import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api';
import './api/authApi';
import './api/employeeApi';
import './api/salaryApi';
import './api/settingsApi';
import './api/paymentApi';
import './api/reportsApi';
import './api/dashboardApi';
import './api/shiftApi';
import { authReducer } from './slices';

export const store = configureStore({
  reducer: {
    // Auth
    auth: authReducer,

    // API
    api: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const getState = () => store.getState();
export const dispatch = store.dispatch;