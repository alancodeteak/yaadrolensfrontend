import { useState } from 'react';
import { X } from 'lucide-react';
import { ButtonSpinner } from '../../../common';

const BalanceAdjustModal = ({ isOpen, employee, employees = [], onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    transaction_type: 'give',
    amount: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const resolvedEmployeeId = employee?.employee_id || employee?.id || formData.employee_id;
  const needsEmployeePicker = !employee?.employee_id && !employee?.id;

  const validate = () => {
    const next = {};
    if (needsEmployeePicker && !formData.employee_id) next.employee_id = 'Select an employee';
    if (!formData.amount || Number(formData.amount) <= 0) next.amount = 'Enter a positive amount';
    if (!formData.notes.trim()) next.notes = 'Note is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave({
      employeeId: resolvedEmployeeId,
      transaction_type: formData.transaction_type,
      amount: formData.amount,
      notes: formData.notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm" onClick={onClose} role="presentation">
      <div className="w-full max-w-md rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Adjust balance</h2>
            {employee && <p className="text-sm text-gray-500">{employee.name || employee.employee_name}</p>}
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          {needsEmployeePicker && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Employee</label>
              <select
                value={formData.employee_id}
                onChange={(e) => setFormData((p) => ({ ...p, employee_id: e.target.value }))}
                className="w-full rounded-xl border border-gray-200/60 px-3 py-2.5 text-sm"
              >
                <option value="">Select employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} ({emp.employee_code})
                  </option>
                ))}
              </select>
              {errors.employee_id && <p className="mt-1 text-xs text-red-600">{errors.employee_id}</p>}
            </div>
          )}
          <div className="flex gap-2">
            {['give', 'take'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData((p) => ({ ...p, transaction_type: type }))}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold capitalize ${
                  formData.transaction_type === type
                    ? 'border-[#007AFF] bg-[#007AFF]/10 text-[#007AFF]'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData((p) => ({ ...p, amount: e.target.value }))}
              className="w-full rounded-xl border border-gray-200/60 px-3 py-2.5 text-sm"
            />
            {errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Note</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
              rows={2}
              className="w-full rounded-xl border border-gray-200/60 px-3 py-2.5 text-sm"
              placeholder="Reason for adjustment"
            />
            {errors.notes && <p className="mt-1 text-xs text-red-600">{errors.notes}</p>}
          </div>
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button type="button" onClick={onClose} className="rounded-xl border border-gray-200/60 px-4 py-2.5 text-sm font-medium text-gray-700">Cancel</button>
            <button type="submit" disabled={isLoading} className="inline-flex items-center gap-2 rounded-xl bg-[#007AFF] px-4 py-2.5 text-sm font-semibold text-white">
              {isLoading && <ButtonSpinner size="sm" className="text-white" />}
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BalanceAdjustModal;
