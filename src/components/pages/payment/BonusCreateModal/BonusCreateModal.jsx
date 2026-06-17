import { useState } from 'react';
import { X } from 'lucide-react';
import { ButtonSpinner, DashboardEmployeeSelect } from '../../../common';
import { MONTHS } from '../PaymentPeriodBar';

const BonusCreateModal = ({ isOpen, onClose, onSave, isLoading, employees = [], defaultYear, defaultMonth }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    period_year: defaultYear || new Date().getFullYear(),
    period_month: defaultMonth || new Date().getMonth() + 1,
    amount: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const next = {};
    if (!formData.employee_id) next.employee_id = 'Select an employee';
    if (!formData.amount || Number(formData.amount) <= 0) next.amount = 'Enter a positive amount';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave({
      employee_id: formData.employee_id,
      period_year: Number(formData.period_year),
      period_month: Number(formData.period_month),
      amount: formData.amount,
      notes: formData.notes.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm" onClick={onClose} role="presentation">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Schedule bonus</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Employee</label>
            <DashboardEmployeeSelect
              id="bonus-employee"
              value={formData.employee_id}
              onChange={(employeeId) =>
                setFormData((p) => ({ ...p, employee_id: employeeId }))
              }
              employees={employees}
              disabled={isLoading}
            />
            {errors.employee_id && <p className="mt-1 text-xs text-red-600">{errors.employee_id}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Month</label>
              <select
                value={formData.period_month}
                onChange={(e) => setFormData((p) => ({ ...p, period_month: e.target.value }))}
                className="w-full rounded-xl border border-gray-200/60 px-3 py-2.5 text-sm"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Year</label>
              <input
                type="number"
                value={formData.period_year}
                onChange={(e) => setFormData((p) => ({ ...p, period_year: e.target.value }))}
                className="w-full rounded-xl border border-gray-200/60 px-3 py-2.5 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Amount</label>
            <input type="number" min="0" step="0.01" value={formData.amount} onChange={(e) => setFormData((p) => ({ ...p, amount: e.target.value }))} className="w-full rounded-xl border border-gray-200/60 px-3 py-2.5 text-sm" />
            {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Notes</label>
            <textarea value={formData.notes} onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))} rows={2} className="w-full rounded-xl border border-gray-200/60 px-3 py-2.5 text-sm" />
          </div>
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button type="button" onClick={onClose} className="rounded-xl border border-gray-200/60 px-4 py-2.5 text-sm font-medium text-gray-700">Cancel</button>
            <button type="submit" disabled={isLoading} className="inline-flex items-center gap-2 rounded-xl bg-[#007AFF] px-4 py-2.5 text-sm font-semibold text-white">
              {isLoading && <ButtonSpinner size="sm" className="text-white" />}
              Schedule bonus
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BonusCreateModal;
