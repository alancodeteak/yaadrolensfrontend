import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetUserByIdQuery } from '../../store/api/apiSlice';
import { LoadingScreen, UserAvatar } from '../../components/common';

const UserDetails = () => {
  const { id } = useParams();
  const { data: user, error, isLoading } = useGetUserByIdQuery(id);

  if (isLoading) {
    return <LoadingScreen message="Loading user details..." size="xl" />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error.message || 'Failed to load user details'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">User Details</h1>
      
      {user && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-6">
            <UserAvatar
              className="h-20 w-20 rounded-full"
              src={user.avatar}
              name={user.name}
              seed={user.id}
            />
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.role} - {user.department}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-900">{user.email}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Phone:</span>
                  <span className="ml-2 text-gray-900">{user.phone}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Emma Wilson:</span>
                  <span className="ml-2 text-gray-900">{user.employeeId}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Join Date:</span>
                  <span className="ml-2 text-gray-900">
                    {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Department:</span>
                  <span className="ml-2 text-gray-900">{user.department}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Role:</span>
                  <span className="ml-2 text-gray-900">{user.role}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : user.status === 'inactive'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.status}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Salary:</span>
                  <span className="ml-2 text-gray-900">
                    {user.salary ? `$${user.salary.toLocaleString()}` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex space-x-4">
            <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Edit User
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              View Attendance
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              View Payroll
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
