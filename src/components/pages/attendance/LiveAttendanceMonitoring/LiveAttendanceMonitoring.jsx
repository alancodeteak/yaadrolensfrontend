import React, { useState, useEffect } from 'react';
import Card from '../../../common/Card/Card';
import { 
  useGetAttendanceLogsQuery,
  useGetLiveAttendanceQuery 
} from '../../../../store/api/attendanceApi';
import { useGetEmployeesQuery } from '../../../../store/api/employeeApi';
import { 
  ACTIVITY_STATUS_COLORS, 
  ACTIVITY_DOT_COLORS 
} from '../../../../utils/constants';

const LiveAttendanceMonitoring = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [dateRange, setDateRange] = useState({
    start_date: new Date().toISOString().split('T')[0] + 'T00:00:00Z',
    end_date: new Date().toISOString().split('T')[0] + 'T23:59:59Z'
  });

  // API hooks for real data
  const { data: attendanceLogs = [], isLoading: logsLoading, error: logsError } = useGetAttendanceLogsQuery({
    start_date: dateRange.start_date,
    end_date: dateRange.end_date,
    skip: 0,
    limit: 100
  });
  
  const { data: liveAttendanceData = [], isLoading: attendanceLoading, error: attendanceError } = useGetLiveAttendanceQuery();
  
  // Fetch all active employees
  const { data: employeesData = [], isLoading: employeesLoading, error: employeesError } = useGetEmployeesQuery({
    page: 1,
    limit: 1000, // Get all employees
    is_active: true
  });

  // Process attendance logs for live activity display
  const processedLiveActivity = React.useMemo(() => {
    if (!attendanceLogs || attendanceLogs.length === 0) return [];
    
    return attendanceLogs.slice(0, 10).map(log => ({
      id: log.id,
      employee: log.employee_name,
      event: log.type === 'IN' ? 'Clock In' : 'Clock Out',
      timestamp: new Date(log.timestamp).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      confidence: Math.round(parseFloat(log.confidence_score) * 100),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(log.employee_name)}&background=3b82f6&color=fff&size=32`
    }));
  }, [attendanceLogs]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  // Generate attendance status for employees based on today's attendance logs
  const generateEmployeeStatus = (employee, todaysLogs) => {
    const employeeLogs = todaysLogs.filter(log => log.employee_id === employee.id);
    
    if (employeeLogs.length === 0) {
      return {
        ...employee,
        status: 'Absent',
        clockIn: null,
        lastSeen: 'Not seen today',
        confidence: null,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=3b82f6&color=fff&size=48`
      };
    }
    
    // Sort logs by timestamp to get the latest
    const sortedLogs = employeeLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const latestLog = sortedLogs[0];
    const firstInLog = employeeLogs.find(log => log.type === 'IN');
    
    // Determine status based on clock-in time and current status
    let status = 'Present';
    let clockIn = null;
    
    if (firstInLog) {
      const clockInTime = new Date(firstInLog.timestamp);
      const clockInTimeString = clockInTime.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      clockIn = clockInTimeString;
      
      // Check if late (assuming 9:00 AM is the standard time)
      const standardTime = new Date(clockInTime);
      standardTime.setHours(9, 0, 0, 0);
      
      if (clockInTime > standardTime) {
        status = 'Present (Late)';
      }
    }
    
    // Check if employee has clocked out (last log is OUT)
    if (latestLog.type === 'OUT') {
      status = 'Clocked Out';
    }
    
    const lastSeenTime = new Date(latestLog.timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    
    return {
      ...employee,
      status,
      clockIn,
      lastSeen: lastSeenTime,
      confidence: latestLog.confidence_score ? Math.round(parseFloat(latestLog.confidence_score) * 100) : null,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=3b82f6&color=fff&size=48`
    };
  };

  // Process employees with their attendance status
  const employees = React.useMemo(() => {
    if (employeesLoading || !employeesData) {
      return [];
    }
    
    // Generate attendance status for each employee based on today's logs
    return employeesData.map(employee => generateEmployeeStatus(employee, attendanceLogs || []));
  }, [employeesData, attendanceLogs, employeesLoading]);

  // Calculate summary data from processed employees
  const summaryData = React.useMemo(() => {
    if (!employees || employees.length === 0) {
      return {
        currentlyPresent: 0,
        currentlyAbsent: 0,
        lateArrivalsToday: 0,
        totalEmployees: 0
      };
    }

    const currentlyPresent = employees.filter(emp => 
      emp.status === 'Present' || emp.status === 'Present (Late)'
    ).length;
    
    const currentlyAbsent = employees.filter(emp => 
      emp.status === 'Absent'
    ).length;
    
    const lateArrivalsToday = employees.filter(emp => 
      emp.status === 'Present (Late)'
    ).length;
    
    return {
      currentlyPresent,
      currentlyAbsent,
      lateArrivalsToday,
      totalEmployees: employees.length
    };
  }, [employees]);

  // Live activity data is now processed from attendance logs above

  const departments = ['All Departments', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
  const statuses = ['All Status', 'Present', 'Present (Late)', 'Absent', 'On Leave'];

  // Filter employees based on search term, department, and status
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All Departments' || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'All Status' || employee.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const formatDateTime = (date) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    return date.toLocaleDateString('en-US', options);
  };


  const getStatusBadge = (status) => {
    const statusClass = ACTIVITY_STATUS_COLORS[status] || 'bg-gray-50 text-gray-700 ring-1 ring-gray-200';

    return (
      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${statusClass}`}>
        {status}
      </span>
    );
  };

  const getStatusDotColor = (status) => {
    return ACTIVITY_DOT_COLORS[status] || 'bg-gray-500';
  };

  const handleViewDetails = (employeeId) => {
    console.log('View details for employee:', employeeId);
    // TODO: Implement view details functionality
  };

  const handleRefresh = () => {
    console.log('Refreshing attendance data...');
    // Refresh the current page to reload data
    window.location.reload();
  };

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  // Show loading state if critical APIs are loading
  if (logsLoading || employeesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  // Show error state if critical APIs fail
  if (logsError || employeesError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">
            {employeesError ? 'Failed to load employee data.' : 'Failed to load attendance logs.'}
            {' '}Please try refreshing the page.
          </p>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Attendance Monitoring</h1>
          <p className="text-gray-600">{formatDateTime(currentTime)}</p>
          
          {/* API Status Notification */}
          {attendanceError && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Live attendance monitoring API unavailable
                  </p>
                  <p className="text-sm text-yellow-700">
                    Showing real employee data with attendance status calculated from attendance logs. Some real-time features may be limited.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {employees.length > 0 && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Showing {employees.length} active employees
                  </p>
                  <p className="text-sm text-blue-700">
                    Employee attendance status is calculated from today's attendance logs. Status updates in real-time based on clock-in/out activity.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card variant="flat">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Currently Present</p>
                <p className="text-3xl font-bold text-gray-900">{summaryData.currentlyPresent}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card variant="flat">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Currently Absent</p>
                <p className="text-3xl font-bold text-gray-900">{summaryData.currentlyAbsent}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card variant="flat">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Late Arrivals Today</p>
                <p className="text-3xl font-bold text-gray-900">{summaryData.lateArrivalsToday}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card variant="flat">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900">{summaryData.totalEmployees}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            {/* Date Range Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Date:</label>
              <input
                type="date"
                value={dateRange.start_date.split('T')[0]}
                onChange={(e) => handleDateRangeChange({
                  start_date: e.target.value + 'T00:00:00Z',
                  end_date: e.target.value + 'T23:59:59Z'
                })}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Department Filter */}
            <div className="relative">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Refresh Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <div className="flex items-center text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live Updates
            </div>
          </div>
        </div>

        {/* Main Content - 70:30 Responsive Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Container - Users Listing (70% width) */}
          <div className="w-full lg:w-[70%]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Employee Status</h2>
              <div className="flex items-center text-sm text-gray-500">
                <span>{filteredEmployees.length} of {employees.length} employees</span>
                {attendanceError && (
                  <span className="ml-3 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                    Limited Features
                  </span>
                )}
              </div>
            </div>
            
            {filteredEmployees.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || selectedDepartment !== 'All Departments' || selectedStatus !== 'All Status' 
                    ? 'Try adjusting your search criteria or filters.'
                    : 'No employee data available at the moment.'}
                </p>
                {(searchTerm || selectedDepartment !== 'All Departments' || selectedStatus !== 'All Status') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedDepartment('All Departments');
                      setSelectedStatus('All Status');
                    }}
                    className="mt-3 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredEmployees.map((employee) => (
                <Card key={employee.id} variant="flat" className="h-full">
                  <div className="p-4 h-full flex flex-col">
                    {/* Avatar with Status Dot */}
                    <div className="relative mb-3 flex justify-center">
                      <img
                        className="w-12 h-12 rounded-full object-cover"
                        src={employee.avatar}
                        alt={employee.name}
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=3b82f6&color=fff&size=48`;
                        }}
                      />
                      {/* Status Dot */}
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusDotColor(employee.status)}`}></div>
                    </div>

                    {/* Employee Info */}
                    <div className="text-center mb-3">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{employee.name}</h3>
                      <p className="text-xs text-gray-500">{employee.id}</p>
                    </div>

                    {/* Status Badge */}
                    <div className="text-center mb-3">
                      {getStatusBadge(employee.status)}
                    </div>

                    {/* Details */}
                    <div className="space-y-1 mb-3 text-xs flex-grow">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Dept:</span>
                        <span className="text-gray-900 truncate">{employee.department}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Position:</span>
                        <span className="text-gray-900 truncate">{employee.position}</span>
                      </div>
                      {employee.clockIn && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Clock In:</span>
                          <span className="text-gray-900">{employee.clockIn}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">Last Seen:</span>
                        <span className="text-gray-900 text-xs truncate">{employee.lastSeen}</span>
                      </div>
                      {employee.confidence && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Confidence:</span>
                          <span className="text-gray-900">{employee.confidence}%</span>
                        </div>
                      )}
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => handleViewDetails(employee.id)}
                      className="w-full px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors duration-200 mt-auto"
                    >
                      View Details
                    </button>
                  </div>
                </Card>
                ))}
              </div>
            )}
          </div>

          {/* Right Container - Activity Feed (30% width) */}
          <div className="w-full lg:w-[30%]">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Live Activity</h2>
            <Card className="h-full">
              <div className="p-4 h-full overflow-y-auto">
                {processedLiveActivity.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No recent activity</p>
                    <p className="text-xs mt-1">Attendance logs for the selected date will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {processedLiveActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg min-h-[64px]">
                        <img
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          src={activity.avatar}
                          alt={activity.employee}
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(activity.employee)}&background=3b82f6&color=fff&size=32`;
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-gray-900 truncate">{activity.employee}</h4>
                            <span className="text-xs text-gray-500">{activity.timestamp}</span>
                          </div>
                          <p className="text-xs text-gray-600 truncate">{activity.event}</p>
                          {activity.confidence > 0 && (
                            <div className="text-right">
                              <span className="text-sm font-semibold text-gray-900">{activity.confidence}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAttendanceMonitoring;
