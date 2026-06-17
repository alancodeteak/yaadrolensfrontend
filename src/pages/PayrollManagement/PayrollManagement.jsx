import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Gift, Plus, Scale, Wallet } from 'lucide-react';
import {
  PaymentToolbar,
  MONTHS,
  getMonthDateRange,
  PaymentStatsRow,
  PaymentTable,
  AdvanceTable,
  BonusTable,
  BalanceTable,
  BalanceLedgerTable,
  PaymentRecordModal,
  AdvanceCreateModal,
  AdvanceRecoverModal,
  PaymentHistoryPanel,
  BalanceHistoryPanel,
  AdvanceDetailPanel,
  PaymentMarkPaidModal,
  BalanceAdjustModal,
  BonusCreateModal,
  OutstandingPanel,
} from '../../components/pages/payment';
import { formatMoney } from '../../components/pages/payment/paymentUtils';
import { DASHBOARD_BTN_PRIMARY, DASHBOARD_BTN_SECONDARY } from '../../components/pages/dashboard';
import {
  PAYROLL_GUIDE_STEPS,
  Pagination,
  LoadingScreen,
  LottieLoader,
  PageInfoOverlay,
  PageTourButtons,
  usePageTour,
  dashboardToast,
  ButtonSpinner,
  ConfirmationDialog,
} from '../../components/common';
import {
  useGetPaymentsQuery,
  useGetPaymentSummaryQuery,
  useGetMonthlyGenerationStatusQuery,
  useRecordPaymentMutation,
  useGetEmployeePaymentSummaryQuery,
  useGetEmployeePaymentHistoryQuery,
  useGetAdvancesQuery,
  useCreateAdvanceMutation,
  useGetAdvanceQuery,
  useApproveAdvanceMutation,
  useDisburseAdvanceMutation,
  useRecoverAdvanceMutation,
  useCancelAdvanceMutation,
  useGenerateMonthlySalariesMutation,
  useRunScheduledSalariesMutation,
  useGetEmployeesQuery,
  useGetOutstandingEmployeesQuery,
  useGetSettingsQuery,
  useApprovePaymentMutation,
  useMarkPaymentPaidMutation,
  useAdjustEmployeeBalanceMutation,
  useCreateBonusMutation,
  useGetBonusesQuery,
  useReleaseBonusMutation,
  useGetEmployeeBalancesQuery,
  useGetBalanceTransactionsQuery,
  useGetBalanceLedgerQuery,
} from '../../store/api';
import { isPayrollPeriodOpen } from '../../store/api/transforms';
import {
  buildEmployeePhotoMap,
  computePeriodPaymentStats,
  enrichRowsWithPhotos,
  filterPaymentRows,
  paginateRows,
} from '../../utils/paymentListUtils';

const PER_PAGE = 10;
const HISTORY_PER_PAGE = 10;
/** Backend payment/employee list endpoints cap limit at 200 (le=200). */
const FETCH_LIMIT = 200;

const getMonthNumber = (monthName) => MONTHS.indexOf(monthName) + 1;

const getErrorMessage = (err, fallback) => {
  const detail = err?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map((d) => d.msg || d).join(', ');
  return fallback;
};

