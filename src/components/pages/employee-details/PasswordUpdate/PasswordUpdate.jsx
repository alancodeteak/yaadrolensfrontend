import React, { useState } from 'react';
import Card from '../../../common/Card/Card';
import { LottieLoader, UserAvatar } from '../../../common';

const PasswordUpdate = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mock employee data
  const employeeData = {
    name: 'Sarah Johnson',
    id: 'EMP-2024-001',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
    department: 'Engineering',
    position: 'Senior Developer',
    email: 'sarah.johnson@company.com',
    phone: '+1 (555) 123-4567',
    joinDate: 'January 15, 2022'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Password updated successfully!');
      setFormData({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError('Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-gray-100 text-gray-800',
      'Suspended': 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'attendance', label: 'Attendance Log' },
    { id: 'training', label: 'Training' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Summary Header */}
        <Card variant="panel">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
              {/* Avatar */}
              <div className="flex-shrink-0 mb-4 sm:mb-0">
                <UserAvatar
                  className="w-20 h-20 rounded-full ring-4 ring-white shadow-lg"
                  src={employeeData.avatar}
                  name={employeeData.name}
                  seed={employeeData.id}
                />
              </div>

              {/* Employee Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                      {employeeData.name}
                    </h1>
                    <p className="text-sm text-gray-500 mb-3">
                      {employeeData.id}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                      <p className="text-sm text-gray-600">
                        {employeeData.position} • {employeeData.department}
                      </p>
                      {getStatusBadge(employeeData.status)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Navigation Tabs */}
        <div className="mb-4">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Section */}
        <Card variant="panel">
          <div className="p-6">
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* New Password Field */}
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-all duration-200 outline-none bg-white"
                      placeholder="Enter new password"
                      required
                    />
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-all duration-200 outline-none bg-white"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {/* Success Message */}
                  {success && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                      {success}
                    </div>
                  )}

                  {/* Update Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <LottieLoader size="xs" className="mr-3" />
                        Updating...
                      </div>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'personal' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={employeeData.name}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                    <input
                      type="text"
                      value={employeeData.id}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={employeeData.email}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={employeeData.phone}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <input
                      type="text"
                      value={employeeData.department}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                    <input
                      type="text"
                      value={employeeData.joinDate}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      disabled
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Attendance Log</h2>
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Attendance log coming soon...</p>
                </div>
              </div>
            )}

            {activeTab === 'training' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Training Records</h2>
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Training records coming soon...</p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PasswordUpdate;
