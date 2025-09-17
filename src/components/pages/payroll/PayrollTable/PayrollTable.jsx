import React from 'react';
import { useNavigate } from 'react-router-dom';

const PayrollTable = ({ payrolls }) => {
  const navigate = useNavigate();

  const handleView = (payrollId) => {
    navigate(`/admin/payroll/${payrollId}`);
  };

  const handleEdit = (payrollId) => {
    console.log('Edit payroll:', payrollId);
    // TODO: Implement edit functionality
  };

  const handleApprove = (payrollId) => {
    console.log('Approve payroll:', payrollId);
    // TODO: Implement approve functionality
  };

  const handleMarkPaid = (payrollId) => {
    console.log('Mark payroll as paid:', payrollId);
    // TODO: Implement mark paid functionality
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'Paid': 'bg-green-50 text-green-700 ring-1 ring-green-200',
      'Approved': 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
      'Pending': 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200'
    };

    return (
      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-50 text-gray-700 ring-1 ring-gray-200'}`}>
        {status}
      </span>
    );
  };

  const getActionButtons = (payroll) => {
    switch (payroll.status) {
      case 'Paid':
        return (
          <>
            <button
              onClick={() => handleView(payroll.id)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => handleEdit(payroll.id)}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Edit
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => handleApprove(payroll.id)}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Approve
            </button>
          </>
        );
      case 'Approved':
        return (
          <>
            <button
              onClick={() => handleView(payroll.id)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => handleEdit(payroll.id)}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Edit
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => handleMarkPaid(payroll.id)}
              className="text-green-600 hover:text-green-800 font-medium"
            >
              Mark Paid
            </button>
          </>
        );
      case 'Pending':
        return (
          <>
            <button
              onClick={() => handleView(payroll.id)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => handleEdit(payroll.id)}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Edit
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => handleApprove(payroll.id)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Approve
            </button>
          </>
        );
      default:
        return (
          <>
            <button
              onClick={() => handleView(payroll.id)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => handleEdit(payroll.id)}
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Edit
            </button>
          </>
        );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50/50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Employee ID
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Gross Pay
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Deductions
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Net Pay
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
          {payrolls.map((payroll) => (
            <tr key={payroll.id} className="hover:bg-gray-50/50 transition-all duration-200 group">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{payroll.id}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-gray-100 group-hover:ring-gray-200 transition-all duration-200"
                      src={payroll.photo}
                      alt={payroll.name}
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(payroll.name)}&background=3b82f6&color=fff&size=40`;
                      }}
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-gray-900">{payroll.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">${payroll.grossPay.toLocaleString()}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">${payroll.deductions.toLocaleString()}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900">${payroll.netPay.toLocaleString()}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(payroll.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  {getActionButtons(payroll)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {payrolls.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No payroll records found</h3>
          <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria or load a different period.</p>
        </div>
      )}
    </div>
  );
};

export default PayrollTable;
