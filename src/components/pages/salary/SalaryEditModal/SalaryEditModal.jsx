import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import {
  DashboardDatePicker,
  LottieLoader,
  UserAvatar,
  dashboardToast,
} from '../../../common';
import {
  DASHBOARD_BTN_PRIMARY,
  DASHBOARD_BTN_SECONDARY,
} from '../../dashboard/dashboardTheme';
import { formatMonthlySalary } from '../../../../utils/helpers';

const labelClass = 'mb-1.5 block text-xs font-medium text-gray-500';
const inputClass =
  'w-full rounded-xl border border-gray-200/60 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] placeholder:text-gray-400 transition-colors duration-200 focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 disabled:opacity-50';

const todayIso = () => new Date().toISOString().slice(0, 10);

const SalaryEditModal = ({ isOpen, employee, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    new_amount: '',
    effective_date: todayIso(),
    reason: '',
  });
  const [errors, setErrors] = useState({});

  const currentSalary = employee?.current_salary;

  useEffect(() => {
    if (isOpen && employee) {
      setFormData({
        new_amount:
          employee.current_salary != null ? String(employee.current_salary) : '',
        effective_date: todayIso(),
        reason: '',
      });
      setErrors({});
    }
  }, [isOpen, employee]);

  const validate = () => {
    const next = {};
    const amount = Number(formData.new_amount);
    if (!formData.new_amount || Number.isNaN(amount) || amount <= 0) {
      next.new_amount = 'Enter a valid salary greater than zero';
    } else if (
      currentSalary != null &&
      !Number.isNaN(amount) &&
      Number(currentSalary) === amount
    ) {
      next.new_amount = 'New salary must differ from the current amount';
    }
    if (!formData.effective_date) {
      next.effective_date = 'Effective date is required';
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
        employeeId: employee.employee_id || employee.id,
        new_amount: formData.new_amount,
        effective_date: formData.effective_date,
        reason: formData.reason.trim() || undefined,
      });
      onClose();
    } catch {
      // Parent handles error toast
    }
  };

  if (!isOpen || !employee) return null;

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
        aria-labelledby="salary-edit-title"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <UserAvatar
              className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-gray-100"
              src={employee.profilePhotoUrl || employee.photo || employee.avatar}
              name={employee.name}
              seed={employee.employee_id || employee.id}
            />
            <div>
              <h2 id="salary-edit-title" className="text-lg font-semibold text-gray-900">
                Update salary
              </h2>
              <p className="text-sm text-gray-500">
                {employee.name} · {employee.employee_code}
              </p>
            </div>
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
            {currentSalary != null && (
              <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-3 py-2.5 text-sm">
                <span className="text-gray-500">Current monthly salary: </span>
                <span className="font-semibold tabular-nums text-gray-900">
                  {formatMonthlySalary(currentSalary)}
                </span>
              </div>
            )}

            <div>
              <label htmlFor="salary-amount" className={labelClass}>
                New monthly salary (INR)
              </label>
              <input
                id="salary-amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.new_amount}
                onChange={(e) => setFormData((p) => ({ ...p, new_amount: e.target.value }))}
                className={inputClass}
                placeholder="3500.00"
                disabled={isLoading}
              />
              {errors.new_amount && (
                <p className="mt-1 text-xs text-red-600">{errors.new_amount}</p>
              )}
            </div>

            <div>
              <label htmlFor="salary-effective-date" className={labelClass}>
                Effective date
              </label>
              <DashboardDatePicker
                id="salary-effective-date"
                value={formData.effective_date}
                onChange={(value) => setFormData((p) => ({ ...p, effective_date: value }))}
              />
              {errors.effective_date && (
                <p className="mt-1 text-xs text-red-600">{errors.effective_date}</p>
              )}
            </div>

            <div>
              <label htmlFor="salary-reason" className={labelClass}>
                Reason (optional)
              </label>
              <textarea
                id="salary-reason"
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData((p) => ({ ...p, reason: e.target.value }))}
                className={inputClass}
                placeholder="Annual raise, promotion, etc."
                maxLength={500}
                disabled={isLoading}
              />
            </div>

            <p className="text-xs text-gray-500">
              After saving, generate payments on the{' '}
              <Link to="/admin/payroll" className="font-medium text-[#007AFF] hover:underline">
                Payment
              </Link>{' '}
              page.
            </p>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className={DASHBOARD_BTN_SECONDARY}
            >
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className={DASHBOARD_BTN_PRIMARY}>
              {isLoading && <LottieLoader size={18} />}
              Save salary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalaryEditModal;
