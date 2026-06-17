import { baseApi } from './baseApi';
import { API_BASE_URL } from '../../config/apiBaseUrl';

/** API origin without /api/v1 — for GET /health */
const apiOrigin = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

const notAvailable = (feature) => ({
  error: {
    status: 501,
    data: { message: `${feature} is not available on the Lens v2 API yet.` },
  },
});

export const systemAdminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSystemHealth: builder.query({
      queryFn: async () => {
        try {
          const res = await fetch(`${apiOrigin}/health`);
          const data = await res.json();
          return {
            data: {
              overall_status: data.status === 'healthy' ? 'healthy' : 'error',
              uptime: 'N/A',
              version: '2.0.0',
            },
          };
        } catch {
          return {
            data: {
              overall_status: 'error',
              uptime: 'N/A',
              version: 'N/A',
            },
          };
        }
      },
    }),

    getSystemMetrics: builder.query({
      queryFn: async () => ({
        data: {
          cpu_usage: 0,
          memory_usage: 0,
          disk_usage: 0,
          active_connections: 0,
        },
      }),
    }),

    getSystemLogs: builder.query({
      queryFn: async () => ({ data: [] }),
    }),

    getSystemBackups: builder.query({
      queryFn: async () => ({ data: [] }),
    }),

    createSystemBackup: builder.mutation({
      queryFn: async () => notAvailable('System backup'),
    }),

    restoreSystemBackup: builder.mutation({
      queryFn: async () => notAvailable('Backup restore'),
    }),

    getSystemNotifications: builder.query({
      queryFn: async () => ({
        data: {
          email_alerts: false,
          sms_alerts: false,
          push_notifications: false,
          attendance_reminders: true,
        },
      }),
    }),

    updateSystemNotifications: builder.mutation({
      queryFn: async (settings) => ({ data: { ...settings, success: true } }),
    }),

    getSystemIntegrations: builder.query({
      queryFn: async () => ({ data: [] }),
    }),

    updateSystemIntegration: builder.mutation({
      queryFn: async () => notAvailable('Integration update'),
    }),

    testSystemIntegration: builder.mutation({
      queryFn: async () => notAvailable('Integration test'),
    }),

    getSystemAuditLogs: builder.query({
      queryFn: async () => ({ data: [] }),
    }),
  }),
});

export const {
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
  useGetSystemAuditLogsQuery,
} = systemAdminApi;
