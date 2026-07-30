import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Gift, Plus, Scale, Wallet } from 'lucide-react';
import {
  PaymentToolbar,
  ALL_PERIODS,
  PaymentStatsRow,
  PaymentTable,
  AdvanceTable,
  BonusTable,
  BalanceTable,
  BalanceLedgerTable,
  OutstandingPanel,
} from '../../components/pages/payment';
import { formatMoney } from '../../components/pages/payment/paymentUtils';
import { DASHBOARD_BTN_PRIMARY, DASHBOARD_BTN_SECONDARY } from '../../components/pages/dashboard';
import {
  PAYROLL_GUIDE_STEPS_BY_LANG,
  PAYROLL_PAGE_LABELS,
  Pagination,
  LoadingScreen,
  LottieLoader,
  PageInfoOverlay,
  PageTourButtons,
  usePageTour,
  dashboardToast,
  ButtonSpinner,
} from '../../components/common';
import { getApiErrorMessage } from '../../utils/apiError';
import { getMonthNumber, PER_PAGE, HISTORY_PER_PAGE } from './payrollUtils';
import { usePayrollQueries } from './usePayrollQueries';
import PayrollModals from './PayrollModals';

const PayrollManagement = () => {
  const { infoOpen, startTutorial, startInfo, closeInfo, steps, pageLabel, language } = usePageTour(
    PAYROLL_GUIDE_STEPS_BY_LANG,
    'payroll_tour_completed',
    PAYROLL_PAGE_LABELS
  );

  const currentDate = new Date();
  const [activeTab, setActiveTab] = useState('ledger');
  const [selectedMonth, setSelectedMonth] = useState(ALL_PERIODS);
  const [selectedYear, setSelectedYear] = useState(String(currentDate.getFullYear()));
  const [searchTerm, setSearchTerm] = useState('');
  const [ledgerEmployeeId, setLedgerEmployeeId] = useState(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [bonusStatusFilter, setBonusStatusFilter] = useState('');
  const [balanceFilter, setBalanceFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [prefillEmployee, setPrefillEmployee] = useState(null);
  const [createAdvanceOpen, setCreateAdvanceOpen] = useState(false);
  const [historyEmployee, setHistoryEmployee] = useState(null);
  const [historyPage, setHistoryPage] = useState(1);
  const [selectedAdvanceId, setSelectedAdvanceId] = useState(null);
  const [recoverAdvance, setRecoverAdvance] = useState(null);
  const [advanceToApprove, setAdvanceToApprove] = useState(null);
  const [paymentToMarkPaid, setPaymentToMarkPaid] = useState(null);
  const [balanceEmployee, setBalanceEmployee] = useState(null);
  const [bonusModalOpen, setBonusModalOpen] = useState(false);
  const [balanceHistoryEmployee, setBalanceHistoryEmployee] = useState(null);
  const [balanceHistoryPage, setBalanceHistoryPage] = useState(1);
  const [balanceLedgerPage, setBalanceLedgerPage] = useState(1);
  const [bonusToRelease, setBonusToRelease] = useState(null);
  const [selectedPaymentIds, setSelectedPaymentIds] = useState([]);
  const [isApprovingSelected, setIsApprovingSelected] = useState(false);

  const monthNumber = getMonthNumber(selectedMonth);
  const yearNumber = parseInt(selectedYear, 10);
  const isAllPeriods = selectedMonth === ALL_PERIODS;

  const years = useMemo(() => {
    const y = currentDate.getFullYear();
    return Array.from({ length: 5 }, (_, i) => String(y - 2 + i));
  }, [currentDate]);

  const needsEmployeeRoster =
    recordModalOpen || createAdvanceOpen || bonusModalOpen || Boolean(balanceEmployee);

  const {
    payrollPeriodStillOpen,
    paymentsLoading,
    summary,
    summaryLoading,
    monthlyGenerationStatus,
    monthlyGenerationDone,
    outstandingData,
    outstandingLoading,
    employeePhotoMap,
    employees,
    balancesFetching,
    balanceLedgerFetching,
    balanceHistoryData,
    balanceHistoryLoading,
    employeeSummary,
    summaryDetailLoading,
    historyData,
    historyLoading,
    advanceDetail,
    advanceDetailLoading,
    recordPayment,
    isRecording,
    generateMonthlySalaries,
    isGenerating,
    createAdvance,
    isCreatingAdvance,
    approveAdvance,
    isApproving,
    disburseAdvance,
    recoverAdvanceMutation,
    isRecovering,
    cancelAdvance,
    approvePayment,
    markPaymentPaid,
    isMarkingPaid,
    adjustBalance,
    isAdjustingBalance,
    createBonus,
    isCreatingBonus,
    releaseBonus,
    refreshAll,
    periodStats,
    filteredPayments,
    paymentRows,
    advanceRows,
    bonusRows,
    balanceRows,
    filteredLedger,
    balanceLedgerRows,
    filteredCounts,
    balancesTotalPages,
    balanceLedgerTotalPages,
    totalPages,
    historyTotal,
    historyTotalPages,
    balanceHistoryTotal,
    balanceHistoryTotalPages,
    isFetching,
    error,
    refetch,
    isInitialLedgerLoad,
    isTabContentLoading,
    isTabContentError,
  } = usePayrollQueries({
    activeTab,
    monthNumber,
    yearNumber,
    isAllPeriods,
    ledgerEmployeeId,
    typeFilter,
    statusFilter,
    paymentStatusFilter,
    bonusStatusFilter,
    balanceFilter,
    historyEmployee,
    historyPage,
    balanceHistoryEmployee,
    balanceHistoryPage,
    selectedAdvanceId,
    searchTerm,
    currentPage,
    balanceLedgerPage,
    needsEmployeeRoster,
  });

  const defaultPeriodStats = {
    paidTotal: 0,
    paidCount: 0,
    ledgerTotal: 0,
    ledgerCount: 0,
    pendingSalaryCount: 0,
    pendingSalaryTotal: 0,
    approvedSalaryCount: 0,
  };

  const defaultSummary = {
    paid_this_month: 0,
    payment_count_this_month: 0,
    outstanding_advance_total: 0,
    outstanding_advance_count: 0,
    pending_advance_count: 0,
    pending_salary_count: 0,
    unpaid_salary_total: 0,
  };

  const enrichEmployeeRow = (row) => {
    if (!row) return row;
    const empId = String(row.employee_id || row.id || '');
    const photos = employeePhotoMap.get(empId) || {};
    return {
      ...row,
      profilePhotoUrl: photos.profilePhotoUrl ?? row.profilePhotoUrl,
      photo: photos.photo ?? row.photo,
      avatar: photos.avatar ?? row.avatar,
    };
  };

  const periodLabel = isAllPeriods ? 'All periods' : `${selectedMonth} ${selectedYear}`;

  const approvablePaymentRows = useMemo(
    () =>
      filteredPayments.filter(
        (row) => row.status === 'pending' && row.payment_type === 'monthly_salary'
      ),
    [filteredPayments]
  );

  const approvablePaymentIds = useMemo(
    () => approvablePaymentRows.map((row) => row.id),
    [approvablePaymentRows]
  );

  const allApprovableSelected =
    approvablePaymentIds.length > 0 &&
    approvablePaymentIds.every((id) => selectedPaymentIds.includes(id));

  const someApprovableSelected = approvablePaymentIds.some((id) =>
    selectedPaymentIds.includes(id)
  );

  const selectedPaymentTotal = useMemo(
    () =>
      filteredPayments
        .filter((row) => selectedPaymentIds.includes(row.id))
        .reduce((sum, row) => sum + Number(row.amount || 0), 0),
    [filteredPayments, selectedPaymentIds]
  );

  const hasActiveFilters = Boolean(
    searchTerm ||
    ledgerEmployeeId ||
    typeFilter ||
    statusFilter ||
    paymentStatusFilter ||
    bonusStatusFilter ||
    balanceFilter
  );

  const clearFilters = () => {
    setSearchTerm('');
    setLedgerEmployeeId(null);
    setTypeFilter('');
    setStatusFilter('');
    setPaymentStatusFilter('');
    setBonusStatusFilter('');
    setBalanceFilter('');
    setCurrentPage(1);
    setBalanceLedgerPage(1);
    setSelectedPaymentIds([]);
  };

  useEffect(() => {
    setCurrentPage(1);
    setBalanceLedgerPage(1);
    setSelectedPaymentIds([]);
  }, [
    searchTerm,
    ledgerEmployeeId,
    typeFilter,
    statusFilter,
    paymentStatusFilter,
    bonusStatusFilter,
    balanceFilter,
    selectedMonth,
    selectedYear,
  ]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (balanceLedgerPage > balanceLedgerTotalPages) {
      setBalanceLedgerPage(balanceLedgerTotalPages);
    }
  }, [balanceLedgerPage, balanceLedgerTotalPages]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setBalanceLedgerPage(1);
    setSearchTerm('');
    setLedgerEmployeeId(null);
    setTypeFilter('');
    setStatusFilter('');
    setPaymentStatusFilter('');
    setBonusStatusFilter('');
    setBalanceFilter('');
    setSelectedPaymentIds([]);
  };

  const handleTogglePaymentSelection = (paymentId) => {
    setSelectedPaymentIds((prev) =>
      prev.includes(paymentId) ? prev.filter((id) => id !== paymentId) : [...prev, paymentId]
    );
  };

  const handleToggleSelectAllApprovable = () => {
    if (allApprovableSelected) {
      setSelectedPaymentIds((prev) =>
        prev.filter((id) => !approvablePaymentIds.includes(id))
      );
      return;
    }
    setSelectedPaymentIds((prev) => [...new Set([...prev, ...approvablePaymentIds])]);
  };

  const handleApproveSelected = async () => {
    if (selectedPaymentIds.length === 0) return;

    setIsApprovingSelected(true);
    let approvedCount = 0;
    try {
      for (const paymentId of selectedPaymentIds) {
        await approvePayment(paymentId).unwrap();
        approvedCount += 1;
      }
      setSelectedPaymentIds([]);
      dashboardToast.success(
        `Approved ${approvedCount} pending ${approvedCount === 1 ? 'salary' : 'salaries'} (${formatMoney(selectedPaymentTotal)}).`,
        'Payments approved'
      );
      refreshAll();
    } catch (err) {
      dashboardToast.error(
        getApiErrorMessage(
          err,
          approvedCount > 0
            ? `Approved ${approvedCount}, but some payments could not be approved.`
            : 'Could not approve selected payments.'
        ),
        'Approval failed'
      );
      if (approvedCount > 0) {
        setSelectedPaymentIds([]);
        refreshAll();
      }
    } finally {
      setIsApprovingSelected(false);
    }
  };

  const handleMarkPaid = async (payload) => {
    try {
      await markPaymentPaid(payload).unwrap();
      setPaymentToMarkPaid(null);
      dashboardToast.successAfterOverlay('Payment marked as paid.', 'Payment completed');
      refreshAll();
    } catch (err) {
      dashboardToast.error(
        getApiErrorMessage(err, 'Could not mark payment as paid.'),
        'Update failed'
      );
    }
  };

  const handleAdjustBalance = async (payload) => {
    try {
      await adjustBalance(payload).unwrap();
      setBalanceEmployee(null);
      dashboardToast.success('Balance adjustment recorded in the ledger.', 'Adjustment saved');
      if (balanceHistoryEmployee?.employee_id || balanceHistoryEmployee?.id) {
        setBalanceHistoryEmployee(null);
      }
      refreshAll();
    } catch (err) {
      dashboardToast.error(
        getApiErrorMessage(err, 'Could not update balance.'),
        'Balance failed'
      );
    }
  };

  const handleCreateBonus = async (payload) => {
    try {
      await createBonus(payload).unwrap();
      setBonusModalOpen(false);
      dashboardToast.successAfterOverlay('Bonus scheduled for the selected month.', 'Bonus scheduled');
      refreshAll();
    } catch (err) {
      dashboardToast.error(
        getApiErrorMessage(err, 'Could not schedule bonus.'),
        'Bonus failed'
      );
    }
  };

  const handleReleaseBonus = (bonus) => setBonusToRelease(bonus);

  const confirmReleaseBonus = async () => {
    if (!bonusToRelease) return;
    try {
      await releaseBonus(bonusToRelease.id).unwrap();
      setBonusToRelease(null);
      dashboardToast.success(
        `Released ${formatMoney(bonusToRelease.amount)} bonus for ${bonusToRelease.employee_name}.`,
        'Bonus released'
      );
      refreshAll();
    } catch (err) {
      dashboardToast.error(
        getApiErrorMessage(err, 'Could not release bonus.'),
        'Release failed'
      );
    }
  };

  const openBalanceAdjust = (row) =>
    setBalanceEmployee({
      id: row.employee_id || row.id,
      employee_id: row.employee_id || row.id,
      name: row.employee_name || row.name,
    });

  const handleOutstandingSelect = (row) => {
    setActiveTab('ledger');
    setLedgerEmployeeId(row.employee_id);
    setSearchTerm('');
    setTypeFilter('');
    setPaymentStatusFilter('');
    setCurrentPage(1);
    setSelectedPaymentIds([]);
  };

  const handleRecordPayment = async (payload) => {
    let saved = false;
    try {
      const result = await recordPayment(payload).unwrap();
      saved = true;
      const name = result?.employee_name || 'Employee';
      const amount = formatMoney(result?.amount ?? payload.amount ?? 0);
      setRecordModalOpen(false);
      setPrefillEmployee(null);
      dashboardToast.success(`Recorded ${amount} for ${name}.`, 'Payment saved');
      refreshAll();
    } catch (err) {
      if (!saved) {
        const status = err?.status;
        const message = getApiErrorMessage(
          err,
          status === 409
            ? 'Salary for this month is already recorded.'
            : 'Could not record payment. Please try again.'
        );
        dashboardToast.error(message, 'Record failed');
        throw err;
      }
    }
  };

  const handleGenerateMonthlySalaries = async () => {
    if (isAllPeriods || !monthNumber) {
      dashboardToast.error(
        'Select a specific payroll month before generating salaries.',
        'Choose a month'
      );
      return;
    }
    try {
      const result = await generateMonthlySalaries({
        period_year: yearNumber,
        period_month: monthNumber,
      }).unwrap();
      if (result.created_count > 0) {
        dashboardToast.success(
          `Recorded ${result.created_count} monthly ${result.created_count === 1 ? 'salary' : 'salaries'} for ${selectedMonth} ${selectedYear}.`,
          'Salaries generated'
        );
      } else {
        dashboardToast.info(
          `All eligible employees already have salary recorded for ${selectedMonth} ${selectedYear}.`,
          'Nothing to add'
        );
      }
      refreshAll();
    } catch (err) {
      dashboardToast.error(
        getApiErrorMessage(err, 'Could not generate monthly salaries. Please try again.'),
        'Generation failed'
      );
    }
  };

  const handleCreateAdvance = async (payload) => {
    let saved = false;
    try {
      await createAdvance(payload).unwrap();
      saved = true;
      setCreateAdvanceOpen(false);
      setActiveTab('advances');
      setCurrentPage(1);
      dashboardToast.successAfterOverlay('Advance request submitted.', 'Advance created');
      refreshAll();
    } catch (err) {
      if (!saved) {
        dashboardToast.error(
          getApiErrorMessage(err, 'Could not create advance. Please try again.'),
          'Request failed'
        );
        throw err;
      }
    }
  };

  const handleRecoverAdvance = async (payload) => {
    let saved = false;
    try {
      await recoverAdvanceMutation(payload).unwrap();
      saved = true;
      setRecoverAdvance(null);
      setSelectedAdvanceId(null);
      dashboardToast.success('Recovery recorded successfully.', 'Recovery saved');
      refreshAll();
    } catch (err) {
      if (!saved) {
        dashboardToast.error(
          getApiErrorMessage(err, 'Could not record recovery. Please try again.'),
          'Recovery failed'
        );
        throw err;
      }
    }
  };

  const runAdvanceAction = async (action, advance, successMessage, successTitle, onSuccess) => {
    let saved = false;
    try {
      await action(advance.id).unwrap();
      saved = true;
      onSuccess?.();
      dashboardToast.success(successMessage, successTitle);
      refreshAll();
      return true;
    } catch (err) {
      if (!saved) {
        dashboardToast.error(
          getApiErrorMessage(err, 'This action is not allowed in the current status.'),
          'Action failed'
        );
      }
      return false;
    }
  };

  const handleApproveAdvance = (advance) => {
    setAdvanceToApprove(advance);
  };

  const handleCloseApproveConfirm = () => {
    if (!isApproving) setAdvanceToApprove(null);
  };

  const confirmApproveAdvance = async () => {
    if (!advanceToApprove) return;
    const advance = advanceToApprove;
    await runAdvanceAction(
      approveAdvance,
      advance,
      `Approved ${advance.employee_name}'s advance of ${formatMoney(advance.amount)}.`,
      'Advance approved',
      () => setAdvanceToApprove(null)
    );
  };

  const handleDisburseAdvance = (advance) =>
    runAdvanceAction(
      disburseAdvance,
      advance,
      `Disbursed ${formatMoney(advance.amount)} to ${advance.employee_name}.`,
      'Advance disbursed'
    );

  const handleCancelAdvance = (advance) =>
    runAdvanceAction(
      cancelAdvance,
      advance,
      `Cancelled advance request for ${advance.employee_name}.`,
      'Advance cancelled'
    );

  if (isInitialLedgerLoad) {
    return <LoadingScreen message="Loading payments..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
          <p className="mt-1 text-sm text-gray-500">
            Full payment ledger with amounts paid, plus advances, bonuses, and balances.{' '}
            Use <span className="font-medium text-gray-700">All periods</span> to list every
            payment, or pick a payroll month to focus one salary cycle.{' '}
            <Link to="/admin/salary" className="font-medium text-[#007AFF] hover:underline">
              Salary setup
            </Link>
          </p>
        </div>
        <PageTourButtons onTutorial={startTutorial} onInfo={startInfo} />
      </div>

      <div className="mb-6 space-y-4">
        <PaymentStatsRow
          summary={summary || defaultSummary}
          periodStats={periodStats || defaultPeriodStats}
          periodLabel={periodLabel}
          loading={summaryLoading || paymentsLoading}
        />
        <OutstandingPanel
          items={outstandingData?.items || []}
          loading={outstandingLoading}
          photoMap={employeePhotoMap}
          onSelectEmployee={handleOutstandingSelect}
        />
      </div>

      <div className="mb-6">
        <PaymentToolbar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={(m) => {
            setSelectedMonth(m);
            setCurrentPage(1);
            setSelectedPaymentIds([]);
          }}
          onYearChange={(y) => {
            setSelectedYear(y);
            setCurrentPage(1);
            setSelectedPaymentIds([]);
          }}
          years={years}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          typeFilter={typeFilter}
          onTypeFilterChange={(v) => {
            setTypeFilter(v);
            setCurrentPage(1);
            setSelectedPaymentIds([]);
          }}
          statusFilter={statusFilter}
          onStatusFilterChange={(v) => {
            setStatusFilter(v);
            setCurrentPage(1);
          }}
          paymentStatusFilter={paymentStatusFilter}
          onPaymentStatusFilterChange={(v) => {
            setPaymentStatusFilter(v);
            setCurrentPage(1);
            setSelectedPaymentIds([]);
          }}
          bonusStatusFilter={bonusStatusFilter}
          onBonusStatusFilterChange={(v) => {
            setBonusStatusFilter(v);
            setCurrentPage(1);
          }}
          balanceFilter={balanceFilter}
          onBalanceFilterChange={(v) => {
            setBalanceFilter(v);
            setCurrentPage(1);
            setBalanceLedgerPage(1);
          }}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
          actions={
            activeTab === 'ledger' ? (
              <>
                <button
                  type="button"
                  onClick={handleGenerateMonthlySalaries}
                  disabled={
                    isGenerating ||
                    isAllPeriods ||
                    !monthNumber ||
                    monthlyGenerationDone ||
                    payrollPeriodStillOpen
                  }
                  title={
                    isAllPeriods || !monthNumber
                      ? 'Select a specific payroll month to generate salaries'
                      : payrollPeriodStillOpen
                        ? `Salary for ${selectedMonth} ${selectedYear} can be generated after the month ends`
                        : monthlyGenerationDone
                          ? monthlyGenerationStatus?.eligible_count === 0
                            ? 'No active employees with salary set for this period'
                            : `Monthly salaries already generated for ${selectedMonth} ${selectedYear}`
                          : undefined
                  }
                  className={`${DASHBOARD_BTN_SECONDARY} inline-flex items-center gap-2`}
                >
                  {isGenerating ? (
                    <ButtonSpinner size="sm" />
                  ) : (
                    <CalendarCheck className="h-4 w-4" strokeWidth={2} />
                  )}
                  {isGenerating
                    ? 'Generating…'
                    : monthlyGenerationDone
                      ? 'Salaries generated'
                      : 'Generate monthly salaries'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPrefillEmployee(null);
                    setRecordModalOpen(true);
                  }}
                  className={DASHBOARD_BTN_PRIMARY}
                >
                  <Plus className="h-4 w-4" strokeWidth={2} />
                  Record payment
                </button>
              </>
            ) : activeTab === 'advances' ? (
              <button
                type="button"
                onClick={() => setCreateAdvanceOpen(true)}
                className={DASHBOARD_BTN_PRIMARY}
              >
                <Wallet className="h-4 w-4" strokeWidth={2} />
                Request advance
              </button>
            ) : activeTab === 'bonuses' ? (
              <button
                type="button"
                onClick={() => setBonusModalOpen(true)}
                className={DASHBOARD_BTN_PRIMARY}
              >
                <Gift className="h-4 w-4" strokeWidth={2} />
                Schedule bonus
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setBalanceEmployee({})}
                className={DASHBOARD_BTN_PRIMARY}
              >
                <Scale className="h-4 w-4" strokeWidth={2} />
                Adjust balance
              </button>
            )
          }
        />
      </div>

      <div className="space-y-6">
        {isTabContentLoading ? (
          <div className="flex justify-center py-16">
            <LottieLoader size={48} label="Loading..." centered />
          </div>
        ) : isTabContentError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-700">
              {getApiErrorMessage(error, 'Failed to load payment data.')}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className={`mt-4 ${DASHBOARD_BTN_PRIMARY}`}
            >
              Try again
            </button>
          </div>
        ) : (
          <>
        {activeTab === 'ledger' && (
          <PaymentTable
            rows={paymentRows}
            totalCount={filteredCounts.ledger}
            isFetching={isFetching}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            selectedIds={selectedPaymentIds}
            onToggleRow={handleTogglePaymentSelection}
            onToggleSelectAll={handleToggleSelectAllApprovable}
            allApprovableSelected={allApprovableSelected}
            someApprovableSelected={someApprovableSelected}
            approvableCount={approvablePaymentIds.length}
            selectedCount={selectedPaymentIds.length}
            selectedTotal={selectedPaymentTotal}
            onApproveSelected={handleApproveSelected}
            isApprovingSelected={isApprovingSelected}
            onHistory={(row) => {
              setHistoryEmployee(enrichEmployeeRow(row));
              setHistoryPage(1);
            }}
            onRecord={(row) => {
              setPrefillEmployee(row);
              setRecordModalOpen(true);
            }}
            onMarkPaid={(row) => setPaymentToMarkPaid(row)}
          />
        )}

        {activeTab === 'advances' && (
          <AdvanceTable
            rows={advanceRows}
            totalCount={filteredCounts.advances}
            isFetching={isFetching}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            onView={(row) => setSelectedAdvanceId(row.id)}
            onApprove={handleApproveAdvance}
          />
        )}

        {activeTab === 'bonuses' && (
          <BonusTable
            rows={bonusRows}
            totalCount={filteredCounts.bonuses}
            isFetching={isFetching}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            onRelease={handleReleaseBonus}
          />
        )}

        {activeTab === 'balance' && (
          <div className="space-y-4">
            <BalanceTable
              rows={balanceRows}
              totalCount={filteredCounts.balance}
              isFetching={balancesFetching}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={clearFilters}
              onHistory={(row) => {
                setBalanceHistoryEmployee(enrichEmployeeRow(row));
                setBalanceHistoryPage(1);
              }}
              onAdjust={openBalanceAdjust}
            />
            {filteredCounts.balance > PER_PAGE && (
              <Pagination
                currentPage={currentPage}
                totalPages={balancesTotalPages}
                totalItems={filteredCounts.balance}
                itemsPerPage={PER_PAGE}
                onPageChange={setCurrentPage}
              />
            )}
            <BalanceLedgerTable
              rows={balanceLedgerRows}
              totalCount={filteredLedger.length}
              isFetching={balanceLedgerFetching}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={clearFilters}
              onSelectEmployee={(row) => {
                setBalanceHistoryEmployee(
                  enrichEmployeeRow({
                    id: row.employee_id,
                    employee_id: row.employee_id,
                    employee_name: row.employee_name,
                    employee_code: row.employee_code,
                    name: row.employee_name,
                  })
                );
                setBalanceHistoryPage(1);
              }}
            />
            {filteredLedger.length > PER_PAGE && (
              <Pagination
                currentPage={balanceLedgerPage}
                totalPages={balanceLedgerTotalPages}
                totalItems={filteredLedger.length}
                itemsPerPage={PER_PAGE}
                onPageChange={setBalanceLedgerPage}
              />
            )}
          </div>
        )}

        {activeTab !== 'balance' && filteredCounts[activeTab] > PER_PAGE && (
          <div className="pt-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredCounts[activeTab]}
              itemsPerPage={PER_PAGE}
              onPageChange={(page) => {
                setCurrentPage(page);
                if (activeTab === 'ledger') setSelectedPaymentIds([]);
              }}
            />
          </div>
        )}
          </>
        )}
      </div>

      <PayrollModals
        recordModalOpen={recordModalOpen}
        onCloseRecordModal={() => {
          setRecordModalOpen(false);
          setPrefillEmployee(null);
        }}
        handleRecordPayment={handleRecordPayment}
        isRecording={isRecording}
        employees={employees}
        prefillEmployee={prefillEmployee}
        yearNumber={yearNumber}
        monthNumber={monthNumber}
        createAdvanceOpen={createAdvanceOpen}
        onCloseCreateAdvance={() => setCreateAdvanceOpen(false)}
        handleCreateAdvance={handleCreateAdvance}
        isCreatingAdvance={isCreatingAdvance}
        recoverAdvance={recoverAdvance}
        onCloseRecoverAdvance={() => setRecoverAdvance(null)}
        handleRecoverAdvance={handleRecoverAdvance}
        isRecovering={isRecovering}
        historyEmployee={historyEmployee}
        onCloseHistory={() => setHistoryEmployee(null)}
        employeeSummary={employeeSummary}
        historyData={historyData}
        historyLoading={historyLoading}
        summaryDetailLoading={summaryDetailLoading}
        historyPage={historyPage}
        setHistoryPage={setHistoryPage}
        historyTotalPages={historyTotalPages}
        historyTotal={historyTotal}
        onAdjustBalanceFromHistory={(emp) =>
          setBalanceEmployee({
            id: emp.employee_id || emp.id,
            name: emp.employee_name || emp.name,
          })
        }
        selectedAdvanceId={selectedAdvanceId}
        advanceDetail={advanceDetail}
        advanceDetailLoading={advanceDetailLoading}
        onCloseAdvanceDetail={() => setSelectedAdvanceId(null)}
        handleApproveAdvance={handleApproveAdvance}
        handleDisburseAdvance={handleDisburseAdvance}
        handleCancelAdvance={handleCancelAdvance}
        onRecoverFromDetail={(adv) => {
          setSelectedAdvanceId(null);
          setRecoverAdvance(adv);
        }}
        paymentToMarkPaid={paymentToMarkPaid}
        onCloseMarkPaid={() => setPaymentToMarkPaid(null)}
        handleMarkPaid={handleMarkPaid}
        isMarkingPaid={isMarkingPaid}
        balanceEmployee={balanceEmployee}
        onCloseBalanceAdjust={() => setBalanceEmployee(null)}
        handleAdjustBalance={handleAdjustBalance}
        isAdjustingBalance={isAdjustingBalance}
        bonusModalOpen={bonusModalOpen}
        onCloseBonusModal={() => setBonusModalOpen(false)}
        handleCreateBonus={handleCreateBonus}
        isCreatingBonus={isCreatingBonus}
        balanceHistoryEmployee={balanceHistoryEmployee}
        onCloseBalanceHistory={() => setBalanceHistoryEmployee(null)}
        balanceHistoryData={balanceHistoryData}
        balanceHistoryLoading={balanceHistoryLoading}
        balanceHistoryPage={balanceHistoryPage}
        setBalanceHistoryPage={setBalanceHistoryPage}
        balanceHistoryTotalPages={balanceHistoryTotalPages}
        balanceHistoryTotal={balanceHistoryTotal}
        onAdjustFromBalanceHistory={(emp) => {
          setBalanceHistoryEmployee(null);
          openBalanceAdjust(emp);
        }}
        advanceToApprove={advanceToApprove}
        handleCloseApproveConfirm={handleCloseApproveConfirm}
        confirmApproveAdvance={confirmApproveAdvance}
        isApproving={isApproving}
        bonusToRelease={bonusToRelease}
        onCloseReleaseBonus={() => setBonusToRelease(null)}
        confirmReleaseBonus={confirmReleaseBonus}
      />

      {infoOpen && (
        <PageInfoOverlay
          steps={steps}
          onClose={closeInfo}
          pageLabel={pageLabel || 'Payment'}
          language={language}
        />
      )}
    </div>
  );
};

export default PayrollManagement;
