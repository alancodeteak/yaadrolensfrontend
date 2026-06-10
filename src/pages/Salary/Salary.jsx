import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SalaryStatsRow,
  SalaryFilterBar,
  SalaryTable,
  SalaryEditModal,
  SalaryHistoryPanel,
} from '../../components/pages/salary';
import { DASHBOARD_PANEL } from '../../components/pages/dashboard';
import {
  SALARY_GUIDE_STEPS,
  LoadingScreen,
  PageInfoOverlay,
  PageTourButtons,
  usePageTour,
  dashboardToast,
} from '../../components/common';
import {
  useGetSalariesQuery,
  useUpdateSalaryMutation,
  useGetSalaryHistoryQuery,
} from '../../store/api';

const HISTORY_PER_PAGE = 10;

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
  const [editEmployee, setEditEmployee] = useState(null);
  const [historyEmployee, setHistoryEmployee] = useState(null);
  const [historyPage, setHistoryPage] = useState(1);

  const { data: salaries = [], isLoading, isError, error, refetch } = useGetSalariesQuery();
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
    const salarySet = salaries.filter((r) => r.current_salary != null).length;
    const unset = total - salarySet;
    const totalMonthly = salaries.reduce(
      (sum, r) => sum + (r.current_salary != null ? Number(r.current_salary) : 0),
      0
    );
    const activeWithSalary = salaries.filter(
      (r) => (r.status === 'active' || r.is_active) && r.current_salary != null
    ).length;
    return { total, salarySet, unset, totalMonthly, activeWithSalary };
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

  useEffect(() => {
    if (!highlightId || !salaries.length) return;
    const match = salaries.find(
      (r) => r.employee_id === highlightId || r.id === highlightId
    );
    if (match) {
      setEditEmployee(match);
      searchParams.delete('employeeId');
      setSearchParams(searchParams, { replace: true });
    }
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

  if (isLoading) {
    return <LoadingScreen message="Loading salaries..." />;
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">
            {error?.data?.detail || 'Failed to load salary data.'}
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
          <h1 className="text-3xl font-bold text-gray-900">Salary</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage monthly salaries and view change history for your team.
          </p>
        </div>
        <PageTourButtons onTutorial={startTutorial} onInfo={startInfo} />
      </div>

      <div className="mb-6">
        <SalaryStatsRow stats={stats} loading={false} />
      </div>

      <div className={`${DASHBOARD_PANEL} mb-6 px-4 py-3 sm:px-5`}>
        <SalaryFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>

      <SalaryTable
          rows={processedRows}
          highlightId={highlightId}
          onEdit={(row) => setEditEmployee(row)}
          onHistory={(row) => {
            setHistoryEmployee(row);
            setHistoryPage(1);
          }}
        />

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
