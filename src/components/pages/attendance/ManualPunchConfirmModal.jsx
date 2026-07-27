import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { ButtonSpinner, dashboardToast } from '../../common';

export const MANUAL_ATTENDANCE_CONFIRMATION = 'manual attendance approved';

const inputClass =
  'w-full rounded-xl border border-gray-200/60 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] placeholder:text-gray-400 transition-colors duration-200 focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 disabled:opacity-50';

/**
 * Type-to-confirm modal for admin manual clock in / out.
 * Visual language matches DashboardToast (notification theme).
 */
export default function ManualPunchConfirmModal({
  isOpen,
  employee,
  action,
  isLoading = false,
  onClose,
  onConfirm,
}) {
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setConfirmationText('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen || !employee || !action) return null;

  const actionLabel = action === 'clock_in' ? 'Clock in' : 'Clock out';
  const matches = confirmationText === MANUAL_ATTENDANCE_CONFIRMATION;

  const handleConfirm = async () => {
    if (!matches || isLoading) return;
    setError(null);
    try {
      await onConfirm({
        employee_id: employee.id,
        action,
        confirmation: confirmationText,
      });
    } catch (err) {
      const detail =
        err?.data?.detail ||
        (Array.isArray(err?.data?.detail) ? err.data.detail[0]?.msg : null) ||
        err?.error ||
        err?.message ||
        'Manual punch failed';
      const message = typeof detail === 'string' ? detail : 'Manual punch failed';
      setError(message);
      dashboardToast.error(message, 'Manual punch failed');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="dashboard-toast-card w-full max-w-md overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="manual-punch-title"
      >
        <div className="flex items-start gap-3 px-4 py-3.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#007AFF] text-white">
            <Info className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p id="manual-punch-title" className="text-sm font-semibold text-gray-900">
              Manual {actionLabel.toLowerCase()}
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-gray-500">
              Record a manual {actionLabel.toLowerCase()} for{' '}
              <span className="font-medium text-gray-700">{employee.name}</span>
              {employee.employee_code ? ` (${employee.employee_code})` : ''}. This bypasses face
              recognition and should only be used when the kiosk cannot be used.
            </p>
          </div>
        </div>

        <div className="space-y-3 border-t border-gray-100 px-4 py-3.5">
          <div className="rounded-xl border border-[#007AFF]/20 bg-[#007AFF]/5 px-3 py-2.5">
            <p className="text-xs text-gray-600">
              To confirm, type{' '}
              <span className="font-mono text-[11px] font-semibold text-[#007AFF]">
                {MANUAL_ATTENDANCE_CONFIRMATION}
              </span>
            </p>
          </div>

          <input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder={`Type "${MANUAL_ATTENDANCE_CONFIRMATION}"`}
            className={clsx(
              inputClass,
              confirmationText && !matches
                ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
                : ''
            )}
            disabled={isLoading}
            autoComplete="off"
            autoFocus
          />
          {confirmationText && !matches && (
            <p className="flex items-center gap-1.5 text-xs text-[#FF3B30]">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
              Confirmation text doesn&apos;t match
            </p>
          )}
          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-[#FF3B30]/20 bg-[#FF3B30]/5 px-3 py-2.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#FF3B30]" strokeWidth={2} />
              <p className="text-xs text-[#FF3B30]">{error}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl border border-gray-200/60 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!matches || isLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#007AFF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0066DD] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <ButtonSpinner size="sm" className="text-white" />
                Processing…
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                Confirm {actionLabel.toLowerCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
