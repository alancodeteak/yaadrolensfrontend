import { useState } from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { Eye, CheckCircle, Wallet } from 'lucide-react';
import { UserAvatar, ConfirmationDialog, dashboardToast } from '../../../common';
import {
  useApprovePayrollMutation,
  useMarkPayrollPaidMutation,
} from '../../../../store/api/payrollApi';

const TH = 'px-4 py-3 text-left text-xs font-medium text-gray-500 first:pl-5 last:pr-5';
const TD = 'px-4 py-3.5 text-sm text-gray-900 first:pl-5 last:pr-5';

const statusClass = {
  Paid: 'bg-emerald-100 text-emerald-700',
  Approved: 'bg-blue-100 text-blue-700',
  Pending: 'bg-orange-100 text-orange-700',
  Draft: 'bg-gray-100 text-gray-600',
};

const ActionButton = ({ onClick, title, children, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    disabled={disabled}
    className="rounded-lg p-1.5 text-gray-400 transition-colors duration-200 hover:bg-blue-50 hover:text-[#007AFF] disabled:opacity-50"
  >
    {children}
  </button>
);

const PayrollTable = ({ payrolls, onRefresh }) => {
  const navigate = useNavigate();
  const [confirmPayroll, setConfirmPayroll] = useState(null);

  const [approvePayroll, { isLoading: isApproving }] = useApprovePayrollMutation();
  const [markPayrollPaid, { isLoading: isMarkingPaid }] = useMarkPayrollPaidMutation();

  const runAction = async () => {
    if (!confirmPayroll) return;
    const { payroll, action } = confirmPayroll;
    const id = payroll.payrollId || payroll.id;
    try {
      if (action === 'approve') {
        await approvePayroll(id).unwrap();
        dashboardToast.success(`Payroll approved for ${payroll.name}.`, 'Approved');
      } else {
        await markPayrollPaid(id).unwrap();
        dashboardToast.success(`Payroll marked paid for ${payroll.name}.`, 'Payment recorded');
      }
      onRefresh?.();
    } catch (err) {
      dashboardToast.error(err?.data?.detail || 'Action failed.', 'Payroll update failed');
    } finally {
      setConfirmPayroll(null);
    }
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Payroll runs</h2>
            <p className="text-[11px] text-gray-500">
              {payrolls.length} {payrolls.length === 1 ? 'record' : 'records'}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className={clsx(TH, 'min-w-40')}>Employee</th>
                <th className={clsx(TH, 'min-w-24')}>Gross</th>
                <th className={clsx(TH, 'min-w-24 hidden md:table-cell')}>Deductions</th>
                <th className={clsx(TH, 'min-w-24')}>Net pay</th>
                <th className={clsx(TH, 'w-24')}>Status</th>
                <th className={clsx(TH, 'w-32')}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {payrolls.map((payroll) => (
                <tr key={payroll.payrollId || payroll.id} className="hover:bg-gray-50/80">
                  <td className={TD}>
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        className="h-9 w-9 rounded-full ring-1 ring-gray-100"
                        src={payroll.photo}
                        name={payroll.name}
                        seed={payroll.id}
                      />
                      <span className="font-semibold text-gray-900">{payroll.name}</span>
                    </div>
                  </td>
                  <td className={TD}>
                    <span className="tabular-nums">${payroll.grossPay.toLocaleString()}</span>
                  </td>
                  <td className={clsx(TD, 'hidden md:table-cell')}>
                    <span className="tabular-nums">${payroll.deductions.toLocaleString()}</span>
                  </td>
                  <td className={TD}>
                    <span className="tabular-nums font-semibold">${payroll.netPay.toLocaleString()}</span>
                  </td>
                  <td className={TD}>
                    <span
                      className={clsx(
                        'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                        statusClass[payroll.status] || statusClass.Pending
                      )}
                    >
                      {payroll.status}
                    </span>
                  </td>
                  <td className={TD}>
                    <div className="flex items-center gap-1">
                      <ActionButton
                        onClick={() => navigate(`/admin/payroll/${payroll.payrollId || payroll.id}`)}
                        title="View details"
                      >
                        <Eye className="h-4 w-4" strokeWidth={2} />
                      </ActionButton>
                      {(payroll.status === 'Pending' || payroll.status === 'Draft') && (
                        <ActionButton
                          onClick={() => setConfirmPayroll({ payroll, action: 'approve' })}
                          title="Approve"
                          disabled={isApproving}
                        >
                          <CheckCircle className="h-4 w-4" strokeWidth={2} />
                        </ActionButton>
                      )}
                      {payroll.status === 'Approved' && (
                        <ActionButton
                          onClick={() => setConfirmPayroll({ payroll, action: 'paid' })}
                          title="Mark paid"
                          disabled={isMarkingPaid}
                        >
                          <Wallet className="h-4 w-4" strokeWidth={2} />
                        </ActionButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {payrolls.length === 0 && (
            <div className="px-5 py-12 text-center text-sm text-gray-500">
              No payroll records for this period. Calculate payroll to get started.
            </div>
          )}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={Boolean(confirmPayroll)}
        onClose={() => setConfirmPayroll(null)}
        onConfirm={runAction}
        title={
          confirmPayroll?.action === 'approve' ? 'Approve payroll?' : 'Mark payroll as paid?'
        }
        message={
          confirmPayroll
            ? `${confirmPayroll.action === 'approve' ? 'Approve' : 'Mark as paid'} payroll for ${confirmPayroll.payroll.name}?`
            : ''
        }
        confirmText={confirmPayroll?.action === 'approve' ? 'Approve' : 'Mark paid'}
      />
    </>
  );
};

export default PayrollTable;
