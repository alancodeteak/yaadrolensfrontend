import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  useGetRealTimeMetricsQuery,
  useGetPredictiveAnalyticsQuery,
  useGetTrendAnalysisQuery,
  useGetComparativeAnalysisQuery,
  useGetAnomalyDetectionQuery,
  useGetPerformanceInsightsQuery,
  useGetWorkloadDistributionQuery,
  useGetEfficiencyMetricsQuery,
  useGetDepartmentsQuery
} from '../../store/api';
import Card from '../../components/common/Card/Card';

const AnalyticsDashboard = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedMetric, setSelectedMetric] = useState('attendance');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [dateRange, setDateRange] = useState({
    start_date: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  });

  // API hooks
  const { data: realTimeMetrics, isLoading: realTimeLoading } = useGetRealTimeMetricsQuery();
  const { data: predictiveAnalytics, isLoading: predictiveLoading } = useGetPredictiveAnalyticsQuery({
    period: selectedPeriod,
    department_id: selectedDepartment || undefined
  });
  const { data: trendAnalysis, isLoading: trendLoading } = useGetTrendAnalysisQuery({
    metric: selectedMetric,
    period: selectedPeriod,
    granularity: 'daily'
  });
  const { data: comparativeAnalysis, isLoading: comparativeLoading } = useGetComparativeAnalysisQuery({
    departments: selectedDepartments,
    period: selectedPeriod
  });
  const { data: anomalyDetection, isLoading: anomalyLoading } = useGetAnomalyDetectionQuery({
    start_date: dateRange.start_date,
    end_date: dateRange.end_date
  });
  const { data: performanceInsights, isLoading: performanceLoading } = useGetPerformanceInsightsQuery({
    period: selectedPeriod
  });
  const { data: workloadDistribution, isLoading: workloadLoading } = useGetWorkloadDistributionQuery({
    department_id: selectedDepartment || undefined,
    period: selectedPeriod
  });
  const { data: efficiencyMetrics, isLoading: efficiencyLoading } = useGetEfficiencyMetricsQuery({
    start_date: dateRange.start_date,
    end_date: dateRange.end_date,
    group_by: 'department'
  });
  const { data: departmentsData } = useGetDepartmentsQuery({ active_only: true });

  const departments = departmentsData || [];

  const handleDepartmentChange = (deptId) => {
    setSelectedDepartment(deptId);
  };

  const handleDepartmentToggle = (deptId) => {
    setSelectedDepartments(prev => 
      prev.includes(deptId) 
        ? prev.filter(id => id !== deptId)
        : [...prev, deptId]
    );
  };

  const getMetricColor = (value, type = 'positive') => {
    if (type === 'positive') {
      return value >= 80 ? 'text-green-600' : value >= 60 ? 'text-yellow-600' : 'text-red-600';
    } else {
      return value <= 20 ? 'text-green-600' : value <= 40 ? 'text-yellow-600' : 'text-red-600';
    }
  };

  const getAnomalySeverity = (severity) => {
    const severityConfig = {
      high: { color: 'text-red-600', bg: 'bg-red-100', text: 'High' },
      medium: { color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Medium' },
      low: { color: 'text-blue-600', bg: 'bg-blue-100', text: 'Low' }
    };
    
    const config = severityConfig[severity] || { color: 'text-gray-600', bg: 'bg-gray-100', text: 'Unknown' };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toFixed(1) || '0';
  };

  const formatPercentage = (num) => {
    return `${(num || 0).toFixed(1)}%`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
        <p className="text-gray-600 mt-2">Real-time insights, predictive analytics, and performance metrics</p>
      </div>

      {/* Controls */}
      <Card className="mb-8">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Metric</label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="attendance">Attendance</option>
                <option value="punctuality">Punctuality</option>
                <option value="productivity">Productivity</option>
                <option value="efficiency">Efficiency</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={dateRange.start_date}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start_date: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="date"
                  value={dateRange.end_date}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end_date: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {realTimeLoading ? '...' : realTimeMetrics?.active_users || 0}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Attendance Rate</p>
                <p className={`text-2xl font-semibold ${getMetricColor(realTimeMetrics?.attendance_rate, 'positive')}`}>
                  {realTimeLoading ? '...' : formatPercentage(realTimeMetrics?.attendance_rate)}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg. Response Time</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {realTimeLoading ? '...' : `${realTimeMetrics?.avg_response_time || 0}ms`}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">System Health</p>
                <p className={`text-2xl font-semibold ${getMetricColor(realTimeMetrics?.system_health, 'positive')}`}>
                  {realTimeLoading ? '...' : formatPercentage(realTimeMetrics?.system_health)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Predictive Analytics */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Predictive Insights</h2>
            {predictiveLoading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {predictiveAnalytics?.insights?.map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900">{insight.title}</h3>
                      <span className={`text-xs font-semibold ${getMetricColor(insight.confidence, 'positive')}`}>
                        {formatPercentage(insight.confidence)} confidence
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                    <div className="mt-2">
                      <div className="text-xs text-gray-500">Predicted Impact: {insight.impact}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Anomaly Detection */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Anomaly Detection</h2>
            {anomalyLoading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {anomalyDetection?.anomalies?.slice(0, 5).map((anomaly, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{anomaly.type}</span>
                      {getAnomalySeverity(anomaly.severity)}
                    </div>
                    <p className="text-xs text-gray-600">{anomaly.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Detected: {new Date(anomaly.detected_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card className="mb-8">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h2>
          {performanceLoading ? (
            <div className="animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${getMetricColor(performanceInsights?.productivity_score, 'positive')}`}>
                  {formatPercentage(performanceInsights?.productivity_score)}
                </div>
                <p className="text-sm text-gray-500">Productivity Score</p>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${getMetricColor(performanceInsights?.efficiency_score, 'positive')}`}>
                  {formatPercentage(performanceInsights?.efficiency_score)}
                </div>
                <p className="text-sm text-gray-500">Efficiency Score</p>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${getMetricColor(performanceInsights?.engagement_score, 'positive')}`}>
                  {formatPercentage(performanceInsights?.engagement_score)}
                </div>
                <p className="text-sm text-gray-500">Engagement Score</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Workload Distribution */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Workload Distribution</h2>
          {workloadLoading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {workloadDistribution?.distribution?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.department || item.employee}</p>
                    <p className="text-xs text-gray-500">{item.role || 'Department'}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{item.hours_worked}h</p>
                      <p className="text-xs text-gray-500">Hours Worked</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${getMetricColor(item.efficiency, 'positive')}`}>
                        {formatPercentage(item.efficiency)}
                      </p>
                      <p className="text-xs text-gray-500">Efficiency</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;

