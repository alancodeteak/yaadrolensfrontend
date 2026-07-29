import React from 'react';
import {
  PaymentRecordModal,
  AdvanceCreateModal,
  AdvanceRecoverModal,
  PaymentHistoryPanel,
  BalanceHistoryPanel,
  AdvanceDetailPanel,
  PaymentMarkPaidModal,
  BalanceAdjustModal,
  BonusCreateModal,
} from '../../components/pages/payment';
import { formatMoney } from '../../components/pages/payment/paymentUtils';
import { ConfirmationDialog } from '../../components/common';
import { HISTORY_PER_PAGE } from './payrollUtils';

/**
 * Modal/panel cluster for the Payroll page: record/create/adjust forms,
 * detail & history side panels, and confirmation dialogs. Kept as a single
 * component (rather than many tiny ones) since they all share the page's
 * open/close state and mutation handlers.
 */
const PayrollModals = ({
  // Record payment
  recordModalOpen,
  onCloseRecordModal,
  handleRecordPayment,
  isRecording,
  employees,
  prefillEmployee,
  yearNumber,
  monthNumber,

  // Create advance
  createAdvanceOpen,
  onCloseCreateAdvance,
  handleCreateAdvance,
  isCreatingAdvance,

  // Recover advance
  recoverAdvance,
  onCloseRecoverAdvance,
  handleRecoverAdvance,
  isRecovering,

  // Payment history panel
  historyEmployee,
  onCloseHistory,
  employeeSummary,
  historyData,
  historyLoading,
  summaryDetailLoading,
  historyPage,
  setHistoryPage,
  historyTotalPages,
  historyTotal,
  onAdjustBalanceFromHistory,

  // Advance detail panel
  selectedAdvanceId,
  advanceDetail,
  advanceDetailLoading,
  onCloseAdvanceDetail,
  handleApproveAdvance,
  handleDisburseAdvance,
  handleCancelAdvance,
  onRecoverFromDetail,

  // Mark paid
  paymentToMarkPaid,
  onCloseMarkPaid,
  handleMarkPaid,
  isMarkingPaid,

  // Balance adjust
  balanceEmployee,
  onCloseBalanceAdjust,
  handleAdjustBalance,
  isAdjustingBalance,

  // Create bonus
  bonusModalOpen,
  onCloseBonusModal,
  handleCreateBonus,
  isCreatingBonus,

  // Balance history panel
  balanceHistoryEmployee,
  onCloseBalanceHistory,
  balanceHistoryData,
  balanceHistoryLoading,
  balanceHistoryPage,
  setBalanceHistoryPage,
  balanceHistoryTotalPages,
  balanceHistoryTotal,
  onAdjustFromBalanceHistory,

  // Confirmation dialogs
  advanceToApprove,
  handleCloseApproveConfirm,
  confirmApproveAdvance,
  isApproving,
  bonusToRelease,
  onCloseReleaseBonus,
  confirmReleaseBonus,
}) => (
  <>
    <PaymentRecordModal
      isOpen={recordModalOpen}
      onClose={onCloseRecordModal}
      onSave={handleRecordPayment}
      isLoading={isRecording}
      employees={employees}
      prefillEmployee={prefillEmployee}
      defaultPeriodYear={yearNumber}
      defaultPeriodMonth={monthNumber}
    />

    <AdvanceCreateModal
      isOpen={createAdvanceOpen}
      onClose={onCloseCreateAdvance}
      onSave={handleCreateAdvance}
      isLoading={isCreatingAdvance}
      employees={employees}
    />

    <AdvanceRecoverModal
      isOpen={Boolean(recoverAdvance)}
      advance={recoverAdvance}
      onClose={onCloseRecoverAdvance}
      onSave={handleRecoverAdvance}
      isLoading={isRecovering}
    />

    <PaymentHistoryPanel
      isOpen={Boolean(historyEmployee)}
      employee={historyEmployee}
      summary={employeeSummary}
      history={historyData}
      isLoading={historyLoading}
      summaryLoading={summaryDetailLoading}
      currentPage={historyPage}
      totalPages={historyTotalPages}
      totalItems={historyTotal}
      itemsPerPage={HISTORY_PER_PAGE}
      onPageChange={setHistoryPage}
      onClose={onCloseHistory}
      onAdjustBalance={onAdjustBalanceFromHistory}
    />

    <AdvanceDetailPanel
      isOpen={Boolean(selectedAdvanceId)}
      advance={advanceDetail}
      isLoading={advanceDetailLoading}
      onClose={onCloseAdvanceDetail}
      onApprove={handleApproveAdvance}
      onDisburse={handleDisburseAdvance}
      onCancel={handleCancelAdvance}
      onRecover={onRecoverFromDetail}
    />

    <PaymentMarkPaidModal
      isOpen={Boolean(paymentToMarkPaid)}
      payment={paymentToMarkPaid}
      onClose={onCloseMarkPaid}
      onSave={handleMarkPaid}
      isLoading={isMarkingPaid}
    />

    <BalanceAdjustModal
      isOpen={Boolean(balanceEmployee)}
      employee={balanceEmployee}
      employees={employees}
      onClose={onCloseBalanceAdjust}
      onSave={handleAdjustBalance}
      isLoading={isAdjustingBalance}
    />

    <BonusCreateModal
      isOpen={bonusModalOpen}
      onClose={onCloseBonusModal}
      onSave={handleCreateBonus}
      isLoading={isCreatingBonus}
      employees={employees}
      defaultYear={yearNumber}
      defaultMonth={monthNumber}
    />

    <BalanceHistoryPanel
      isOpen={Boolean(balanceHistoryEmployee)}
      employee={balanceHistoryEmployee}
      transactions={balanceHistoryData}
      runningBalance={balanceHistoryData?.running_balance}
      isLoading={balanceHistoryLoading}
      currentPage={balanceHistoryPage}
      totalPages={balanceHistoryTotalPages}
      totalItems={balanceHistoryTotal}
      itemsPerPage={HISTORY_PER_PAGE}
      onPageChange={setBalanceHistoryPage}
      onClose={onCloseBalanceHistory}
      onAdjust={onAdjustFromBalanceHistory}
    />

    <ConfirmationDialog
      isOpen={Boolean(advanceToApprove)}
      onClose={handleCloseApproveConfirm}
      onConfirm={confirmApproveAdvance}
      title="Approve advance"
      message={
        advanceToApprove
          ? `Approve ${advanceToApprove.employee_name}'s salary advance of ${formatMoney(advanceToApprove.amount)}?\n\nThis marks the request as approved and allows disbursement.`
          : ''
      }
      confirmText="Approve"
      cancelText="Cancel"
      variant="primary"
      isLoading={isApproving}
    />

    <ConfirmationDialog
      isOpen={Boolean(bonusToRelease)}
      onClose={onCloseReleaseBonus}
      onConfirm={confirmReleaseBonus}
      title="Quick release bonus"
      message={
        bonusToRelease
          ? `Release ${formatMoney(bonusToRelease.amount)} bonus for ${bonusToRelease.employee_name} as a separate payment?\n\nThis will not include it in their monthly salary.`
          : ''
      }
      confirmText="Release"
      cancelText="Cancel"
      variant="primary"
    />
  </>
);

export default PayrollModals;
