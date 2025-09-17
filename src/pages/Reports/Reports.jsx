import React, { useState } from 'react';
import { Card, Pagination } from '../../components/common';
import Chart from 'react-apexcharts';

const Reports = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('Last 7 Days');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedEmployee, setSelectedEmployee] = useState('All Employees');
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(10);

  // Mock data for key metrics
  const metrics = [
    {
      title: 'Total Employees',
      value: '97',
      change: '+2 from last month',
      changeType: 'positive',
      icon: '👥'
    },
    {
      title: 'Avg. Attendance',
      value: '89.5%',
      change: '+1.21% from last month',
      changeType: 'positive',
      icon: '📊'
    },
    {
      title: 'Late Arrivals',
      value: '23',
      change: '-3 from yesterday',
      changeType: 'negative',
      icon: '⏰'
    },
    {
      title: 'Overtime Hours',
      value: '156',
      change: '',
      changeType: 'neutral',
      icon: '⏱️'
    }
  ];

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

  // Mock data for recent reports
  const recentReports = [
    {
      id: 1,
      name: 'Monthly Attendance - September 2025',
      type: 'Attendance',
      generatedBy: 'Admin',
      date: 'Sep 15, 2025',
      status: 'Ready'
    },
    {
      id: 2,
      name: 'Payroll Report - August 2025',
      type: 'Payroll',
      generatedBy: 'HR Manager',
      date: 'Sep 10, 2025',
      status: 'Processing'
    },
    {
      id: 3,
      name: 'Audit Trail - Q3 2025',
      type: 'Audit',
      generatedBy: 'System Admin',
      date: 'Sep 8, 2025',
      status: 'Ready'
    },
    {
      id: 4,
      name: 'Performance Report - Q3 2025',
      type: 'Performance',
      generatedBy: 'Manager',
      date: 'Sep 5, 2025',
      status: 'Ready'
    },
    {
      id: 5,
      name: 'Leave Summary - August 2025',
      type: 'Leave',
      generatedBy: 'HR Manager',
      date: 'Sep 1, 2025',
      status: 'Ready'
    }
  ];

  const dateRanges = ['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'Last 6 Months', 'This Year', 'Custom Range'];
  const departments = ['All Departments', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
  const employees = ['All Employees', 'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];

  // Chart configurations
  const attendanceTrendOptions = {
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
      data: [85, 92, 88, 95, 89, 78, 82]
    }],
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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

  const departmentAttendanceOptions = {
    chart: {
      type: 'donut',
      height: 300,
      background: 'transparent'
    },
    series: [35, 25, 20, 12, 8],
    labels: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'],
    colors: ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'],
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

  const handleGenerateReport = (reportType) => {
    console.log('Generating report:', reportType);
    // TODO: Implement report generation
  };

  const handleExportAll = () => {
    console.log('Exporting all reports');
    // TODO: Implement export all functionality
  };

  const handleScheduleReport = () => {
    console.log('Scheduling report');
    // TODO: Implement schedule report functionality
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', { selectedDateRange, selectedDepartment, selectedEmployee });
    // TODO: Implement filter functionality
  };

  const handleDownloadReport = (reportId) => {
    console.log('Downloading report:', reportId);
    // TODO: Implement download functionality
  };

  const handleViewReport = (reportId) => {
    console.log('Viewing report:', reportId);
    // TODO: Implement view functionality
  };

  const handleDeleteReport = (reportId) => {
    console.log('Deleting report:', reportId);
    // TODO: Implement delete functionality
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-4 sm:mb-0">Reports</h1>
            
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
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Generate
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