import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { History, Plus, Users, Wallet } from 'lucide-react';
import { UserAvatar, ButtonSpinner } from '../../../common';
import { DASHBOARD_BTN_PRIMARY, DASHBOARD_PANEL } from '../../dashboard/dashboardTheme';
import {
  formatDate,
  formatMoney,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_STYLES,
  PAYMENT_TYPE_LABELS,
  PAYMENT_TYPE_STYLES,
} from '../paymentUtils';
import { MONTHS } from '../PaymentPeriodBar';

const TH =
  'px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wide text-gray-400 first:pl-5 last:pr-5';

const TD = 'px-4 py-3.5 text-sm text-gray-900 first:pl-5 last:pr-5';

const periodLabel = (year, month) =>
  year && month ? `${MONTHS[(month || 1) - 1]} ${year}` : '—';

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
  totalCount = 0,
  isFetching = false,
  hasActiveFilters = false,
  onClearFilters,
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
  const showApprovalColumn = approvableCount > 0;
  const isEmpty = rows.length === 0;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        someApprovableSelected && !allApprovableSelected;
    }
  }, [someApprovableSelected, allApprovableSelected]);

  return (
    <div className={clsx(DASHBOARD_PANEL, 'relative overflow-hidden')} data-tour="payroll-table">
      <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Payment ledger</h2>
          <p className="text-[11px] text-gray-500">
            {totalCount} {totalCount === 1 ? 'payment' : 'payments'}
            {approvableCount > 0 && ` · ${approvableCount} pending approval`}
            {isFetching ? ' · Updating…' : ''}
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
              className={`${DASHBOARD_BTN_PRIMARY} py-2`}
            >
              {isApprovingSelected && <ButtonSpinner size="sm" className="text-white" />}
              Approve selected
            </button>
          </div>
        )}
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
            <Users className="h-6 w-6 text-gray-400" strokeWidth={1.75} />
          </div>
          <p className="text-sm font-medium text-gray-900">No payments found</p>
          <p className="mt-1 max-w-sm text-xs text-gray-500">
            {hasActiveFilters
              ? 'Try adjusting your search, filters, or selected period.'
              : 'No payments recorded for this period.'}
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
          <table className="w-full min-w-[880px]">
            <thead>
              <tr className="border-b border-gray-100">
                {showApprovalColumn && (
                  <th className={clsx(TH, 'w-10 pr-0')}>
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      checked={allApprovableSelected}
                      onChange={onToggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300 text-[#007AFF] focus:ring-[#007AFF]/30"
                      aria-label="Select all pending salaries on this page"
                    />
                  </th>
                )}
                <th className={clsx(TH, 'min-w-40')}>Employee</th>
                <th className={clsx(TH, 'min-w-28 hidden sm:table-cell')}>Code</th>
                <th className={clsx(TH, 'min-w-32')}>Type</th>
                <th className={clsx(TH, 'min-w-24')}>Status</th>
                <th className={clsx(TH, 'min-w-24')}>Amount</th>
                <th className={clsx(TH, 'min-w-28 hidden md:table-cell')}>Date</th>
                <th className={clsx(TH, 'min-w-28 hidden lg:table-cell')}>Period</th>
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
                    {showApprovalColumn && (
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
                    )}
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
                    <td className={clsx(TD, 'hidden md:table-cell')}>
                      <span className="text-gray-600">{formatDate(row.payment_date)}</span>
                    </td>
                    <td className={clsx(TD, 'hidden lg:table-cell')}>
                      <span className="text-gray-600">
                        {periodLabel(row.period_year, row.period_month)}
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
        </div>
      )}
    </div>
  );
};

export default PaymentTable;
