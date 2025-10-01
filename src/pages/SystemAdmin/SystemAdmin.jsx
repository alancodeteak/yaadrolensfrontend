import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  useGetSystemHealthQuery,
  useGetSystemMetricsQuery,
  useGetSystemLogsQuery,
  useGetSystemBackupsQuery,
  useCreateSystemBackupMutation,
  useRestoreSystemBackupMutation,
  useGetSystemNotificationsQuery,
  useUpdateSystemNotificationsMutation,
  useGetSystemIntegrationsQuery,
  useUpdateSystemIntegrationMutation,
  useTestSystemIntegrationMutation,
  useGetSystemAuditLogsQuery
} from '../../store/api';
import Card from '../../components/common/Card/Card';

const SystemAdmin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [logLevel, setLogLevel] = useState('');
  const [logDateRange, setLogDateRange] = useState({
    start_date: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  });

  // API hooks
  const { data: systemHealth, isLoading: healthLoading } = useGetSystemHealthQuery();
  const { data: systemMetrics, isLoading: metricsLoading } = useGetSystemMetricsQuery();
  const { data: systemLogs, isLoading: logsLoading } = useGetSystemLogsQuery({
    level: logLevel,
    start_date: logDateRange.start_date,
    end_date: logDateRange.end_date
  });
  const { data: systemBackups, isLoading: backupsLoading } = useGetSystemBackupsQuery();
  const { data: notifications, isLoading: notificationsLoading } = useGetSystemNotificationsQuery();
  const { data: integrations, isLoading: integrationsLoading } = useGetSystemIntegrationsQuery();
  const { data: auditLogs, isLoading: auditLoading } = useGetSystemAuditLogsQuery({
    start_date: logDateRange.start_date,
    end_date: logDateRange.end_date
  });

  const [createBackup, { isLoading: creatingBackup }] = useCreateSystemBackupMutation();
  const [restoreBackup, { isLoading: restoringBackup }] = useRestoreSystemBackupMutation();
  const [updateNotifications, { isLoading: updatingNotifications }] = useUpdateSystemNotificationsMutation();
  const [updateIntegration, { isLoading: updatingIntegration }] = useUpdateSystemIntegrationMutation();
  const [testIntegration, { isLoading: testingIntegration }] = useTestSystemIntegrationMutation();

  const handleCreateBackup = async () => {
    try {
      await createBackup({
        name: `backup_${new Date().toISOString().split('T')[0]}`,
        description: 'Manual backup created from admin panel'
      }).unwrap();
      toast.success('Backup created successfully');
    } catch (error) {
      console.error('Backup creation failed:', error);
      toast.error(error?.data?.message || 'Failed to create backup');
    }
  };

  const handleRestoreBackup = async (backupId) => {
    if (!confirm('Are you sure you want to restore this backup? This action cannot be undone.')) {
      return;
    }

    try {
      await restoreBackup({ backup_id: backupId, confirm: true }).unwrap();
      toast.success('Backup restored successfully');
    } catch (error) {
      console.error('Backup restoration failed:', error);
      toast.error(error?.data?.message || 'Failed to restore backup');
    }
  };

  const handleUpdateNotifications = async (settings) => {
    try {
      await updateNotifications(settings).unwrap();
      toast.success('Notification settings updated successfully');
    } catch (error) {
      console.error('Notification update failed:', error);
      toast.error(error?.data?.message || 'Failed to update notifications');
    }
  };

  const handleTestIntegration = async (integrationId) => {
    try {
      const result = await testIntegration(integrationId).unwrap();
      toast.success(`Integration test ${result.success ? 'passed' : 'failed'}`);
    } catch (error) {
      console.error('Integration test failed:', error);
      toast.error(error?.data?.message || 'Integration test failed');
    }
  };

  const getHealthStatus = (status) => {
    const statusConfig = {
      healthy: { color: 'text-green-600', bg: 'bg-green-100', text: 'Healthy' },
      warning: { color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Warning' },
      error: { color: 'text-red-600', bg: 'bg-red-100', text: 'Error' }
    };
    
    const config = statusConfig[status] || { color: 'text-gray-600', bg: 'bg-gray-100', text: 'Unknown' };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getLogLevelColor = (level) => {
    const levelConfig = {
      ERROR: 'text-red-600',
      WARNING: 'text-yellow-600',
      INFO: 'text-blue-600',
      DEBUG: 'text-gray-600'
    };
    return levelConfig[level] || 'text-gray-600';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const tabs = [
    { id: 'overview', name: 'System Overview' },
    { id: 'logs', name: 'System Logs' },
    { id: 'backups', name: 'Backups' },
    { id: 'notifications', name: 'Notifications' },
    { id: 'integrations', name: 'Integrations' },
    { id: 'audit', name: 'Audit Logs' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">System Administration</h1>
        <p className="text-gray-600 mt-2">Monitor system health, manage backups, and configure integrations</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* System Health */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health</h2>
              {healthLoading ? (
                <div className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {getHealthStatus(systemHealth?.overall_status)}
                    </div>
                    <p className="text-sm text-gray-500">Overall Status</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {systemHealth?.uptime || 'N/A'}
                    </div>
                    <p className="text-sm text-gray-500">Uptime</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-2">
                      {systemHealth?.version || 'N/A'}
                    </div>
                    <p className="text-sm text-gray-500">Version</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* System Metrics */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Metrics</h2>
              {metricsLoading ? (
                <div className="animate-pulse">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-24 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      {systemMetrics?.cpu_usage || 0}%
                    </div>
                    <p className="text-sm text-gray-500">CPU Usage</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {systemMetrics?.memory_usage || 0}%
                    </div>
                    <p className="text-sm text-gray-500">Memory Usage</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-2">
                      {systemMetrics?.disk_usage || 0}%
                    </div>
                    <p className="text-sm text-gray-500">Disk Usage</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 mb-2">
                      {systemMetrics?.active_connections || 0}
                    </div>
                    <p className="text-sm text-gray-500">Active Connections</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'logs' && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">System Logs</h2>
              <div className="flex space-x-4">
                <select
                  value={logLevel}
                  onChange={(e) => setLogLevel(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Levels</option>
                  <option value="ERROR">Error</option>
                  <option value="WARNING">Warning</option>
                  <option value="INFO">Info</option>
                  <option value="DEBUG">Debug</option>
                </select>
                <input
                  type="date"
                  value={logDateRange.start_date}
                  onChange={(e) => setLogDateRange(prev => ({ ...prev, start_date: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="date"
                  value={logDateRange.end_date}
                  onChange={(e) => setLogDateRange(prev => ({ ...prev, end_date: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {logsLoading ? (
              <div className="animate-pulse space-y-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {systemLogs?.map((log, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${getLogLevelColor(log.level)}`}>
                        {log.level}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(log.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{log.message}</p>
                    {log.details && (
                      <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'backups' && (
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">System Backups</h2>
                <button
                  onClick={handleCreateBackup}
                  disabled={creatingBackup}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
                >
                  {creatingBackup ? 'Creating...' : 'Create Backup'}
                </button>
              </div>

              {backupsLoading ? (
                <div className="animate-pulse space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {systemBackups?.map((backup) => (
                    <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{backup.name}</h3>
                        <p className="text-sm text-gray-500">{backup.description}</p>
                        <p className="text-xs text-gray-400">
                          Created: {formatDate(backup.created_at)} • Size: {backup.size}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRestoreBackup(backup.id)}
                          disabled={restoringBackup}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                        >
                          Restore
                        </button>
                        <button className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-200">
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'notifications' && (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h2>
            {notificationsLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(notifications || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                    <button
                      onClick={() => handleUpdateNotifications({ [key]: !value })}
                      disabled={updatingNotifications}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                        value ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'integrations' && (
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Integrations</h2>
            {integrationsLoading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {integrations?.map((integration) => (
                  <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{integration.name}</h3>
                      <p className="text-sm text-gray-500">{integration.description}</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        integration.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {integration.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleTestIntegration(integration.id)}
                        disabled={testingIntegration}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200"
                      >
                        Test
                      </button>
                      <button
                        onClick={() => updateIntegration({ integration_id: integration.id, enabled: !integration.enabled })}
                        disabled={updatingIntegration}
                        className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 transition-colors duration-200"
                      >
                        {integration.enabled ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'audit' && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Audit Logs</h2>
              <div className="flex space-x-4">
                <input
                  type="date"
                  value={logDateRange.start_date}
                  onChange={(e) => setLogDateRange(prev => ({ ...prev, start_date: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="date"
                  value={logDateRange.end_date}
                  onChange={(e) => setLogDateRange(prev => ({ ...prev, end_date: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {auditLoading ? (
              <div className="animate-pulse space-y-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {auditLogs?.map((log, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{log.action}</span>
                      <span className="text-xs text-gray-500">{formatDate(log.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      User: {log.user_name} ({log.user_email})
                    </p>
                    {log.details && (
                      <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SystemAdmin;

