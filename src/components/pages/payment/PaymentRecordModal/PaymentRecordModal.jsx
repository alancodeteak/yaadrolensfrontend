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

const PAYMENT_TYPES = [
  { value: 'monthly_salary', label: 'Monthly salary' },
  { value: 'bonus', label: 'Bonus' },
  { value: 'other', label: 'Other' },
];

const PaymentRecordModal = ({
  isOpen,
  onClose,
  onSave,
  isLoading,
  employees = [],
  prefillEmployee,
  defaultPeriodYear,
  defaultPeriodMonth,
}) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    payment_type: 'monthly_salary',
    amount: '',
    payment_date: todayIso(),
    period_year: '',
    period_month: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        employee_id: prefillEmployee?.employee_id || prefillEmployee?.id || '',
        payment_type: 'monthly_salary',
        amount: '',
        payment_date: todayIso(),
        period_year: defaultPeriodYear ? String(defaultPeriodYear) : '',
        period_month: defaultPeriodMonth ? String(defaultPeriodMonth) : '',
        notes: '',
      });
      setErrors({});
    }
  }, [isOpen, prefillEmployee, defaultPeriodYear, defaultPeriodMonth]);

  const validate = () => {
    const next = {};
    if (!formData.employee_id) next.employee_id = 'Select an employee';
    const amount = Number(formData.amount);
    if (!formData.amount || Number.isNaN(amount) || amount <= 0) {
      next.amount = 'Enter a valid amount greater than zero';
    }
    if (!formData.payment_date) next.payment_date = 'Payment date is required';
    if (formData.payment_type === 'monthly_salary') {
      if (!formData.period_year) next.period_year = 'Year is required';
      if (!formData.period_month) next.period_month = 'Month is required';
    }
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
        payment_type: formData.payment_type,
        amount: formData.amount,
        payment_date: formData.payment_date,
        period_year: formData.payment_type === 'monthly_salary' ? formData.period_year : undefined,
        period_month: formData.payment_type === 'monthly_salary' ? formData.period_month : undefined,
        notes: formData.notes.trim() || undefined,
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
        aria-labelledby="payment-record-title"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 id="payment-record-title" className="text-lg font-semibold text-gray-900">
              Record payment
            </h2>
            <p className="text-sm text-gray-500">Add a payout to the payment ledger.</p>
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
              <label htmlFor="payment-employee" className={labelClass}>
                Employee
              </label>
              <DashboardEmployeeSelect
                id="payment-employee"
                value={formData.employee_id}
                onChange={(employeeId) =>
                  setFormData((p) => ({ ...p, employee_id: employeeId }))
                }
                employees={employees}
                disabled={isLoading || Boolean(prefillEmployee)}
              />
              {errors.employee_id && (
                <p className="mt-1 text-xs text-red-600">{errors.employee_id}</p>
              )}
            </div>

            <div>
              <label htmlFor="payment-type" className={labelClass}>
                Payment type
              </label>
              <select
                id="payment-type"
                value={formData.payment_type}
                onChange={(e) => setFormData((p) => ({ ...p, payment_type: e.target.value }))}
                className={inputClass}
                disabled={isLoading}
              >
                {PAYMENT_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="payment-amount" className={labelClass}>
                Amount (INR)
              </label>
              <input
                id="payment-amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData((p) => ({ ...p, amount: e.target.value }))}
                className={inputClass}
                placeholder="3500.00"
                disabled={isLoading}
              />
              {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount}</p>}
            </div>

            <div>
              <label htmlFor="payment-date" className={labelClass}>
                Payment date
              </label>
              <DashboardDatePicker
                id="payment-date"
                value={formData.payment_date}
                onChange={(value) => setFormData((p) => ({ ...p, payment_date: value }))}
              />
              {errors.payment_date && (
                <p className="mt-1 text-xs text-red-600">{errors.payment_date}</p>
              )}
            </div>

            {formData.payment_type === 'monthly_salary' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="payment-year" className={labelClass}>
                    Period year
                  </label>
                  <input
                    id="payment-year"
                    type="number"
                    min="2000"
                    max="2100"
                    value={formData.period_year}
                    onChange={(e) => setFormData((p) => ({ ...p, period_year: e.target.value }))}
                    className={inputClass}
                    disabled={isLoading}
                  />
                  {errors.period_year && (
                    <p className="mt-1 text-xs text-red-600">{errors.period_year}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="payment-month" className={labelClass}>
                    Period month
                  </label>
                  <input
                    id="payment-month"
                    type="number"
                    min="1"
                    max="12"
                    value={formData.period_month}
                    onChange={(e) => setFormData((p) => ({ ...p, period_month: e.target.value }))}
                    className={inputClass}
                    disabled={isLoading}
                  />
                  {errors.period_month && (
                    <p className="mt-1 text-xs text-red-600">{errors.period_month}</p>
                  )}
                </div>
              </div>
            )}

            <div>
              <label htmlFor="payment-notes" className={labelClass}>
                Notes (optional)
              </label>
              <textarea
                id="payment-notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                className={inputClass}
                placeholder="June salary payout, bonus, etc."
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
              Record payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentRecordModal;
