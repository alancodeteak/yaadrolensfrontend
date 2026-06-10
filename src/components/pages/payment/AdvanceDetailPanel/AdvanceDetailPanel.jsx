import clsx from 'clsx';
import { X } from 'lucide-react';
import { LottieLoader } from '../../../common';
import {
  ADVANCE_STATUS_LABELS,
  ADVANCE_STATUS_STYLES,
  formatDate,
  formatDateTime,
  formatMoney,
  PAYMENT_TYPE_LABELS,
} from '../paymentUtils';

const AdvanceDetailPanel = ({
  isOpen,
  advance,
  isLoading,
  onClose,
  onApprove,
  onDisburse,
  onCancel,
  onRecover,
}) => {
  if (!isOpen) return null;

  const detail = advance;
  const payments = detail?.payments || [];

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
        aria-labelledby="advance-detail-title"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 id="advance-detail-title" className="text-lg font-semibold text-gray-900">
              Advance details
            </h2>
            {detail && (
              <p className="text-sm text-gray-500">
                {detail.employee_name} · {detail.employee_code}
              </p>
            )}
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

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <LottieLoader size={48} />
          </div>
        ) : detail ? (
          <>
            <div className="space-y-4 border-b border-gray-100 px-5 py-4">
              <div className="flex items-center justify-between">
                <span
                  className={clsx(
                    'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                    ADVANCE_STATUS_STYLES[detail.status]
                  )}
                >
                  {ADVANCE_STATUS_LABELS[detail.status]}
                </span>
                <span className="text-sm text-gray-500">{formatDate(detail.advance_date)}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="font-semibold text-gray-900">{formatMoney(detail.amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Outstanding</p>
                  <p className="font-semibold text-gray-900">
                    {formatMoney(detail.outstanding_amount)}
                  </p>
                </div>
              </div>

              {detail.reason && (
                <p className="text-sm text-gray-600">{detail.reason}</p>
              )}

              {detail.approved_at && (
                <p className="text-xs text-gray-500">
                  Approved {formatDateTime(detail.approved_at)}
                </p>
              )}
              {detail.disbursed_at && (
                <p className="text-xs text-gray-500">
                  Disbursed {formatDateTime(detail.disbursed_at)}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
                {detail.status === 'pending' && (
                  <>
                    <button
                      type="button"
                      onClick={() => onApprove(detail)}
                      className="rounded-xl bg-[#007AFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0066DD]"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => onCancel(detail)}
                      className="rounded-xl border border-gray-200/60 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel request
                    </button>
                  </>
                )}
                {detail.status === 'approved' && (
                  <>
                    <button
                      type="button"
                      onClick={() => onDisburse(detail)}
                      className="rounded-xl bg-[#007AFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0066DD]"
                    >
                      Disburse
                    </button>
                    <button
                      type="button"
                      onClick={() => onCancel(detail)}
                      className="rounded-xl border border-gray-200/60 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel request
                    </button>
                  </>
                )}
                {detail.status === 'disbursed' && (
                  <button
                    type="button"
                    onClick={() => onRecover(detail)}
                    className="rounded-xl bg-[#007AFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0066DD]"
                  >
                    Record recovery
                  </button>
                )}
                {(detail.status === 'fully_recovered' || detail.status === 'cancelled') && (
                  <p className="text-sm text-gray-500">No actions available for this advance.</p>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Linked payments</h3>
              {payments.length === 0 ? (
                <p className="text-sm text-gray-500">No linked payments yet.</p>
              ) : (
                <ul className="space-y-3">
                  {payments.map((payment) => (
                    <li
                      key={payment.id}
                      className="rounded-2xl border border-gray-200/60 bg-gray-50/50 p-4"
                    >
                      <p className="text-sm font-semibold text-gray-900">
                        {formatMoney(payment.amount)} ·{' '}
                        {PAYMENT_TYPE_LABELS[payment.payment_type] || payment.payment_type}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatDate(payment.payment_date)} · {formatDateTime(payment.created_at)}
                      </p>
                      {payment.notes && (
                        <p className="mt-2 text-sm text-gray-600">{payment.notes}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
            Advance not found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvanceDetailPanel;
