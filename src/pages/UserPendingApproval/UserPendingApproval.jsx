import React from 'react';
import { useDispatch } from 'react-redux';
import { useGetPendingUsersQuery, useApproveUserMutation, useRejectUserMutation } from '../../store/api/apiSlice';
import { approveUser, rejectUser } from '../../store/slices/userSlice';
import { LoadingScreen, UserAvatar } from '../../components/common';

const UserPendingApproval = () => {
  const dispatch = useDispatch();
  const { data: pendingUsers, error, isLoading, refetch } = useGetPendingUsersQuery();
  const [approveUserMutation] = useApproveUserMutation();
  const [rejectUserMutation] = useRejectUserMutation();

  const handleApprove = async (userId) => {
    try {
      await approveUserMutation(userId).unwrap();
      dispatch(approveUser(userId));
      refetch();
    } catch (err) {
      console.error('Failed to approve user:', err);
    }
  };

  const handleReject = async (userId) => {
    try {
      await rejectUserMutation(userId).unwrap();
      dispatch(rejectUser(userId));
      refetch();
    } catch (err) {
      console.error('Failed to reject user:', err);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading pending approvals..." size="xl" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Pending User Approvals</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error.message || 'Failed to fetch pending users'}
        </div>
      )}

      {pendingUsers && pendingUsers.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-8 rounded text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Approvals</h3>
          <p className="text-gray-500">All user registrations have been processed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingUsers?.map((user) => (
            <div key={user.id} className="bg-white shadow-md rounded-lg p-6">
              <div className="flex items-center mb-4">
                <UserAvatar
                  className="h-12 w-12 rounded-full"
                  src={user.avatar}
                  name={user.name}
                  seed={user.id}
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Department:</span>
                  <span className="text-sm text-gray-900">{user.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Role:</span>
                  <span className="text-sm text-gray-900">{user.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Phone:</span>
                  <span className="text-sm text-gray-900">{user.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">Applied:</span>
                  <span className="text-sm text-gray-900">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleApprove(user.id)}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(user.id)}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPendingApproval;
