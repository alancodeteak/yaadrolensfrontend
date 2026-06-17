import { useState, useEffect, useMemo } from 'react';
import { ButtonSpinner, LoadingScreen, dashboardToast } from '../../../common';
import SettingsSection, {
  settingsInputClass,
  settingsLabelClass,
  SettingsSectionMeta,
  SettingsContentGrid,
} from '../SettingsSection/SettingsSection';
import { DASHBOARD_BTN_PRIMARY, SETTINGS_PANEL } from '../settingsTheme';
import {
  useGetSettingsQuery,
  useUpdatePaymentSettingsMutation,
} from '../../../../store/api/settingsApi';

const WEEKDAY_OPTIONS = [
  { value: 0, label: 'Mon' },
  { value: 1, label: 'Tue' },
  { value: 2, label: 'Wed' },
  { value: 3, label: 'Thu' },
  { value: 4, label: 'Fri' },
  { value: 5, label: 'Sat' },
  { value: 6, label: 'Sun' },
];

const arraysEqual = (a, b) => {
  const left = [...(a || [])].sort((x, y) => x - y);
  const right = [...(b || [])].sort((x, y) => x - y);
  return left.length === right.length && left.every((v, i) => v === right[i]);
};

const PaymentRules = () => {
  const { data: settings, isLoading, error, refetch } = useGetSettingsQuery();
  const [updatePaymentSettings, { isLoading: isUpdating }] = useUpdatePaymentSettingsMutation();

  const [salaryPayDay, setSalaryPayDay] = useState(25);
  const [autoRecord, setAutoRecord] = useState(true);
  const [salaryCalcMode, setSalaryCalcMode] = useState('fixed');
  const [workingDaysMode, setWorkingDaysMode] = useState('weekdays');
  const [workingDaysFixed, setWorkingDaysFixed] = useState(26);
  const [countHalfDays, setCountHalfDays] = useState(true);
  const [weeklyOffDays, setWeeklyOffDays] = useState([6]);
  const [paidLeavesPerMonth, setPaidLeavesPerMonth] = useState(2);
  const [deductionMode, setDeductionMode] = useState('proportional');
  const [blockLeaveOnWeeklyOff, setBlockLeaveOnWeeklyOff] = useState(true);
  const [allowWeeklyOffOverride, setAllowWeeklyOffOverride] = useState(true);
  const [allowLeaveQuotaOverride, setAllowLeaveQuotaOverride] = useState(true);
  const [maxFutureLeaveDays, setMaxFutureLeaveDays] = useState(90);

  useEffect(() => {
    if (!settings) return;
    setSalaryPayDay(settings.salary_pay_day ?? 25);
    setAutoRecord(settings.auto_record_monthly_salary ?? true);
    setSalaryCalcMode(settings.salary_calculation_mode ?? 'fixed');
    setWorkingDaysMode(settings.salary_working_days_mode ?? 'weekdays');
    setWorkingDaysFixed(settings.salary_working_days_fixed ?? 26);
    setCountHalfDays(Boolean(settings.salary_count_half_days ?? true));
    setWeeklyOffDays(settings.default_weekly_off_days ?? [6]);
    setPaidLeavesPerMonth(settings.paid_leaves_per_month ?? 2);
    setDeductionMode(settings.excess_leave_deduction_mode ?? 'proportional');
    setBlockLeaveOnWeeklyOff(Boolean(settings.block_leave_on_weekly_off ?? true));
    setAllowWeeklyOffOverride(Boolean(settings.allow_employee_weekly_off_override ?? true));
    setAllowLeaveQuotaOverride(Boolean(settings.allow_employee_leave_quota_override ?? true));
    setMaxFutureLeaveDays(settings.max_future_leave_days ?? 90);
  }, [settings]);

  const toggleWeeklyOff = (day) => {
    setWeeklyOffDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort((a, b) => a - b)
    );
  };

  const isDirty = useMemo(() => {
    if (!settings) return false;
    return (
      Number(settings.salary_pay_day ?? 25) !== Number(salaryPayDay) ||
      Boolean(settings.auto_record_monthly_salary ?? true) !== autoRecord ||
      (settings.salary_calculation_mode ?? 'fixed') !== salaryCalcMode ||
      (settings.salary_working_days_mode ?? 'weekdays') !== workingDaysMode ||
      Number(settings.salary_working_days_fixed ?? 26) !== Number(workingDaysFixed) ||
      Boolean(settings.salary_count_half_days ?? true) !== countHalfDays ||
      !arraysEqual(settings.default_weekly_off_days ?? [6], weeklyOffDays) ||
      Number(settings.paid_leaves_per_month ?? 2) !== Number(paidLeavesPerMonth) ||
      (settings.excess_leave_deduction_mode ?? 'proportional') !== deductionMode ||
      Boolean(settings.block_leave_on_weekly_off ?? true) !== blockLeaveOnWeeklyOff ||
      Boolean(settings.allow_employee_weekly_off_override ?? true) !== allowWeeklyOffOverride ||
      Boolean(settings.allow_employee_leave_quota_override ?? true) !== allowLeaveQuotaOverride ||
      Number(settings.max_future_leave_days ?? 90) !== Number(maxFutureLeaveDays)
    );
  }, [
    settings,
    salaryPayDay,
    autoRecord,
    salaryCalcMode,
    workingDaysMode,
    workingDaysFixed,
    countHalfDays,
    weeklyOffDays,
    paidLeavesPerMonth,
    deductionMode,
    blockLeaveOnWeeklyOff,
    allowWeeklyOffOverride,
    allowLeaveQuotaOverride,
    maxFutureLeaveDays,
  ]);

  const validateForm = () => {
    const errors = [];
    const day = Number(salaryPayDay);
    if (!Number.isInteger(day) || day < 1 || day > 28) {
      errors.push('Pay day must be between 1 and 28');
    }
    if (workingDaysMode === 'fixed_count') {
      const fixed = Number(workingDaysFixed);
      if (!Number.isInteger(fixed) || fixed < 1 || fixed > 31) {
        errors.push('Fixed working days must be between 1 and 31');
      }
    }
    const leaves = Number(paidLeavesPerMonth);
    if (!Number.isInteger(leaves) || leaves < 0 || leaves > 31) {
      errors.push('Paid leaves per month must be between 0 and 31');
    }
    const maxFuture = Number(maxFutureLeaveDays);
    if (!Number.isInteger(maxFuture) || maxFuture < 1 || maxFuture > 365) {
      errors.push('Max future leave days must be between 1 and 365');
    }
    return errors;
  };

  const handleSave = async () => {
    if (!isDirty) return;

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach((msg) => dashboardToast.error(msg));
      return;
    }

    try {
      await updatePaymentSettings({
        salary_pay_day: Number(salaryPayDay),
        auto_record_monthly_salary: autoRecord,
        salary_calculation_mode: salaryCalcMode,
        salary_working_days_mode: workingDaysMode,
        salary_working_days_fixed: Number(workingDaysFixed),
        salary_count_half_days: countHalfDays,
        default_weekly_off_days: weeklyOffDays,
        paid_leaves_per_month: Number(paidLeavesPerMonth),
        excess_leave_deduction_mode: deductionMode,
        block_leave_on_weekly_off: blockLeaveOnWeeklyOff,
        allow_employee_weekly_off_override: allowWeeklyOffOverride,
        allow_employee_leave_quota_override: allowLeaveQuotaOverride,
        max_future_leave_days: Number(maxFutureLeaveDays),
      }).unwrap();
      dashboardToast.success('Payment rules were updated.', 'Changes saved');
      refetch();
    } catch (err) {
      dashboardToast.error(
        err?.data?.detail || 'Could not save payment rules. Please try again.',
        'Save failed'
      );
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading payment rules..." fullScreen={false} size="md" />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <p>Could not load payment rules. Please try again.</p>
        <button type="button" onClick={() => refetch()} className={`${DASHBOARD_BTN_PRIMARY} mt-3`}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {settings?.updated_at && (
        <SettingsSectionMeta>
          Last updated {new Date(settings.updated_at).toLocaleString()}
        </SettingsSectionMeta>
      )}

      <SettingsContentGrid>
        <SettingsSection
          title="Monthly salary"
          subtitle="Salaries are taken from each employee's pay amount on the Salary page"
        >
          <div className="space-y-4">
            <label className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-700">Automatically record monthly salaries</span>
              <button
                type="button"
                role="switch"
                aria-checked={autoRecord}
                onClick={() => setAutoRecord((v) => !v)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  autoRecord ? 'bg-[#007AFF]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    autoRecord ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>

            <div className="max-w-xs">
              <label className={settingsLabelClass}>Pay day (day of month)</label>
              <input
                type="number"
                value={salaryPayDay}
                onChange={(e) => setSalaryPayDay(parseInt(e.target.value, 10) || 1)}
                className={settingsInputClass}
                min="1"
                max="28"
              />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Weekly off"
          subtitle="Default off days for all employees (can be overridden per employee)"
        >
          <div className="flex flex-wrap gap-2">
            {WEEKDAY_OPTIONS.map((wd) => (
              <button
                key={wd.value}
                type="button"
                onClick={() => toggleWeeklyOff(wd.value)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  weeklyOffDays.includes(wd.value)
                    ? 'border-[#007AFF] bg-[#007AFF]/10 text-[#007AFF]'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {wd.label}
              </button>
            ))}
          </div>
          <label className="mt-4 flex items-center justify-between gap-3">
            <span className="text-sm text-gray-700">Allow per-employee weekly off override</span>
            <button
              type="button"
              role="switch"
              aria-checked={allowWeeklyOffOverride}
              onClick={() => setAllowWeeklyOffOverride((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                allowWeeklyOffOverride ? 'bg-[#007AFF]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  allowWeeklyOffOverride ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
        </SettingsSection>

        <SettingsSection
          title="Leave policy"
          subtitle="Paid leave quota and rules for marking leave"
        >
          <div className="space-y-4">
            <div className="max-w-xs">
              <label className={settingsLabelClass}>Paid leaves per month</label>
              <input
                type="number"
                value={paidLeavesPerMonth}
                onChange={(e) => setPaidLeavesPerMonth(parseInt(e.target.value, 10) || 0)}
                className={settingsInputClass}
                min="0"
                max="31"
              />
            </div>

            <div className="max-w-md">
              <label className={settingsLabelClass}>Deduction after quota exceeded</label>
              <select
                value={deductionMode}
                onChange={(e) => setDeductionMode(e.target.value)}
                className={settingsInputClass}
              >
                <option value="proportional">Proportional — (payable days ÷ working days) × salary</option>
                <option value="per_day">Per day — deduct daily rate for each unpaid day</option>
              </select>
            </div>

            <div className="max-w-xs">
              <label className={settingsLabelClass}>Max days to schedule leave ahead</label>
              <input
                type="number"
                value={maxFutureLeaveDays}
                onChange={(e) => setMaxFutureLeaveDays(parseInt(e.target.value, 10) || 90)}
                className={settingsInputClass}
                min="1"
                max="365"
              />
              <p className="mt-1 text-xs text-gray-500">
                How far in advance admins can schedule employee leave.
              </p>
            </div>

            <label className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-700">Block marking leave on weekly off days</span>
              <button
                type="button"
                role="switch"
                aria-checked={blockLeaveOnWeeklyOff}
                onClick={() => setBlockLeaveOnWeeklyOff((v) => !v)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  blockLeaveOnWeeklyOff ? 'bg-[#007AFF]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    blockLeaveOnWeeklyOff ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>

            <label className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-700">Allow per-employee leave quota override</span>
              <button
                type="button"
                role="switch"
                aria-checked={allowLeaveQuotaOverride}
                onClick={() => setAllowLeaveQuotaOverride((v) => !v)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  allowLeaveQuotaOverride ? 'bg-[#007AFF]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    allowLeaveQuotaOverride ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Salary calculation"
          subtitle="How monthly salary is computed when salaries are generated"
        >
          <div className="space-y-4">
            <div className="max-w-md">
              <label className={settingsLabelClass}>Calculation mode</label>
              <select
                value={salaryCalcMode}
                onChange={(e) => setSalaryCalcMode(e.target.value)}
                className={settingsInputClass}
              >
                <option value="fixed">Fixed — full monthly pay amount</option>
                <option value="attendance_based">Attendance-based — prorate by days present</option>
                <option value="leave_aware">Leave-aware — weekly off, paid leave quota, deductions</option>
              </select>
            </div>

            {salaryCalcMode === 'attendance_based' && (
              <>
                <div className="max-w-md">
                  <label className={settingsLabelClass}>Working days in month</label>
                  <select
                    value={workingDaysMode}
                    onChange={(e) => setWorkingDaysMode(e.target.value)}
                    className={settingsInputClass}
                  >
                    <option value="weekdays">Weekdays only (Mon–Fri)</option>
                    <option value="calendar">All calendar days</option>
                    <option value="fixed_count">Fixed count</option>
                  </select>
                </div>

                {workingDaysMode === 'fixed_count' && (
                  <div className="max-w-xs">
                    <label className={settingsLabelClass}>Fixed working days</label>
                    <input
                      type="number"
                      value={workingDaysFixed}
                      onChange={(e) => setWorkingDaysFixed(parseInt(e.target.value, 10) || 26)}
                      className={settingsInputClass}
                      min="1"
                      max="31"
                    />
                  </div>
                )}
              </>
            )}

            {(salaryCalcMode === 'attendance_based' || salaryCalcMode === 'leave_aware') && (
              <label className="flex items-center justify-between gap-3">
                <span className="text-sm text-gray-700">Count half-days as 0.5 present</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={countHalfDays}
                  onClick={() => setCountHalfDays((v) => !v)}
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                    countHalfDays ? 'bg-[#007AFF]' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      countHalfDays ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </label>
            )}
          </div>
        </SettingsSection>
      </SettingsContentGrid>

      <div className={`${SETTINGS_PANEL} flex justify-end px-4 py-4`}>
        <button
          type="button"
          onClick={handleSave}
          disabled={isUpdating || !isDirty}
          className={DASHBOARD_BTN_PRIMARY}
        >
          {isUpdating ? (
            <>
              <ButtonSpinner size="sm" />
              Saving…
            </>
          ) : (
            'Save changes'
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentRules;
