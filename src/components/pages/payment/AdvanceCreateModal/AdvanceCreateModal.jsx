import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import {
  ButtonSpinner,
  DashboardDatePicker,
  DashboardEmployeeSelect,
  dashboardToast,
} from '../../../common';

const labelClass = 'mb-1.5 block text-xs font-medium text-gray-500';
const inputClass =
  'w-full rounded-xl border border-gray-200/60 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] placeholder:text-gray-400 transition-colors duration-200 focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 disabled:opacity-50';

const todayIso = () => new Date().toISOString().slice(0, 10);

const AdvanceCreateModal = ({ isOpen, onClose, onSave, isLoading, employees = [] }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    amount: '',
    advance_date: todayIso(),
    reason: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        employee_id: '',
        amount: '',
        advance_date: todayIso(),
        reason: '',
      });
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const next = {};
    if (!formData.employee_id) next.employee_id = 'Select an employee';
    const amount = Number(formData.amount);
    if (!formData.amount || Number.isNaN(amount) || amount <= 0) {
      next.amount = 'Enter a valid amount greater than zero';
    }
    if (!formData.advance_date) next.advance_date = 'Advance date is required';
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
        employee_id: formData.employee_id,
        amount: formData.amount,
        advance_date: formData.advance_date,
        reason: formData.reason.trim() || undefined,
      });
    } catch {
      // Parent handles toast and modal state
    }
  };

  if (!isOpen) return null;

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
        aria-labelledby="advance-create-title"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 id="advance-create-title" className="text-lg font-semibold text-gray-900">
              Request advance
            </h2>
            <p className="text-sm text-gray-500">Max 50% of employee monthly salary.</p>
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
              <label htmlFor="advance-employee" className={labelClass}>
                Employee
              </label>
              <DashboardEmployeeSelect
                id="advance-employee"
                value={formData.employee_id}
                onChange={(employeeId) =>
                  setFormData((p) => ({ ...p, employee_id: employeeId }))
                }
                employees={employees}
                disabled={isLoading}
              />
              {errors.employee_id && (
                <p className="mt-1 text-xs text-red-600">{errors.employee_id}</p>
              )}
            </div>

            <div>
              <label htmlFor="advance-amount" className={labelClass}>
                Amount (INR)
              </label>
              <input
                id="advance-amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData((p) => ({ ...p, amount: e.target.value }))}
                className={inputClass}
                placeholder="500.00"
                disabled={isLoading}
              />
              {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount}</p>}
            </div>

            <div>
              <label htmlFor="advance-date" className={labelClass}>
                Advance date
              </label>
              <DashboardDatePicker
                id="advance-date"
                value={formData.advance_date}
                onChange={(value) => setFormData((p) => ({ ...p, advance_date: value }))}
              />
              {errors.advance_date && (
                <p className="mt-1 text-xs text-red-600">{errors.advance_date}</p>
              )}
            </div>

            <div>
              <label htmlFor="advance-reason" className={labelClass}>
                Reason (optional)
              </label>
              <textarea
                id="advance-reason"
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData((p) => ({ ...p, reason: e.target.value }))}
                className={inputClass}
                placeholder="Emergency advance, etc."
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
              Submit request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvanceCreateModal;
