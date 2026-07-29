import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { AlertCircle, CheckCircle2, Clock, Info } from 'lucide-react';
import { ButtonSpinner, DashboardTimePicker, dashboardToast } from '../../common';
import { formatOrgNowTime, orgMaxPunchTime, orgNowTime, clampManualPunchTime, isManualPunchTimeAllowed } from '../../../store/api/transforms';

export const MANUAL_ATTENDANCE_CONFIRMATION = 'manual attendance approved';

const inputClass =
  'w-full rounded-xl border border-gray-200/60 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] placeholder:text-gray-400 transition-colors duration-200 focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 disabled:opacity-50';

const labelClass = 'mb-1.5 block text-xs font-medium text-gray-500';

/**
 * Type-to-confirm modal for admin manual clock in / out.
 * Visual language matches DashboardToast (notification theme).
 */
export default function ManualPunchConfirmModal({
  isOpen,
  employee,
  action,
  timezone = 'Asia/Kolkata',
  onClose,
  onConfirm,
}) {
  const mountedRef = useRef(true);
  const [confirmationText, setConfirmationText] = useState('');
  const [punchTime, setPunchTime] = useState(() => orgNowTime(timezone));
  const [maxPunchTime, setMaxPunchTime] = useState(() => orgMaxPunchTime(timezone));
  const [liveOrgClock, setLiveOrgClock] = useState(() => formatOrgNowTime(timezone));
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setConfirmationText('');
      setError(null);
      setIsSubmitting(false);
      return undefined;
    }

    const nowTime = orgNowTime(timezone);
    const latestTime = orgMaxPunchTime(timezone);
    setPunchTime(nowTime);
    setMaxPunchTime(latestTime);
    setLiveOrgClock(formatOrgNowTime(timezone));
    setConfirmationText('');
    setError(null);
    setIsSubmitting(false);

    const timer = window.setInterval(() => {
      if (mountedRef.current) {
        setLiveOrgClock(formatOrgNowTime(timezone));
        setMaxPunchTime(orgMaxPunchTime(timezone));
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isOpen, timezone, action, employee?.id]);

  if (!isOpen || !employee || !action) return null;

  const actionLabel = action === 'clock_in' ? 'Clock in' : 'Clock out';
  const matches = confirmationText === MANUAL_ATTENDANCE_CONFIRMATION;
  const busy = isSubmitting;
  const punchTimeInvalid = punchTime && !isManualPunchTimeAllowed(punchTime, timezone);

  const handleUseNow = () => {
    setPunchTime(orgNowTime(timezone));
    setError(null);
  };

  const handlePunchTimeChange = (next) => {
    setPunchTime(clampManualPunchTime(next, timezone));
    setError(null);
  };

  const handleConfirm = async () => {
    if (!matches || busy) return;
    if (!isManualPunchTimeAllowed(punchTime, timezone)) {
      setError('Punch time cannot be in the future.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onConfirm({
        employee_id: employee.id,
        action,
        confirmation: confirmationText,
        punch_time: punchTime
          ? punchTime.length === 5
            ? `${punchTime}:00`
            : punchTime
          : undefined,
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
    } finally {
      if (mountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm"
      onClick={busy ? undefined : onClose}
      role="presentation"
    >
      <div
        className="dashboard-toast-card w-full max-w-md rounded-2xl border border-gray-200/60 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
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
          <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50/80 px-3 py-2">
            <Clock className="h-4 w-4 shrink-0 text-[#007AFF]" strokeWidth={2} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                Org time now
              </p>
              <p className="text-sm font-semibold tabular-nums text-gray-900">{liveOrgClock}</p>
            </div>
            <span className="text-[10px] font-medium text-gray-400">{timezone}</span>
          </div>

          <div className="relative z-10 overflow-visible">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label htmlFor="manual-punch-time" className={labelClass}>
                Punch time
              </label>
              <button
                type="button"
                onClick={handleUseNow}
                disabled={busy}
                className="text-[11px] font-semibold text-[#007AFF] hover:underline disabled:opacity-50"
              >
                Use current time
              </button>
            </div>
            <DashboardTimePicker
              id="manual-punch-time"
              value={punchTime}
              onChange={handlePunchTimeChange}
              maxTime={maxPunchTime}
              minuteStep={1}
            />
            <p className="mt-1.5 text-[11px] text-gray-500">
              Defaults to now in your organization timezone. You can only pick a time up to the
              current moment (today).
            </p>
            {punchTimeInvalid && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#FF3B30]">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                Punch time cannot be in the future.
              </p>
            )}
          </div>

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
            disabled={busy}
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
            disabled={busy}
            className="rounded-xl border border-gray-200/60 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!matches || busy || !punchTime || punchTimeInvalid}
            className="inline-flex items-center gap-2 rounded-xl bg-[#007AFF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0066DD] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? (
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
