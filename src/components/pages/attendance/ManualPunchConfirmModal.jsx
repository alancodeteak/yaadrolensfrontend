import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { ConfirmationDialog, dashboardToast } from '../../common';

export const MANUAL_ATTENDANCE_CONFIRMATION = 'manual attendance approved';

const inputClass =
  'w-full rounded-xl border border-gray-200/60 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] placeholder:text-gray-400 transition-colors duration-200 focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 disabled:opacity-50';

/**
 * Type-to-confirm modal for admin manual clock in / out.
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

  if (!employee || !action) return null;

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
      throw err;
    }
  };

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      confirmDisabled={!matches || isLoading}
      title={`Manual ${actionLabel.toLowerCase()}`}
      variant="neutral"
      confirmText={`Confirm ${actionLabel.toLowerCase()}`}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <div className="space-y-3">
        <p>
          Record a manual <strong>{actionLabel.toLowerCase()}</strong> for{' '}
          <strong>{employee.name}</strong>
          {employee.employee_code ? ` (${employee.employee_code})` : ''}. This bypasses face
          recognition and should only be used when the kiosk cannot be used.
        </p>

        <div className="rounded-xl border border-amber-200/60 bg-amber-50 p-3">
          <p className="text-sm text-amber-800">
            To confirm, type{' '}
            <span className="font-mono text-xs font-semibold">
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
        />
        {confirmationText && !matches && (
          <p className="text-sm text-red-600">Confirmation text doesn&apos;t match</p>
        )}
        {error && (
          <div className="rounded-xl border border-red-200/60 bg-red-50 p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
      </div>
    </ConfirmationDialog>
  );
}
