import React from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeTable = ({ employees }) => {
  const navigate = useNavigate();

  const handleEdit = (employeeId) => {
    console.log('Edit employee:', employeeId);
    // TODO: Implement edit functionality
  };

  const handleView = (employeeId) => {
    navigate(`/admin/employees/${employeeId}`);
  };

  const handlePayroll = (employeeId) => {
    navigate(`/admin/payroll/${employeeId}`);
  };

  const handleStatusToggle = (employeeId) => {
    console.log('Toggle status for employee:', employeeId);
    // TODO: Implement status toggle functionality
  };

  return (
    <div className="w-full">
      <table className="w-full divide-y divide-gray-100">
        <thead className="bg-gray-50/50">
          <tr>
            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
              ID
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">
              Photo
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-32">
              Name
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-48 hidden lg:table-cell">
              Email
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-32 hidden md:table-cell">
              Department
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-32 hidden xl:table-cell">
              Position
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
              Status
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50/50 transition-all duration-200 group">
              <td className="px-4 py-4">
                <div className="text-sm font-medium text-gray-900 truncate">{employee.id}</div>
              </td>
              <td className="px-4 py-4">
                <div className="flex-shrink-0 h-8 w-8">
                  <img
                    className="h-8 w-8 rounded-lg object-cover ring-1 ring-gray-100 group-hover:ring-gray-200 transition-all duration-200"
                    src={employee.photo}
                    alt={employee.name}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=3b82f6&color=fff&size=32`;
                    }}
                  />
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="text-sm font-semibold text-gray-900 truncate">{employee.name}</div>
                <div className="text-xs text-gray-500 lg:hidden">{employee.email}</div>
                <div className="text-xs text-gray-500 md:hidden">{employee.department}</div>
              </td>
              <td className="px-4 py-4 hidden lg:table-cell">
                <div className="text-sm text-gray-600 truncate">{employee.email}</div>
              </td>
              <td className="px-4 py-4 hidden md:table-cell">
                <div className="text-sm text-gray-900 truncate">{employee.department}</div>
              </td>
              <td className="px-4 py-4 hidden xl:table-cell">
                <div className="text-sm text-gray-900 truncate">{employee.position}</div>
              </td>
              <td className="px-4 py-4">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    employee.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                      : 'bg-gray-50 text-gray-600 ring-1 ring-gray-200'
                  }`}
                >
                  {employee.status}
                </span>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center space-x-1">
                  {/* Edit Button */}
                  <button
                    onClick={() => handleEdit(employee.id)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                    title="Edit employee"
                  >
                    <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  {/* View Button */}
                  <button
                    onClick={() => handleView(employee.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200 group"
                    title="View employee"
                  >
                    <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>

                  {/* Status Toggle Button */}
                  <button
                    onClick={() => handleStatusToggle(employee.id)}
                    className={`p-1.5 rounded-lg transition-all duration-200 group ${
                      employee.status === 'Active'
                        ? 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                    }`}
                    title={`${employee.status === 'Active' ? 'Deactivate' : 'Activate'} employee`}
                  >
                    <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                  </button>

                  {/* Payroll Button */}
                  <button
                    onClick={() => handlePayroll(employee.id)}
                    className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group"
                    title="View payroll details"
                  >
                    <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {employees.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
