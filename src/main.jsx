import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { store } from './store';
import './styles/globals.css';
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
              <Route path="payroll" element={<PayrollManagement />} />
              <Route path="payroll/:id" element={<PayrollDetailsPage />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings/*" element={<Settings />} />
              <Route path="attendance" element={<LiveAttendanceMonitoring />} />
              <Route path="attendance-dashboard" element={<AttendanceDashboard />} />
              <Route path="analytics" element={<AnalyticsDashboard />} />
              <Route path="mobile" element={<MobileDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="system" element={<SystemAdmin />} />
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
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
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