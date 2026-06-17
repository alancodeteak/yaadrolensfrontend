import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './store';
import './styles/fonts.css';
import './styles/critical.css';
import './styles/globals.css';
import './styles/dashboardToast.css';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import { ProtectedRoute, AuthChecker } from './components/common';
import LoadingScreen from './components/common/Lottie/LoadingScreen';
import DeferredAppToasts from './components/common/DeferredAppToasts/DeferredAppToasts';
import PageNotFound from './pages/PageNotFound';
import { lazyWithRetry } from './utils/lazyWithRetry';

const Dashboard = lazyWithRetry(() => import('./pages/Dashboard/Dashboard'));
const Employees = lazyWithRetry(() => import('./pages/Employees/Employees'));
const EmployeeDetails = lazyWithRetry(() => import('./pages/EmployeeDetails/EmployeeDetails'));
const EmployeeToday = lazyWithRetry(() => import('./pages/EmployeeToday/EmployeeToday'));
const EmployeeAttendanceReport = lazyWithRetry(() =>
  import('./pages/EmployeeAttendanceReport/EmployeeAttendanceReport')
);
const EmployeeTraining = lazyWithRetry(() => import('./pages/EmployeeTraining/EmployeeTraining'));
const AttendanceDashboard = lazyWithRetry(() => import('./pages/AttendanceDashboard/AttendanceDashboard'));
const MobileDashboard = lazyWithRetry(() => import('./pages/MobileDashboard/MobileDashboard'));
const PayrollManagement = lazyWithRetry(() => import('./pages/PayrollManagement/PayrollManagement'));
const Salary = lazyWithRetry(() => import('./pages/Salary/Salary'));
const Reports = lazyWithRetry(() => import('./pages/Reports/Reports'));
const Settings = lazyWithRetry(() => import('./pages/Settings/Settings'));
const Docs = lazyWithRetry(() => import('./pages/Docs/Docs'));
const AdminDocsRedirect = lazyWithRetry(() => import('./pages/Docs/AdminDocsRedirect'));
const LiveAttendanceMonitoring = lazyWithRetry(() =>
  import('./components/pages/attendance').then((m) => ({
    default: m.LiveAttendanceMonitoring,
  }))
);

const PageFallback = () => <LoadingScreen message="Loading page…" />;

function App() {
  return (
    <Provider store={store}>
      <AuthChecker>
        <Router>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<AdminLogin />} />
              <Route path="/admin-login" element={<AdminLogin />} />

              {/* Protected admin routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="employees" element={<Employees />} />
                <Route path="employees/:id" element={<EmployeeDetails />} />
                <Route path="employees/:id/today" element={<EmployeeToday />} />
                <Route
                  path="employees/:id/attendance-report"
                  element={<EmployeeAttendanceReport />}
                />
                <Route path="employees/:id/training" element={<EmployeeTraining />} />
                <Route path="salary" element={<Salary />} />
                <Route path="payroll" element={<PayrollManagement />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings/*" element={<Settings />} />
                <Route path="attendance" element={<LiveAttendanceMonitoring />} />
                <Route path="attendance-dashboard" element={<AttendanceDashboard />} />
                <Route
                  path="analytics"
                  element={<Navigate to="/admin/attendance-dashboard" replace />}
                />
                <Route path="mobile" element={<MobileDashboard />} />
                <Route path="users" element={<Navigate to="/admin/employees" replace />} />
                <Route path="system" element={<Navigate to="/admin/settings" replace />} />
                <Route path="docs/*" element={<AdminDocsRedirect />} />
                <Route path="*" element={<PageNotFound />} />
              </Route>

              {/* Protected docs routes (top-level /docs) */}
              <Route
                path="/docs/*"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="*" element={<Docs />} />
              </Route>

              {/* Protected legacy routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Root redirect */}
              <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

              {/* Catch all */}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </Router>
        <DeferredAppToasts />
      </AuthChecker>
    </Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

sessionStorage.removeItem('chunk-reload');
