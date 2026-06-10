import clsx from 'clsx';
import { History, Scale } from 'lucide-react';
import { formatDateTime, formatMoney } from '../paymentUtils';

const TH = 'px-4 py-3 text-left text-xs font-medium text-gray-500 first:pl-5 last:pr-5';
const TD = 'px-4 py-3.5 text-sm text-gray-900 first:pl-5 last:pr-5';

const BalanceTable = ({ rows, onHistory, onAdjust }) => (
  <div
    className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
    data-tour="payroll-table"
  >
    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
      <div>
        <h2 className="text-sm font-semibold text-gray-900">Employee balances</h2>
        <p className="text-[11px] text-gray-500">
          Running balances applied when salaries are generated
        </p>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className={clsx(TH, 'min-w-28')}>Code</th>
            <th className={clsx(TH, 'min-w-36')}>Employee</th>
            <th className={clsx(TH, 'min-w-28')}>Running balance</th>
            <th className={clsx(TH, 'min-w-32 hidden lg:table-cell')}>Last updated</th>
            <th className={clsx(TH, 'w-36 text-right')}>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.employee_id} className="transition-colors duration-200 hover:bg-gray-50/80">
              <td className={TD}>
                <span className="font-mono text-xs text-gray-600">{row.employee_code}</span>
              </td>
              <td className={TD}>
                <p className="font-semibold text-gray-900">{row.employee_name}</p>
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

      {rows.length === 0 && (
        <div className="px-5 py-12 text-center text-sm text-gray-500">
          No employee balances found.
        </div>
      )}
    </div>
  </div>
);

export default BalanceTable;
