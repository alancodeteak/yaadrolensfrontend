import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { dashboardToastTransition } from './utils/dashboardToastTransition';
import { store } from './store';
import './styles/globals.css';
import './styles/dashboardToast.css';
import 'react-toastify/dist/ReactToastify.css';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Employees from './pages/Employees/Employees';
import EmployeeDetails from './pages/EmployeeDetails/EmployeeDetails';
import EmployeeToday from './pages/EmployeeToday/EmployeeToday';
import EmployeeAttendanceReport from './pages/EmployeeAttendanceReport/EmployeeAttendanceReport';
import EmployeeTraining from './pages/EmployeeTraining/EmployeeTraining';
import AttendanceDashboard from './pages/AttendanceDashboard/AttendanceDashboard';
import UserManagement from './pages/UserManagement/UserManagement';
import SystemAdmin from './pages/SystemAdmin/SystemAdmin';
import AnalyticsDashboard from './pages/AnalyticsDashboard/AnalyticsDashboard';
import MobileDashboard from './pages/MobileDashboard/MobileDashboard';
import PayrollDetailsPage from './pages/PayrollDetails/PayrollDetails';
import PayrollManagement from './pages/PayrollManagement/PayrollManagement';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';
import Docs from './pages/Docs/Docs';
import AdminDocsRedirect from './pages/Docs/AdminDocsRedirect';
import { LiveAttendanceMonitoring } from './components/pages/attendance';
import { ProtectedRoute, AuthChecker } from './components/common';

function App() {
  return (
    <Provider store={store}>
      <AuthChecker>
        <Router>
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
              <Route path="employees/:id/attendance-report" element={<EmployeeAttendanceReport />} />
              <Route path="employees/:id/training" element={<EmployeeTraining />} />
              <Route path="payroll" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="payroll/:id" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="reports" element={<Navigate to="/admin/attendance-dashboard" replace />} />
              <Route path="settings/*" element={<Settings />} />
              <Route path="attendance" element={<LiveAttendanceMonitoring />} />
              <Route path="attendance-dashboard" element={<AttendanceDashboard />} />
              <Route path="analytics" element={<Navigate to="/admin/attendance-dashboard" replace />} />
              <Route path="mobile" element={<MobileDashboard />} />
              <Route path="users" element={<Navigate to="/admin/employees" replace />} />
              <Route path="system" element={<Navigate to="/admin/settings" replace />} />
              <Route path="docs/*" element={<AdminDocsRedirect />} />
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
            <Route 
              path="/" 
              element={<Navigate to="/admin/dashboard" replace />} 
            />
            
            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
        <ToastContainer
          position="top-center"
          className="dashboard-toast-container"
          transition={dashboardToastTransition}
          autoClose={false}
          hideProgressBar
          newestOnTop
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
          theme="colored"
          toastClassName="dashboard-toast-item"
          bodyClassName="dashboard-toast-body"
        />
      </AuthChecker>
    </Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);