import clsx from 'clsx';
import {
  BONUS_STATUS_LABELS,
  BONUS_STATUS_STYLES,
  formatDateTime,
  formatMoney,
} from '../paymentUtils';
import { MONTHS } from '../PaymentPeriodBar';

const TH = 'px-4 py-3 text-left text-xs font-medium text-gray-500 first:pl-5 last:pr-5';
const TD = 'px-4 py-3.5 text-sm text-gray-900 first:pl-5 last:pr-5';

const periodLabel = (year, month) => `${MONTHS[(month || 1) - 1]} ${year}`;

const BonusTable = ({ rows, onRelease }) => (
  <div
    className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
    data-tour="payroll-table"
  >
    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
      <div>
        <h2 className="text-sm font-semibold text-gray-900">Scheduled bonuses</h2>
        <p className="text-[11px] text-gray-500">
          {rows.length} {rows.length === 1 ? 'bonus' : 'bonuses'}
        </p>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className={clsx(TH, 'min-w-28')}>Code</th>
            <th className={clsx(TH, 'min-w-36')}>Employee</th>
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
                <span className="font-mono text-xs text-gray-600">{row.employee_code}</span>
              </td>
              <td className={TD}>
                <p className="font-semibold text-gray-900">{row.employee_name}</p>
                {row.notes && <p className="mt-0.5 text-xs text-gray-500">{row.notes}</p>}
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

      {rows.length === 0 && (
        <div className="px-5 py-12 text-center text-sm text-gray-500">
          No bonuses found for this period.
        </div>
      )}
    </div>
  </div>
);

export default BonusTable;
