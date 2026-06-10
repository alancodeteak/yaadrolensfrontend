import { Scale, X } from 'lucide-react';
import { LottieLoader, Pagination } from '../../../common';
import {
  formatDate,
  formatDateTime,
  formatMoney,
  PAYMENT_TYPE_LABELS,
} from '../paymentUtils';

const PaymentHistoryPanel = ({
  isOpen,
  employee,
  summary,
  history,
  isLoading,
  summaryLoading,
  currentPage,
  totalPages,
  onPageChange,
  onClose,
  onAdjustBalance,
}) => {
  if (!isOpen || !employee) return null;

  const items = history?.items || [];
  const displayName = employee.employee_name || employee.name;
  const displayCode = employee.employee_code;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex h-full w-full max-w-lg flex-col border-l border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-history-title"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 id="payment-history-title" className="text-lg font-semibold text-gray-900">
              Payment history
            </h2>
            <p className="text-sm text-gray-500">
              {displayName} · {displayCode}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {summaryLoading ? (
          <div className="flex justify-center border-b border-gray-100 py-6">
            <LottieLoader size={32} />
          </div>
        ) : summary ? (
          <div className="border-b border-gray-100 px-5 py-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-500">Current salary</p>
                <p className="font-semibold text-gray-900">
                  {summary.current_salary != null ? formatMoney(summary.current_salary) : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total paid</p>
                <p className="font-semibold text-gray-900">{formatMoney(summary.total_paid)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Outstanding advance</p>
                <p className="font-semibold text-gray-900">
                  {formatMoney(summary.outstanding_advance)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Running balance</p>
                <p className="font-semibold text-gray-900">
                  {formatMoney(summary.running_balance ?? 0)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Last payment</p>
                <p className="font-semibold text-gray-900">{formatDate(summary.last_payment_date)}</p>
              </div>
            </div>
            {onAdjustBalance && (
              <button
                type="button"
                onClick={() => onAdjustBalance(employee)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-gray-200/60 px-3 py-2 text-xs font-semibold text-[#007AFF] hover:bg-[#007AFF]/10"
              >
                <Scale className="h-3.5 w-3.5" strokeWidth={2} />
                Adjust balance
              </button>
            )}
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LottieLoader size={48} />
            </div>
          ) : items.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">No payments recorded yet.</p>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="rounded-2xl border border-gray-200/60 bg-gray-50/50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatMoney(item.amount)} ·{' '}
                        {PAYMENT_TYPE_LABELS[item.payment_type] || item.payment_type}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Paid {formatDate(item.payment_date)}
                        {item.period_year && item.period_month
                          ? ` · Period ${item.period_month}/${item.period_year}`
                          : ''}
                      </p>
                    </div>
                    <span className="shrink-0 text-[10px] text-gray-400">
                      {formatDateTime(item.created_at)}
                    </span>
                  </div>
                  {item.notes && <p className="mt-2 text-sm text-gray-600">{item.notes}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>

        {totalPages > 1 && (
          <div className="border-t border-gray-100 px-5 py-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistoryPanel;
