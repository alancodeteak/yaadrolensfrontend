import { useMemo } from 'react';
import {
  buildEmployeePhotoMap,
  computePeriodPaymentStats,
  enrichRowsWithPhotos,
  filterPaymentRows,
  paginateRows,
} from '../../utils/paymentListUtils';
import {
  useLazyGetPaymentsQuery,
  useGetPaymentSummaryQuery,
  useGetMonthlyGenerationStatusQuery,
  useRecordPaymentMutation,
  useGetEmployeePaymentSummaryQuery,
  useGetEmployeePaymentHistoryQuery,
  useLazyGetAdvancesQuery,
  useCreateAdvanceMutation,
  useGetAdvanceQuery,
  useApproveAdvanceMutation,
  useDisburseAdvanceMutation,
  useRecoverAdvanceMutation,
  useCancelAdvanceMutation,
  useGenerateMonthlySalariesMutation,
  useLazyGetEmployeesQuery,
  useGetOutstandingEmployeesQuery,
  useGetSettingsQuery,
  useApprovePaymentMutation,
  useMarkPaymentPaidMutation,
  useAdjustEmployeeBalanceMutation,
  useCreateBonusMutation,
  useLazyGetBonusesQuery,
  useReleaseBonusMutation,
  useLazyGetEmployeeBalancesQuery,
  useGetBalanceTransactionsQuery,
  useLazyGetBalanceLedgerQuery,
} from '../../store/api';
import { isPayrollPeriodOpen } from '../../store/api/transforms';
import { useFetchAllPages } from '../../hooks/useFetchAllPages';
import { AGGREGATE_PAGE_LIMIT, HISTORY_PER_PAGE, PER_PAGE } from './payrollUtils';

/**
 * Centralizes all payroll data-fetching (queries + mutations) so the page
 * component only has to deal with UI state and wiring handlers.
 */
