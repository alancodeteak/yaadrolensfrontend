import clsx from 'clsx';
import { ChevronRight, Users } from 'lucide-react';
import { UserAvatar } from '../../../common';
import { DASHBOARD_BTN_PRIMARY, DASHBOARD_PANEL } from '../../dashboard/dashboardTheme';
import {
  ADVANCE_STATUS_LABELS,
  ADVANCE_STATUS_STYLES,
  formatDate,
  formatMoney,
} from '../paymentUtils';

const TH =
  'px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wide text-gray-400 first:pl-5 last:pr-5';

const TD = 'px-4 py-3.5 text-sm text-gray-900 first:pl-5 last:pr-5';

const AdvanceTable = ({
  rows,
  totalCount = 0,
  isFetching = false,
  hasActiveFilters = false,
  onClearFilters,
  onView,
  onApprove,
}) => {
  const isEmpty = rows.length === 0;

  return (
    <div className={clsx(DASHBOARD_PANEL, 'overflow-hidden')} data-tour="payroll-table">
      <div className="border-b border-gray-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">Salary advances</h2>
        <p className="text-[11px] text-gray-500">
          {totalCount} {totalCount === 1 ? 'advance' : 'advances'}
          {isFetching ? ' · Updating…' : ''}
        </p>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
            <Users className="h-6 w-6 text-gray-400" strokeWidth={1.75} />
          </div>
          <p className="text-sm font-medium text-gray-900">No advances found</p>
          <p className="mt-1 text-xs text-gray-500">
            {hasActiveFilters ? 'Try adjusting your search or filters.' : 'No salary advances yet.'}
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
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className={clsx(TH, 'min-w-40')}>Employee</th>
                <th className={clsx(TH, 'min-w-28 hidden sm:table-cell')}>Code</th>
                <th className={clsx(TH, 'min-w-24')}>Amount</th>
                <th className={clsx(TH, 'min-w-24')}>Outstanding</th>
                <th className={clsx(TH, 'min-w-28 hidden md:table-cell')}>Advance date</th>
                <th className={clsx(TH, 'w-28')}>Status</th>
                <th className={clsx(TH, 'w-24 text-right')}> </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="group cursor-pointer transition-colors duration-200 hover:bg-gray-50/80"
                  onClick={() => onView(row)}
                >
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
                    <span className="tabular-nums font-medium">{formatMoney(row.amount)}</span>
                  </td>
                  <td className={TD}>
                    <span className="tabular-nums text-gray-700">
                      {formatMoney(row.outstanding_amount)}
                    </span>
                  </td>
                  <td className={clsx(TD, 'hidden md:table-cell')}>
                    <span className="text-gray-600">{formatDate(row.advance_date)}</span>
                  </td>
                  <td className={TD}>
                    <span
                      className={clsx(
                        'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                        ADVANCE_STATUS_STYLES[row.status] || ADVANCE_STATUS_STYLES.cancelled
                      )}
                    >
                      {ADVANCE_STATUS_LABELS[row.status] || row.status}
                    </span>
                  </td>
                  <td className={clsx(TD, 'text-right')}>
                    <div className="flex items-center justify-end gap-2">
                      {row.status === 'pending' && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onApprove(row);
                          }}
                          className="rounded-lg px-2.5 py-1 text-xs font-semibold text-[#007AFF] transition-colors hover:bg-[#007AFF]/10"
                        >
                          Approve
                        </button>
                      )}
                      <ChevronRight
                        className="h-4 w-4 text-gray-300 transition-colors group-hover:text-gray-500"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
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

export default AdvanceTable;
