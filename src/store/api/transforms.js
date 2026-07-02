import { getDefaultAvatar } from '../../utils/avatar';
import { DEFAULT_IDENTITY_DOCUMENT } from '../../utils/employeeDocumentConstants';
import { resolveEmployeePhotoUrl } from '../../utils/employeePhoto';

/** YYYY-MM-DD in an IANA timezone (e.g. org settings). */
export function formatDateInTimezone(date = new Date(), timezone = 'UTC') {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

export function orgToday(timezone = 'UTC') {
  return formatDateInTimezone(new Date(), timezone);
}

/** True when the calendar month has not ended yet in org timezone. */
export function isPayrollPeriodOpen(year, month, timezone = 'UTC') {
  const today = orgToday(timezone);
  const lastDay = new Date(year, month, 0).getDate();
  const periodEnd = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  return today < periodEnd;
}

export function normalizeEmployee(employee) {
  if (!employee) return employee;
  const photo = resolveEmployeePhotoUrl(employee.profile_photo_url);
  return {
    ...employee,
    is_active: employee.status === 'active',
    department: employee.department_name || employee.department || '',
    position: employee.designation || employee.position || '',
    training_status: employee.has_face_enrolled ? 'completed' : 'not_started',
    photo,
    avatar: photo || getDefaultAvatar(employee.id || employee.name),
    identity_document: {
      ...DEFAULT_IDENTITY_DOCUMENT,
      ...(employee.identity_document || {}),
    },
  };
}

export function normalizeEmployees(list) {
  return (list || []).map(normalizeEmployee);
}

export function toEmployeeCreatePayload(data) {
  const payload = {
    name: data.name,
    phone: data.phone || undefined,
    department_id: data.department_id || undefined,
    designation: data.designation || data.position || undefined,
  };
  // salary is monthly amount in INR
  if (data.salary !== undefined && data.salary !== null && data.salary !== '') {
    payload.salary = Number(data.salary);
  }
  if (data.weekly_off_days !== undefined) payload.weekly_off_days = data.weekly_off_days;
  if (data.paid_leaves_per_month !== undefined) {
    payload.paid_leaves_per_month = data.paid_leaves_per_month;
  }
  return payload;
}

export function toEmployeeUpdatePayload(data) {
  const payload = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.phone !== undefined) payload.phone = data.phone;
  if (data.department_id !== undefined) payload.department_id = data.department_id;
  if (data.designation !== undefined || data.position !== undefined) {
    payload.designation = data.designation || data.position;
  }
  if (data.is_active !== undefined) {
    payload.status = data.is_active ? 'active' : 'inactive';
  }
  if (data.status !== undefined) payload.status = data.status;
  // salary is monthly amount in INR
  if (data.salary !== undefined) {
    payload.salary =
      data.salary === null || data.salary === '' ? null : Number(data.salary);
  }
  if (data.weekly_off_days !== undefined) payload.weekly_off_days = data.weekly_off_days;
  if (data.paid_leaves_per_month !== undefined) {
    payload.paid_leaves_per_month = data.paid_leaves_per_month;
  }
  return payload;
}

export function formatTimeValue(value) {
  if (!value) return value;
  if (typeof value === 'string' && value.length >= 5) {
    return value.slice(0, 5);
  }
  return value;
}

export function transformDailyReport(response) {
  const rows = response?.rows || [];
  const present = rows.filter((row) => row.attendance_status !== 'absent').length;
  const absent = rows.filter((row) => row.attendance_status === 'absent').length;
  const late = rows.filter((row) => row.attendance_status === 'late').length;
  const total = rows.length;

  return {
    date: response?.date,
    rows,
    total_employees: total,
    present_count: present,
    absent_count: absent,
    late_count: late,
    summary: {
      present_rate: total ? (present / total) * 100 : 0,
    },
  };
}

export function transformMonthlyReport(response) {
  const rows = response?.rows || [];
  const totalPresentDays = rows.reduce((sum, row) => sum + (row.days_present || 0), 0);
  const totalLate = rows.reduce((sum, row) => sum + (row.late_count || 0), 0);
  const totalHours = rows.reduce((sum, row) => sum + (row.total_hours || 0), 0);
  const punctualityRate = totalPresentDays
    ? ((totalPresentDays - totalLate) / totalPresentDays) * 100
    : 0;

  return {
    year: response?.year,
    month: response?.month,
    rows,
    stats: {
      average_attendance_rate: rows.length
        ? (rows.reduce((sum, row) => sum + (row.days_present || 0), 0) / (rows.length * 22)) * 100
        : 0,
      average_punctuality_rate: punctualityRate,
      total_hours_worked: totalHours,
      total_late: totalLate,
    },
  };
}

