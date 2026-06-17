import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { dashboardToast } from '../../../common';

const labelClass = 'mb-1.5 block text-xs font-medium text-gray-500';
const inputClass =
  'w-full rounded-xl border border-gray-200/60 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20';

function toDateInputValue(value) {
  if (!value) return '';
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return String(value).slice(0, 10);
}

function addDays(isoDate, days) {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

const MarkLeaveModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  defaultDate,
  maxFutureLeaveDays = 90,
}) => {
  const today = useMemo(() => toDateInputValue(new Date()), []);
  const maxDate = useMemo(() => addDays(today, maxFutureLeaveDays), [today, maxFutureLeaveDays]);

  const [leaveDate, setLeaveDate] = useState(defaultDate || today);
  const [leaveType, setLeaveType] = useState('paid');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setLeaveDate(defaultDate || today);
    setLeaveType('paid');
    setReason('');
  }, [isOpen, defaultDate, today]);

  if (!isOpen) return null;

  const isFuture = leaveDate > today;
  const title = isFuture ? 'Schedule leave' : 'Mark leave';
  const submitLabel = isLoading ? 'Saving…' : isFuture ? 'Schedule leave' : 'Mark leave';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!leaveDate) {
      dashboardToast.error('Please select a date.', 'Date required');
      return;
    }
    if (leaveDate > maxDate) {
      dashboardToast.error(
        `Leave can only be scheduled up to ${maxFutureLeaveDays} days ahead.`,
        'Date too far'
      );
      return;
    }
    try {
      await onSubmit({
        leave_date: leaveDate,
        leave_type: leaveType,
        reason: reason.trim() || undefined,
      });
      onClose();
    } catch {
      // Parent handles toast
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mark-leave-title"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 id="mark-leave-title" className="text-sm font-semibold text-gray-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <p className="text-xs text-gray-500">
            Mark leave for today or schedule it for an upcoming date (up to {maxFutureLeaveDays}{' '}
            days ahead).
          </p>

          <div>
            <label htmlFor="leave-date" className={labelClass}>
              Date
            </label>
            <input
              id="leave-date"
              type="date"
              value={leaveDate}
              min={today}
              max={maxDate}
              onChange={(e) => setLeaveDate(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label htmlFor="leave-type" className={labelClass}>
              Leave type
            </label>
            <select
              id="leave-type"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className={inputClass}
            >
              <option value="paid">Paid leave</option>
              <option value="unpaid">Unpaid leave</option>
              <option value="half">Half day</option>
            </select>
          </div>

          <div>
            <label htmlFor="leave-reason" className={labelClass}>
              Reason (optional)
            </label>
            <textarea
              id="leave-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className={inputClass}
              rows={3}
              maxLength={500}
              placeholder="e.g. Family function"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200/60 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-xl bg-[#007AFF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0066DD] disabled:opacity-50"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarkLeaveModal;
