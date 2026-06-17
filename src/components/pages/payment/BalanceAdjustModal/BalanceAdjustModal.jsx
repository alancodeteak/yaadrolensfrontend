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

const TRANSACTION_TYPES = [
  { value: 'give', label: 'Give (add to balance)' },
  { value: 'take', label: 'Take (deduct from balance)' },
];

const todayIso = () => new Date().toISOString().slice(0, 10);

const BalanceAdjustModal = ({ isOpen, employee, employees = [], onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    transaction_type: 'give',
    amount: '',
    transaction_date: todayIso(),
    reference: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  const needsEmployeePicker = !employee?.employee_id && !employee?.id;
  const employeeName = employee?.name || employee?.employee_name;

  useEffect(() => {
    if (!isOpen) return;
    setFormData({
      employee_id: employee?.employee_id || employee?.id || '',
      transaction_type: 'give',
      amount: '',
      transaction_date: todayIso(),
      reference: '',
      notes: '',
    });
    setErrors({});
  }, [isOpen, employee]);

  const validate = () => {
    const next = {};
    if (needsEmployeePicker && !formData.employee_id) next.employee_id = 'Select an employee';
    const amount = Number(formData.amount);
    if (!formData.amount || Number.isNaN(amount) || amount <= 0) {
      next.amount = 'Enter a valid amount greater than zero';
    }
    if (!formData.transaction_date) next.transaction_date = 'Date is required';
    if (!formData.notes.trim()) next.notes = 'Reason is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      dashboardToast.error('Please fix the errors below', 'Validation failed');
      return;
    }
    const employeeId = employee?.employee_id || employee?.id || formData.employee_id;
    try {
      await onSave({
        employeeId,
        transaction_type: formData.transaction_type,
        amount: formData.amount,
        transaction_date: formData.transaction_date,
        reference: formData.reference.trim() || undefined,
        notes: formData.notes.trim(),
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
        aria-labelledby="balance-adjust-title"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 id="balance-adjust-title" className="text-lg font-semibold text-gray-900">
              Adjust balance
            </h2>
            <p className="text-sm text-gray-500">
              {employeeName
                ? `${employeeName} · ledger entry with proof`
                : 'Add a balance adjustment to the ledger.'}
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
            {needsEmployeePicker && (
              <div>
                <label htmlFor="balance-employee" className={labelClass}>
                  Employee
                </label>
                <DashboardEmployeeSelect
                  id="balance-employee"
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
            )}

            <div>
              <label htmlFor="balance-type" className={labelClass}>
                Type
              </label>
              <select
                id="balance-type"
                value={formData.transaction_type}
                onChange={(e) => setFormData((p) => ({ ...p, transaction_type: e.target.value }))}
                className={inputClass}
                disabled={isLoading}
              >
                {TRANSACTION_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="balance-amount" className={labelClass}>
                Amount (INR)
              </label>
              <input
                id="balance-amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData((p) => ({ ...p, amount: e.target.value }))}
                className={inputClass}
                placeholder="0.00"
                disabled={isLoading}
              />
              {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount}</p>}
            </div>

            <div>
              <label htmlFor="balance-date" className={labelClass}>
                Adjustment date
              </label>
              <DashboardDatePicker
                id="balance-date"
                value={formData.transaction_date}
                onChange={(value) => setFormData((p) => ({ ...p, transaction_date: value }))}
                disabled={isLoading}
              />
              {errors.transaction_date && (
                <p className="mt-1 text-xs text-red-600">{errors.transaction_date}</p>
              )}
            </div>

            <div>
              <label htmlFor="balance-reference" className={labelClass}>
                Reference (optional)
              </label>
              <input
                id="balance-reference"
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData((p) => ({ ...p, reference: e.target.value }))}
                className={inputClass}
                placeholder="Receipt no., voucher ID, etc."
                maxLength={200}
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="balance-reason" className={labelClass}>
                Reason
              </label>
              <textarea
                id="balance-reason"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                className={inputClass}
                placeholder="Why is this balance being adjusted?"
                maxLength={500}
                disabled={isLoading}
              />
              {errors.notes && <p className="mt-1 text-xs text-red-600">{errors.notes}</p>}
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
              Record adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BalanceAdjustModal;
