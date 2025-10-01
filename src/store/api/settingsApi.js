import { baseApi } from './baseApi';

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: () => '/organization/settings',
      providesTags: ['Settings'],
    }),
    
    updateSettings: builder.mutation({
      query: (settingsData) => ({
        url: '/organization/settings',
        method: 'PUT',
        body: settingsData,
      }),
      invalidatesTags: ['Settings'],
    }),
    
    getAttendanceRules: builder.query({
      query: () => '/organization/attendance-rules',
      providesTags: ['Settings'],
    }),
    
    updateAttendanceRules: builder.mutation({
      query: (rulesData) => ({
        url: '/organization/attendance-rules',
        method: 'PUT',
        body: rulesData,
      }),
      invalidatesTags: ['Settings'],
    }),
    
    getSalaryDefaults: builder.query({
      query: () => '/organization/salary-defaults',
      providesTags: ['Settings'],
    }),
    
    resetToDefaults: builder.mutation({
      query: () => ({
        url: '/organization/reset-defaults',
        method: 'POST',
      }),
      invalidatesTags: ['Settings'],
    }),
    
    getSettingsHistory: builder.query({
      query: ({ limit = 10 } = {}) => `/organization/settings/history?limit=${limit}`,
      providesTags: ['Settings'],
    }),
    
    // Salary Management APIs
    getSalarySettings: builder.query({
      query: () => '/organization/salary-settings',
      providesTags: ['SalarySettings'],
    }),
    
    updateSalarySettings: builder.mutation({
      query: (salaryData) => ({
        url: '/organization/salary-settings',
        method: 'PUT',
        body: salaryData,
      }),
      invalidatesTags: ['SalarySettings'],
    }),
    
    getSalaryBands: builder.query({
      query: () => '/organization/salary-bands',
      providesTags: ['SalaryBands'],
    }),
    
    createSalaryBand: builder.mutation({
      query: (bandData) => ({
        url: '/organization/salary-bands',
        method: 'POST',
        body: bandData,
      }),
      invalidatesTags: ['SalaryBands'],
    }),
    
    updateSalaryBand: builder.mutation({
      query: ({ id, ...bandData }) => ({
        url: `/organization/salary-bands/${id}`,
        method: 'PUT',
        body: bandData,
      }),
      invalidatesTags: ['SalaryBands'],
    }),
    
    deleteSalaryBand: builder.mutation({
      query: (id) => ({
        url: `/organization/salary-bands/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SalaryBands'],
    }),
    
    resetSalarySettings: builder.mutation({
      query: () => ({
        url: '/organization/salary-settings/reset',
        method: 'POST',
      }),
      invalidatesTags: ['SalarySettings'],
    }),
    
    // Department Management APIs
    getDepartments: builder.query({
      query: ({ active_only = true } = {}) => `/departments/?active_only=${active_only}`,
      providesTags: ['Department'],
    }),
    
    getDepartment: builder.query({
      query: (id) => `/departments/${id}`,
      providesTags: ['Department'],
    }),
    
    createDepartment: builder.mutation({
      query: (departmentData) => ({
        url: '/departments/',
        method: 'POST',
        body: departmentData,
      }),
      invalidatesTags: ['Department'],
    }),
    
    updateDepartment: builder.mutation({
      query: ({ id, ...departmentData }) => ({
        url: `/departments/${id}`,
        method: 'PUT',
        body: departmentData,
      }),
      invalidatesTags: ['Department'],
    }),
    
    deleteDepartment: builder.mutation({
      query: (id) => ({
        url: `/departments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Department'],
    }),
    
    getDepartmentSummary: builder.query({
      query: () => '/departments/summary',
      providesTags: ['Department'],
    }),
    
    getDepartmentHistory: builder.query({
      query: ({ id, limit = 50 } = {}) => `/departments/${id}/history?limit=${limit}`,
      providesTags: ['Department'],
    }),
    
    // Job Position Management APIs
    getJobPositions: builder.query({
      query: ({ department_id = null, active_only = true } = {}) => {
        const params = new URLSearchParams();
        if (department_id) params.append('department_id', department_id);
        params.append('active_only', active_only);
        return `/departments/positions/?${params}`;
      },
      providesTags: ['JobPosition'],
    }),
    
    getJobPosition: builder.query({
      query: (id) => `/departments/positions/${id}`,
      providesTags: ['JobPosition'],
    }),
    
    createJobPosition: builder.mutation({
      query: (positionData) => ({
        url: '/departments/positions/',
        method: 'POST',
        body: positionData,
      }),
      invalidatesTags: ['JobPosition'],
    }),
    
    updateJobPosition: builder.mutation({
      query: ({ id, ...positionData }) => ({
        url: `/departments/positions/${id}`,
        method: 'PUT',
        body: positionData,
      }),
      invalidatesTags: ['JobPosition'],
    }),
    
    deleteJobPosition: builder.mutation({
      query: (id) => ({
        url: `/departments/positions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['JobPosition'],
    }),
    
    getJobPositionSummary: builder.query({
      query: () => '/departments/positions/summary',
      providesTags: ['JobPosition'],
    }),
    
    getJobPositionHistory: builder.query({
      query: ({ id, limit = 50 } = {}) => `/departments/positions/${id}/history?limit=${limit}`,
      providesTags: ['JobPosition'],
    }),
    
    // Bulk Operations
    bulkUpdateDepartments: builder.mutation({
      query: (data) => ({
        url: '/departments/bulk-update',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Department'],
    }),
    
    bulkUpdateJobPositions: builder.mutation({
      query: (data) => ({
        url: '/departments/positions/bulk-update',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['JobPosition'],
    }),
    
    getCameraDevices: builder.query({
      query: () => '/organization/camera-devices',
      providesTags: ['Settings'],
    }),
    
    updateCameraDevice: builder.mutation({
      query: ({ id, ...deviceData }) => ({
        url: `/organization/camera-devices/${id}`,
        method: 'PUT',
        body: deviceData,
      }),
      invalidatesTags: ['Settings'],
    }),
    
    getSystemInfo: builder.query({
      query: () => '/organization/system-info',
      providesTags: ['Settings'],
    }),
    
    backupData: builder.mutation({
      query: () => ({
        url: '/organization/backup',
        method: 'POST',
        responseHandler: (response) => response.blob(),
      }),
    }),
    
    restoreData: builder.mutation({
      query: (formData) => ({
        url: '/organization/restore',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['Settings', 'Employee', 'User', 'Attendance', 'Payroll'],
    }),

    // System Settings APIs
    getSystemHealth: builder.query({
      query: () => '/system/health',
      providesTags: ['System'],
    }),

    getSystemMetrics: builder.query({
      query: () => '/system/metrics',
      providesTags: ['System'],
    }),

    getSystemLogs: builder.query({
      query: ({ level, start_date, end_date, limit = 100 } = {}) => {
        const params = new URLSearchParams({ limit });
        if (level) params.append('level', level);
        if (start_date) params.append('start_date', start_date);
        if (end_date) params.append('end_date', end_date);
        return `/system/logs?${params.toString()}`;
      },
      providesTags: ['System'],
    }),

    getSystemBackups: builder.query({
      query: () => '/system/backups',
      providesTags: ['System'],
    }),

    createSystemBackup: builder.mutation({
      query: (backupConfig) => ({
        url: '/system/backups',
        method: 'POST',
        body: backupConfig,
      }),
      invalidatesTags: ['System'],
    }),

    restoreSystemBackup: builder.mutation({
      query: ({ backup_id, confirm = false }) => ({
        url: `/system/backups/${backup_id}/restore`,
        method: 'POST',
        body: { confirm },
      }),
      invalidatesTags: ['System'],
    }),

    getSystemNotifications: builder.query({
      query: () => '/system/notifications',
      providesTags: ['System'],
    }),

    updateSystemNotifications: builder.mutation({
      query: (notificationSettings) => ({
        url: '/system/notifications',
        method: 'PUT',
        body: notificationSettings,
      }),
      invalidatesTags: ['System'],
    }),

    getSystemIntegrations: builder.query({
      query: () => '/system/integrations',
      providesTags: ['System'],
    }),

    updateSystemIntegration: builder.mutation({
      query: ({ integration_id, ...settings }) => ({
        url: `/system/integrations/${integration_id}`,
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['System'],
    }),

    testSystemIntegration: builder.mutation({
      query: (integration_id) => ({
        url: `/system/integrations/${integration_id}/test`,
        method: 'POST',
      }),
    }),

    getSystemAuditLogs: builder.query({
      query: ({ user_id, action, start_date, end_date, limit = 100 } = {}) => {
        const params = new URLSearchParams({ limit });
        if (user_id) params.append('user_id', user_id);
        if (action) params.append('action', action);
        if (start_date) params.append('start_date', start_date);
        if (end_date) params.append('end_date', end_date);
        return `/system/audit-logs?${params.toString()}`;
      },
      providesTags: ['System'],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useGetAttendanceRulesQuery,
  useUpdateAttendanceRulesMutation,
  useGetSalaryDefaultsQuery,
  useResetToDefaultsMutation,
  useGetSettingsHistoryQuery,
  // Department Management hooks
  useGetDepartmentsQuery,
  useGetDepartmentQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDepartmentSummaryQuery,
  useGetDepartmentHistoryQuery,
  // Job Position Management hooks
  useGetJobPositionsQuery,
  useGetJobPositionQuery,
  useCreateJobPositionMutation,
  useUpdateJobPositionMutation,
  useDeleteJobPositionMutation,
  useGetJobPositionSummaryQuery,
  useGetJobPositionHistoryQuery,
  // Bulk Operations hooks
  useBulkUpdateDepartmentsMutation,
  useBulkUpdateJobPositionsMutation,
  useGetCameraDevicesQuery,
  useUpdateCameraDeviceMutation,
  useGetSystemInfoQuery,
  useBackupDataMutation,
  useRestoreDataMutation,
  // Salary Management hooks
  useGetSalarySettingsQuery,
  useUpdateSalarySettingsMutation,
  useGetSalaryBandsQuery,
  useCreateSalaryBandMutation,
  useUpdateSalaryBandMutation,
  useDeleteSalaryBandMutation,
  useResetSalarySettingsMutation,
  // System Settings hooks
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
} = settingsApi;
