import { X } from 'lucide-react';
import { LottieLoader, Pagination } from '../../../common';

const formatSalary = (value) =>
  value != null ? `$${Number(value).toLocaleString()}` : '—';

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatDateTime = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const SalaryHistoryPanel = ({
  isOpen,
  employee,
  history,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onClose,
}) => {
  if (!isOpen || !employee) return null;

  const items = history?.items || [];

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
        aria-labelledby="salary-history-title"
        data-tour="salary-history"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 id="salary-history-title" className="text-lg font-semibold text-gray-900">
              Salary history
            </h2>
            <p className="text-sm text-gray-500">
              {employee.name} · {employee.employee_code}
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

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LottieLoader size={48} />
            </div>
          ) : items.length === 0 ? (
            <p className="py-12 text-center text-sm text-gray-500">No salary changes recorded yet.</p>
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
                        {formatSalary(item.previous_amount)} → {formatSalary(item.new_amount)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Effective {formatDate(item.effective_date)}
                      </p>
                    </div>
                    <span className="shrink-0 text-[10px] text-gray-400">
                      {formatDateTime(item.created_at)}
                    </span>
                  </div>
                  {item.reason && (
                    <p className="mt-2 text-sm text-gray-600">{item.reason}</p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">By {item.changed_by_name}</p>
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

export default SalaryHistoryPanel;
