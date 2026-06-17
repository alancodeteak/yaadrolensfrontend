import { Scale, X } from 'lucide-react';
import { LottieLoader, Pagination, UserAvatar } from '../../../common';
import {
  BALANCE_TRANSACTION_LABELS,
  BALANCE_TRANSACTION_STYLES,
  formatDate,
  formatDateTime,
  formatMoney,
} from '../paymentUtils';

const BalanceHistoryPanel = ({
  isOpen,
  employee,
  transactions,
  runningBalance,
  isLoading,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  onClose,
  onAdjust,
}) => {
  if (!isOpen || !employee) return null;

  const items = transactions?.items || [];
  const displayName = employee.employee_name || employee.name;
  const showPagination = totalItems > itemsPerPage;

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
        aria-labelledby="balance-history-title"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <UserAvatar
              className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-gray-100"
              src={employee.profilePhotoUrl || employee.photo || employee.avatar}
              name={displayName}
              seed={employee.employee_id || employee.id}
            />
            <div>
              <h2 id="balance-history-title" className="text-lg font-semibold text-gray-900">
                Balance history
              </h2>
              <p className="text-sm text-gray-500">
                {displayName} · {employee.employee_code}
              </p>
            </div>
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

        <div className="border-b border-gray-100 px-5 py-4">
          <p className="text-xs text-gray-500">Running balance</p>
          <p className="text-2xl font-semibold text-gray-900">
            {formatMoney(runningBalance ?? employee.running_balance ?? 0)}
          </p>
          {onAdjust && (
            <button
              type="button"
              onClick={() => onAdjust(employee)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-gray-200/60 px-3 py-2 text-xs font-semibold text-[#007AFF] hover:bg-[#007AFF]/10"
            >
              <Scale className="h-3.5 w-3.5" strokeWidth={2} />
              Adjust balance
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LottieLoader size={48} />
            </div>
          ) : items.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">No balance adjustments yet.</p>
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
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            BALANCE_TRANSACTION_STYLES[item.transaction_type] ||
                            BALANCE_TRANSACTION_STYLES.give
                          }`}
                        >
                          {BALANCE_TRANSACTION_LABELS[item.transaction_type] || item.transaction_type}
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatDate(item.transaction_date)}
                        {item.reference ? ` · Ref ${item.reference}` : ''}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        Balance after {formatMoney(item.balance_after)}
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

        {showPagination && (
          <div className="border-t border-gray-100 px-5 py-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BalanceHistoryPanel;
