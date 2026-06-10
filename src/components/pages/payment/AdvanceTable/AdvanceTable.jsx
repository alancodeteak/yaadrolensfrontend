import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import {
  ADVANCE_STATUS_LABELS,
  ADVANCE_STATUS_STYLES,
  formatDate,
  formatMoney,
} from '../paymentUtils';

const TH =
  'px-4 py-3 text-left text-xs font-medium text-gray-500 first:pl-5 last:pr-5';

const TD = 'px-4 py-3.5 text-sm text-gray-900 first:pl-5 last:pr-5';

const AdvanceTable = ({ rows, onView, onApprove }) => (
  <div
    className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
    data-tour="payroll-table"
  >
    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
      <div>
        <h2 className="text-sm font-semibold text-gray-900">Salary advances</h2>
        <p className="text-[11px] text-gray-500">
          {rows.length} {rows.length === 1 ? 'advance' : 'advances'}
        </p>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className={clsx(TH, 'min-w-28')}>Code</th>
            <th className={clsx(TH, 'min-w-36')}>Employee</th>
            <th className={clsx(TH, 'min-w-24')}>Amount</th>
            <th className={clsx(TH, 'min-w-24')}>Outstanding</th>
            <th className={clsx(TH, 'min-w-28')}>Advance date</th>
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
                <span className="font-mono text-xs text-gray-600">{row.employee_code}</span>
              </td>
              <td className={TD}>
                <p className="font-semibold text-gray-900">{row.employee_name}</p>
              </td>
              <td className={TD}>
                <span className="tabular-nums font-medium">{formatMoney(row.amount)}</span>
              </td>
              <td className={TD}>
                <span className="tabular-nums text-gray-700">
                  {formatMoney(row.outstanding_amount)}
                </span>
              </td>
              <td className={TD}>
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

      {rows.length === 0 && (
        <div className="px-5 py-12 text-center text-sm text-gray-500">
          No salary advances found.
        </div>
      )}
    </div>
  </div>
);

export default AdvanceTable;
