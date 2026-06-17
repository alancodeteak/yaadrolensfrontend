import clsx from 'clsx';
import { History, Scale, Users } from 'lucide-react';
import { UserAvatar } from '../../../common';
import { DASHBOARD_BTN_PRIMARY, DASHBOARD_PANEL } from '../../dashboard/dashboardTheme';
import { formatDateTime, formatMoney } from '../paymentUtils';

const TH =
  'px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wide text-gray-400 first:pl-5 last:pr-5';

const TD = 'px-4 py-3.5 text-sm text-gray-900 first:pl-5 last:pr-5';

const BalanceTable = ({
  rows,
  totalCount = 0,
  isFetching = false,
  hasActiveFilters = false,
  onClearFilters,
  onHistory,
  onAdjust,
}) => {
  const isEmpty = rows.length === 0;

  return (
    <div className={clsx(DASHBOARD_PANEL, 'overflow-hidden')} data-tour="payroll-table">
      <div className="border-b border-gray-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">Employee balances</h2>
        <p className="text-[11px] text-gray-500">
          {totalCount} {totalCount === 1 ? 'employee' : 'employees'}
          {isFetching ? ' · Updating…' : ''}
        </p>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
            <Users className="h-6 w-6 text-gray-400" strokeWidth={1.75} />
          </div>
          <p className="text-sm font-medium text-gray-900">No balances found</p>
          <p className="mt-1 text-xs text-gray-500">
            {hasActiveFilters ? 'Try adjusting your search or filters.' : 'No balance records yet.'}
          </p>
          {hasActiveFilters && onClearFilters && (
            <button type="button" onClick={onClearFilters} className={`${DASHBOARD_BTN_PRIMARY} mt-3`}>
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div
          className={clsx(
            'overflow-x-auto transition-opacity duration-200',
            isFetching && 'pointer-events-none opacity-60'
          )}
        >
          <table className="w-full min-w-[680px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className={clsx(TH, 'min-w-40')}>Employee</th>
                <th className={clsx(TH, 'min-w-28 hidden sm:table-cell')}>Code</th>
                <th className={clsx(TH, 'min-w-28')}>Running balance</th>
                <th className={clsx(TH, 'min-w-32 hidden lg:table-cell')}>Last updated</th>
                <th className={clsx(TH, 'w-36 text-right')}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.employee_id} className="transition-colors duration-200 hover:bg-gray-50/80">
                  <td className={TD}>
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-gray-100"
                        src={row.profilePhotoUrl || row.photo || row.avatar}
                        name={row.employee_name}
                        seed={row.employee_id}
                      />
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {row.employee_name}
                      </p>
                    </div>
                  </td>
                  <td className={clsx(TD, 'hidden sm:table-cell')}>
                    <span className="font-mono text-xs text-gray-600">{row.employee_code}</span>
                  </td>
                  <td className={TD}>
                    <span
                      className={clsx(
                        'tabular-nums font-semibold',
                        Number(row.running_balance) < 0
                          ? 'text-[#FF9500]'
                          : Number(row.running_balance) > 0
                            ? 'text-[#34C759]'
                            : 'text-gray-700'
                      )}
                    >
                      {formatMoney(row.running_balance)}
                    </span>
                  </td>
                  <td className={clsx(TD, 'hidden lg:table-cell')}>
                    <span className="text-gray-600">{formatDateTime(row.updated_at)}</span>
                  </td>
                  <td className={clsx(TD, 'text-right')}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onHistory?.(row)}
                        title="View history"
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-[#007AFF]"
                      >
                        <History className="h-4 w-4" strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onAdjust?.(row)}
                        title="Adjust balance"
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-[#007AFF]"
                      >
                        <Scale className="h-4 w-4" strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BalanceTable;
