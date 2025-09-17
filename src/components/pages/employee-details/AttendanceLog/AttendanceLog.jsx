import React from 'react';
import Card from '../../../common/Card/Card';

const AttendanceLog = () => {
  // Mock attendance data
  const attendanceRecords = [
    {
      id: 1,
      date: '2024-05-10',
      clockIn: '08:55 AM',
      clockOut: '05:05 PM',
      totalHours: '8h 10m',
      status: 'Present'
    },
    {
      id: 2,
      date: '2024-05-09',
      clockIn: '09:15 AM',
      clockOut: '05:00 PM',
      totalHours: '7h 45m',
      status: 'Late'
    },
    {
      id: 3,
      date: '2024-05-08',
      clockIn: '08:58 AM',
      clockOut: '05:02 PM',
      totalHours: '8h 04m',
      status: 'Present'
    },
    {
      id: 4,
      date: '2024-05-07',
      clockIn: 'N/A',
      clockOut: 'N/A',
      totalHours: '0h 0m',
      status: 'Absence'
    }
  ];

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Present': 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
      'Late': 'bg-red-50 text-red-700 ring-1 ring-red-200',
      'Absence': 'bg-orange-50 text-orange-700 ring-1 ring-orange-200'
    };

    return (
      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-50 text-gray-700 ring-1 ring-gray-200'}`}>
        {status}
      </span>
    );
  };

  return (
    <Card title="Recent Attendance Records">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Clock In
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Clock Out
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Total Hours
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {attendanceRecords.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50/50 transition-all duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{record.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{record.clockIn}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{record.clockOut}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{record.totalHours}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(record.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {attendanceRecords.length === 0 && (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records</h3>
          <p className="mt-1 text-sm text-gray-500">Attendance data will appear here once recorded.</p>
        </div>
      )}
    </Card>
  );
};

export default AttendanceLog;
