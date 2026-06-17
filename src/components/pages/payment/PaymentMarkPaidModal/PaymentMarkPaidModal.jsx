import { useState } from 'react';
import { X } from 'lucide-react';
import { DashboardDatePicker, ButtonSpinner } from '../../../common';
import { formatMoney, PAYMENT_METHOD_LABELS } from '../paymentUtils';

const PaymentMarkPaidModal = ({ isOpen, payment, onClose, onSave, isLoading }) => {
  const today = new Date().toISOString().slice(0, 10);
  const [formData, setFormData] = useState({
    payment_date: today,
    payment_method: 'bank_transfer',
    payment_reference: '',
    notes: '',
  });

  if (!isOpen || !payment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave({
      paymentId: payment.id,
      ...formData,
      payment_reference: formData.payment_reference.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    });
  };

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
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Mark as paid</h2>
            <p className="text-sm text-gray-500">
              {payment.employee_name} · {payment.amount != null ? formatMoney(payment.amount) : ''}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="space-y-4 overflow-y-auto px-5 py-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Payment date</label>
              <DashboardDatePicker
                value={formData.payment_date}
                onChange={(v) => setFormData((p) => ({ ...p, payment_date: v }))}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Payment method</label>
              <select
                value={formData.payment_method}
                onChange={(e) => setFormData((p) => ({ ...p, payment_method: e.target.value }))}
                disabled={isLoading}
                className="w-full rounded-xl border border-gray-200/60 px-3 py-2.5 text-sm"
              >
                {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Reference / receipt</label>
              <input
                type="text"
                value={formData.payment_reference}
                onChange={(e) => setFormData((p) => ({ ...p, payment_reference: e.target.value }))}
                disabled={isLoading}
                className="w-full rounded-xl border border-gray-200/60 px-3 py-2.5 text-sm"
                placeholder="Transaction ID, cheque no., etc."
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                disabled={isLoading}
                rows={2}
                className="w-full rounded-xl border border-gray-200/60 px-3 py-2.5 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 px-5 py-4">
            <button type="button" onClick={onClose} disabled={isLoading} className="rounded-xl border border-gray-200/60 px-4 py-2.5 text-sm font-medium text-gray-700">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-[#007AFF] px-4 py-2.5 text-sm font-semibold text-white"
            >
              {isLoading && <ButtonSpinner size="sm" className="text-white" />}
              Confirm paid
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentMarkPaidModal;
