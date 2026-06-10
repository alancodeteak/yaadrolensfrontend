import { useState, useEffect, useMemo } from 'react';
import { Wallet } from 'lucide-react';
import { ButtonSpinner, LoadingScreen, dashboardToast } from '../../../common';
import SettingsSection, {
  settingsInputClass,
  settingsLabelClass,
  SettingsPageHeader,
  SettingsContentGrid,
} from '../SettingsSection';
import { SETTINGS_PANEL } from '../settingsTheme';
import {
  useGetSettingsQuery,
  useUpdatePaymentSettingsMutation,
} from '../../../../store/api/settingsApi';

const PaymentRules = () => {
  const { data: settings, isLoading, error, refetch } = useGetSettingsQuery();
  const [updatePaymentSettings, { isLoading: isUpdating }] = useUpdatePaymentSettingsMutation();

  const [salaryPayDay, setSalaryPayDay] = useState(25);
  const [autoRecord, setAutoRecord] = useState(true);
  const [salaryCalcMode, setSalaryCalcMode] = useState('fixed');
  const [workingDaysMode, setWorkingDaysMode] = useState('weekdays');
  const [workingDaysFixed, setWorkingDaysFixed] = useState(26);
  const [countHalfDays, setCountHalfDays] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setSalaryPayDay(settings.salary_pay_day ?? 25);
    setAutoRecord(settings.auto_record_monthly_salary ?? true);
    setSalaryCalcMode(settings.salary_calculation_mode ?? 'fixed');
    setWorkingDaysMode(settings.salary_working_days_mode ?? 'weekdays');
    setWorkingDaysFixed(settings.salary_working_days_fixed ?? 26);
    setCountHalfDays(Boolean(settings.salary_count_half_days));
  }, [settings]);

  const isDirty = useMemo(() => {
    if (!settings) return false;
    return (
      Number(settings.salary_pay_day ?? 25) !== Number(salaryPayDay) ||
      Boolean(settings.auto_record_monthly_salary ?? true) !== autoRecord ||
      (settings.salary_calculation_mode ?? 'fixed') !== salaryCalcMode ||
      (settings.salary_working_days_mode ?? 'weekdays') !== workingDaysMode ||
      Number(settings.salary_working_days_fixed ?? 26) !== Number(workingDaysFixed) ||
      Boolean(settings.salary_count_half_days) !== countHalfDays
    );
  }, [
    settings,
    salaryPayDay,
    autoRecord,
    salaryCalcMode,
    workingDaysMode,
    workingDaysFixed,
    countHalfDays,
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
      <div className={`${SETTINGS_PANEL} px-5 py-8 text-center`}>
        <p className="text-sm font-medium text-red-800">Failed to load payment rules</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 rounded-xl bg-[#007AFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0066DD]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SettingsPageHeader
        icon={Wallet}
        tone="payment"
        title="Payment rules"
        subtitle="Configure when monthly salaries are recorded in the payment ledger"
        meta={
          settings?.updated_at
            ? `Last updated ${new Date(settings.updated_at).toLocaleString()}`
            : undefined
        }
      />

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
              <p className="mt-1.5 text-xs text-gray-500">
                On or after this day each month, salaries are added to the ledger for active employees
                with a pay amount set. Use 1–28 so every month has that day.
              </p>
            </div>
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
              </select>
              <p className="mt-1.5 text-xs text-gray-500">
                Attendance mode uses (present days ÷ working days) × base salary. Per-employee
                overrides can be set on the employee record.
              </p>
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
              </>
            )}
          </div>
        </SettingsSection>
      </SettingsContentGrid>

      <div className={`${SETTINGS_PANEL} flex justify-end px-4 py-4 sm:px-5`}>
        <button
          type="button"
          onClick={handleSave}
          disabled={isUpdating || !isDirty}
          className="inline-flex items-center gap-2 rounded-xl bg-[#007AFF] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0066DD] disabled:cursor-not-allowed disabled:opacity-60"
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
