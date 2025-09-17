import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { store } from './store';
import './styles/globals.css';
import AdminLogin from './pages/AdminLogin/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Employees from './pages/Employees/Employees';
import EmployeeDetails from './pages/EmployeeDetails/EmployeeDetails';
import PayrollDetailsPage from './pages/PayrollDetails/PayrollDetails';
import PayrollManagement from './pages/PayrollManagement/PayrollManagement';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';
import { LiveAttendanceMonitoring } from './components/pages/attendance';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<AdminLogin />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="employees/:id" element={<EmployeeDetails />} />
            <Route path="payroll" element={<PayrollManagement />} />
            <Route path="payroll/:id" element={<PayrollDetailsPage />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings/*" element={<Settings />} />
            <Route path="attendance" element={<LiveAttendanceMonitoring />} />
          </Route>
          {/* Redirect old dashboard route */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);