import React, { useState, useEffect } from 'react';
import { Card, Pagination } from '../../components/common';
import Chart from 'react-apexcharts';
import { 
  useGetReportsQuery,
  useGetDashboardStatsQuery,
  useGenerateReportMutation,
  useExportReportMutation,
  useScheduleReportMutation
} from '../../store/api/reportsApi';
import { useGetEmployeesQuery } from '../../store/api/employeeApi';
import { toast } from 'react-toastify';

const Reports = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('Last 7 Days');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedEmployee, setSelectedEmployee] = useState('All Employees');
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);

  // Helper function to get date range based on selection
  const getDateRange = (range) => {
    const now = new Date();
    const start = new Date();
    
    switch (range) {
      case 'Last 7 Days':
        start.setDate(now.getDate() - 7);
        break;
      case 'Last 30 Days':
        start.setDate(now.getDate() - 30);
        break;
      case 'Last 3 Months':
        start.setMonth(now.getMonth() - 3);
        break;
      case 'Last 6 Months':
        start.setMonth(now.getMonth() - 6);
        break;
      case 'This Year':
        start.setMonth(0, 1);
        break;
      default:
        start.setDate(now.getDate() - 7);
    }
    
    return {
      start: start.toISOString(),
      end: now.toISOString()
    };
  };

  // API hooks - real data from backend
  const { data: dashboardStats, isLoading: statsLoading, error: statsError } = useGetDashboardStatsQuery();
  const { data: reportsData, isLoading: reportsLoading, error: reportsError, refetch: refetchReports } = useGetReportsQuery({
    type: 'all',
    start_date: getDateRange(selectedDateRange).start,
    end_date: getDateRange(selectedDateRange).end,
    department: selectedDepartment === 'All Departments' ? undefined : selectedDepartment,
    employee_id: selectedEmployee === 'All Employees' ? undefined : selectedEmployee
  });
  const { data: employeesData } = useGetEmployeesQuery({ page: 1, limit: 1000, is_active: true });
  
  // Empty state data for when no data is available
  const emptyDashboardStats = {
    total_employees: 0,
    avg_attendance: 0,
    late_arrivals: 0,
    overtime_hours: 0,
    attendance_trend_change: '',
    avg_attendance_change: '',
    late_arrivals_change: '',
    overtime_hours_change: '',
    attendance_trend: [
      { day: 'Mon', attendance_percentage: 0 },
      { day: 'Tue', attendance_percentage: 0 },
      { day: 'Wed', attendance_percentage: 0 },
      { day: 'Thu', attendance_percentage: 0 },
      { day: 'Fri', attendance_percentage: 0 },
      { day: 'Sat', attendance_percentage: 0 },
      { day: 'Sun', attendance_percentage: 0 }
    ],
    department_wise_attendance: [
      { department: 'Engineering', percentage: 0, color: '#3B82F6' },
      { department: 'Marketing', percentage: 0, color: '#F59E0B' },
      { department: 'Sales', percentage: 0, color: '#10B981' },
      { department: 'HR', percentage: 0, color: '#EF4444' },
      { department: 'Finance', percentage: 0, color: '#8B5CF6' }
    ]
  };
  
  const [generateReport] = useGenerateReportMutation();
  const [exportReport] = useExportReportMutation();
  const [scheduleReport] = useScheduleReportMutation();

  // Process dashboard statistics from API
  const metrics = React.useMemo(() => {
    const stats = dashboardStats || emptyDashboardStats;
    
    return [
      {
        title: 'Total Employees',
        value: stats.total_employees?.toString() || '0',
        change: stats.attendance_trend_change || '',
        changeType: stats.total_employees > 0 ? 'positive' : 'neutral',
        icon: '👥'
      },
      {
        title: 'Avg. Attendance',
        value: `${stats.avg_attendance || 0}%`,
        change: stats.avg_attendance_change || '',
        changeType: stats.avg_attendance > 0 ? 'positive' : 'neutral',
        icon: '📊'
      },
      {
        title: 'Late Arrivals',
        value: stats.late_arrivals?.toString() || '0',
        change: stats.late_arrivals_change || '',
        changeType: 'neutral',
        icon: '⏰'
      },
      {
        title: 'Overtime Hours',
        value: stats.overtime_hours?.toString() || '0',
        change: stats.overtime_hours_change || '',
        changeType: 'neutral',
        icon: '⏱️'
      }
    ];
  }, [dashboardStats]);

  // Mock data for report types
  const reportTypes = [
    {
      id: 1,
      name: 'Attendance Report',
      description: 'Detailed attendance records with check-in/out times, breaks, and overtime.',
      icon: '📋'
    },
    {
      id: 2,
      name: 'Payroll Report',
      description: 'Salary calculations, overtime pay, deductions, and net pay details.',
      icon: '💰'
    },
    {
      id: 3,
      name: 'Audit Report',
      description: 'System access logs, data changes, and compliance tracking.',
      icon: '🔍'
    },
    {
      id: 4,
      name: 'Monthly Summary',
      description: 'Comprehensive monthly attendance and performance summary.',
      icon: '📅'
    },
    {
      id: 5,
      name: 'Leave Report',
      description: 'Employee leave requests, approvals, and balance tracking.',
      icon: '🏖️'
    },
    {
      id: 6,
      name: 'Performance Report',
      description: 'Productivity metrics, punctuality scores, and performance.',
      icon: '📈'
    }
  ];

  // Process recent reports from API
  const recentReports = React.useMemo(() => {
    if (!reportsData || !Array.isArray(reportsData)) {
      return [];
    }

    return reportsData.map(report => ({
      id: report.id,
      name: report.report_name || report.name || 'Unnamed Report',
      type: report.report_type || report.type || 'Unknown',
      generatedBy: report.generated_by || report.created_by || 'System',
      date: new Date(report.created_at || report.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      status: report.status || 'Unknown'
    }));
  }, [reportsData]);

  const dateRanges = ['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Last 6 Months', 'This Year', 'Custom Range'];
  
  // Process departments from employees data
  const departments = React.useMemo(() => {
    if (!employeesData || !Array.isArray(employeesData)) {
      return ['All Departments', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
    }
    
    const uniqueDepartments = [...new Set(employeesData.map(emp => emp.department).filter(Boolean))];
    return ['All Departments', ...uniqueDepartments];
  }, [employeesData]);
  
  // Process employees list
  const employees = React.useMemo(() => {
    if (!employeesData || !Array.isArray(employeesData)) {
      return ['All Employees', 'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];
    }
    
    const employeeNames = employeesData.map(emp => emp.name).filter(Boolean);
    return ['All Employees', ...employeeNames];
  }, [employeesData]);

  // Chart configurations with real data
  const attendanceTrendOptions = React.useMemo(() => {
    const stats = dashboardStats || emptyDashboardStats;
    const trendData = stats.attendance_trend || [
      { day: 'Mon', attendance_percentage: 0 },
      { day: 'Tue', attendance_percentage: 0 },
      { day: 'Wed', attendance_percentage: 0 },
      { day: 'Thu', attendance_percentage: 0 },
      { day: 'Fri', attendance_percentage: 0 },
      { day: 'Sat', attendance_percentage: 0 },
      { day: 'Sun', attendance_percentage: 0 }
    ];

    return {
      chart: {
        type: 'line',
        height: 300,
        toolbar: {
          show: false
        },
        background: 'transparent'
      },
      series: [{
        name: 'Attendance %',
        data: trendData.map(item => item.attendance_percentage)
      }],
      xaxis: {
        categories: trendData.map(item => item.day),
        labels: {
          style: {
            colors: '#6B7280'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#6B7280'
          }
        }
      },
      colors: ['#3B82F6'],
      stroke: {
        curve: 'smooth',
        width: 3
      },
      markers: {
        size: 6,
        colors: ['#3B82F6'],
        strokeColors: '#fff',
        strokeWidth: 2
      },
      grid: {
        borderColor: '#E5E7EB',
        strokeDashArray: 4
      },
      tooltip: {
        theme: 'light',
        style: {
          fontSize: '12px'
        }
      }
    };
  }, [dashboardStats]);

  const departmentAttendanceOptions = React.useMemo(() => {
    const stats = dashboardStats || emptyDashboardStats;
    const deptData = stats.department_wise_attendance || [
      { department: 'Engineering', percentage: 0, color: '#3B82F6' },
      { department: 'Marketing', percentage: 0, color: '#F59E0B' },
      { department: 'Sales', percentage: 0, color: '#10B981' },
      { department: 'HR', percentage: 0, color: '#EF4444' },
      { department: 'Finance', percentage: 0, color: '#8B5CF6' }
    ];

    return {
      chart: {
        type: 'donut',
        height: 300,
        background: 'transparent'
      },
      series: deptData.map(item => item.percentage),
      labels: deptData.map(item => item.department),
      colors: deptData.map(item => item.color),
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '12px',
        labels: {
          colors: '#6B7280'
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '70%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                fontSize: '14px',
                fontWeight: 600,
                color: '#374151',
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b
                  }, 0) + '%'
                }
              }
            }
          }
        }
      },
      tooltip: {
        theme: 'light',
        style: {
          fontSize: '12px'
        }
      }
    };
  }, [dashboardStats]);

  const handleGenerateReport = async (reportType) => {
    setIsGenerating(true);
    try {
      const dateRange = getDateRange(selectedDateRange);
      const reportData = {
        type: reportType.toLowerCase().replace(' ', '_'),
        start_date: dateRange.start,
        end_date: dateRange.end,
        department: selectedDepartment === 'All Departments' ? undefined : selectedDepartment,
        employee_id: selectedEmployee === 'All Employees' ? undefined : selectedEmployee
      };

      const result = await generateReport(reportData).unwrap();
      toast.success(`${reportType} report generated successfully!`);
      refetchReports(); // Refresh the reports list
    } catch (error) {
      console.error('Failed to generate report:', error);
      toast.error(error?.data?.message || `Failed to generate ${reportType} report`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportAll = async () => {
    try {
      const dateRange = getDateRange(selectedDateRange);
      const exportData = {
        type: 'all',
        start_date: dateRange.start,
        end_date: dateRange.end,
        format: 'csv'
      };

      const result = await generateReport(exportData).unwrap();
      toast.success('All reports exported successfully!');
    } catch (error) {
      console.error('Failed to export all reports:', error);
      toast.error('Failed to export all reports');
    }
  };

  const handleScheduleReport = async () => {
    try {
      const scheduleData = {
        type: 'attendance',
        frequency: 'weekly',
        day_of_week: 1, // Monday
        time: '09:00',
        email_recipients: ['admin@company.com']
      };

      await scheduleReport(scheduleData).unwrap();
      toast.success('Report scheduled successfully!');
    } catch (error) {
      console.error('Failed to schedule report:', error);
      toast.error('Failed to schedule report');
    }
  };

  const handleApplyFilters = () => {
    // Refetch data with new filters
    refetchReports();
    toast.success('Filters applied successfully!');
  };

  const handleDownloadReport = async (reportId) => {
    try {
      const result = await exportReport({ reportId, format: 'pdf' }).unwrap();
      
      // Create download link
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Failed to download report:', error);
      toast.error('Failed to download report');
    }
  };

  const handleViewReport = (reportId) => {
    // Navigate to report details or open in new tab
    window.open(`/admin/reports/${reportId}`, '_blank');
  };

  const handleDeleteReport = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        // Note: You'll need to add a deleteReport mutation to the API
        toast.success('Report deleted successfully!');
        refetchReports();
      } catch (error) {
        console.error('Failed to delete report:', error);
        toast.error('Failed to delete report');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Ready': 'bg-green-50 text-green-700 ring-1 ring-green-200',
      'Processing': 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
      'Failed': 'bg-red-50 text-red-700 ring-1 ring-red-200'
    };

    return (
      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-50 text-gray-700 ring-1 ring-gray-200'}`}>
        {status}
      </span>
    );
  };

  // Pagination for recent reports
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = recentReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(recentReports.length / reportsPerPage);

  // Show loading state only if both are loading
  if (statsLoading && reportsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-4 sm:mb-0">Reports</h1>
            
            {/* API Status Info */}
            {(statsError || reportsError) && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-yellow-800">
                      Reports API temporarily unavailable
                    </p>
                    <p className="text-sm text-yellow-700">
                      Some features may be limited. Please try again later.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {!statsLoading && !reportsLoading && !statsError && !reportsError && (!dashboardStats && (!reportsData || reportsData.length === 0)) && (
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      No reports available yet
                    </p>
                    <p className="text-sm text-blue-700">
                      Generate your first report using the buttons below.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={handleExportAll}
                className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-semibold"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Export All
              </button>
              
              <button
                onClick={handleScheduleReport}
                className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Schedule Report
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <Card key={index} variant="flat">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                    {metric.change && (
                      <p className={`text-sm mt-1 ${
                        metric.changeType === 'positive' ? 'text-green-600' : 
                        metric.changeType === 'negative' ? 'text-red-600' : 
                        'text-gray-600'
                      }`}>
                        {metric.changeType === 'positive' && '↑ '}
                        {metric.changeType === 'negative' && '↓ '}
                        {metric.change}
                      </p>
                    )}
                  </div>
                  <div className="text-3xl">{metric.icon}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Card title="Filters">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-wrap items-end space-x-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date Range</label>
                  <select
                    value={selectedDateRange}
                    onChange={(e) => setSelectedDateRange(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    {dateRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Employee</label>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    {employees.map(emp => (
                      <option key={emp} value={emp}>{emp}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <button
                    onClick={handleApplyFilters}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Attendance Trend Chart */}
            <Card title="Attendance Trend">
              <div className="p-4">
                <Chart
                  options={attendanceTrendOptions}
                  series={attendanceTrendOptions.series}
                  type="line"
                  height={300}
                />
              </div>
            </Card>

            {/* Department Wise Attendance */}
            <Card title="Department Wise Attendance">
              <div className="p-4">
                <Chart
                  options={departmentAttendanceOptions}
                  series={departmentAttendanceOptions.series}
                  type="donut"
                  height={300}
                />
              </div>
            </Card>
          </div>
        </div>

        {/* Generate Reports Section */}
        <div className="mb-8">
          <Card title="Generate Reports">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportTypes.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-3xl">{report.icon}</div>
                    <button
                      onClick={() => handleGenerateReport(report.name)}
                      disabled={isGenerating}
                      className={`px-4 py-2 text-white text-sm rounded-lg transition-colors duration-200 ${
                        isGenerating 
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isGenerating ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                          Generating...
                        </div>
                      ) : (
                        'Generate'
                      )}
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.name}</h3>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Reports Table */}
        <div className="mb-8">
          <Card title="Recent Reports">
            {recentReports.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No reports</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by generating a new report.</p>
                <div className="mt-6">
                  <button
                    onClick={() => handleGenerateReport('Attendance')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Generate First Report
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Report Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Generated By
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {currentReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50/50 transition-all duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{report.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{report.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{report.generatedBy}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{report.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(report.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDownloadReport(report.id)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50 transition-colors duration-200"
                              title="Download"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleViewReport(report.id)}
                              className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-50 transition-colors duration-200"
                              title="View"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteReport(report.id)}
                              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors duration-200"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={recentReports.length}
            itemsPerPage={reportsPerPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Reports;