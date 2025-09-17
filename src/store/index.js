import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import payrollReducer from './slices/payrollSlice';
import attendanceReducer from './slices/attendanceSlice';
import reportReducer from './slices/reportSlice';
import settingsReducer from './slices/settingsSlice';
import { apiSlice } from './api/apiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    payroll: payrollReducer,
    attendance: attendanceReducer,
    report: reportReducer,
    settings: settingsReducer,
    api: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const getState = () => store.getState();
export const dispatch = store.dispatch;