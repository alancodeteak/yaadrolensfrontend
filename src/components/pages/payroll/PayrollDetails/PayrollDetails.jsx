import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../../common/Card/Card';
import { LoadingScreen, UserAvatar } from '../../../common';
import {
  useGetPayrollByIdQuery,
  useUpdatePayrollMutation,
  useApprovePayrollMutation,
  useMarkPayrollPaidMutation
} from '../../../../store/api/payrollApi';
import { useGetEmployeeByIdQuery } from '../../../../store/api/employeeApi';

const PayrollDetails = ({ employee: propEmployee }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // API hooks
  const { data: payrollData, isLoading: payrollLoading, error: payrollError } = useGetPayrollByIdQuery(id, {
    skip: !id
  });
  
  const { data: employeeData } = useGetEmployeeByIdQuery(payrollData?.employee_id, {
    skip: !payrollData?.employee_id
  });
  
  const [updatePayroll, { isLoading: isUpdating }] = useUpdatePayrollMutation();
  const [approvePayroll, { isLoading: isApproving }] = useApprovePayrollMutation();
  const [markPayrollPaid, { isLoading: isMarkingPaid }] = useMarkPayrollPaidMutation();
  
  // Use employee from props or API
  const employee = propEmployee || employeeData || {};
  
  const [formData, setFormData] = useState({
    regularHours: 0,
    overtimeHours: 0,
    bonuses: 0,
    deductions: 0,
    comments: '',
    hourlyRate: 0,
    overtimeRate: 0
  });
  
  // Update form data when payroll data loads
  useEffect(() => {
    if (payrollData) {
      setFormData({
        regularHours: parseFloat(payrollData.hours_worked || 0),
        overtimeHours: parseFloat(payrollData.overtime_hours || 0),
        bonuses: 0, // Not in API response
        deductions: parseFloat(payrollData.deductions || 0),
        comments: payrollData.comments || '',
        hourlyRate: parseFloat(payrollData.hourly_rate || 0),
        overtimeRate: parseFloat(payrollData.overtime_rate || 0)
      });
    }
  }, [payrollData]);

  const [deductions, setDeductions] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleDeductionChange = (id, field, value) => {
    setDeductions(prev => 
      prev.map(deduction => 
        deduction.id === id 
          ? { ...deduction, [field]: value }
          : deduction
      )
    );
  };

  const addNewDeduction = () => {
    const newId = Math.max(...deductions.map(d => d.id), 0) + 1;
    setDeductions(prev => [...prev, { id: newId, name: '', amount: 0 }]);
  };

  const removeDeduction = (id) => {
    setDeductions(prev => prev.filter(deduction => deduction.id !== id));
  };

  const calculateNetPay = () => {
    if (payrollData) {
      return parseFloat(payrollData.net_salary || 0);
    }
    const grossPay = (formData.regularHours * formData.hourlyRate) + (formData.overtimeHours * formData.overtimeRate) + formData.bonuses;
    const totalDeductions = formData.deductions + deductions.reduce((sum, deduction) => sum + parseFloat(deduction.amount || 0), 0);
    return grossPay - totalDeductions;
  };

  const handleSaveChanges = async () => {
    if (!payrollData || isUpdating) return;
    
    try {
      await updatePayroll({
        id: payrollData.id,
        hourly_rate: formData.hourlyRate.toString(),
        overtime_rate: formData.overtimeRate.toString(),
        deductions: formData.deductions.toString()
      }).unwrap();
      alert('Payroll updated successfully');
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update payroll');
    }
  };

  const handleApprove = async () => {
    if (!payrollData || isApproving) return;
    
    if (!confirm('Are you sure you want to approve this payroll?')) {
      return;
    }

    try {
      await approvePayroll(payrollData.id).unwrap();
      alert('Payroll approved successfully');
      // Refresh data or navigate back
      navigate('/admin/payroll');
    } catch (error) {
      console.error('Approve failed:', error);
      alert('Failed to approve payroll');
    }
  };

  const handleMarkPaid = async () => {
    if (!payrollData || isMarkingPaid) return;
    
    if (!confirm('Are you sure you want to mark this payroll as paid?')) {
      return;
    }

    try {
      await markPayrollPaid(payrollData.id).unwrap();
      alert('Payroll marked as paid successfully');
      // Refresh data or navigate back
      navigate('/admin/payroll');
    } catch (error) {
      console.error('Mark paid failed:', error);
      alert('Failed to mark payroll as paid');
    }
  };

  // Show loading state
  if (payrollLoading) {
    return <LoadingScreen message="Loading payroll details..." />;
  }

  // Show error state
  if (payrollError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Payroll</h3>
          <p className="text-gray-600 mb-4">Failed to load payroll details. Please try again.</p>
          <button
            onClick={() => navigate('/admin/payroll')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Payroll List
          </button>
        </div>
      </div>
    );
  }

  if (!payrollData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Payroll Not Found</h3>
          <p className="text-gray-600 mb-4">The requested payroll record could not be found.</p>
          <button
            onClick={() => navigate('/admin/payroll')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Payroll List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Payroll Details for {employee.name || payrollData.employee_name} - {new Date(payrollData.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h1>
          </div>
          <button 
            onClick={() => navigate('/admin/payroll')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Payroll List
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Employee Information */}
            <Card title="Employee Information">
              <div className="flex items-center space-x-6">
                <UserAvatar
                  className="h-20 w-20 rounded-full ring-4 ring-gray-100"
                  src={employee.photo}
                  name={employee.name || payrollData.employee_name}
                  seed={employee.id || payrollData.employee_id}
                />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{employee.name || payrollData.employee_name}</h3>
                  <p className="text-gray-600 text-lg">{employee.department || payrollData.employee_department} Department</p>
                  <p className="text-gray-500">{employee.position || 'Employee'}</p>
                  <p className="text-gray-500">ID: {employee.id || payrollData.employee_id}</p>
                </div>
              </div>
            </Card>

            {/* Calculation Breakdown */}
            <Card title="Calculation Breakdown">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Regular Hours
                  </label>
                  <input
                    type="number"
                    name="regularHours"
                    value={formData.regularHours}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Overtime Hours
                  </label>
                  <input
                    type="number"
                    name="overtimeHours"
                    value={formData.overtimeHours}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deductions
                  </label>
                  <input
                    type="number"
                    name="deductions"
                    value={formData.deductions}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    step="0.01"
                  />
                </div>
              </div>
            </Card>

            {/* Deductions */}
            <Card title="Deductions">
              <div className="space-y-4">
                {deductions.map((deduction) => (
                  <div key={deduction.id} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={deduction.name}
                        onChange={(e) => handleDeductionChange(deduction.id, 'name', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Deduction name"
                      />
                    </div>
                    <div className="w-32">
                      <input
                        type="number"
                        value={deduction.amount}
                        onChange={(e) => handleDeductionChange(deduction.id, 'amount', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        step="0.01"
                      />
                    </div>
                    <button
                      onClick={() => removeDeduction(deduction.id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  onClick={addNewDeduction}
                  className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
                >
                  + Add New Deduction
                </button>
              </div>
            </Card>

            {/* Comments/Notes */}
            <Card title="Comments/Notes">
              <textarea
                name="comments"
                value={formData.comments}
                onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Add comments or notes here"
              />
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Summary */}
            <Card title="Summary">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">Net Pay</p>
                  <p className="text-3xl font-bold text-gray-900">${calculateNetPay().toFixed(2)}</p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      payrollData.status === 'Paid' ? 'bg-green-50 text-green-700 ring-1 ring-green-200' :
                      payrollData.status === 'Approved' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' :
                      'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200'
                    }`}>
                      {payrollData.status || 'Pending'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Gross Pay</span>
                    <span className="font-semibold text-gray-900">${parseFloat(payrollData.salary || 0).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Deductions</span>
                    <span className="font-semibold text-gray-900">${parseFloat(payrollData.deductions || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Payroll Summary */}
            <Card title="Payroll Summary">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Hours Worked</span>
                  <span className="font-semibold text-gray-900">{parseFloat(payrollData.hours_worked || 0).toFixed(1)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Overtime Hours</span>
                  <span className="font-semibold text-gray-900">{parseFloat(payrollData.overtime_hours || 0).toFixed(1)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Hourly Rate</span>
                  <span className="font-semibold text-gray-900">${parseFloat(payrollData.hourly_rate || 0).toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Overtime Rate</span>
                  <span className="font-semibold text-gray-900">${parseFloat(payrollData.overtime_rate || 0).toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card title="Actions">
              <div className="space-y-3">
                <button 
                  onClick={handleSaveChanges}
                  disabled={isUpdating}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
                
                {payrollData.status !== 'Approved' && payrollData.status !== 'Paid' && (
                  <button 
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="w-full py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isApproving ? 'Approving...' : 'Approve Payroll'}
                  </button>
                )}
                
                {payrollData.status === 'Approved' && (
                  <button 
                    onClick={handleMarkPaid}
                    disabled={isMarkingPaid}
                    className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isMarkingPaid ? 'Marking Paid...' : 'Mark as Paid'}
                  </button>
                )}
              </div>
            </Card>

            {/* Payroll Info */}
            <Card title="Payroll Information">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Created:</span>
                  <span className="text-sm text-gray-900">{new Date(payrollData.created_at).toLocaleDateString()}</span>
                </div>
                {payrollData.processed_at && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Processed:</span>
                    <span className="text-sm text-gray-900">{new Date(payrollData.processed_at).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Period:</span>
                  <span className="text-sm text-gray-900">{payrollData.month}/{payrollData.year}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollDetails;
