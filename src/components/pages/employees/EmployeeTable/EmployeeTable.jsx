import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpdateEmployeeMutation } from '../../../../store/api';
import { toast } from 'react-toastify';

const EmployeeTable = ({ employees, isLoading, onRefresh, onEdit, onDeactivate, showActiveEmployees = true }) => {
  const navigate = useNavigate();
  const [updateEmployee] = useUpdateEmployeeMutation();

  const handleEdit = (employee) => {
    if (onEdit) {
      onEdit(employee);
    }
  };

  const handleView = (employeeId) => {
    navigate(`/admin/employees/${employeeId}`);
  };

  const handlePayroll = (employeeId) => {
    navigate(`/admin/payroll/${employeeId}`);
  };

  const handleDeactivate = (employee) => {
    if (onDeactivate) {
      onDeactivate(employee);
    }
  };

  const handleStatusToggle = async (employee) => {
    try {
      await updateEmployee({
        id: employee.id,
        is_active: !employee.is_active
      }).unwrap();
      toast.success(`Employee ${employee.is_active ? 'deactivated' : 'activated'} successfully!`);
      onRefresh?.();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update employee status');
    }
  };

  return (
    <div className="w-full">
      <table className="w-full divide-y divide-gray-100">
        <thead className="bg-gray-50/50">
          <tr>
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
            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-24 hidden lg:table-cell">
              Phone
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
              Status
            </th>
            <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-32 hidden xl:table-cell">
              Training
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
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 mr-3">
                    <img
                      className="h-8 w-8 rounded-lg object-cover ring-1 ring-gray-100 group-hover:ring-gray-200 transition-all duration-200"
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=3b82f6&color=fff&size=32`}
                      alt={employee.name}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 truncate">{employee.name}</div>
                    <div className="text-xs text-gray-500 lg:hidden">{employee.email}</div>
                    <div className="text-xs text-gray-500 md:hidden">{employee.department}</div>
                  </div>
                </div>
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
              <td className="px-4 py-4 hidden lg:table-cell">
                <div className="text-sm text-gray-600 truncate">{employee.phone}</div>
              </td>
              <td className="px-4 py-4">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    employee.is_active
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                      : 'bg-gray-50 text-gray-600 ring-1 ring-gray-200'
                  }`}
                >
                  {employee.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-4 py-4 hidden xl:table-cell">
                <div className="space-y-1">
                  <div className="flex items-center text-xs text-gray-600">
                    <svg className="w-3 h-3 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    {employee.training_photos_count || 0} photos
                  </div>
                  <div className="flex items-center text-xs">
                    <span className={`inline-flex px-1.5 py-0.5 rounded-full text-xs font-medium ${
                      employee.training_status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : employee.training_status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {employee.training_status || 'Not started'}
                    </span>
                  </div>
                  {employee.training_quality_score && (
                    <div className="text-xs text-gray-600">
                      Quality: {(employee.training_quality_score * 100).toFixed(0)}%
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center space-x-1">
                  {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(employee)}
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
                    onClick={() => handleStatusToggle(employee)}
                    className={`p-1.5 rounded-lg transition-all duration-200 group ${
                      employee.is_active
                        ? 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                    }`}
                    title={`${employee.is_active ? 'Deactivate' : 'Activate'} employee`}
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

                  {/* Deactivate Button - Only show for active employees in active view */}
                  {employee.is_active && showActiveEmployees && (
                    <button
                      onClick={() => handleDeactivate(employee)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                      title="Deactivate employee"
                    >
                      <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}

                  {/* Reactivate Button - Only show for inactive employees in deactivated view */}
                  {!employee.is_active && !showActiveEmployees && (
                    <button
                      onClick={() => handleStatusToggle(employee)}
                      className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group"
                      title="Reactivate employee"
                    >
                      <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  )}
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {showActiveEmployees ? 'No active employees found' : 'No deactivated employees found'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {showActiveEmployees 
                  ? 'Try adjusting your search or filter criteria.' 
                  : 'All employees are currently active or try adjusting your search criteria.'
                }
              </p>
            </div>
          )}
    </div>
  );
};

export default EmployeeTable;
