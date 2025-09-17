import React, { useState, useEffect } from 'react';
import Card from '../../../common/Card/Card';

const LiveAttendanceMonitoring = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mock data for summary cards
  const summaryData = {
    currentlyPresent: 4,
    currentlyAbsent: 1,
    lateArrivalsToday: 2,
    totalEmployees: 6
  };

  // Mock data for employees
  const employees = [
    {
      id: 'EMP001',
      name: 'Ethan Carter',
      department: 'Engineering',
      position: 'Software Engineer',
      status: 'Present',
      clockIn: '09:00 AM',
      lastSeen: '10:45 AM',
      confidence: 98,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'EMP002',
      name: 'Olivia Bennett',
      department: 'Marketing',
      position: 'Marketing Specialist',
      status: 'Present (Late)',
      clockIn: '09:15 AM',
      lastSeen: '11:20 AM',
      confidence: 95,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'EMP003',
      name: 'Liam Harper',
      department: 'Sales',
      position: 'Sales Manager',
      status: 'Absent',
      clockIn: null,
      lastSeen: 'Yesterday 5:30 PM',
      confidence: null,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'EMP004',
      name: 'Sophia Rodriguez',
      department: 'HR',
      position: 'HR Manager',
      status: 'Present',
      clockIn: '08:45 AM',
      lastSeen: '11:45 AM',
      confidence: 97,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'EMP005',
      name: 'James Wilson',
      department: 'Finance',
      position: 'Financial Analyst',
      status: 'On Leave',
      clockIn: null,
      lastSeen: 'On Leave',
      confidence: null,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'EMP006',
      name: 'Emma Thompson',
      department: 'Engineering',
      position: 'Senior Developer',
      status: 'Present (Late)',
      clockIn: '09:30 AM',
      lastSeen: '12:00 PM',
      confidence: 99,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
    }
  ];

  // Mock data for live activity
  const liveActivity = [
    {
      id: 1,
      employee: 'Olivia Bennett',
      event: 'Face Scan',
      timestamp: '05:25 PM',
      confidence: 97,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 2,
      employee: 'Olivia Bennett',
      event: 'Movement Detected',
      timestamp: '05:25 PM',
      confidence: 95,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 3,
      employee: 'Emma Thompson',
      event: 'Movement Detected',
      timestamp: '05:24 PM',
      confidence: 99,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 4,
      employee: 'Liam Harper',
      event: 'Movement Detected',
      timestamp: '05:24 PM',
      confidence: 90,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    }
  ];

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
    const statusStyles = {
      'Present': 'bg-green-50 text-green-700 ring-1 ring-green-200',
      'Present (Late)': 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
      'Absent': 'bg-red-50 text-red-700 ring-1 ring-red-200',
      'On Leave': 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
    };

    return (
      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-50 text-gray-700 ring-1 ring-gray-200'}`}>
        {status}
      </span>
    );
  };

  const handleViewDetails = (employeeId) => {
    console.log('View details for employee:', employeeId);
    // TODO: Implement view details functionality
  };

  const handleRefresh = () => {
    console.log('Refreshing attendance data...');
    // TODO: Implement refresh functionality
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Attendance Monitoring</h1>
          <p className="text-gray-600">{formatDateTime(currentTime)}</p>
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
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Employee Status</h2>
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
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        employee.status === 'Present' ? 'bg-green-500' :
                        employee.status === 'Present (Late)' ? 'bg-yellow-500' :
                        employee.status === 'Absent' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`}></div>
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
          </div>

          {/* Right Container - Activity Feed (30% width) */}
          <div className="w-full lg:w-[30%]">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Live Activity</h2>
            <Card className="h-full">
              <div className="p-4 h-full overflow-y-auto">
                <div className="space-y-3">
                  {liveActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg h-16">
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
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900">{activity.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAttendanceMonitoring;
