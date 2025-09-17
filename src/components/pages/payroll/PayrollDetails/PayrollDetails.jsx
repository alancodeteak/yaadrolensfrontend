import React, { useState } from 'react';
import Card from '../../../common/Card/Card';

const PayrollDetails = ({ employee }) => {
  const [payrollData, setPayrollData] = useState({
    regularHours: 160,
    overtimeHours: 10,
    bonuses: 500.00,
    tax: 1200.00,
    insurance: 350.00,
    otherDeductions: '',
    comments: '',
    totalDaysWorked: 20,
    sickDays: 1,
    vacationDays: 2
  });

  const [deductions, setDeductions] = useState([
    { id: 1, name: 'Tax', amount: 1200.00 },
    { id: 2, name: 'Insurance', amount: 350.00 }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPayrollData(prev => ({
      ...prev,
      [name]: value
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
    const grossPay = (payrollData.regularHours * 25) + (payrollData.overtimeHours * 37.5) + payrollData.bonuses;
    const totalDeductions = deductions.reduce((sum, deduction) => sum + parseFloat(deduction.amount || 0), 0);
    return grossPay - totalDeductions;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Payroll Details for {employee.name} - July 2024</h1>
          </div>
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Payroll List
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Employee Information */}
            <Card title="Employee Information">
              <div className="flex items-center space-x-6">
                <img
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-gray-100"
                  src={employee.photo}
                  alt={employee.name}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=3b82f6&color=fff&size=80`;
                  }}
                />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{employee.name}</h3>
                  <p className="text-gray-600 text-lg">{employee.department} Department</p>
                  <p className="text-gray-500">{employee.position}</p>
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
                    value={payrollData.regularHours}
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
                    value={payrollData.overtimeHours}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bonuses/Commissions
                  </label>
                  <input
                    type="number"
                    name="bonuses"
                    value={payrollData.bonuses}
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
                value={payrollData.comments}
                onChange={handleInputChange}
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
                    <span className="text-sm text-gray-600">Approval Status</span>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200">
                      Pending Approval
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Payment Status</span>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 ring-1 ring-red-200">
                      Unpaid
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Attendance Summary */}
            <Card title="Attendance Summary">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Days Worked</span>
                  <span className="font-semibold text-gray-900">{payrollData.totalDaysWorked}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sick Days</span>
                  <span className="font-semibold text-gray-900">{payrollData.sickDays}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Vacation Days</span>
                  <span className="font-semibold text-gray-900">{payrollData.vacationDays}</span>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card title="Actions">
              <div className="space-y-3">
                <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold">
                  Save Changes
                </button>
                
                <button className="w-full py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-semibold">
                  Approve Payroll
                </button>
                
                <button className="w-full py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold">
                  Mark as Paid
                </button>
              </div>
            </Card>

            {/* Audit Log */}
            <Card title="Audit Log">
              <p className="text-sm text-gray-500">No audit log available for this payroll.</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollDetails;
