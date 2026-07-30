import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Users } from 'lucide-react';
import {
  DASHBOARD_BTN_PRIMARY,
  DASHBOARD_BTN_SECONDARY,
  DASHBOARD_MOBILE_STACK,
  DASHBOARD_PANEL,
  DASHBOARD_TABLE_DESKTOP,
} from '../../dashboard/dashboardTheme';
import {
  isLiveOnSiteStatus,
  mapDailyRowToLiveEmployee,
  matchesLiveAttendanceStatusFilter,
  resolveLiveWorkHours,
} from '../../../../store/api/transforms';
import { LiveAttendanceDesktopRow, LiveAttendanceMobileRow } from './LiveAttendanceEmployeeRow';

const TH =
  'px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wide text-gray-400 first:pl-5 last:pr-5';

const LiveAttendanceEmployeeSection = ({
  dailyData,
  isToday,
  dailyFetching,
  searchTerm,
  selectedStatus,
  manualAttendanceEnabled,
  statusBadgeMap,
  onOpenReport,
  onManualPunch,
  onClearFilters,
}) => {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    if (!isToday) return undefined;
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isToday]);

  const baseEmployees = useMemo(
    () => (dailyData?.rows || []).map((row) => mapDailyRowToLiveEmployee(row, null)),
    [dailyData]
  );

  const employeesCacheRef = useRef({ base: null, list: [] });

  const employees = useMemo(() => {
    if (!isToday) {
      employeesCacheRef.current = { base: baseEmployees, list: baseEmployees };
      return baseEmployees;
    }

    const rows = dailyData?.rows || [];
    const cache = employeesCacheRef.current;

    if (cache.base !== baseEmployees) {
      cache.base = baseEmployees;
      cache.list = baseEmployees;
    }

    if (!rows.length) return cache.list;

    const rowById = new Map(rows.map((row) => [row.employee_id, row]));
    let changed = false;
    const next = cache.list.map((emp) => {
      if (!isLiveOnSiteStatus(emp.status)) return emp;
      const row = rowById.get(emp.id);
      if (!row) return emp;
      const totalHours = resolveLiveWorkHours(row, currentTime);
      if (totalHours === emp.totalHours) return emp;
      changed = true;
      return { ...emp, totalHours };
    });

    if (changed) {
      cache.list = next;
      return next;
    }
    return cache.list;
  }, [baseEmployees, dailyData, isToday, currentTime]);

  const filteredEmployees = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return employees
      .filter((employee) => {
        const matchesSearch =
          !term ||
          employee.name.toLowerCase().includes(term) ||
          String(employee.employee_code || '').toLowerCase().includes(term);
        const matchesStatus = matchesLiveAttendanceStatusFilter(employee.status, selectedStatus);
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [employees, searchTerm, selectedStatus]);

  const hasActiveFilters = Boolean(searchTerm || selectedStatus !== 'All Status');

  return (
    <div className={clsx(DASHBOARD_PANEL, 'relative overflow-hidden')} data-tour="employee-table">
      <div className="border-b border-gray-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">Employee status</h2>
        <p className="text-[11px] text-gray-500">
          {filteredEmployees.length} of {employees.length} employees
          {dailyFetching ? ' · Updating…' : ''}
        </p>
      </div>

      {filteredEmployees.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
            <Users className="h-6 w-6 text-gray-400" strokeWidth={1.75} />
          </div>
          <p className="text-sm font-medium text-gray-900">No employees found</p>
          <p className="mt-1 max-w-sm text-xs text-gray-500">
            {hasActiveFilters
              ? 'Try adjusting your search or filters.'
              : 'No employee data for this date.'}
          </p>
          {hasActiveFilters && (
            <button type="button" onClick={onClearFilters} className={`${DASHBOARD_BTN_PRIMARY} mt-3`}>
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div
            className={clsx(
              DASHBOARD_TABLE_DESKTOP,
              'transition-opacity duration-200',
              dailyFetching && 'pointer-events-none opacity-60'
            )}
          >
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className={clsx(TH, 'min-w-36')}>Name</th>
                  <th className={clsx(TH, 'hidden md:table-cell')}>Department</th>
                  <th className={clsx(TH, 'hidden xl:table-cell')}>Shift</th>
                  <th className={TH}>Status</th>
                  <th className={clsx(TH, 'hidden sm:table-cell')}>Clock in</th>
                  <th className={clsx(TH, 'hidden lg:table-cell')}>Last seen</th>
                  <th className={TH}>Hours</th>
                  {isToday && manualAttendanceEnabled && (
                    <th className={clsx(TH, 'text-right')}>Manual</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEmployees.map((employee) => (
                  <LiveAttendanceDesktopRow
                    key={employee.id}
                    employee={employee}
                    statusBadgeClass={statusBadgeMap[employee.status] || 'bg-gray-100 text-gray-600'}
                    isToday={isToday}
                    manualAttendanceEnabled={manualAttendanceEnabled}
                    onOpenReport={onOpenReport}
                    onManualPunch={onManualPunch}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div
            className={clsx(
              DASHBOARD_MOBILE_STACK,
              'transition-opacity duration-200',
              dailyFetching && 'pointer-events-none opacity-60'
            )}
          >
            {filteredEmployees.map((employee) => (
              <LiveAttendanceMobileRow
                key={employee.id}
                employee={employee}
                statusBadgeClass={statusBadgeMap[employee.status] || 'bg-gray-100 text-gray-600'}
                isToday={isToday}
                manualAttendanceEnabled={manualAttendanceEnabled}
                onOpenReport={onOpenReport}
                onManualPunch={onManualPunch}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default memo(LiveAttendanceEmployeeSection);
