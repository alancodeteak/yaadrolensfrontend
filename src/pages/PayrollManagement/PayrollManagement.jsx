import React, { useState, useMemo } from 'react';
import { PayrollTable } from '../../components/pages/payroll';
import { Pagination, Card } from '../../components/common';
import {
  useGetPayrollsQuery,
  useCreatePayrollMutation,
  useApprovePayrollMutation,
  useMarkPayrollPaidMutation,
  useExportPayrollMutation
} from '../../store/api/payrollApi';
import { useGetEmployeesQuery } from '../../store/api/employeeApi';

const PayrollManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [payrollsPerPage] = useState(10);
  
  // Get current date for defaults
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('en-US', { month: 'long' });
  const currentYear = currentDate.getFullYear().toString();
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isMarkingPaid, setIsMarkingPaid] = useState(false);

  // Convert month name to number
  const getMonthNumber = (monthName) => {
    const months = {
      'January': 1, 'February': 2, 'March': 3, 'April': 4,
      'May': 5, 'June': 6, 'July': 7, 'August': 8,
      'September': 9, 'October': 10, 'November': 11, 'December': 12
    };
    return months[monthName] || 6;
  };

  const monthNumber = getMonthNumber(selectedMonth);
  const yearNumber = parseInt(selectedYear);

  // API hooks
  const { data: payrollsData = [], isLoading: payrollsLoading, error: payrollsError, refetch } = useGetPayrollsQuery({
    start_month: monthNumber,
    start_year: yearNumber,
    end_month: monthNumber,
    end_year: yearNumber,
    skip: (currentPage - 1) * payrollsPerPage,
    limit: payrollsPerPage
  });

  const { data: employeesData = [] } = useGetEmployeesQuery({
    page: 1,
    limit: 1000,
    is_active: true
  });

  const [createPayroll] = useCreatePayrollMutation();
  const [approvePayroll] = useApprovePayrollMutation();
  const [markPayrollPaid] = useMarkPayrollPaidMutation();
  const [exportPayroll] = useExportPayrollMutation();

  // Process API data for display
  const payrolls = useMemo(() => {
    if (!payrollsData || payrollsData.length === 0) return [];
    
    return payrollsData.map(payroll => ({
      id: payroll.employee_id,
      payrollId: payroll.id,
      name: payroll.employee_name,
      grossPay: parseFloat(payroll.salary || 0),
      deductions: parseFloat(payroll.deductions || 0),
      netPay: parseFloat(payroll.net_salary || 0),
      status: payroll.status || 'Pending',
      photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(payroll.employee_name)}&background=3b82f6&color=fff&size=100`,
      month: payroll.month,
      year: payroll.year
    }));
  }, [payrollsData]);

  // Filter payrolls based on search term
  const filteredPayrolls = payrolls.filter(payroll => 
    payroll.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    payroll.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // For API-based pagination, we use the payrolls directly
  const currentPayrolls = searchTerm ? filteredPayrolls : payrolls;
  const totalPages = Math.ceil((searchTerm ? filteredPayrolls.length : (payrollsData?.length || 0)) / payrollsPerPage);

  // Calculate statistics
  const totalEmployees = payrolls.length;
  const totalGrossPay = payrolls.reduce((sum, payroll) => sum + payroll.grossPay, 0);
  const totalDeductions = payrolls.reduce((sum, payroll) => sum + payroll.deductions, 0);
  const totalNetPay = payrolls.reduce((sum, payroll) => sum + payroll.netPay, 0);
  const approvedCount = payrolls.filter(payroll => payroll.status === 'Approved' || payroll.status === 'Paid').length;
  const isAllApproved = approvedCount === totalEmployees;

  // Generate months list (only up to current month for current year, all months for past years)
  const allMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const getAvailableMonths = () => {
    const currentMonthIndex = currentDate.getMonth(); // 0-based index
    const selectedYearNum = parseInt(selectedYear);
    const currentYearNum = currentDate.getFullYear();
    
    if (selectedYearNum === currentYearNum) {
      // For current year, only show months up to current month
      return allMonths.slice(0, currentMonthIndex + 1);
    } else if (selectedYearNum < currentYearNum) {
      // For past years, show all months
      return allMonths;
    } else {
      // For future years, show no months (shouldn't happen with our year filter)
      return [];
    }
  };
  
  const months = getAvailableMonths();
  
  // Generate years list (from 2020 to current year, no future years)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 2020;
    const years = [];
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year.toString());
    }
    return years;
  };
  
  const years = generateYears();

  const handleLoadPayrolls = () => {
    setCurrentPage(1);
    refetch();
  };
  
  const handleYearChange = (newYear) => {
    setSelectedYear(newYear);
    
    // If changing to current year and selected month is not available, reset to current month
    const newYearNum = parseInt(newYear);
    const currentYearNum = currentDate.getFullYear();
    const currentMonthIndex = currentDate.getMonth();
    const selectedMonthIndex = allMonths.indexOf(selectedMonth);
    
    if (newYearNum === currentYearNum && selectedMonthIndex > currentMonthIndex) {
      // Selected month is in the future for current year, reset to current month
      setSelectedMonth(currentMonth);
    }
  };

  const handleExportAll = async () => {
    try {
      const blob = await exportPayroll({
        start_month: monthNumber,
        start_year: yearNumber,
        end_month: monthNumber,
        end_year: yearNumber
      }).unwrap();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payroll_${selectedMonth}_${selectedYear}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export payroll data');
    }
  };

  const handleCalculateAll = async () => {
    if (isCalculating) return;
    
    setIsCalculating(true);
    try {
      const activeEmployees = employeesData.filter(emp => emp.is_active);
      
      if (activeEmployees.length === 0) {
        alert('No active employees found');
        return;
      }

      // Create payroll for each active employee
      const promises = activeEmployees.map(employee => 
        createPayroll({
          employee_id: employee.id,
          month: monthNumber,
          year: yearNumber,
          hourly_rate: employee.hourly_rate || "25.00",
          overtime_rate: employee.overtime_rate || "37.50",
          deductions: employee.deductions || "1000.00"
        })
      );

      await Promise.all(promises);
      alert(`Successfully calculated payroll for ${activeEmployees.length} employees`);
      refetch();
    } catch (error) {
      console.error('Calculate all failed:', error);
      alert('Failed to calculate payrolls');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleApproveAll = async () => {
    if (isApproving) return;
    
    const unapprovedPayrolls = payrolls.filter(p => p.status === 'Pending');
    
    if (unapprovedPayrolls.length === 0) {
      alert('No payrolls to approve');
      return;
    }

    if (!confirm(`Are you sure you want to approve ${unapprovedPayrolls.length} payrolls?`)) {
      return;
    }

    setIsApproving(true);
    try {
      const promises = unapprovedPayrolls.map(payroll => 
        approvePayroll(payroll.payrollId)
      );

      await Promise.all(promises);
      alert(`Successfully approved ${unapprovedPayrolls.length} payrolls`);
      refetch();
    } catch (error) {
      console.error('Approve all failed:', error);
      alert('Failed to approve payrolls');
    } finally {
      setIsApproving(false);
    }
  };

  const handleMarkAllPaid = async () => {
    if (isMarkingPaid) return;
    
    const approvedPayrolls = payrolls.filter(p => p.status === 'Approved');
    
    if (approvedPayrolls.length === 0) {
      alert('No approved payrolls to mark as paid');
      return;
    }

    if (!confirm(`Are you sure you want to mark ${approvedPayrolls.length} payrolls as paid?`)) {
      return;
    }

    setIsMarkingPaid(true);
    try {
      const promises = approvedPayrolls.map(payroll => 
        markPayrollPaid(payroll.payrollId)
      );

      await Promise.all(promises);
      alert(`Successfully marked ${approvedPayrolls.length} payrolls as paid`);
      refetch();
    } catch (error) {
      console.error('Mark all paid failed:', error);
      alert('Failed to mark payrolls as paid');
    } finally {
      setIsMarkingPaid(false);
    }
  };

  // Show loading state
  if (payrollsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payroll data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (payrollsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Payroll Data</h3>
          <p className="text-gray-600 mb-4">Failed to load payroll data. Please try again.</p>
          <button
            onClick={() => refetch()}
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
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Payroll Management</h1>
            {selectedMonth === currentMonth && selectedYear === currentYear && (
              <div className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                Current Month
              </div>
            )}
          </div>
          
          {/* Payroll Period Selection */}
          <Card title="Select Payroll Period">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing payroll data for <strong>{selectedMonth} {selectedYear}</strong>
                {selectedMonth === currentMonth && selectedYear === currentYear && (
                  <span className="ml-2 text-blue-600 font-medium">(Current Month)</span>
                )}
              </p>
            </div>
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
                    onChange={(e) => handleYearChange(e.target.value)}
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
                disabled={isCalculating}
                className="flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {isCalculating ? 'Calculating...' : 'Calculate All Payrolls'}
              </button>
              
              <button
                onClick={handleApproveAll}
                disabled={isApproving}
                className="flex items-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {isApproving ? 'Approving...' : 'Approve All Payrolls'}
              </button>
              
              <button
                onClick={handleMarkAllPaid}
                disabled={isMarkingPaid}
                className="flex items-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                {isMarkingPaid ? 'Marking Paid...' : 'Mark All Paid'}
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
          <PayrollTable payrolls={currentPayrolls} onRefresh={refetch} />
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