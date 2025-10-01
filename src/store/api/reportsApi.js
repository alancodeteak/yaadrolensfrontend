import { baseApi } from './baseApi';

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query({
      query: ({ type, start_date, end_date, department, employee_id } = {}) => {
        const params = new URLSearchParams();
        if (type) params.append('type', type);
        if (start_date) params.append('start_date', start_date);
        if (end_date) params.append('end_date', end_date);
        if (department) params.append('department', department);
        if (employee_id) params.append('employee_id', employee_id);
        return `/reports?${params.toString()}`;
      },
      providesTags: ['Report'],
    }),
    
    getReportById: builder.query({
      query: (id) => `/reports/${id}`,
      providesTags: (result, error, id) => [{ type: 'Report', id }],
    }),
    
    generateReport: builder.mutation({
      query: (reportData) => ({
        url: '/reports/generate',
        method: 'POST',
        body: reportData,
      }),
      invalidatesTags: ['Report'],
    }),
    
    getAttendanceReport: builder.query({
      query: ({ start_date, end_date, department, employee_id } = {}) => {
        const params = new URLSearchParams();
        if (start_date) params.append('start_date', start_date);
        if (end_date) params.append('end_date', end_date);
        if (department) params.append('department', department);
        if (employee_id) params.append('employee_id', employee_id);
        return `/reports/attendance?${params.toString()}`;
      },
      providesTags: ['Report'],
    }),
    
    getPayrollReport: builder.query({
      query: ({ month, year, department, employee_id } = {}) => {
        const params = new URLSearchParams();
        if (month) params.append('month', month);
        if (year) params.append('year', year);
        if (department) params.append('department', department);
        if (employee_id) params.append('employee_id', employee_id);
        return `/reports/payroll?${params.toString()}`;
      },
      providesTags: ['Report'],
    }),
    
    getPerformanceReport: builder.query({
      query: ({ start_date, end_date, department, employee_id } = {}) => {
        const params = new URLSearchParams();
        if (start_date) params.append('start_date', start_date);
        if (end_date) params.append('end_date', end_date);
        if (department) params.append('department', department);
        if (employee_id) params.append('employee_id', employee_id);
        return `/reports/performance?${params.toString()}`;
      },
      providesTags: ['Report'],
    }),
    
    getDashboardStats: builder.query({
      query: () => '/reports/dashboard',
      providesTags: ['Report'],
    }),
    
    exportReport: builder.mutation({
      query: ({ reportId, format = 'pdf' }) => ({
        url: `/reports/${reportId}/export`,
        method: 'POST',
        body: { format },
        responseHandler: (response) => response.blob(),
      }),
    }),
    
    scheduleReport: builder.mutation({
      query: (scheduleData) => ({
        url: '/reports/schedule',
        method: 'POST',
        body: scheduleData,
      }),
      invalidatesTags: ['Report'],
    }),
    
    // Fallback endpoints for basic functionality
    getRecentReports: builder.query({
      query: ({ limit = 10 } = {}) => `/reports/recent?limit=${limit}`,
      providesTags: ['Report'],
    }),
    
    getDashboardMetrics: builder.query({
      query: () => '/reports/metrics',
      providesTags: ['Report'],
    }),
    
    getAttendanceSummary: builder.query({
      query: ({ start_date, end_date } = {}) => {
        const params = new URLSearchParams();
        if (start_date) params.append('start_date', start_date);
        if (end_date) params.append('end_date', end_date);
        return `/attendance/summary?${params.toString()}`;
      },
      providesTags: ['Report'],
    }),

    // Advanced Reports APIs
    getAdvancedAnalytics: builder.query({
      query: ({ start_date, end_date, department_id, employee_id, metrics = [] } = {}) => {
        const params = new URLSearchParams();
        if (start_date) params.append('start_date', start_date);
        if (end_date) params.append('end_date', end_date);
        if (department_id) params.append('department_id', department_id);
        if (employee_id) params.append('employee_id', employee_id);
        metrics.forEach(metric => params.append('metrics', metric));
        return `/reports/advanced-analytics?${params.toString()}`;
      },
      providesTags: ['Report'],
    }),

    getPredictiveInsights: builder.query({
      query: ({ period = '30d', department_id } = {}) => {
        const params = new URLSearchParams({ period });
        if (department_id) params.append('department_id', department_id);
        return `/reports/predictive-insights?${params.toString()}`;
      },
      providesTags: ['Report'],
    }),

    getCustomReport: builder.query({
      query: (config) => ({
        url: '/reports/custom',
        method: 'POST',
        body: config,
      }),
      providesTags: ['Report'],
    }),

    scheduleRecurringReport: builder.mutation({
      query: (reportConfig) => ({
        url: '/reports/schedule',
        method: 'POST',
        body: reportConfig,
      }),
      invalidatesTags: ['Report'],
    }),

    getScheduledReports: builder.query({
      query: () => '/reports/scheduled',
      providesTags: ['Report'],
    }),

    updateScheduledReport: builder.mutation({
      query: ({ schedule_id, ...updates }) => ({
        url: `/reports/scheduled/${schedule_id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['Report'],
    }),

    deleteScheduledReport: builder.mutation({
      query: (schedule_id) => ({
        url: `/reports/scheduled/${schedule_id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Report'],
    }),

    getReportTemplates: builder.query({
      query: () => '/reports/templates',
      providesTags: ['Report'],
    }),

    createReportTemplate: builder.mutation({
      query: (template) => ({
        url: '/reports/templates',
        method: 'POST',
        body: template,
      }),
      invalidatesTags: ['Report'],
    }),

    // Real-time Analytics APIs
    getRealTimeMetrics: builder.query({
      query: () => '/analytics/realtime',
      providesTags: ['Analytics'],
      pollingInterval: 30000, // Poll every 30 seconds
    }),

    getPredictiveAnalytics: builder.query({
      query: ({ period = '7d', department_id } = {}) => {
        const params = new URLSearchParams({ period });
        if (department_id) params.append('department_id', department_id);
        return `/analytics/predictive?${params.toString()}`;
      },
      providesTags: ['Analytics'],
    }),

    getTrendAnalysis: builder.query({
      query: ({ metric, period = '30d', granularity = 'daily' } = {}) => {
        const params = new URLSearchParams({ metric, period, granularity });
        return `/analytics/trends?${params.toString()}`;
      },
      providesTags: ['Analytics'],
    }),

    getComparativeAnalysis: builder.query({
      query: ({ departments, period = '30d' } = {}) => {
        const params = new URLSearchParams({ period });
        departments.forEach(dept => params.append('departments', dept));
        return `/analytics/comparative?${params.toString()}`;
      },
      providesTags: ['Analytics'],
    }),

    getAnomalyDetection: builder.query({
      query: ({ start_date, end_date, threshold = 0.8 } = {}) => {
        const params = new URLSearchParams({ threshold });
        if (start_date) params.append('start_date', start_date);
        if (end_date) params.append('end_date', end_date);
        return `/analytics/anomalies?${params.toString()}`;
      },
      providesTags: ['Analytics'],
    }),

    getPerformanceInsights: builder.query({
      query: ({ employee_id, period = '30d' } = {}) => {
        const params = new URLSearchParams({ period });
        if (employee_id) params.append('employee_id', employee_id);
        return `/analytics/performance?${params.toString()}`;
      },
      providesTags: ['Analytics'],
    }),

    getWorkloadDistribution: builder.query({
      query: ({ department_id, period = '7d' } = {}) => {
        const params = new URLSearchParams({ period });
        if (department_id) params.append('department_id', department_id);
        return `/analytics/workload?${params.toString()}`;
      },
      providesTags: ['Analytics'],
    }),

    getEfficiencyMetrics: builder.query({
      query: ({ start_date, end_date, group_by = 'department' } = {}) => {
        const params = new URLSearchParams({ group_by });
        if (start_date) params.append('start_date', start_date);
        if (end_date) params.append('end_date', end_date);
        return `/analytics/efficiency?${params.toString()}`;
      },
      providesTags: ['Analytics'],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useGetReportByIdQuery,
  useGenerateReportMutation,
  useGetAttendanceReportQuery,
  useGetPayrollReportQuery,
  useGetPerformanceReportQuery,
  useGetDashboardStatsQuery,
  useExportReportMutation,
  useScheduleReportMutation,
  useGetRecentReportsQuery,
  useGetDashboardMetricsQuery,
  useGetAttendanceSummaryQuery,
  useGetAdvancedAnalyticsQuery,
  useGetPredictiveInsightsQuery,
  useLazyGetCustomReportQuery,
  useScheduleRecurringReportMutation,
  useGetScheduledReportsQuery,
  useUpdateScheduledReportMutation,
  useDeleteScheduledReportMutation,
  useGetReportTemplatesQuery,
  useCreateReportTemplateMutation,
  // Real-time Analytics hooks
  useGetRealTimeMetricsQuery,
  useGetPredictiveAnalyticsQuery,
  useGetTrendAnalysisQuery,
  useGetComparativeAnalysisQuery,
  useGetAnomalyDetectionQuery,
  useGetPerformanceInsightsQuery,
  useGetWorkloadDistributionQuery,
  useGetEfficiencyMetricsQuery,
} = reportsApi;
