import React from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SettingsSidebar, DepartmentManagement, AttendanceRules, PositionManagement, CameraDeviceManagement } from '../../components/pages/settings';

// Placeholder components for other settings sections
const GeneralSettings = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-900 mb-8">General Settings</h1>
    <div className="bg-white shadow-md rounded-lg p-6">
      <p className="text-gray-600">General settings content coming soon...</p>
    </div>
  </div>
);

const UserProfile = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-900 mb-8">User Profile</h1>
    <div className="bg-white shadow-md rounded-lg p-6">
      <p className="text-gray-600">User profile settings coming soon...</p>
    </div>
  </div>
);

const AccountSettings = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>
    <div className="bg-white shadow-md rounded-lg p-6">
      <p className="text-gray-600">Account settings coming soon...</p>
    </div>
  </div>
);



const UserManagement = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>
    <div className="bg-white shadow-md rounded-lg p-6">
      <p className="text-gray-600">User management settings coming soon...</p>
    </div>
  </div>
);


const Settings = () => {
  const { generalSettings, attendanceSettings, payrollSettings, loading } = useSelector((state) => state.settings);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SettingsSidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/admin/settings/departments" replace />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="account" element={<AccountSettings />} />
          <Route path="attendance" element={<AttendanceRules />} />
          <Route path="departments" element={<DepartmentManagement />} />
          <Route path="positions" element={<PositionManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="cameras" element={<CameraDeviceManagement />} />
          <Route path="*" element={<Navigate to="/admin/settings/departments" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Settings;
