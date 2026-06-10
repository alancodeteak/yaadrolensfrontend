/** ISO start/end dates for a calendar month (for ledger API filters). */
export const getMonthDateRange = (year, month) => {
  const y = Number(year);
  const m = Number(month);
  if (!y || !m || m < 1 || m > 12) return { start_date: undefined, end_date: undefined };
  const lastDay = new Date(y, m, 0).getDate();
  const pad = (n) => String(n).padStart(2, '0');
  return {
    start_date: `${y}-${pad(m)}-01`,
    end_date: `${y}-${pad(m)}-${pad(lastDay)}`,
  };
};

export const formatMoney = (value) => {
  if (value == null) return '—';
  return `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatDateTime = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const PAYMENT_TYPE_LABELS = {
  monthly_salary: 'Monthly salary',
  advance_disbursement: 'Advance disbursement',
  advance_recovery: 'Advance recovery',
  bonus: 'Bonus',
  other: 'Other',
};

export const ADVANCE_STATUS_LABELS = {
  pending: 'Pending',
  approved: 'Approved',
  disbursed: 'Disbursed',
  fully_recovered: 'Fully recovered',
  cancelled: 'Cancelled',
};

export const ADVANCE_STATUS_STYLES = {
  pending: 'bg-[#FF9500]/10 text-[#FF9500]',
  approved: 'bg-[#007AFF]/10 text-[#007AFF]',
  disbursed: 'bg-[#5856D6]/10 text-[#5856D6]',
  fully_recovered: 'bg-[#34C759]/10 text-[#34C759]',
  cancelled: 'bg-gray-100 text-gray-600',
};

export const PAYMENT_TYPE_STYLES = {
  monthly_salary: 'bg-[#007AFF]/10 text-[#007AFF]',
  advance_disbursement: 'bg-[#5856D6]/10 text-[#5856D6]',
  advance_recovery: 'bg-[#FF9500]/10 text-[#FF9500]',
  bonus: 'bg-[#34C759]/10 text-[#34C759]',
  other: 'bg-gray-100 text-gray-600',
};

export const PAYMENT_STATUS_LABELS = {
  pending: 'Pending',
  approved: 'Approved',
  paid: 'Paid',
};

export const PAYMENT_STATUS_STYLES = {
  pending: 'bg-[#FF9500]/10 text-[#FF9500]',
  approved: 'bg-[#007AFF]/10 text-[#007AFF]',
  paid: 'bg-[#34C759]/10 text-[#34C759]',
};

export const PAYMENT_METHOD_LABELS = {
  cash: 'Cash',
  bank_transfer: 'Bank transfer',
  other: 'Other',
};

export const BONUS_STATUS_LABELS = {
  scheduled: 'Scheduled',
  included_in_salary: 'In salary',
  released: 'Released',
};

export const BONUS_STATUS_STYLES = {
  scheduled: 'bg-[#FF9500]/10 text-[#FF9500]',
  included_in_salary: 'bg-[#007AFF]/10 text-[#007AFF]',
  released: 'bg-[#34C759]/10 text-[#34C759]',
};

export const BALANCE_TRANSACTION_LABELS = {
  give: 'Give',
  take: 'Take',
};

export const BALANCE_TRANSACTION_STYLES = {
  give: 'bg-[#34C759]/10 text-[#34C759]',
  take: 'bg-[#FF9500]/10 text-[#FF9500]',
};
