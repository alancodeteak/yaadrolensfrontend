import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  useGetUsersQuery,
  useGetUserActivityQuery,
  useGetUserPermissionsQuery,
  useUpdateUserPermissionsMutation,
  useGetUserSessionsQuery,
  useRevokeUserSessionMutation,
  useBulkUpdateUsersMutation,
  useLazyExportUsersQuery
} from '../../store/api';
import Card from '../../components/common/Card/Card';

const UserManagement = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showPermissions, setShowPermissions] = useState(false);
  const [showSessions, setShowSessions] = useState(false);

  // API hooks
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useGetUsersQuery({
    search: searchTerm,
    role: roleFilter,
    is_active: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : null
  });
  
  const { data: userActivity, isLoading: activityLoading } = useGetUserActivityQuery(selectedUser?.id, {
    skip: !selectedUser
  });
  
  const { data: userPermissions, isLoading: permissionsLoading } = useGetUserPermissionsQuery(selectedUser?.id, {
    skip: !selectedUser
  });
  
  const { data: userSessions, isLoading: sessionsLoading } = useGetUserSessionsQuery(selectedUser?.id, {
    skip: !selectedUser
  });

  const [updateUserPermissions, { isLoading: updatingPermissions }] = useUpdateUserPermissionsMutation();
  const [revokeUserSession, { isLoading: revokingSession }] = useRevokeUserSessionMutation();
  const [bulkUpdateUsers, { isLoading: bulkUpdating }] = useBulkUpdateUsersMutation();
  const [exportUsers] = useLazyExportUsersQuery();

  const users = usersData?.data || [];

  const handlePermissionUpdate = async (permission, enabled) => {
    if (!selectedUser) return;

    try {
      const currentPermissions = userPermissions?.permissions || {};
      const updatedPermissions = {
        ...currentPermissions,
        [permission]: enabled
      };

      await updateUserPermissions({
        user_id: selectedUser.id,
        permissions: updatedPermissions
      }).unwrap();

      toast.success('Permissions updated successfully');
    } catch (error) {
      console.error('Permission update failed:', error);
      toast.error(error?.data?.message || 'Failed to update permissions');
    }
  };

  const handleRevokeSession = async (sessionId) => {
    if (!selectedUser) return;

    try {
      await revokeUserSession({
        user_id: selectedUser.id,
        session_id: sessionId
      }).unwrap();

      toast.success('Session revoked successfully');
    } catch (error) {
      console.error('Session revocation failed:', error);
      toast.error(error?.data?.message || 'Failed to revoke session');
    }
  };

  const handleBulkAction = async (action, userIds) => {
    try {
      const updates = userIds.map(id => ({ id, action }));
      await bulkUpdateUsers(updates).unwrap();
      toast.success(`Bulk ${action} completed successfully`);
      refetchUsers();
    } catch (error) {
      console.error('Bulk action failed:', error);
      toast.error(error?.data?.message || 'Bulk action failed');
    }
  };

  const handleExportUsers = async (format = 'csv') => {
    try {
      const result = await exportUsers({
        format,
        filters: {
          role: roleFilter,
          is_active: statusFilter === 'active' ? true : statusFilter === 'inactive' ? false : null
        }
      }).unwrap();
      
      // Create download link
      const blob = new Blob([result], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users_export_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Users exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(error?.data?.message || 'Export failed');
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: 'bg-red-100 text-red-800', text: 'Admin' },
      hr: { color: 'bg-blue-100 text-blue-800', text: 'HR' },
      manager: { color: 'bg-green-100 text-green-800', text: 'Manager' },
      employee: { color: 'bg-gray-100 text-gray-800', text: 'Employee' }
    };
    
    const config = roleConfig[role] || { color: 'bg-gray-100 text-gray-800', text: role };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage system users, permissions, and sessions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users List */}
        <div className="lg:col-span-2">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Users</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleExportUsers('csv')}
                    className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    Export CSV
                  </button>
                  <button
                    onClick={() => handleExportUsers('excel')}
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Export Excel
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search users..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="hr">HR</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              {usersLoading ? (
                <div className="animate-pulse">
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr 
                          key={user.id} 
                          className={`hover:bg-gray-50 cursor-pointer ${selectedUser?.id === user.id ? 'bg-blue-50' : ''}`}
                          onClick={() => setSelectedUser(user)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                  <span className="text-sm font-medium text-blue-600">
                                    {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.first_name} {user.last_name}
                                </div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getRoleBadge(user.role)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(user.is_active)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.last_login ? formatDate(user.last_login) : 'Never'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowPermissions(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              Permissions
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowSessions(true);
                              }}
                              className="text-green-600 hover:text-green-900"
                            >
                              Sessions
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* User Details Sidebar */}
        <div className="space-y-6">
          {/* User Info */}
          {selectedUser && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">User Details</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Name</p>
                    <p className="text-sm text-gray-900">{selectedUser.first_name} {selectedUser.last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <div className="mt-1">{getRoleBadge(selectedUser.role)}</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <div className="mt-1">{getStatusBadge(selectedUser.is_active)}</div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedUser.created_at)}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Recent Activity */}
          {selectedUser && userActivity && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                {activityLoading ? (
                  <div className="animate-pulse space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-4 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {userActivity.slice(0, 5).map((activity, index) => (
                      <div key={index} className="text-sm">
                        <p className="text-gray-900">{activity.action}</p>
                        <p className="text-gray-500">{formatDate(activity.timestamp)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Permissions Modal */}
      {showPermissions && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Permissions for {selectedUser.first_name} {selectedUser.last_name}
              </h3>
              {permissionsLoading ? (
                <div className="animate-pulse space-y-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-8 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(userPermissions?.permissions || {}).map(([permission, enabled]) => (
                    <div key={permission} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700 capitalize">
                        {permission.replace(/_/g, ' ')}
                      </span>
                      <button
                        onClick={() => handlePermissionUpdate(permission, !enabled)}
                        disabled={updatingPermissions}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                          enabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                            enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowPermissions(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sessions Modal */}
      {showSessions && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Active Sessions for {selectedUser.first_name} {selectedUser.last_name}
              </h3>
              {sessionsLoading ? (
                <div className="animate-pulse space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {userSessions?.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {session.device_info || 'Unknown Device'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {session.ip_address} • {formatDate(session.created_at)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRevokeSession(session.id)}
                        disabled={revokingSession}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
                      >
                        Revoke
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowSessions(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;