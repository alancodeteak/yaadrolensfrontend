import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useSearchParams } from 'react-router-dom';
import {
  SalaryStatsRow,
  SalaryFilterBar,
  SalaryTable,
  SalaryEditModal,
  SalaryHistoryPanel,
} from '../../components/pages/salary';
import {
  DASHBOARD_BTN_PRIMARY,
  DASHBOARD_PANEL,
} from '../../components/pages/dashboard';
import {
  SALARY_GUIDE_STEPS,
  LoadingScreen,
  PageInfoOverlay,
  PageTourButtons,
  Pagination,
  usePageTour,
  dashboardToast,
} from '../../components/common';
import {
  useGetSalariesQuery,
  useUpdateSalaryMutation,
  useGetSalaryHistoryQuery,
} from '../../store/api';

const HISTORY_PER_PAGE = 10;
const ROWS_PER_PAGE = 10;

const Salary = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const highlightId = searchParams.get('employeeId');

  const { infoOpen, startTutorial, startInfo, closeInfo } = usePageTour(
    SALARY_GUIDE_STEPS,
    'salary_tour_completed'
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowHighlightId, setRowHighlightId] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);
  const [historyEmployee, setHistoryEmployee] = useState(null);
  const [historyPage, setHistoryPage] = useState(1);

  const {
    data: salaries = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetSalariesQuery();
  const [updateSalary, { isLoading: isUpdating }] = useUpdateSalaryMutation();

  const historyEmployeeId = historyEmployee?.employee_id || historyEmployee?.id;
  const { data: historyData, isLoading: historyLoading } = useGetSalaryHistoryQuery(
    {
      employeeId: historyEmployeeId,
      skip: (historyPage - 1) * HISTORY_PER_PAGE,
      limit: HISTORY_PER_PAGE,
    },
    { skip: !historyEmployeeId }
  );

  const stats = useMemo(() => {
    const total = salaries.length;
    const activeCount = salaries.filter((r) => r.status === 'active' || r.is_active).length;
    const salarySet = salaries.filter((r) => r.current_salary != null).length;
    const unset = total - salarySet;
    const totalMonthly = salaries.reduce(
      (sum, r) =>
        sum +
        (r.current_salary != null && (r.status === 'active' || r.is_active)
          ? Number(r.current_salary)
          : 0),
      0
    );
    const activeSalaries = salaries.filter(
      (r) => (r.status === 'active' || r.is_active) && r.current_salary != null
    );
    const avgActiveSalary = activeSalaries.length
      ? Math.round(
          activeSalaries.reduce((sum, r) => sum + Number(r.current_salary), 0) /
            activeSalaries.length
        )
      : 0;
    return { total, activeCount, salarySet, unset, totalMonthly, avgActiveSalary };
  }, [salaries]);

  const processedRows = useMemo(() => {
    let rows = [...salaries];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.name?.toLowerCase().includes(term) ||
          r.employee_code?.toLowerCase().includes(term)
      );
    }

    if (statusFilter === 'active') {
      rows = rows.filter((r) => r.status === 'active' || r.is_active);
    } else if (statusFilter === 'inactive') {
      rows = rows.filter((r) => r.status !== 'active' && !r.is_active);
    } else if (statusFilter === 'unset') {
      rows = rows.filter((r) => r.current_salary == null);
    }

    rows.sort((a, b) => {
      switch (sortBy) {
        case 'salary':
          return (a.current_salary || 0) - (b.current_salary || 0);
        case 'last_changed': {
          const aTime = a.last_changed_at ? new Date(a.last_changed_at).getTime() : 0;
          const bTime = b.last_changed_at ? new Date(b.last_changed_at).getTime() : 0;
          return bTime - aTime;
        }
        case 'department':
          return (a.department || a.department_name || '').localeCompare(
            b.department || b.department_name || ''
          );
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return rows;
  }, [salaries, searchTerm, statusFilter, sortBy]);

  const totalFilteredCount = processedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredCount / ROWS_PER_PAGE));
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    return processedRows.slice(start, start + ROWS_PER_PAGE);
  }, [processedRows, currentPage]);

  const hasActiveFilters =
    Boolean(searchTerm) || statusFilter !== 'all' || sortBy !== 'name';

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSortBy('name');
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!highlightId || !salaries.length) return;
    const match = salaries.find(
      (r) => r.employee_id === highlightId || r.id === highlightId
    );
    if (match) {
      setEditEmployee(match);
      setRowHighlightId(highlightId);
      searchParams.delete('employeeId');
      setSearchParams(searchParams, { replace: true });
      const timer = setTimeout(() => setRowHighlightId(null), 4000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [highlightId, salaries, searchParams, setSearchParams]);

  const handleSaveSalary = async (payload) => {
    try {
      await updateSalary(payload).unwrap();
      const name = editEmployee?.name || 'Employee';
      dashboardToast.success(`Salary updated for ${name}.`, 'Salary saved');
      refetch();
    } catch (err) {
      const message =
        err?.data?.detail ||
        (typeof err?.data === 'string' ? err.data : null) ||
        'Could not update salary. Please try again.';
      dashboardToast.error(
        typeof message === 'string' ? message : JSON.stringify(message),
        'Update failed'
      );
      throw err;
    }
  };

  const historyTotal = historyData?.total || 0;
  const historyTotalPages = Math.max(1, Math.ceil(historyTotal / HISTORY_PER_PAGE));

  if (isLoading && !salaries.length) {
    return <LoadingScreen message="Loading salaries..." />;
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>{error?.data?.detail || 'Failed to load salary data.'}</p>
          <button type="button" onClick={() => refetch()} className={`${DASHBOARD_BTN_PRIMARY} mt-3`}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Salary</h1>
          <p className="mt-1 text-sm text-gray-500">
            Set monthly salaries and view change history. Generate payments on the Payment page.
          </p>
        </div>
        <PageTourButtons onTutorial={startTutorial} onInfo={startInfo} />
      </div>

      <SalaryStatsRow stats={stats} loading={isFetching} />

      <div className={clsx(DASHBOARD_PANEL, 'p-4')}>
        <SalaryFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <SalaryTable
        rows={paginatedRows}
        totalCount={totalFilteredCount}
        isFetching={isFetching}
        highlightId={rowHighlightId}
        onEdit={(row) => setEditEmployee(row)}
        onHistory={(row) => {
          setHistoryEmployee(row);
          setHistoryPage(1);
        }}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {totalFilteredCount > ROWS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalFilteredCount}
          itemsPerPage={ROWS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}

      <SalaryEditModal
        isOpen={Boolean(editEmployee)}
        employee={editEmployee}
        onClose={() => setEditEmployee(null)}
        onSave={handleSaveSalary}
        isLoading={isUpdating}
      />

      <SalaryHistoryPanel
        isOpen={Boolean(historyEmployee)}
        employee={historyEmployee}
        history={historyData}
        isLoading={historyLoading}
        currentPage={historyPage}
        totalPages={historyTotalPages}
        totalItems={historyTotal}
        itemsPerPage={HISTORY_PER_PAGE}
        onPageChange={setHistoryPage}
        onClose={() => setHistoryEmployee(null)}
      />

      {infoOpen && (
        <PageInfoOverlay steps={SALARY_GUIDE_STEPS} onClose={closeInfo} pageLabel="Salary" />
      )}
    </div>
  );
};

export default Salary;