const PayrollManagement = () => {
  const { infoOpen, startTutorial, startInfo, closeInfo } = usePageTour(
    PAYROLL_GUIDE_STEPS,
    'payroll_tour_completed'
  );

  const currentDate = new Date();
  const [activeTab, setActiveTab] = useState('ledger');
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[currentDate.getMonth()]);
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
  const { data: orgSettings } = useGetSettingsQuery();
  const payrollPeriodStillOpen = useMemo(
    () => isPayrollPeriodOpen(yearNumber, monthNumber, orgSettings?.timezone ?? 'UTC'),
    [yearNumber, monthNumber, orgSettings?.timezone]
  );
  const monthDateRange = useMemo(
    () => getMonthDateRange(yearNumber, monthNumber),
    [yearNumber, monthNumber]
  );

  const years = useMemo(() => {
    const y = currentDate.getFullYear();
    return Array.from({ length: 5 }, (_, i) => String(y - 2 + i));
  }, [currentDate]);

  const {
    data: paymentsData,
    isLoading: paymentsLoading,
    isFetching: paymentsFetching,
    isError: paymentsError,
    error: paymentsErr,
    refetch: refetchPayments,
  } = useGetPaymentsQuery(
    {
      start_date: monthDateRange.start_date,
      end_date: monthDateRange.end_date,
      payment_type: typeFilter || undefined,
      status: paymentStatusFilter || undefined,
      employee_id: ledgerEmployeeId || undefined,
      skip: 0,
      limit: FETCH_LIMIT,
    },
    { skip: activeTab !== 'ledger' }
  );

  const {
    data: summary,
    isLoading: summaryLoading,
    refetch: refetchSummary,
  } = useGetPaymentSummaryQuery();

  const { data: monthlyGenerationStatus } = useGetMonthlyGenerationStatusQuery(
    { period_year: yearNumber, period_month: monthNumber },
    { skip: activeTab !== 'ledger' }
  );

  const monthlyGenerationDone =
    monthlyGenerationStatus != null && !monthlyGenerationStatus.can_generate;

  const { data: outstandingData, isLoading: outstandingLoading } =
    useGetOutstandingEmployeesQuery();

  const {
    data: advancesData,
    isLoading: advancesLoading,
    isFetching: advancesFetching,
    isError: advancesError,
    error: advancesErr,
    refetch: refetchAdvances,
  } = useGetAdvancesQuery(
    {
      status: statusFilter || undefined,
      skip: 0,
      limit: FETCH_LIMIT,
    },
    { skip: activeTab !== 'advances' }
  );

  const { data: employeesData } = useGetEmployeesQuery({ page: 1, limit: FETCH_LIMIT });
  const employeePhotoMap = useMemo(
    () => buildEmployeePhotoMap(employeesData?.items ?? []),
    [employeesData]
  );
  const employees = useMemo(
    () => (employeesData?.items ?? []).filter((employee) => employee.is_active),
    [employeesData]
  );

  const [recordPayment, { isLoading: isRecording }] = useRecordPaymentMutation();
  const [generateMonthlySalaries, { isLoading: isGenerating }] =
    useGenerateMonthlySalariesMutation();
  const [runScheduledSalaries] = useRunScheduledSalariesMutation();
  const scheduledRunRef = useRef(false);
  const [createAdvance, { isLoading: isCreatingAdvance }] = useCreateAdvanceMutation();
  const [approveAdvance, { isLoading: isApproving }] = useApproveAdvanceMutation();
  const [disburseAdvance] = useDisburseAdvanceMutation();
  const [recoverAdvanceMutation, { isLoading: isRecovering }] = useRecoverAdvanceMutation();
  const [cancelAdvance] = useCancelAdvanceMutation();
  const [approvePayment] = useApprovePaymentMutation();
  const [markPaymentPaid, { isLoading: isMarkingPaid }] = useMarkPaymentPaidMutation();
  const [adjustBalance, { isLoading: isAdjustingBalance }] = useAdjustEmployeeBalanceMutation();
  const [createBonus, { isLoading: isCreatingBonus }] = useCreateBonusMutation();
  const [releaseBonus] = useReleaseBonusMutation();
  const {
    data: bonusesData,
    isLoading: bonusesLoading,
    isFetching: bonusesFetching,
    isError: bonusesError,
    error: bonusesErr,
    refetch: refetchBonuses,
  } = useGetBonusesQuery(
    {
      period_year: yearNumber,
      period_month: monthNumber,
      status: bonusStatusFilter || undefined,
      skip: 0,
      limit: FETCH_LIMIT,
    },
    { skip: activeTab !== 'bonuses' }
  );

  const {
    data: balancesData,
    isLoading: balancesLoading,
    isFetching: balancesFetching,
    isError: balancesError,
    error: balancesErr,
    refetch: refetchBalances,
  } = useGetEmployeeBalancesQuery(
    {
      non_zero_only: balanceFilter === 'non_zero',
      skip: 0,
      limit: FETCH_LIMIT,
    },
    { skip: activeTab !== 'balance' }
  );

  const {
    data: balanceLedgerData,
    isLoading: balanceLedgerLoading,
    isFetching: balanceLedgerFetching,
    refetch: refetchBalanceLedger,
  } = useGetBalanceLedgerQuery(
    {
      skip: 0,
      limit: FETCH_LIMIT,
    },
    { skip: activeTab !== 'balance' }
  );

  const balanceHistoryEmployeeId =
    balanceHistoryEmployee?.employee_id || balanceHistoryEmployee?.id;
  const { data: balanceHistoryData, isLoading: balanceHistoryLoading } =
    useGetBalanceTransactionsQuery(
      {
        employeeId: balanceHistoryEmployeeId,
        skip: (balanceHistoryPage - 1) * HISTORY_PER_PAGE,
        limit: HISTORY_PER_PAGE,
      },
      { skip: !balanceHistoryEmployeeId }
    );

  const historyEmployeeId = historyEmployee?.employee_id || historyEmployee?.id;
  const { data: employeeSummary, isLoading: summaryDetailLoading } =
    useGetEmployeePaymentSummaryQuery(historyEmployeeId, { skip: !historyEmployeeId });
  const { data: historyData, isLoading: historyLoading } = useGetEmployeePaymentHistoryQuery(
    {
      employeeId: historyEmployeeId,
      skip: (historyPage - 1) * HISTORY_PER_PAGE,
      limit: HISTORY_PER_PAGE,
    },
    { skip: !historyEmployeeId }
  );

  const { data: advanceDetail, isLoading: advanceDetailLoading } = useGetAdvanceQuery(
    selectedAdvanceId,
    { skip: !selectedAdvanceId }
  );

  const defaultPeriodStats = {
    paidTotal: 0,
    paidCount: 0,
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

  const periodLabel = `${selectedMonth} ${selectedYear}`;

  const periodStats = useMemo(
    () => computePeriodPaymentStats(paymentsData?.items || []),
    [paymentsData]
  );

  const allPaymentItems = useMemo(
    () => enrichRowsWithPhotos(paymentsData?.items || [], employeePhotoMap),
    [paymentsData, employeePhotoMap]
  );
  const filteredPayments = useMemo(
    () => filterPaymentRows(allPaymentItems, searchTerm),
    [allPaymentItems, searchTerm]
  );
  const paymentRows = useMemo(
    () => paginateRows(filteredPayments, currentPage, PER_PAGE),
    [filteredPayments, currentPage]
  );

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

  const allAdvanceItems = useMemo(
    () => enrichRowsWithPhotos(advancesData?.items || [], employeePhotoMap),
    [advancesData, employeePhotoMap]
  );
  const filteredAdvances = useMemo(
    () => filterPaymentRows(allAdvanceItems, searchTerm),
    [allAdvanceItems, searchTerm]
  );
  const advanceRows = useMemo(
    () => paginateRows(filteredAdvances, currentPage, PER_PAGE),
    [filteredAdvances, currentPage]
  );

  const allBonusItems = useMemo(
    () => enrichRowsWithPhotos(bonusesData?.items || [], employeePhotoMap),
    [bonusesData, employeePhotoMap]
  );
  const filteredBonuses = useMemo(
    () => filterPaymentRows(allBonusItems, searchTerm),
    [allBonusItems, searchTerm]
  );
  const bonusRows = useMemo(
    () => paginateRows(filteredBonuses, currentPage, PER_PAGE),
    [filteredBonuses, currentPage]
  );

  const allBalanceItems = useMemo(
    () => enrichRowsWithPhotos(balancesData?.items || [], employeePhotoMap),
    [balancesData, employeePhotoMap]
  );
  const filteredBalances = useMemo(
    () => filterPaymentRows(allBalanceItems, searchTerm),
    [allBalanceItems, searchTerm]
  );
  const balanceRows = useMemo(
    () => paginateRows(filteredBalances, currentPage, PER_PAGE),
    [filteredBalances, currentPage]
  );

  const allLedgerItems = useMemo(
    () => enrichRowsWithPhotos(balanceLedgerData?.items || [], employeePhotoMap),
    [balanceLedgerData, employeePhotoMap]
  );
  const filteredLedger = useMemo(
    () => filterPaymentRows(allLedgerItems, searchTerm),
    [allLedgerItems, searchTerm]
  );
  const balanceLedgerRows = useMemo(
    () => paginateRows(filteredLedger, balanceLedgerPage, PER_PAGE),
    [filteredLedger, balanceLedgerPage]
  );

  const filteredCounts = {
    ledger: filteredPayments.length,
    advances: filteredAdvances.length,
    bonuses: filteredBonuses.length,
    balance: filteredBalances.length,
  };

  const ledgerTotalPages = Math.max(1, Math.ceil(filteredCounts.ledger / PER_PAGE));
  const advancesTotalPages = Math.max(1, Math.ceil(filteredCounts.advances / PER_PAGE));
  const bonusesTotalPages = Math.max(1, Math.ceil(filteredCounts.bonuses / PER_PAGE));
  const balancesTotalPages = Math.max(1, Math.ceil(filteredCounts.balance / PER_PAGE));
  const balanceLedgerTotalPages = Math.max(1, Math.ceil(filteredLedger.length / PER_PAGE));

  const tabTotalPages = {
    ledger: ledgerTotalPages,
    advances: advancesTotalPages,
    bonuses: bonusesTotalPages,
    balance: balancesTotalPages,
  };
  const totalPages = tabTotalPages[activeTab] || 1;

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

  const historyTotal = historyData?.total || 0;
  const historyTotalPages = Math.max(1, Math.ceil(historyTotal / HISTORY_PER_PAGE));

  const tabLoading = {
    ledger: paymentsLoading,
    advances: advancesLoading,
    bonuses: bonusesLoading,
    balance: balancesLoading || balanceLedgerLoading,
  };
  const tabFetching = {
    ledger: paymentsFetching,
    advances: advancesFetching,
    bonuses: bonusesFetching,
    balance: balancesFetching || balanceLedgerFetching,
  };
  const tabError = {
    ledger: paymentsError,
    advances: advancesError,
    bonuses: bonusesError,
    balance: balancesError,
  };
  const tabErrors = {
    ledger: paymentsErr,
    advances: advancesErr,
    bonuses: bonusesErr,
    balance: balancesErr,
  };
  const tabRefetch = {
    ledger: refetchPayments,
    advances: refetchAdvances,
    bonuses: refetchBonuses,
    balance: refetchBalances,
  };
  const isLoading = tabLoading[activeTab];
  const isFetching = tabFetching[activeTab];
  const isError = tabError[activeTab];
  const error = tabErrors[activeTab];
  const refetch = tabRefetch[activeTab];

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

  const balanceHistoryTotal = balanceHistoryData?.total || 0;
  const balanceHistoryTotalPages = Math.max(
    1,
    Math.ceil(balanceHistoryTotal / HISTORY_PER_PAGE)
  );

  const safeRefetch = (refetchFn) => {
    try {
      const result = refetchFn();
      if (result?.catch) result.catch(() => {});
    } catch {
      // Query was skipped (e.g. ledger query while on advances tab)
    }
  };

  const refreshAll = () => {
    safeRefetch(refetchPayments);
    safeRefetch(refetchAdvances);
    safeRefetch(refetchBonuses);
    safeRefetch(refetchBalances);
    safeRefetch(refetchBalanceLedger);
    safeRefetch(refetchSummary);
  };

  useEffect(() => {
    if (scheduledRunRef.current) return;
    scheduledRunRef.current = true;

    runScheduledSalaries()
      .unwrap()
      .then((result) => {
        if (result?.ran && result.created_count > 0) {
          const monthLabel = MONTHS[(result.period_month || 1) - 1];
          dashboardToast.success(
            `Recorded ${result.created_count} monthly ${result.created_count === 1 ? 'salary' : 'salaries'} for ${monthLabel} ${result.period_year}.`,
            'Salaries generated'
          );
          refreshAll();
        }
      })
      .catch(() => {
        // Silent on load — admin can use manual generate if needed
      });
  }, [runScheduledSalaries]);

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
        getErrorMessage(
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
        getErrorMessage(err, 'Could not mark payment as paid.'),
        'Update failed'
      );
    }
  };

  const handleAdjustBalance = async (payload) => {
    try {
      await adjustBalance(payload).unwrap();
      setBalanceEmployee(null);
      dashboardToast.success('Balance adjustment recorded in the ledger.', 'Adjustment saved');
      if (balanceHistoryEmployeeId) {
        setBalanceHistoryEmployee(null);
      }
      refreshAll();
    } catch (err) {
      dashboardToast.error(
        getErrorMessage(err, 'Could not update balance.'),
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
        getErrorMessage(err, 'Could not schedule bonus.'),
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
        getErrorMessage(err, 'Could not release bonus.'),
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
        const message = getErrorMessage(
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
        getErrorMessage(err, 'Could not generate monthly salaries. Please try again.'),
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
          getErrorMessage(err, 'Could not create advance. Please try again.'),
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
          getErrorMessage(err, 'Could not record recovery. Please try again.'),
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
          getErrorMessage(err, 'This action is not allowed in the current status.'),
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

  const tabData = {
    ledger: paymentsData,
    advances: advancesData,
    bonuses: bonusesData,
    balance: balancesData,
  };

  const isInitialLedgerLoad =
    activeTab === 'ledger' && paymentsLoading && !paymentsData;
  const isTabContentLoading = isLoading && !tabData[activeTab];
  const isTabContentError = isError && !tabData[activeTab];

  if (isInitialLedgerLoad) {
    return <LoadingScreen message="Loading payments..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
          <p className="mt-1 text-sm text-gray-500">
            Ledger, advances, bonuses, and employee balances.{' '}
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
                  disabled={isGenerating || monthlyGenerationDone || payrollPeriodStillOpen}
                  title={
                    payrollPeriodStillOpen
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
              {getErrorMessage(error, 'Failed to load payment data.')}
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

      <PaymentRecordModal
        isOpen={recordModalOpen}
        onClose={() => {
          setRecordModalOpen(false);
          setPrefillEmployee(null);
        }}
        onSave={handleRecordPayment}
        isLoading={isRecording}
        employees={employees}
        prefillEmployee={prefillEmployee}
        defaultPeriodYear={yearNumber}
        defaultPeriodMonth={monthNumber}
      />

      <AdvanceCreateModal
        isOpen={createAdvanceOpen}
        onClose={() => setCreateAdvanceOpen(false)}
        onSave={handleCreateAdvance}
        isLoading={isCreatingAdvance}
        employees={employees}
      />

      <AdvanceRecoverModal
        isOpen={Boolean(recoverAdvance)}
        advance={recoverAdvance}
        onClose={() => setRecoverAdvance(null)}
        onSave={handleRecoverAdvance}
        isLoading={isRecovering}
      />

      <PaymentHistoryPanel
        isOpen={Boolean(historyEmployee)}
        employee={historyEmployee}
        summary={employeeSummary}
        history={historyData}
        isLoading={historyLoading}
        summaryLoading={summaryDetailLoading}
        currentPage={historyPage}
        totalPages={historyTotalPages}
        totalItems={historyTotal}
        itemsPerPage={HISTORY_PER_PAGE}
        onPageChange={setHistoryPage}
        onClose={() => setHistoryEmployee(null)}
        onAdjustBalance={(emp) =>
          setBalanceEmployee({
            id: emp.employee_id || emp.id,
            name: emp.employee_name || emp.name,
          })
        }
      />

      <AdvanceDetailPanel
        isOpen={Boolean(selectedAdvanceId)}
        advance={advanceDetail}
        isLoading={advanceDetailLoading}
        onClose={() => setSelectedAdvanceId(null)}
        onApprove={handleApproveAdvance}
        onDisburse={handleDisburseAdvance}
        onCancel={handleCancelAdvance}
        onRecover={(adv) => {
          setSelectedAdvanceId(null);
          setRecoverAdvance(adv);
        }}
      />

      <PaymentMarkPaidModal
        isOpen={Boolean(paymentToMarkPaid)}
        payment={paymentToMarkPaid}
        onClose={() => setPaymentToMarkPaid(null)}
        onSave={handleMarkPaid}
        isLoading={isMarkingPaid}
      />

      <BalanceAdjustModal
        isOpen={Boolean(balanceEmployee)}
        employee={balanceEmployee}
        employees={employees}
        onClose={() => setBalanceEmployee(null)}
        onSave={handleAdjustBalance}
        isLoading={isAdjustingBalance}
      />

      <BonusCreateModal
        isOpen={bonusModalOpen}
        onClose={() => setBonusModalOpen(false)}
        onSave={handleCreateBonus}
        isLoading={isCreatingBonus}
        employees={employees}
        defaultYear={yearNumber}
        defaultMonth={monthNumber}
      />

      <BalanceHistoryPanel
        isOpen={Boolean(balanceHistoryEmployee)}
        employee={balanceHistoryEmployee}
        transactions={balanceHistoryData}
        runningBalance={balanceHistoryData?.running_balance}
        isLoading={balanceHistoryLoading}
        currentPage={balanceHistoryPage}
        totalPages={balanceHistoryTotalPages}
        totalItems={balanceHistoryTotal}
        itemsPerPage={HISTORY_PER_PAGE}
        onPageChange={setBalanceHistoryPage}
        onClose={() => setBalanceHistoryEmployee(null)}
        onAdjust={(emp) => {
          setBalanceHistoryEmployee(null);
          openBalanceAdjust(emp);
        }}
      />

      <ConfirmationDialog
        isOpen={Boolean(advanceToApprove)}
        onClose={handleCloseApproveConfirm}
        onConfirm={confirmApproveAdvance}
        title="Approve advance"
        message={
          advanceToApprove
            ? `Approve ${advanceToApprove.employee_name}'s salary advance of ${formatMoney(advanceToApprove.amount)}?\n\nThis marks the request as approved and allows disbursement.`
            : ''
        }
        confirmText="Approve"
        cancelText="Cancel"
        variant="primary"
        isLoading={isApproving}
      />

      <ConfirmationDialog
        isOpen={Boolean(bonusToRelease)}
        onClose={() => setBonusToRelease(null)}
        onConfirm={confirmReleaseBonus}
        title="Quick release bonus"
        message={
          bonusToRelease
            ? `Release ${formatMoney(bonusToRelease.amount)} bonus for ${bonusToRelease.employee_name} as a separate payment?\n\nThis will not include it in their monthly salary.`
            : ''
        }
        confirmText="Release"
        cancelText="Cancel"
        variant="primary"
      />

      {infoOpen && (
        <PageInfoOverlay steps={PAYROLL_GUIDE_STEPS} onClose={closeInfo} pageLabel="Payment" />
      )}
    </div>
  );
};

export default PayrollManagement;
