import React, { memo } from 'react';
import clsx from 'clsx';
import { LogIn, LogOut } from 'lucide-react';
import { UserAvatar } from '../../../common';
import { formatDurationHours, isLiveOnSiteStatus } from '../../../../store/api/transforms';
import { DASHBOARD_BTN_SECONDARY } from '../../dashboard/dashboardTheme';

const TD = 'px-4 py-3.5 text-sm text-gray-900 first:pl-5 last:pr-5';

const LiveAttendanceDesktopRow = memo(function LiveAttendanceDesktopRow({
  employee,
  statusBadgeClass,
  isToday,
  manualAttendanceEnabled,
  onOpenReport,
  onManualPunch,
}) {
  const onSite = isLiveOnSiteStatus(employee.status);

  return (
    <tr
      className="cursor-pointer transition-colors hover:bg-gray-50/80"
      onClick={() => onOpenReport(employee.id)}
      title="View attendance report"
    >
      <td className={TD}>
        <div className="flex items-center gap-3">
          <UserAvatar
            className="h-9 w-9 shrink-0 rounded-full ring-1 ring-gray-100"
            src={employee.profilePhotoUrl || employee.photo || employee.avatar}
            name={employee.name}
            seed={employee.id}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900">{employee.name}</p>
            {employee.employee_code && (
              <p className="truncate text-xs text-gray-500 md:hidden">{employee.employee_code}</p>
            )}
            <p className="truncate text-xs text-gray-500 sm:hidden">{employee.clockIn || '—'}</p>
            <p className="truncate text-xs text-gray-500 md:hidden">{employee.department || '—'}</p>
          </div>
        </div>
      </td>
      <td className={clsx(TD, 'hidden md:table-cell')}>
        <span className="truncate text-gray-700">{employee.department || '—'}</span>
      </td>
      <td className={clsx(TD, 'hidden xl:table-cell')}>
        <span className="truncate text-xs text-gray-600">{employee.shiftLabel || '—'}</span>
      </td>
      <td className={TD}>
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={clsx(
              'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
              statusBadgeClass
            )}
          >
            {employee.status}
          </span>
        </div>
      </td>
      <td className={clsx(TD, 'hidden sm:table-cell tabular-nums text-gray-700')}>
        {employee.clockIn || '—'}
      </td>
      <td className={clsx(TD, 'hidden lg:table-cell text-gray-700')}>{employee.lastSeen || '—'}</td>
      <td className={clsx(TD, 'tabular-nums text-gray-700')}>
        {formatDurationHours(employee.totalHours)}
      </td>
      {isToday && manualAttendanceEnabled && (
        <td className={clsx(TD, 'text-right')}>
          {onSite ? (
            <button
              type="button"
              className={clsx(
                DASHBOARD_BTN_SECONDARY,
                'min-h-11 px-3 py-2 text-xs md:min-h-0 md:px-2.5 md:py-1.5'
              )}
              onClick={(event) => onManualPunch(employee, 'clock_out', event)}
              title="Manual clock out"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={2} />
              Out
            </button>
          ) : (
            <button
              type="button"
              className={clsx(
                DASHBOARD_BTN_SECONDARY,
                'min-h-11 px-3 py-2 text-xs md:min-h-0 md:px-2.5 md:py-1.5'
              )}
              onClick={(event) => onManualPunch(employee, 'clock_in', event)}
              title="Manual clock in"
            >
              <LogIn className="h-3.5 w-3.5" strokeWidth={2} />
              In
            </button>
          )}
        </td>
      )}
    </tr>
  );
});

const LiveAttendanceMobileRow = memo(function LiveAttendanceMobileRow({
  employee,
  statusBadgeClass,
  isToday,
  manualAttendanceEnabled,
  onOpenReport,
  onManualPunch,
}) {
  const onSite = isLiveOnSiteStatus(employee.status);

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/40 p-4">
      <button
        type="button"
        className="flex w-full items-start gap-3 text-left"
        onClick={() => onOpenReport(employee.id)}
      >
        <UserAvatar
          className="h-10 w-10 shrink-0 rounded-full ring-1 ring-gray-100"
          src={employee.profilePhotoUrl || employee.photo || employee.avatar}
          name={employee.name}
          seed={employee.id}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">{employee.name}</p>
          <p className="truncate text-xs text-gray-500">
            {[employee.employee_code, employee.department].filter(Boolean).join(' · ') || '—'}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span
              className={clsx(
                'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                statusBadgeClass
              )}
            >
              {employee.status}
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-600">
            In {employee.clockIn || '—'}
            {employee.lastSeen ? ` · Last ${employee.lastSeen}` : ''}
          </p>
          <p className="mt-0.5 text-sm font-semibold tabular-nums text-gray-900">
            {formatDurationHours(employee.totalHours)}
          </p>
        </div>
      </button>
      {isToday && manualAttendanceEnabled && (
        <div className="mt-3 border-t border-gray-100 pt-3">
          {onSite ? (
            <button
              type="button"
              className={clsx(DASHBOARD_BTN_SECONDARY, 'w-full min-h-11 justify-center text-xs')}
              onClick={(event) => onManualPunch(employee, 'clock_out', event)}
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={2} />
              Manual clock out
            </button>
          ) : (
            <button
              type="button"
              className={clsx(DASHBOARD_BTN_SECONDARY, 'w-full min-h-11 justify-center text-xs')}
              onClick={(event) => onManualPunch(employee, 'clock_in', event)}
            >
              <LogIn className="h-3.5 w-3.5" strokeWidth={2} />
              Manual clock in
            </button>
          )}
        </div>
      )}
    </div>
  );
});

export { LiveAttendanceDesktopRow, LiveAttendanceMobileRow };
