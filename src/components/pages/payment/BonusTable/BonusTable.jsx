import clsx from 'clsx';
import { Users } from 'lucide-react';
import { UserAvatar } from '../../../common';
import { DASHBOARD_BTN_PRIMARY, DASHBOARD_PANEL } from '../../dashboard/dashboardTheme';
import {
  BONUS_STATUS_LABELS,
  BONUS_STATUS_STYLES,
  formatDateTime,
  formatMoney,
} from '../paymentUtils';
import { MONTHS } from '../PaymentPeriodBar';

const TH =
  'px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wide text-gray-400 first:pl-5 last:pr-5';

const TD = 'px-4 py-3.5 text-sm text-gray-900 first:pl-5 last:pr-5';

const periodLabel = (year, month) => `${MONTHS[(month || 1) - 1]} ${year}`;

const BonusTable = ({
  rows,
  totalCount = 0,
  isFetching = false,
  hasActiveFilters = false,
  onClearFilters,
  onRelease,
}) => {
  const isEmpty = rows.length === 0;

  return (
    <div className={clsx(DASHBOARD_PANEL, 'overflow-hidden')} data-tour="payroll-table">
      <div className="border-b border-gray-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">Scheduled bonuses</h2>
        <p className="text-[11px] text-gray-500">
          {totalCount} {totalCount === 1 ? 'bonus' : 'bonuses'}
          {isFetching ? ' · Updating…' : ''}
        </p>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
            <Users className="h-6 w-6 text-gray-400" strokeWidth={1.75} />
          </div>
          <p className="text-sm font-medium text-gray-900">No bonuses found</p>
          <p className="mt-1 text-xs text-gray-500">
            {hasActiveFilters
              ? 'Try adjusting your search or filters.'
              : 'No bonuses for this period.'}
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
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className={clsx(TH, 'min-w-40')}>Employee</th>
                <th className={clsx(TH, 'min-w-28')}>Period</th>
                <th className={clsx(TH, 'min-w-24')}>Amount</th>
                <th className={clsx(TH, 'min-w-24')}>Status</th>
                <th className={clsx(TH, 'min-w-32 hidden lg:table-cell')}>Created</th>
                <th className={clsx(TH, 'w-32 text-right')}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.id} className="transition-colors duration-200 hover:bg-gray-50/80">
                  <td className={TD}>
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-gray-100"
                        src={row.profilePhotoUrl || row.photo || row.avatar}
                        name={row.employee_name}
                        seed={row.employee_id}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {row.employee_name}
                        </p>
                        {row.notes && (
                          <p className="truncate text-xs text-gray-500">{row.notes}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className={TD}>
                    <span className="text-gray-700">
                      {periodLabel(row.period_year, row.period_month)}
                    </span>
                  </td>
                  <td className={TD}>
                    <span className="tabular-nums font-medium">{formatMoney(row.amount)}</span>
                  </td>
                  <td className={TD}>
                    <span
                      className={clsx(
                        'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                        BONUS_STATUS_STYLES[row.status] || BONUS_STATUS_STYLES.scheduled
                      )}
                    >
                      {BONUS_STATUS_LABELS[row.status] || row.status}
                    </span>
                  </td>
                  <td className={clsx(TD, 'hidden lg:table-cell')}>
                    <span className="text-gray-600">{formatDateTime(row.created_at)}</span>
                  </td>
                  <td className={clsx(TD, 'text-right')}>
                    {row.status === 'scheduled' && (
                      <button
                        type="button"
                        onClick={() => onRelease?.(row)}
                        className="rounded-lg px-2.5 py-1 text-xs font-semibold text-[#007AFF] transition-colors hover:bg-[#007AFF]/10"
                      >
                        Quick release
                      </button>
                    )}
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

export default BonusTable;
