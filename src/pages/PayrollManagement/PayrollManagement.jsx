import React, { useState } from 'react';
import { PayrollTable } from '../../components/pages/payroll';
import { Pagination, Card } from '../../components/common';

const PayrollManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [payrollsPerPage] = useState(10);
  const [selectedMonth, setSelectedMonth] = useState('June');
  const [selectedYear, setSelectedYear] = useState('2024');

  // Mock payroll data
  const payrolls = [
    {
      id: 'EMP001',
      name: 'Ethan Harper',
      grossPay: 6000,
      deductions: 1200,
      netPay: 4800,
      status: 'Paid',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'EMP002',
      name: 'Olivia Bennett',
      grossPay: 5500,
      deductions: 1100,
      netPay: 4400,
      status: 'Approved',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'EMP003',
      name: 'Noah Carter',
      grossPay: 6200,
      deductions: 1240,
      netPay: 4960,
      status: 'Paid',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'EMP004',
      name: 'Ava Thompson',
      grossPay: 5800,
      deductions: 1160,
      netPay: 4640,
      status: 'Approved',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'EMP005',
      name: 'Liam Foster',
      grossPay: 6500,
      deductions: 1300,
      netPay: 5200,
      status: 'Paid',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'EMP006',
      name: 'Emma Wilson',
      grossPay: 5200,
      deductions: 1040,
      netPay: 4160,
      status: 'Pending',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'EMP007',
      name: 'James Anderson',
      grossPay: 6800,
      deductions: 1360,
      netPay: 5440,
      status: 'Paid',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'EMP008',
      name: 'Sophia Martinez',
      grossPay: 5900,
      deductions: 1180,
      netPay: 4720,
      status: 'Approved',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'EMP009',
      name: 'William Brown',
      grossPay: 6300,
      deductions: 1260,
      netPay: 5040,
      status: 'Paid',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 'EMP010',
      name: 'Isabella Davis',
      grossPay: 5700,
      deductions: 1140,
      netPay: 4560,
      status: 'Pending',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ];

  // Filter payrolls based on search term
  const filteredPayrolls = payrolls.filter(payroll => 
    payroll.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payroll.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastPayroll = currentPage * payrollsPerPage;
  const indexOfFirstPayroll = indexOfLastPayroll - payrollsPerPage;
  const currentPayrolls = filteredPayrolls.slice(indexOfFirstPayroll, indexOfLastPayroll);
  const totalPages = Math.ceil(filteredPayrolls.length / payrollsPerPage);

  // Calculate statistics
  const totalEmployees = payrolls.length;
  const totalGrossPay = payrolls.reduce((sum, payroll) => sum + payroll.grossPay, 0);
  const totalDeductions = payrolls.reduce((sum, payroll) => sum + payroll.deductions, 0);
  const totalNetPay = payrolls.reduce((sum, payroll) => sum + payroll.netPay, 0);
  const approvedCount = payrolls.filter(payroll => payroll.status === 'Approved' || payroll.status === 'Paid').length;
  const isAllApproved = approvedCount === totalEmployees;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = ['2024', '2023', '2022', '2021', '2020'];

  const handleLoadPayrolls = () => {
    console.log('Loading payrolls for:', selectedMonth, selectedYear);
    // TODO: Implement load payrolls functionality
  };

  const handleExportAll = () => {
    console.log('Exporting all payrolls');
    // TODO: Implement export functionality
  };

  const handleCalculateAll = () => {
    console.log('Calculating all payrolls');
    // TODO: Implement calculate all functionality
  };

  const handleApproveAll = () => {
    console.log('Approving all payrolls');
    // TODO: Implement approve all functionality
  };

  const handleMarkAllPaid = () => {
    console.log('Marking all payrolls as paid');
    // TODO: Implement mark all paid functionality
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">Payroll Management</h1>
          
          {/* Payroll Period Selection */}
          <Card title="Select Payroll Period">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-end space-x-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Month</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <button
                    onClick={handleLoadPayrolls}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
                  >
                    Load
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleExportAll}
                className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Export All Payrolls
              </button>
            </div>
          </Card>
        </div>

        {/* Statistics */}
        <div className="mb-8">
          <Card title={`${selectedMonth} ${selectedYear} Period Statistics`}>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
                <p className="text-sm text-gray-600">Total Employees</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">${totalGrossPay.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Gross Pay</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">${totalDeductions.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Deductions</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">${totalNetPay.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Net Pay</p>
              </div>
              
              <div className="text-center">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  isAllApproved 
                    ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                    : 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200'
                }`}>
                  {isAllApproved ? 'Approved' : 'Pending'}
                </span>
                <p className="text-sm text-gray-600 mt-1">Status</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons and Search */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCalculateAll}
                className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Calculate All Payrolls
              </button>
              
              <button
                onClick={handleApproveAll}
                className="flex items-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-semibold"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Approve All Payrolls
              </button>
              
              <button
                onClick={handleMarkAllPaid}
                className="flex items-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Mark All Paid
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by Employee ID or Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-100">
          <PayrollTable payrolls={currentPayrolls} />
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredPayrolls.length}
            itemsPerPage={payrollsPerPage}
          />
        </div>
      </div>
    </div>
  );
};

export default PayrollManagement;