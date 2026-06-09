import { useState, useEffect, useMemo } from 'react';
import { DashboardTimePicker, LoadingScreen, LottieLoader, dashboardToast } from '../../../common';
import { Clock } from 'lucide-react';
import SettingsSection, {
  settingsInputClass,
  settingsLabelClass,
  SettingsPageHeader,
  SettingsContentGrid,
} from '../SettingsSection';
import { SETTINGS_PANEL } from '../settingsTheme';
import {
  useGetAttendanceRulesQuery,
  useUpdateAttendanceRulesMutation,
} from '../../../../store/api/settingsApi';

const normalizeTime = (value, fallback) => {
  if (!value) return fallback;
  const str = String(value);
  return str.length >= 5 ? str.slice(0, 5) : str;
};

const buildApiPayload = (workingHours, gracePeriods) => ({
  work_start_time: normalizeTime(workingHours.startTime, '09:00'),
  work_end_time: normalizeTime(workingHours.endTime, '17:00'),
  late_arrival_grace_minutes: Number(gracePeriods.lateArrival ?? 10),
  early_departure_grace_minutes: Number(gracePeriods.earlyDeparture ?? 5),
});

const hasApiChanges = (saved, workingHours, gracePeriods) => {
  if (!saved) return false;

  const current = buildApiPayload(workingHours, gracePeriods);
  return (
    normalizeTime(saved.work_start_time, '09:00') !== current.work_start_time ||
    normalizeTime(saved.work_end_time, '17:00') !== current.work_end_time ||
    Number(saved.late_arrival_grace_minutes ?? 10) !== current.late_arrival_grace_minutes ||
    Number(saved.early_departure_grace_minutes ?? 5) !== current.early_departure_grace_minutes
  );
};

