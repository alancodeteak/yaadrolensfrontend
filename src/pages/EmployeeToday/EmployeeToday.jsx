import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetEmployeeTodayQuery, useGetEmployeeByIdQuery } from '../../store/api';
import Card from '../../components/common/Card/Card';

const EmployeeToday = () => {
  const { employeeId } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // API hooks
  const { data: todayData, isLoading: todayLoading, error: todayError } = useGetEmployeeTodayQuery(employeeId);
  const { data: employeeData, isLoading: employeeLoading } = useGetEmployeeByIdQuery(employeeId);

  if (todayLoading || employeeLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (todayError) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800">Error loading attendance data</h3>
              <p className="text-sm text-red-700 mt-1">
                {todayError?.data?.message || 'Failed to load today\'s attendance information.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const employee = employeeData;
  const today = todayData;

  const getStatusColor = (status) => {
    switch (status) {
      case 'working':
        return 'bg-green-100 text-green-800';
      case 'on_break':
        return 'bg-yellow-100 text-yellow-800';
      case 'clocked_out':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'working':
        return 'Currently Working';
      case 'on_break':
        return 'On Break';
      case 'clocked_out':
        return 'Clocked Out';
      default:
        return 'Not Clocked In';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Today's Attendance</h1>
        <p className="text-gray-600 mt-2">
          {employee?.first_name} {employee?.last_name} - {selectedDate}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Status Card */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h2>
            
            {today ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(today.current_status)}`}>
                    {getStatusText(today.current_status)}
                  </span>
                </div>

                {today.clock_in && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Clock In</span>
                    <span className="text-sm text-gray-900">{today.clock_in}</span>
                  </div>
                )}

                {today.clock_out && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Clock Out</span>
                    <span className="text-sm text-gray-900">{today.clock_out}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Hours Worked</span>
                  <span className="text-sm text-gray-900">{today.hours_worked || '0.0'} hours</span>
                </div>

                {today.breaks_taken > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Breaks Taken</span>
                    <span className="text-sm text-gray-900">{today.breaks_taken}</span>
                  </div>
                )}

                {today.total_break_time && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Total Break Time</span>
                    <span className="text-sm text-gray-900">{today.total_break_time}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance data</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No attendance record found for today.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Employee Information Card */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Employee Information</h2>
            
            {employee ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-medium text-lg">
                      {employee.first_name?.charAt(0)}{employee.last_name?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {employee.first_name} {employee.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">{employee.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Employee ID</span>
                    <p className="text-sm text-gray-900">{employee.employee_id || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Department</span>
                    <p className="text-sm text-gray-900">{employee.department?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Position</span>
                    <p className="text-sm text-gray-900">{employee.position?.title || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      employee.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {employee.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Employee not found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Unable to load employee information.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                View Full Report
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200">
                Export Data
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                Edit Attendance
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeToday;
