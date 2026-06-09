import React, { useMemo, useState } from 'react';
import { Calculator, CheckCircle, Download, Wallet } from 'lucide-react';
import { PayrollTable } from '../../components/pages/payroll';
import DashboardWidgetCard from '../../components/pages/dashboard/DashboardWidgetCard/DashboardWidgetCard';
import {
  PAYROLL_GUIDE_STEPS,
  Pagination,
  ConfirmationDialog,
  LoadingScreen,
  PageInfoOverlay,
  PageTourButtons,
  usePageTour,
  dashboardToast,
} from '../../components/common';
import {
  useGetPayrollsQuery,
  useCalculatePayrollMutation,
  useApprovePayrollMutation,
  useMarkPayrollPaidMutation,
  useExportPayrollMutation,
} from '../../store/api/payrollApi';

const ACCENT = {
  blue: '#007AFF',
  green: '#34C759',
  orange: '#FF9500',
  purple: '#5856D6',
};

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const getMonthNumber = (monthName) => MONTHS.indexOf(monthName) + 1;

const PayrollManagement = () => {
  const { infoOpen, startTutorial, startInfo, closeInfo } = usePageTour(
    PAYROLL_GUIDE_STEPS,
    'payroll_tour_completed'
  );

  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[currentDate.getMonth()]);
  const [selectedYear, setSelectedYear] = useState(String(currentDate.getFullYear()));
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmAction, setConfirmAction] = useState(null);

  const monthNumber = getMonthNumber(selectedMonth);
  const yearNumber = parseInt(selectedYear, 10);
  const perPage = 10;

  const {
    data: payrollsData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPayrollsQuery({
    year: yearNumber,
    month: monthNumber,
    skip: (currentPage - 1) * perPage,
    limit: perPage,
  });

  const [calculatePayroll, { isLoading: isCalculating }] = useCalculatePayrollMutation();
  const [approvePayroll, { isLoading: isApproving }] = useApprovePayrollMutation();
  const [markPayrollPaid, { isLoading: isMarkingPaid }] = useMarkPayrollPaidMutation();
  const [exportPayroll, { isLoading: isExporting }] = useExportPayrollMutation();

  const payrolls = useMemo(
    () =>
      (payrollsData || []).map((p) => ({
        id: p.employee_id || p.id,
        payrollId: p.id,
        name: p.employee_name || p.name,
        grossPay: p.gross_pay ?? p.salary ?? 0,
        deductions: p.deductions ?? 0,
        netPay: p.net_pay ?? p.net_salary ?? 0,
        status: p.status ? p.status.charAt(0).toUpperCase() + p.status.slice(1) : 'Pending',
        photo: null,
      })),
    [payrollsData]
  );

  const filteredPayrolls = payrolls.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(p.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalGross = payrolls.reduce((s, p) => s + p.grossPay, 0);
  const totalDeductions = payrolls.reduce((s, p) => s + p.deductions, 0);
  const totalNet = payrolls.reduce((s, p) => s + p.netPay, 0);
  const approvedCount = payrolls.filter(
    (p) => p.status === 'Approved' || p.status === 'Paid'
  ).length;

  const years = useMemo(() => {
    const y = currentDate.getFullYear();
    return Array.from({ length: y - 2019 }, (_, i) => String(y - i));
  }, [currentDate]);

  const handleCalculate = async () => {
    try {
      await calculatePayroll({ year: yearNumber, month: monthNumber }).unwrap();
      dashboardToast.success(
        `Payroll calculated for ${selectedMonth} ${selectedYear}.`,
        'Calculation complete'
      );
      refetch();
    } catch (err) {
      dashboardToast.error(
        err?.data?.detail || 'Payroll calculation is not available yet.',
        'Calculation failed'
      );
    }
  };

  const handleApproveAll = async () => {
    const pending = payrolls.filter((p) => p.status === 'Pending' || p.status === 'Draft');
    try {
      await Promise.all(pending.map((p) => approvePayroll(p.payrollId).unwrap()));
      dashboardToast.success(`Approved ${pending.length} payroll runs.`, 'Payroll approved');
      refetch();
    } catch (err) {
      dashboardToast.error(err?.data?.detail || 'Failed to approve payrolls.', 'Approval failed');
    }
  };

  const handleMarkAllPaid = async () => {
    const approved = payrolls.filter((p) => p.status === 'Approved');
    try {
      await Promise.all(approved.map((p) => markPayrollPaid(p.payrollId).unwrap()));
      dashboardToast.success(`Marked ${approved.length} payroll runs as paid.`, 'Payment recorded');
      refetch();
    } catch (err) {
      dashboardToast.error(err?.data?.detail || 'Failed to mark payrolls as paid.', 'Update failed');
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportPayroll({ year: yearNumber, month: monthNumber }).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payroll_${selectedMonth}_${selectedYear}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      dashboardToast.success('Payroll CSV downloaded.', 'Export complete');
    } catch (err) {
      dashboardToast.error(err?.data?.detail || 'Export failed.', 'Export failed');
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading payroll..." />;
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">
            {error?.data?.detail || 'Failed to load payroll data. The payroll API may not be available yet.'}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-xl bg-[#007AFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0066DD]"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
          <p className="mt-1 text-sm text-gray-500">
            Calculate, review, and approve monthly payroll for your team.
          </p>
        </div>
        <PageTourButtons onTutorial={startTutorial} onInfo={startInfo} />
      </div>

      <div className="space-y-6">
        <div
          className="rounded-2xl border border-gray-200/60 bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
          data-tour="payroll-period"
        >
          <p className="mb-4 text-sm text-gray-600">
            Period: <strong>{selectedMonth} {selectedYear}</strong>
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="rounded-xl border border-gray-200/60 bg-white px-3.5 py-2.5 text-sm shadow-[0_2px_16px_rgba(0,0,0,0.04)] focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-500">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="rounded-xl border border-gray-200/60 bg-white px-3.5 py-2.5 text-sm shadow-[0_2px_16px_rgba(0,0,0,0.04)] focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => { setCurrentPage(1); refetch(); }}
              className="rounded-xl bg-[#007AFF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0066DD]"
            >
              Load
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" data-tour="payroll-stats">
          <DashboardWidgetCard
            title="Employees"
            stats={[
              { label: 'In period', value: payrolls.length, accent: ACCENT.blue },
              { label: 'Approved', value: approvedCount, accent: ACCENT.green },
            ]}
          />
          <DashboardWidgetCard
            title="Gross pay"
            stats={[{ label: 'Total', value: `$${totalGross.toLocaleString()}`, accent: ACCENT.purple }]}
          />
          <DashboardWidgetCard
            title="Deductions"
            stats={[{ label: 'Total', value: `$${totalDeductions.toLocaleString()}`, accent: ACCENT.orange }]}
          />
          <DashboardWidgetCard
            title="Net pay"
            stats={[{ label: 'Total', value: `$${totalNet.toLocaleString()}`, accent: ACCENT.green }]}
          />
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between" data-tour="payroll-actions">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCalculate}
              disabled={isCalculating}
              className="inline-flex items-center gap-2 rounded-xl bg-[#007AFF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0066DD] disabled:opacity-50"
            >
              <Calculator className="h-4 w-4" />
              {isCalculating ? 'Calculating...' : 'Calculate payroll'}
            </button>
            <button
              type="button"
              onClick={() => setConfirmAction('approve')}
              disabled={isApproving}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200/60 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <CheckCircle className="h-4 w-4" />
              Approve all
            </button>
            <button
              type="button"
              onClick={() => setConfirmAction('paid')}
              disabled={isMarkingPaid}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200/60 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <Wallet className="h-4 w-4" />
              Mark all paid
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200/60 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
          <input
            type="search"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-xs rounded-xl border border-gray-200/60 bg-white px-3.5 py-2.5 text-sm shadow-[0_2px_16px_rgba(0,0,0,0.04)] focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 lg:w-64"
          />
        </div>

        <div data-tour="payroll-table">
          <PayrollTable payrolls={filteredPayrolls} onRefresh={refetch} />
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={Math.max(1, Math.ceil(filteredPayrolls.length / perPage))}
          onPageChange={setCurrentPage}
        />
      </div>

      <ConfirmationDialog
        isOpen={confirmAction === 'approve'}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          setConfirmAction(null);
          handleApproveAll();
        }}
        title="Approve all payrolls?"
        message="This will approve all pending payroll runs for the selected period."
        confirmText="Approve all"
      />

      <ConfirmationDialog
        isOpen={confirmAction === 'paid'}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          setConfirmAction(null);
          handleMarkAllPaid();
        }}
        title="Mark all as paid?"
        message="This will mark all approved payroll runs as paid for the selected period."
        confirmText="Mark all paid"
      />

      {infoOpen && (
        <PageInfoOverlay steps={PAYROLL_GUIDE_STEPS} onClose={closeInfo} pageLabel="Payment" />
      )}
    </div>
  );
};

export default PayrollManagement;
