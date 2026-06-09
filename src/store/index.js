import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api';
import './api/authApi';
import './api/employeeApi';
import './api/settingsApi';
import { 
  authReducer,
  employeeReducer,
  userReducer,
  payrollReducer,
  attendanceReducer,
  reportReducer,
  settingsReducer
} from './slices';

export const store = configureStore({
  reducer: {
    // Auth
    auth: authReducer,
    
    // Modules
    employee: employeeReducer,
    user: userReducer,
    payroll: payrollReducer,
    attendance: attendanceReducer,
    report: reportReducer,
    settings: settingsReducer,
    
    // API
    api: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(baseApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const getState = () => store.getState();
export const dispatch = store.dispatch;