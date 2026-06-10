import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { History, Plus, Wallet } from 'lucide-react';
import { ButtonSpinner } from '../../../common';
import {
  formatDate,
  formatMoney,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_STYLES,
  PAYMENT_TYPE_LABELS,
  PAYMENT_TYPE_STYLES,
} from '../paymentUtils';

const TH =
  'px-4 py-3 text-left text-xs font-medium text-gray-500 first:pl-5 last:pr-5';

const TD = 'px-4 py-3.5 text-sm text-gray-900 first:pl-5 last:pr-5';

const ActionButton = ({ onClick, title, children, className }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={clsx(
      'rounded-lg p-1.5 text-gray-400 transition-colors duration-200 hover:bg-blue-50 hover:text-[#007AFF]',
      className
    )}
  >
    {children}
  </button>
);

const isApprovableRow = (row) =>
  row.status === 'pending' && row.payment_type === 'monthly_salary';

const PaymentTable = ({
  rows,
  onHistory,
  onRecord,
  onMarkPaid,
  selectedIds = [],
  onToggleRow,
  onToggleSelectAll,
  allApprovableSelected = false,
  someApprovableSelected = false,
  approvableCount = 0,
  selectedCount = 0,
  selectedTotal = 0,
  onApproveSelected,
  isApprovingSelected = false,
}) => {
  const selectAllRef = useRef(null);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        someApprovableSelected && !allApprovableSelected;
    }
  }, [someApprovableSelected, allApprovableSelected]);

  return (
  <div
    className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
    data-tour="payroll-table"
  >
    <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-sm font-semibold text-gray-900">Payment ledger</h2>
        <p className="text-[11px] text-gray-500">
          {rows.length} {rows.length === 1 ? 'payment' : 'payments'}
          {approvableCount > 0 && ` · ${approvableCount} pending approval`}
        </p>
      </div>
      {selectedCount > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{selectedCount}</span> selected ·{' '}
            <span className="font-semibold text-[#007AFF]">{formatMoney(selectedTotal)}</span>
          </p>
          <button
            type="button"
            onClick={onApproveSelected}
            disabled={isApprovingSelected}
            className="inline-flex items-center gap-2 rounded-xl bg-[#007AFF] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#0066DD] disabled:opacity-60"
          >
            {isApprovingSelected && <ButtonSpinner size="sm" className="text-white" />}
            Approve selected
          </button>
        </div>
      )}
    </div>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[960px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className={clsx(TH, 'w-10 pr-0')}>
              <input
                ref={selectAllRef}
                type="checkbox"
                checked={allApprovableSelected}
                onChange={onToggleSelectAll}
                disabled={approvableCount === 0}
                className="h-4 w-4 rounded border-gray-300 text-[#007AFF] focus:ring-[#007AFF]/30 disabled:opacity-40"
                aria-label="Select all pending salaries on this page"
              />
            </th>
            <th className={clsx(TH, 'min-w-28')}>Code</th>
            <th className={clsx(TH, 'min-w-36')}>Employee</th>
            <th className={clsx(TH, 'min-w-32')}>Type</th>
            <th className={clsx(TH, 'min-w-24')}>Status</th>
            <th className={clsx(TH, 'min-w-24')}>Amount</th>
            <th className={clsx(TH, 'min-w-28')}>Date</th>
            <th className={clsx(TH, 'min-w-24 hidden lg:table-cell')}>Period</th>
            <th className={clsx(TH, 'w-28')}>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => {
            const approvable = isApprovableRow(row);
            const isSelected = selectedIds.includes(row.id);

            return (
            <tr
              key={row.id}
              className={clsx(
                'group transition-colors duration-200 hover:bg-gray-50/80',
                isSelected && 'bg-[#007AFF]/5'
              )}
            >
              <td className={clsx(TD, 'pr-0')}>
                {approvable ? (
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleRow?.(row.id)}
                    className="h-4 w-4 rounded border-gray-300 text-[#007AFF] focus:ring-[#007AFF]/30"
                    aria-label={`Select ${row.employee_name}`}
                  />
                ) : (
                  <span className="inline-block h-4 w-4" aria-hidden="true" />
                )}
              </td>
              <td className={TD}>
                <span className="font-mono text-xs text-gray-600">{row.employee_code}</span>
              </td>
              <td className={TD}>
                <p className="font-semibold text-gray-900">{row.employee_name}</p>
              </td>
              <td className={TD}>
                <span
                  className={clsx(
                    'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                    PAYMENT_TYPE_STYLES[row.payment_type] || PAYMENT_TYPE_STYLES.other
                  )}
                >
                  {PAYMENT_TYPE_LABELS[row.payment_type] || row.payment_type}
                </span>
              </td>
              <td className={TD}>
                <span
                  className={clsx(
                    'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                    PAYMENT_STATUS_STYLES[row.status] || PAYMENT_STATUS_STYLES.paid
                  )}
                >
                  {PAYMENT_STATUS_LABELS[row.status] || row.status}
                </span>
              </td>
              <td className={TD}>
                <span className="tabular-nums font-medium">{formatMoney(row.amount)}</span>
              </td>
              <td className={TD}>
                <span className="text-gray-600">{formatDate(row.payment_date)}</span>
              </td>
              <td className={clsx(TD, 'hidden lg:table-cell')}>
                <span className="text-gray-600">
                  {row.period_year && row.period_month
                    ? `${row.period_month}/${row.period_year}`
                    : '—'}
                </span>
              </td>
              <td className={TD}>
                <div className="flex items-center gap-1">
                  {row.status === 'approved' && row.payment_type === 'monthly_salary' && (
                    <ActionButton onClick={() => onMarkPaid?.(row)} title="Mark as paid">
                      <Wallet className="h-4 w-4" strokeWidth={2} />
                    </ActionButton>
                  )}
                  <ActionButton onClick={() => onHistory(row)} title="View history">
                    <History className="h-4 w-4" strokeWidth={2} />
                  </ActionButton>
                  <ActionButton onClick={() => onRecord(row)} title="Record payment">
                    <Plus className="h-4 w-4" strokeWidth={2} />
                  </ActionButton>
                </div>
              </td>
            </tr>
          );
          })}
        </tbody>
      </table>

      {rows.length === 0 && (
        <div className="px-5 py-12 text-center text-sm text-gray-500">
          No payments recorded for this period.
        </div>
      )}
    </div>
  </div>
  );
};

export default PaymentTable;
