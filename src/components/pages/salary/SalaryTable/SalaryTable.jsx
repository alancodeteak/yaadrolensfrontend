import clsx from 'clsx';
import { History, Pencil, Users } from 'lucide-react';
import { UserAvatar } from '../../../common';
import {
  DASHBOARD_BTN_PRIMARY,
  DASHBOARD_ICON_BTN,
  DASHBOARD_MOBILE_STACK,
  DASHBOARD_PANEL,
  DASHBOARD_TABLE_DESKTOP,
} from '../../dashboard/dashboardTheme';
import { formatMonthlySalary } from '../../../../utils/helpers';

const TH =
  'px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wide text-gray-400 first:pl-5 last:pr-5';

const TD = 'px-4 py-3.5 text-sm text-gray-900 first:pl-5 last:pr-5';

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const ActionButton = ({ onClick, title, children, tone = 'blue' }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={clsx(
      DASHBOARD_ICON_BTN,
      tone === 'blue' && 'hover:bg-blue-50 hover:text-[#007AFF]',
      tone === 'neutral' && 'hover:bg-gray-50 hover:text-gray-700'
    )}
  >
    {children}
  </button>
);

const SalaryTable = ({
  rows,
  totalCount = 0,
  isFetching = false,
  highlightId,
  isHourly = false,
  onEdit,
  onHistory,
  onClearFilters,
  hasActiveFilters = false,
}) => {
  const isEmpty = rows.length === 0;

  return (
    <div className={clsx(DASHBOARD_PANEL, 'relative overflow-hidden')} data-tour="salary-table">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Employee salaries</h2>
          <p className="text-[11px] text-gray-500">
            {totalCount} {totalCount === 1 ? 'employee' : 'employees'}
            {isFetching ? ' · Updating…' : ''}
          </p>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
            <Users className="h-6 w-6 text-gray-400" strokeWidth={1.75} />
          </div>
          <p className="text-sm font-medium text-gray-900">No employees found</p>
          <p className="mt-1 max-w-sm text-xs text-gray-500">
            {hasActiveFilters
              ? 'Try adjusting your search or filters.'
              : 'No salary records to display.'}
          </p>
          {hasActiveFilters && onClearFilters && (
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
              isFetching && 'pointer-events-none opacity-60'
            )}
          >
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className={clsx(TH, 'min-w-40')}>Name</th>
                  <th className={clsx(TH, 'min-w-28 hidden sm:table-cell')}>Code</th>
                  <th className={clsx(TH, 'min-w-32 hidden md:table-cell')}>Department</th>
                  <th className={clsx(TH, 'min-w-28')}>{isHourly ? 'Rate / hr' : 'Salary / mo'}</th>
                  <th className={clsx(TH, 'min-w-32 hidden lg:table-cell')}>Last changed</th>
                  <th className={clsx(TH, 'w-20')}>Status</th>
                  <th className={clsx(TH, 'w-28')} data-tour="salary-actions">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => {
                  const isActive = row.status === 'active' || row.is_active;
                  const isUnset = row.current_salary == null;
                  const isHighlighted =
                    highlightId && (row.employee_id === highlightId || row.id === highlightId);

                  return (
                    <tr
                      key={row.employee_id || row.id}
                      className={clsx(
                        'group cursor-pointer transition-colors duration-200 hover:bg-gray-50/80',
                        isHighlighted && 'bg-blue-50/60'
                      )}
                      onClick={() => onEdit(row)}
                      title="Edit salary"
                    >
                      <td className={TD}>
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-gray-100"
                            src={row.profilePhotoUrl || row.photo || row.avatar}
                            name={row.name}
                            seed={row.employee_id || row.id}
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">{row.name}</p>
                            <p className="truncate text-xs text-gray-500 sm:hidden">
                              {row.employee_code}
                            </p>
                            <p className="truncate text-xs text-gray-500 md:hidden">
                              {row.department || row.department_name || '—'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className={clsx(TD, 'hidden sm:table-cell')}>
                        <span className="font-mono text-xs text-gray-600">{row.employee_code}</span>
                      </td>
                      <td className={clsx(TD, 'hidden md:table-cell')}>
                        <span className="text-gray-700">
                          {row.department || row.department_name || '—'}
                        </span>
                      </td>
                      <td className={TD}>
                        {isUnset ? (
                          <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                            Not set
                          </span>
                        ) : (
                          <span className="tabular-nums font-medium text-gray-900">
                            {formatMonthlySalary(row.current_salary)}
                            {isHourly ? '/hr' : ''}
                          </span>
                        )}
                      </td>
                      <td className={clsx(TD, 'hidden lg:table-cell')}>
                        <span className="text-gray-600">{formatDate(row.last_changed_at)}</span>
                      </td>
                      <td className={TD}>
                        <span
                          className={clsx(
                            'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                            isActive
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-gray-100 text-gray-600'
                          )}
                        >
                          {isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className={TD}>
                        <div
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                          role="presentation"
                        >
                          <ActionButton onClick={() => onEdit(row)} title="Edit salary">
                            <Pencil className="h-4 w-4" strokeWidth={2} />
                          </ActionButton>
                          <ActionButton
                            onClick={() => onHistory(row)}
                            title="View history"
                            tone="neutral"
                          >
                            <History className="h-4 w-4" strokeWidth={2} />
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div
            className={clsx(
              DASHBOARD_MOBILE_STACK,
              'transition-opacity duration-200',
              isFetching && 'pointer-events-none opacity-60'
            )}
          >
            {rows.map((row) => {
              const isActive = row.status === 'active' || row.is_active;
              const isUnset = row.current_salary == null;
              return (
                <div
                  key={row.employee_id || row.id}
                  className="rounded-xl border border-gray-100 bg-gray-50/40 p-4"
                >
                  <button
                    type="button"
                    className="flex w-full items-start gap-3 text-left"
                    onClick={() => onEdit(row)}
                  >
                    <UserAvatar
                      className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-gray-100"
                      src={row.profilePhotoUrl || row.photo || row.avatar}
                      name={row.name}
                      seed={row.employee_id || row.id}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">{row.name}</p>
                      <p className="truncate text-xs text-gray-500">
                        {row.employee_code}
                        {(row.department || row.department_name)
                          ? ` · ${row.department || row.department_name}`
                          : ''}
                      </p>
                      <p className="mt-1 text-base font-semibold tabular-nums text-gray-900">
                        {isUnset
                          ? 'Not set'
                          : `${formatMonthlySalary(row.current_salary)}${isHourly ? '/hr' : ''}`}
                      </p>
                      <span
                        className={clsx(
                          'mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                          isActive
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </button>
                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
                    <button
                      type="button"
                      onClick={() => onEdit(row)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onHistory(row)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs font-semibold text-gray-700"
                    >
                      <History className="h-3.5 w-3.5" /> History
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default SalaryTable;
