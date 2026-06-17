import clsx from 'clsx';
import { Users } from 'lucide-react';
import { UserAvatar } from '../../../common';
import { DASHBOARD_BTN_PRIMARY, DASHBOARD_PANEL } from '../../dashboard/dashboardTheme';
import {
  BALANCE_TRANSACTION_LABELS,
  BALANCE_TRANSACTION_STYLES,
  formatDate,
  formatDateTime,
  formatMoney,
} from '../paymentUtils';

const TH =
  'px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wide text-gray-400 first:pl-5 last:pr-5';

const TD = 'px-4 py-3.5 text-sm text-gray-900 first:pl-5 last:pr-5';

const BalanceLedgerTable = ({
  rows,
  totalCount = 0,
  isFetching = false,
  hasActiveFilters = false,
  onClearFilters,
  onSelectEmployee,
}) => {
  const isEmpty = rows.length === 0;

  return (
    <div className={clsx(DASHBOARD_PANEL, 'overflow-hidden')}>
      <div className="border-b border-gray-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">Balance ledger</h2>
        <p className="text-[11px] text-gray-500">
          {totalCount} {totalCount === 1 ? 'entry' : 'entries'}
          {isFetching ? ' · Updating…' : ''}
        </p>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
            <Users className="h-6 w-6 text-gray-400" strokeWidth={1.75} />
          </div>
          <p className="text-sm font-medium text-gray-900">No ledger entries found</p>
          <p className="mt-1 text-xs text-gray-500">
            {hasActiveFilters
              ? 'Try adjusting your search.'
              : 'No balance adjustments recorded yet.'}
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
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className={clsx(TH, 'min-w-28')}>Date</th>
                <th className={clsx(TH, 'min-w-40')}>Employee</th>
                <th className={clsx(TH, 'min-w-20')}>Type</th>
                <th className={clsx(TH, 'min-w-24')}>Amount</th>
                <th className={clsx(TH, 'min-w-28 hidden md:table-cell')}>Reference</th>
                <th className={clsx(TH, 'min-w-40 hidden lg:table-cell')}>Reason</th>
                <th className={clsx(TH, 'min-w-24')}>Balance after</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.id} className="transition-colors duration-200 hover:bg-gray-50/80">
                  <td className={TD}>
                    <span className="text-gray-700">{formatDate(row.transaction_date)}</span>
                    <p className="text-[10px] text-gray-400">{formatDateTime(row.created_at)}</p>
                  </td>
                  <td className={TD}>
                    <button
                      type="button"
                      onClick={() => onSelectEmployee?.(row)}
                      className="flex items-center gap-2 text-left"
                    >
                      <UserAvatar
                        className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-gray-100"
                        src={row.profilePhotoUrl || row.photo || row.avatar}
                        name={row.employee_name}
                        seed={row.employee_id}
                      />
                      <span className="font-semibold text-gray-900 hover:text-[#007AFF]">
                        {row.employee_name}
                      </span>
                    </button>
                  </td>
                  <td className={TD}>
                    <span
                      className={clsx(
                        'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize',
                        BALANCE_TRANSACTION_STYLES[row.transaction_type] ||
                          BALANCE_TRANSACTION_STYLES.give
                      )}
                    >
                      {BALANCE_TRANSACTION_LABELS[row.transaction_type] || row.transaction_type}
                    </span>
                  </td>
                  <td className={TD}>
                    <span className="tabular-nums font-medium">{formatMoney(row.amount)}</span>
                  </td>
                  <td className={clsx(TD, 'hidden md:table-cell')}>
                    <span className="text-gray-600">{row.reference || '—'}</span>
                  </td>
                  <td className={clsx(TD, 'hidden lg:table-cell')}>
                    <span className="line-clamp-2 text-gray-600">{row.notes || '—'}</span>
                  </td>
                  <td className={TD}>
                    <span className="tabular-nums font-medium text-gray-700">
                      {formatMoney(row.balance_after)}
                    </span>
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

export default BalanceLedgerTable;