export function formatDurationHours(hours) {
  if (hours == null || Number.isNaN(Number(hours))) return '—';
  const value = Number(hours);
  if (value <= 0) return '0h';
  const h = Math.floor(value);
  const m = Math.round((value - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function formatClockTime(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/** Resolve profile photo fields for a daily attendance row. */
export function resolveRowProfilePhoto(row) {
  const photo = resolveEmployeePhotoUrl(row?.profile_photo_url);
  return {
    profilePhotoUrl: row?.profile_photo_url || null,
    photo,
    avatar: photo || getDefaultAvatar(row?.employee_id || row?.name),
  };
}

/** Map a daily report row to live-attendance UI employee shape. */
export function mapDailyRowToLiveEmployee(row) {
  let status = 'Absent';
  if (row.attendance_status === 'absent' || (!row.clock_in && !row.clock_out)) {
    status = 'Absent';
  } else if (row.clock_out) {
    status = 'Clocked Out';
  } else if (row.attendance_status === 'late') {
    status = 'Present (Late)';
  } else if (row.clock_in) {
    status = 'Present';
  }

  const clockIn = formatClockTime(row.clock_in);
  const lastSeen = row.clock_out
    ? formatClockTime(row.clock_out)
    : row.clock_in
      ? formatClockTime(row.clock_in)
      : 'Not seen today';

  const { profilePhotoUrl, photo, avatar } = resolveRowProfilePhoto(row);

  return {
    id: row.employee_id,
    employee_code: row.employee_code,
    name: row.name,
    department: row.department_name || '',
    status,
    clockIn,
    lastSeen,
    confidence: null,
    profilePhotoUrl,
    photo,
    avatar,
  };
}

export function transformDailyRowsToLogs(response) {
  const rows = response?.rows || [];
  const logs = [];

  rows.forEach((row) => {
    const { profilePhotoUrl, photo, avatar } = resolveRowProfilePhoto(row);
    if (row.clock_in) {
      logs.push({
        id: `${row.employee_id}-in`,
        employee_name: row.name,
        employee_department: '',
        type: 'IN',
        timestamp: row.clock_in,
        profilePhotoUrl,
        photo,
        avatar,
      });
    }
    if (row.clock_out) {
      logs.push({
        id: `${row.employee_id}-out`,
        employee_name: row.name,
        employee_department: '',
        type: 'OUT',
        timestamp: row.clock_out,
        profilePhotoUrl,
        photo,
        avatar,
      });
    }
  });

  return logs.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function transformSettingsResponse(settings) {
  if (!settings) return settings;
  return {
    ...settings,
    work_start_time: formatTimeValue(settings.work_start_time),
    work_end_time: formatTimeValue(settings.work_end_time),
  };
}

export function normalizeSalaryRow(row) {
  if (!row) return row;
  const photo = resolveEmployeePhotoUrl(row.profile_photo_url);
  return {
    ...row,
    id: row.employee_id,
    is_active: row.status === 'active',
    department: row.department_name || '',
    profilePhotoUrl: row.profile_photo_url || null,
    photo,
    avatar: photo || getDefaultAvatar(row.employee_id || row.name),
    current_salary:
      row.current_salary != null && row.current_salary !== ''
        ? Number(row.current_salary)
        : null,
    last_changed_at: row.last_changed_at || null,
    salary_set: row.salary_set ?? row.current_salary != null,
  };
}

export function normalizeSalaries(list) {
  return (list || []).map(normalizeSalaryRow);
}

export function normalizeSalaryHistory(response) {
  if (!response) return { items: [], total: 0, skip: 0, limit: 50 };
  return {
    ...response,
    items: (response.items || []).map((item) => ({
      ...item,
      previous_amount:
        item.previous_amount != null ? Number(item.previous_amount) : null,
      new_amount: Number(item.new_amount),
    })),
  };
}

export function toSalaryUpdatePayload(data) {
  const payload = {
    new_amount: Number(data.new_amount),
    effective_date: data.effective_date,
  };
  if (data.reason !== undefined && data.reason !== null && data.reason !== '') {
    payload.reason = data.reason;
  }
  return payload;
}

function toMoney(value) {
  if (value == null || value === '') return null;
  return Number(value);
}

export function normalizePaymentRow(row) {
  if (!row) return row;
  return {
    ...row,
    amount: toMoney(row.amount) ?? 0,
    base_amount: toMoney(row.base_amount),
    balance_applied: toMoney(row.balance_applied),
    bonus_included: toMoney(row.bonus_included),
  };
}

export function normalizePayments(response) {
  if (!response) return { items: [], total: 0, skip: 0, limit: 50 };
  return {
    ...response,
    items: (response.items || []).map(normalizePaymentRow),
  };
}

export function normalizePaymentSummary(summary) {
  if (!summary) {
    return {
      paid_this_month: 0,
      payment_count_this_month: 0,
      outstanding_advance_total: 0,
      outstanding_advance_count: 0,
      pending_advance_count: 0,
      pending_salary_count: 0,
      unpaid_salary_total: 0,
    };
  }
  return {
    ...summary,
    paid_this_month: toMoney(summary.paid_this_month) ?? 0,
    outstanding_advance_total: toMoney(summary.outstanding_advance_total) ?? 0,
    unpaid_salary_total: toMoney(summary.unpaid_salary_total) ?? 0,
  };
}

export function normalizeEmployeePaymentSummary(summary) {
  if (!summary) return summary;
  return {
    ...summary,
    current_salary: toMoney(summary.current_salary),
    total_paid: toMoney(summary.total_paid) ?? 0,
    outstanding_advance: toMoney(summary.outstanding_advance) ?? 0,
    running_balance: toMoney(summary.running_balance) ?? 0,
  };
}

export function normalizeBonusRow(row) {
  if (!row) return row;
  return {
    ...row,
    amount: toMoney(row.amount) ?? 0,
  };
}

export function normalizeBonuses(response) {
  if (!response) return { items: [], total: 0 };
  return {
    ...response,
    items: (response.items || []).map(normalizeBonusRow),
  };
}

export function normalizeBalanceRow(row) {
  if (!row) return row;
  return {
    ...row,
    running_balance: toMoney(row.running_balance) ?? 0,
  };
}

export function normalizeBalances(response) {
  if (!response) return { items: [], total: 0, skip: 0, limit: 50 };
  return {
    ...response,
    items: (response.items || []).map(normalizeBalanceRow),
  };
}

export function normalizeBalanceTransactions(response) {
  if (!response) return { items: [], total: 0, running_balance: 0 };
  return {
    ...response,
    running_balance: toMoney(response.running_balance) ?? 0,
    items: (response.items || []).map(normalizeBalanceTransaction),
  };
}

export function normalizeBalanceTransaction(item) {
  if (!item) return item;
  return {
    ...item,
    amount: toMoney(item.amount) ?? 0,
    balance_after: toMoney(item.balance_after) ?? 0,
  };
}

export function normalizeBalanceLedger(response) {
  if (!response) return { items: [], total: 0, skip: 0, limit: 50 };
  return {
    ...response,
    items: (response.items || []).map(normalizeBalanceTransaction),
  };
}

export function toBalanceAdjustPayload(data) {
  return {
    transaction_type: data.transaction_type,
    amount: Number(data.amount),
    transaction_date: data.transaction_date,
    reference: data.reference || undefined,
    notes: data.notes,
  };
}

export function toBonusCreatePayload(data) {
  return {
    employee_id: data.employee_id,
    period_year: Number(data.period_year),
    period_month: Number(data.period_month),
    amount: Number(data.amount),
    notes: data.notes || undefined,
  };
}

export function toMarkPaidPayload(data) {
  return {
    payment_date: data.payment_date,
    payment_method: data.payment_method,
    payment_reference: data.payment_reference || undefined,
    notes: data.notes || undefined,
  };
}

export function toPaymentCreatePayload(data) {
  const payload = {
    employee_id: data.employee_id,
    payment_type: data.payment_type,
    amount: Number(data.amount),
    payment_date: data.payment_date,
  };
  if (data.payment_type === 'monthly_salary') {
    payload.period_year = Number(data.period_year);
    payload.period_month = Number(data.period_month);
  }
  if (data.notes) payload.notes = data.notes;
  return payload;
}

export function normalizeAdvanceRow(row) {
  if (!row) return row;
  return {
    ...row,
    amount: toMoney(row.amount) ?? 0,
    outstanding_amount: toMoney(row.outstanding_amount) ?? 0,
  };
}

export function normalizeAdvances(response) {
  if (!response) return { items: [], total: 0, skip: 0, limit: 50 };
  return {
    ...response,
    items: (response.items || []).map(normalizeAdvanceRow),
  };
}

export function normalizeAdvanceDetail(detail) {
  if (!detail) return detail;
  return {
    ...normalizeAdvanceRow(detail),
    payments: (detail.payments || []).map(normalizePaymentRow),
  };
}

export function toAdvanceCreatePayload(data) {
  const payload = {
    employee_id: data.employee_id,
    amount: Number(data.amount),
    advance_date: data.advance_date,
  };
  if (data.reason) payload.reason = data.reason;
  return payload;
}

export function toAdvanceRecoverPayload(data) {
  const payload = {
    amount: Number(data.amount),
    payment_date: data.payment_date,
  };
  if (data.notes) payload.notes = data.notes;
  return payload;
}

export function buildUserFromToken(accessToken, loginData) {
  const loginId = typeof loginData === 'string' ? loginData : loginData?.login_id;
  const organizationCode =
    typeof loginData === 'object' && loginData?.organization_code
      ? String(loginData.organization_code).trim()
      : undefined;

  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    return {
      id: payload.sub,
      role: payload.role,
      organization_id: payload.organization_id,
      login_id: loginId,
      name: loginId,
      ...(organizationCode ? { organization_code: organizationCode } : {}),
    };
  } catch {
    return {
      login_id: loginId,
      name: loginId,
      role: 'org_admin',
      ...(organizationCode ? { organization_code: organizationCode } : {}),
    };
  }
}
