import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { ButtonSpinner, DashboardDatePicker, dashboardToast } from '../../../common';
import { formatMoney } from '../paymentUtils';

const labelClass = 'mb-1.5 block text-xs font-medium text-gray-500';
const inputClass =
  'w-full rounded-xl border border-gray-200/60 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] placeholder:text-gray-400 transition-colors duration-200 focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 disabled:opacity-50';

const todayIso = () => new Date().toISOString().slice(0, 10);

const AdvanceRecoverModal = ({ isOpen, advance, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    amount: '',
    payment_date: todayIso(),
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && advance) {
      setFormData({
        amount: String(advance.outstanding_amount || ''),
        payment_date: todayIso(),
        notes: '',
      });
      setErrors({});
    }
  }, [isOpen, advance]);

  const validate = () => {
    const next = {};
    const amount = Number(formData.amount);
    const max = Number(advance?.outstanding_amount || 0);
    if (!formData.amount || Number.isNaN(amount) || amount <= 0) {
      next.amount = 'Enter a valid amount greater than zero';
    } else if (amount > max) {
      next.amount = `Amount cannot exceed outstanding ${formatMoney(max)}`;
    }
    if (!formData.payment_date) next.payment_date = 'Payment date is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      dashboardToast.error('Please fix the errors below', 'Validation failed');
      return;
    }
    try {
      await onSave({
        advanceId: advance.id,
        amount: formData.amount,
        payment_date: formData.payment_date,
        notes: formData.notes.trim() || undefined,
      });
    } catch {
      // Parent handles toast and modal state
    }
  };

  if (!isOpen || !advance) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="advance-recover-title"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 id="advance-recover-title" className="text-lg font-semibold text-gray-900">
              Record recovery
            </h2>
            <p className="text-sm text-gray-500">
              {advance.employee_name} · Outstanding {formatMoney(advance.outstanding_amount)}
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

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="space-y-4 overflow-y-auto px-5 py-4">
            <div>
              <label htmlFor="recover-amount" className={labelClass}>
                Recovery amount (USD)
              </label>
              <input
                id="recover-amount"
                type="number"
                min="0"
                step="0.01"
                max={advance.outstanding_amount}
                value={formData.amount}
                onChange={(e) => setFormData((p) => ({ ...p, amount: e.target.value }))}
                className={inputClass}
                disabled={isLoading}
              />
              {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount}</p>}
            </div>

            <div>
              <label htmlFor="recover-date" className={labelClass}>
                Payment date
              </label>
              <DashboardDatePicker
                id="recover-date"
                value={formData.payment_date}
                onChange={(value) => setFormData((p) => ({ ...p, payment_date: value }))}
              />
              {errors.payment_date && (
                <p className="mt-1 text-xs text-red-600">{errors.payment_date}</p>
              )}
            </div>

            <div>
              <label htmlFor="recover-notes" className={labelClass}>
                Notes (optional)
              </label>
              <textarea
                id="recover-notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                className={inputClass}
                maxLength={500}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-xl border border-gray-200/60 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-[#007AFF] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0066DD] disabled:opacity-50"
            >
              {isLoading && <ButtonSpinner size="md" />}
              Record recovery
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvanceRecoverModal;