const AttendanceRules = () => {
  const { data: attendanceRules, isLoading, error, refetch } = useGetAttendanceRulesQuery();
  const [updateAttendanceRules, { isLoading: isUpdating }] = useUpdateAttendanceRulesMutation();

  const [workingHours, setWorkingHours] = useState({
    startTime: '09:00',
    endTime: '17:00',
    breakDuration: 60,
  });
  const [gracePeriods, setGracePeriods] = useState({ lateArrival: 10, earlyDeparture: 5 });
  const [overtimeRules, setOvertimeRules] = useState({ enabled: true, rateMultiplier: 1.5 });
  const [weekendHolidays, setWeekendHolidays] = useState({ weekendDays: ['saturday', 'sunday'] });

  useEffect(() => {
    if (!attendanceRules) return;
    setWorkingHours({
      startTime: normalizeTime(attendanceRules.work_start_time, '09:00'),
      endTime: normalizeTime(attendanceRules.work_end_time, '17:00'),
      breakDuration: attendanceRules.break_duration_minutes ?? 60,
    });
    setGracePeriods({
      lateArrival: attendanceRules.late_arrival_grace_minutes ?? 10,
      earlyDeparture: attendanceRules.early_departure_grace_minutes ?? 5,
    });
    setOvertimeRules({
      enabled: attendanceRules.allow_overtime ?? true,
      rateMultiplier: attendanceRules.overtime_rate_multiplier || 1.5,
    });
    setWeekendHolidays({
      weekendDays: attendanceRules.weekend_days || ['saturday', 'sunday'],
    });
  }, [attendanceRules]);

  const isDirty = useMemo(
    () => hasApiChanges(attendanceRules, workingHours, gracePeriods),
    [attendanceRules, workingHours, gracePeriods]
  );

  const validateForm = () => {
    const errors = [];
    if (workingHours.startTime >= workingHours.endTime) {
      errors.push('End time must be after start time');
    }
    if (workingHours.breakDuration < 0 || workingHours.breakDuration > 480) {
      errors.push('Break duration must be between 0 and 480 minutes');
    }
    if (gracePeriods.lateArrival < 0 || gracePeriods.lateArrival > 60) {
      errors.push('Late arrival grace must be between 0 and 60 minutes');
    }
    if (gracePeriods.earlyDeparture < 0 || gracePeriods.earlyDeparture > 60) {
      errors.push('Early departure grace must be between 0 and 60 minutes');
    }
    if (
      overtimeRules.enabled &&
      (overtimeRules.rateMultiplier < 1.0 || overtimeRules.rateMultiplier > 3.0)
    ) {
      errors.push('Overtime rate multiplier must be between 1.0 and 3.0');
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
      await updateAttendanceRules(buildApiPayload(workingHours, gracePeriods)).unwrap();
      dashboardToast.success('Your attendance rules were updated.', 'Changes saved');
      refetch();
    } catch (err) {
      dashboardToast.error(
        err?.data?.message || 'Could not save attendance rules. Please try again.',
        'Save failed'
      );
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading attendance rules..." fullScreen={false} size="md" />;
  }

  if (error) {
    return (
      <div className={`${SETTINGS_PANEL} px-5 py-8 text-center`}>
        <p className="text-sm font-medium text-red-800">Failed to load attendance rules</p>
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
        icon={Clock}
        tone="attendance"
        title="Attendance rules"
        subtitle="Work hours, grace periods, overtime, and weekend settings"
        meta={
          attendanceRules?.updated_at
            ? `Last updated ${new Date(attendanceRules.updated_at).toLocaleString()}`
            : undefined
        }
      />

      <SettingsContentGrid>
        <SettingsSection title="Working hours" tourId="working-hours">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={settingsLabelClass}>Start</label>
              <DashboardTimePicker
                id="work-start-time"
                label="Work start time"
                value={workingHours.startTime}
                onChange={(startTime) => setWorkingHours((p) => ({ ...p, startTime }))}
              />
            </div>
            <div>
              <label className={settingsLabelClass}>End</label>
              <DashboardTimePicker
                id="work-end-time"
                label="Work end time"
                value={workingHours.endTime}
                onChange={(endTime) => setWorkingHours((p) => ({ ...p, endTime }))}
              />
            </div>
          </div>
          <div className="mt-3 max-w-xs">
            <label className={settingsLabelClass}>Break (min)</label>
            <input
              type="number"
              value={workingHours.breakDuration}
              onChange={(e) =>
                setWorkingHours((p) => ({
                  ...p,
                  breakDuration: parseInt(e.target.value, 10) || 0,
                }))
              }
              className={settingsInputClass}
              min="0"
              max="480"
            />
          </div>
        </SettingsSection>

        <SettingsSection title="Grace periods" subtitle="Minutes before marking late or early" tourId="grace-periods">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={settingsLabelClass}>Late arrival</label>
              <input
                type="number"
                value={gracePeriods.lateArrival}
                onChange={(e) =>
                  setGracePeriods((p) => ({
                    ...p,
                    lateArrival: parseInt(e.target.value, 10) || 0,
                  }))
                }
                className={settingsInputClass}
                min="0"
                max="60"
              />
            </div>
            <div>
              <label className={settingsLabelClass}>Early departure</label>
              <input
                type="number"
                value={gracePeriods.earlyDeparture}
                onChange={(e) =>
                  setGracePeriods((p) => ({
                    ...p,
                    earlyDeparture: parseInt(e.target.value, 10) || 0,
                  }))
                }
                className={settingsInputClass}
                min="0"
                max="60"
              />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Overtime" tourId="overtime-rules">
          <div className="space-y-3">
            <label className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-700">Allow overtime</span>
              <button
                type="button"
                role="switch"
                aria-checked={overtimeRules.enabled}
                onClick={() =>
                  setOvertimeRules((p) => ({ ...p, enabled: !p.enabled }))
                }
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  overtimeRules.enabled ? 'bg-[#007AFF]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    overtimeRules.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </label>
            <div>
              <label className={settingsLabelClass}>Rate multiplier</label>
              <input
                type="number"
                step="0.1"
                value={overtimeRules.rateMultiplier}
                onChange={(e) =>
                  setOvertimeRules((p) => ({
                    ...p,
                    rateMultiplier: parseFloat(e.target.value) || 0,
                  }))
                }
                className={settingsInputClass}
                min="1.0"
                max="3.0"
                disabled={!overtimeRules.enabled}
              />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Weekend days" tourId="weekend-days">
          <div className="flex flex-wrap gap-4">
            {[
              { value: 'saturday', label: 'Saturday' },
              { value: 'sunday', label: 'Sunday' },
            ].map((day) => (
              <label key={day.value} className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={weekendHolidays.weekendDays.includes(day.value)}
                  onChange={() =>
                    setWeekendHolidays((p) => ({
                      ...p,
                      weekendDays: p.weekendDays.includes(day.value)
                        ? p.weekendDays.filter((d) => d !== day.value)
                        : [...p.weekendDays, day.value],
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-[#007AFF] focus:ring-[#007AFF]/20"
                />
                {day.label}
              </label>
            ))}
          </div>
        </SettingsSection>
      </SettingsContentGrid>

      <div
        data-tour="save-actions"
        className={`${SETTINGS_PANEL} flex justify-end px-4 py-4 sm:px-5`}
      >
        <button
          type="button"
          onClick={handleSave}
          disabled={isUpdating || !isDirty}
          className="inline-flex items-center gap-2 rounded-xl bg-[#007AFF] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0066DD] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUpdating ? (
            <>
              <LottieLoader size="xs" />
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

export default AttendanceRules;