export function usePayrollQueries({
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
}) {
  const { data: orgSettings } = useGetSettingsQuery();
  const payrollPeriodStillOpen = useMemo(() => {
    if (isAllPeriods || !monthNumber) return true;
    return isPayrollPeriodOpen(yearNumber, monthNumber, orgSettings?.timezone ?? 'UTC');
  }, [isAllPeriods, yearNumber, monthNumber, orgSettings?.timezone]);

  const [triggerGetPayments] = useLazyGetPaymentsQuery();
  const {
    data: paymentsData,
    isLoading: paymentsLoading,
    isFetching: paymentsFetching,
    error: paymentsErr,
    refetch: refetchPayments,
  } = useFetchAllPages(
    triggerGetPayments,
    {
      // Filter by payroll period (salary/bonus month), not payment_date — so paid-in-July
      // June salaries still appear under June. "All periods" lists every payment.
      period_year: isAllPeriods ? undefined : yearNumber,
      period_month: isAllPeriods ? undefined : monthNumber,
      payment_type: typeFilter || undefined,
      status: paymentStatusFilter || undefined,
      employee_id: ledgerEmployeeId || undefined,
    },
    { skip: activeTab !== 'ledger', limit: AGGREGATE_PAGE_LIMIT }
  );
  const paymentsError = Boolean(paymentsErr);

  const {
    data: summary,
    isLoading: summaryLoading,
    refetch: refetchSummary,
  } = useGetPaymentSummaryQuery();

  const { data: monthlyGenerationStatus } = useGetMonthlyGenerationStatusQuery(
    { period_year: yearNumber, period_month: monthNumber },
    { skip: activeTab !== 'ledger' || isAllPeriods || !monthNumber }
  );

  const monthlyGenerationDone =
    monthlyGenerationStatus != null && !monthlyGenerationStatus.can_generate;

  const { data: outstandingData, isLoading: outstandingLoading } =
    useGetOutstandingEmployeesQuery();

  const [triggerGetAdvances] = useLazyGetAdvancesQuery();
  const {
    data: advancesData,
    isLoading: advancesLoading,
    isFetching: advancesFetching,
    error: advancesErr,
    refetch: refetchAdvances,
  } = useFetchAllPages(
    triggerGetAdvances,
    { status: statusFilter || undefined },
    { skip: activeTab !== 'advances', limit: AGGREGATE_PAGE_LIMIT }
  );
  const advancesError = Boolean(advancesErr);

  const [triggerGetEmployees] = useLazyGetEmployeesQuery();
  const { data: employeesData } = useFetchAllPages(
    triggerGetEmployees,
    {},
    { limit: AGGREGATE_PAGE_LIMIT }
  );
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
  const [triggerGetBonuses] = useLazyGetBonusesQuery();
  const {
    data: bonusesData,
    isLoading: bonusesLoading,
    isFetching: bonusesFetching,
    error: bonusesErr,
    refetch: refetchBonuses,
  } = useFetchAllPages(
    triggerGetBonuses,
    {
      period_year: isAllPeriods ? undefined : yearNumber,
      period_month: isAllPeriods ? undefined : monthNumber,
      status: bonusStatusFilter || undefined,
    },
    { skip: activeTab !== 'bonuses', limit: AGGREGATE_PAGE_LIMIT }
  );
  const bonusesError = Boolean(bonusesErr);

  const [triggerGetEmployeeBalances] = useLazyGetEmployeeBalancesQuery();
  const {
    data: balancesData,
    isLoading: balancesLoading,
    isFetching: balancesFetching,
    error: balancesErr,
    refetch: refetchBalances,
  } = useFetchAllPages(
    triggerGetEmployeeBalances,
    { non_zero_only: balanceFilter === 'non_zero' },
    { skip: activeTab !== 'balance', limit: AGGREGATE_PAGE_LIMIT }
  );
  const balancesError = Boolean(balancesErr);

  const [triggerGetBalanceLedger] = useLazyGetBalanceLedgerQuery();
  const {
    data: balanceLedgerData,
    isLoading: balanceLedgerLoading,
    isFetching: balanceLedgerFetching,
    refetch: refetchBalanceLedger,
  } = useFetchAllPages(
    triggerGetBalanceLedger,
    {},
    { skip: activeTab !== 'balance', limit: AGGREGATE_PAGE_LIMIT }
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

  const historyTotal = historyData?.total || 0;
  const historyTotalPages = Math.max(1, Math.ceil(historyTotal / HISTORY_PER_PAGE));

  const balanceHistoryTotal = balanceHistoryData?.total || 0;
  const balanceHistoryTotalPages = Math.max(1, Math.ceil(balanceHistoryTotal / HISTORY_PER_PAGE));

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

  const tabData = {
    ledger: paymentsData,
    advances: advancesData,
    bonuses: bonusesData,
    balance: balancesData,
  };
  const isInitialLedgerLoad = activeTab === 'ledger' && paymentsLoading;
  const isTabContentLoading = isLoading;
  const isTabContentError = isError && (tabData[activeTab]?.items?.length ?? 0) === 0;

  return {
    orgSettings,
    payrollPeriodStillOpen,

    paymentsData,
    paymentsLoading,
    paymentsFetching,
    paymentsError,
    paymentsErr,
    refetchPayments,

    summary,
    summaryLoading,
    refetchSummary,

    monthlyGenerationStatus,
    monthlyGenerationDone,

    outstandingData,
    outstandingLoading,

    advancesData,
    advancesLoading,
    advancesFetching,
    advancesError,
    advancesErr,
    refetchAdvances,

    employeesData,
    employeePhotoMap,
    employees,

    bonusesData,
    bonusesLoading,
    bonusesFetching,
    bonusesError,
    bonusesErr,
    refetchBonuses,

    balancesData,
    balancesLoading,
    balancesFetching,
    balancesError,
    balancesErr,
    refetchBalances,

    balanceLedgerData,
    balanceLedgerLoading,
    balanceLedgerFetching,
    refetchBalanceLedger,

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
    filteredAdvances,
    advanceRows,
    filteredBonuses,
    bonusRows,
    filteredBalances,
    balanceRows,
    filteredLedger,
    balanceLedgerRows,
    filteredCounts,
    ledgerTotalPages,
    advancesTotalPages,
    bonusesTotalPages,
    balancesTotalPages,
    balanceLedgerTotalPages,
    totalPages,
    historyTotal,
    historyTotalPages,
    balanceHistoryTotal,
    balanceHistoryTotalPages,
    tabLoading,
    tabFetching,
    tabError,
    tabErrors,
    tabRefetch,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    isInitialLedgerLoad,
    isTabContentLoading,
    isTabContentError,
  };
}

export default usePayrollQueries;
