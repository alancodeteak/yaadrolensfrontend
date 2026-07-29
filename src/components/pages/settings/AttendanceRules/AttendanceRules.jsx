import { useState, useEffect, useMemo, useCallback } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import {
  DashboardTimePicker,
  LoadingScreen,
  LottieLoader,
  dashboardToast,
} from '../../../common';
import { getApiErrorMessage } from '../../../../utils/apiError';
import SettingsSection, {
  settingsInputClass,
  settingsLabelClass,
  SettingsSectionMeta,
  SettingsContentGrid,
} from '../SettingsSection/SettingsSection';
import { DASHBOARD_BTN_PRIMARY, SETTINGS_PANEL } from '../settingsTheme';
import {
  useGetAttendanceRulesQuery,
  useUpdateAttendanceRulesMutation,
} from '../../../../store/api/settingsApi';
import { useClearWeeklyShiftAssignmentsMutation } from '../../../../store/api/shiftApi';

const SWITCH_CONFIRM_MESSAGE =
  'This clears every employee’s Mon–Sun shift assignment, then applies org working hours to everyone. Templates stay saved — you can reassign later.';

const normalizeTime = (value, fallback) => {
  if (!value) return fallback;
  const str = String(value);
  return str.length >= 5 ? str.slice(0, 5) : str;
};

const buildApiPayload = (
  workingHours,
  gracePeriods,
  kioskScan,
  manualAttendance,
  shiftMode
) => ({
  work_start_time: normalizeTime(workingHours.startTime, '09:00'),
  work_end_time: normalizeTime(workingHours.endTime, '17:00'),
  late_arrival_grace_minutes: Number(gracePeriods.lateArrival ?? 10),
  early_departure_grace_minutes: Number(gracePeriods.earlyDeparture ?? 5),
  minimum_clock_out_minutes: Number(kioskScan.minimumClockOutMinutes ?? 30),
  manual_attendance_enabled: Boolean(manualAttendance.enabled),
  shift_schedule_mode: shiftMode,
});

const hasApiChanges = (
  saved,
  workingHours,
  gracePeriods,
  kioskScan,
  manualAttendance,
  shiftMode
) => {
  if (!saved) return false;

  const current = buildApiPayload(
    workingHours,
    gracePeriods,
    kioskScan,
    manualAttendance,
    shiftMode
  );
  return (
    normalizeTime(saved.work_start_time, '09:00') !== current.work_start_time ||
    normalizeTime(saved.work_end_time, '17:00') !== current.work_end_time ||
    Number(saved.late_arrival_grace_minutes ?? 10) !== current.late_arrival_grace_minutes ||
    Number(saved.early_departure_grace_minutes ?? 5) !== current.early_departure_grace_minutes ||
    Number(saved.minimum_clock_out_minutes ?? 30) !== current.minimum_clock_out_minutes ||
    Boolean(saved.manual_attendance_enabled) !== current.manual_attendance_enabled ||
    (saved.shift_schedule_mode || 'same_for_all') !== current.shift_schedule_mode
  );
};

const AttendanceRules = () => {
  const { data: attendanceRules, isLoading, error, refetch } = useGetAttendanceRulesQuery();
  const [updateAttendanceRules, { isLoading: isUpdating }] = useUpdateAttendanceRulesMutation();
  const [clearWeeklyAssignments, { isLoading: isClearing }] =
    useClearWeeklyShiftAssignmentsMutation();

  const [workingHours, setWorkingHours] = useState({
    startTime: '09:00',
    endTime: '17:00',
  });
  const [gracePeriods, setGracePeriods] = useState({ lateArrival: 10, earlyDeparture: 5 });
  const [kioskScan, setKioskScan] = useState({ minimumClockOutMinutes: 30 });
  const [manualAttendance, setManualAttendance] = useState({ enabled: false });
  const [shiftMode, setShiftMode] = useState('same_for_all');

  useEffect(() => {
    if (!attendanceRules) return;
    setWorkingHours({
      startTime: normalizeTime(attendanceRules.work_start_time, '09:00'),
      endTime: normalizeTime(attendanceRules.work_end_time, '17:00'),
    });
    setGracePeriods({
      lateArrival: attendanceRules.late_arrival_grace_minutes ?? 10,
      earlyDeparture: attendanceRules.early_departure_grace_minutes ?? 5,
    });
    setKioskScan({
      minimumClockOutMinutes: attendanceRules.minimum_clock_out_minutes ?? 30,
    });
    setManualAttendance({
      enabled: Boolean(attendanceRules.manual_attendance_enabled),
    });
    setShiftMode(attendanceRules.shift_schedule_mode || 'same_for_all');
  }, [attendanceRules]);

  const isDirty = useMemo(
    () =>
      hasApiChanges(
        attendanceRules,
        workingHours,
        gracePeriods,
        kioskScan,
        manualAttendance,
        shiftMode
      ),
    [attendanceRules, workingHours, gracePeriods, kioskScan, manualAttendance, shiftMode]
  );

  const savedShiftMode = attendanceRules?.shift_schedule_mode || 'same_for_all';
  const needsClearToSwitch = savedShiftMode === 'per_employee' && shiftMode === 'same_for_all';

  const validateForm = () => {
    const errors = [];
    if (shiftMode === 'same_for_all' && workingHours.startTime === workingHours.endTime) {
      errors.push('Start and end times cannot be the same');
    }
    if (gracePeriods.lateArrival < 0 || gracePeriods.lateArrival > 120) {
      errors.push('Late arrival grace must be between 0 and 120 minutes');
    }
    if (gracePeriods.earlyDeparture < 0 || gracePeriods.earlyDeparture > 120) {
      errors.push('Early departure grace must be between 0 and 120 minutes');
    }
    if (kioskScan.minimumClockOutMinutes < 0 || kioskScan.minimumClockOutMinutes > 480) {
      errors.push('Minimum clock-out wait must be between 0 and 480 minutes');
    }
    return errors;
  };

  const handleClearAndSwitchSameForAll = useCallback(async () => {
    try {
      await clearWeeklyAssignments().unwrap();
      setShiftMode('same_for_all');
      await updateAttendanceRules(
        buildApiPayload(
          workingHours,
          gracePeriods,
          kioskScan,
          manualAttendance,
          'same_for_all'
        )
      ).unwrap();
      dashboardToast.success('Switched to same shift for all employees.', 'Mode updated');
      refetch();
    } catch (err) {
      const message = getApiErrorMessage(err, 'Could not clear schedules. Please try again.');
      dashboardToast.error(message, 'Switch failed');
      throw err;
    }
  }, [
    clearWeeklyAssignments,
    updateAttendanceRules,
    workingHours,
    gracePeriods,
    kioskScan,
    manualAttendance,
    refetch,
  ]);

  const openSwitchConfirm = useCallback(() => {
    dashboardToast.confirm({
      variant: 'warning',
      title: 'Switch to same shift for all?',
      message: SWITCH_CONFIRM_MESSAGE,
      actions: [
        {
          key: 'keep',
          label: 'Keep per-employee',
          variant: 'secondary',
          onClick: () => {
            setShiftMode('per_employee');
          },
        },
        {
          key: 'switch',
          label: 'Clear schedules & switch',
          variant: 'destructive',
          loadingText: 'Switching…',
          onClick: handleClearAndSwitchSameForAll,
        },
      ],
    });
  }, [handleClearAndSwitchSameForAll]);

  const handleSave = async () => {
    if (!isDirty) return;

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach((msg) => dashboardToast.error(msg));
      return;
    }

    if (needsClearToSwitch) {
      openSwitchConfirm();
      return;
    }

    try {
      await updateAttendanceRules(
        buildApiPayload(workingHours, gracePeriods, kioskScan, manualAttendance, shiftMode)
      ).unwrap();
      dashboardToast.success('Your attendance rules were updated.', 'Changes saved');
      refetch();
    } catch (err) {
      const message = getApiErrorMessage(err, 'Could not save attendance rules. Please try again.');
      if (
        (attendanceRules?.shift_schedule_mode || 'same_for_all') === 'per_employee' &&
        shiftMode === 'same_for_all'
      ) {
        openSwitchConfirm();
      } else {
        dashboardToast.error(message, 'Save failed');
      }
    }
  };

  const handleShiftModeChange = (nextMode) => {
    if (nextMode === 'same_for_all' && savedShiftMode === 'per_employee') {
      setShiftMode('same_for_all');
      openSwitchConfirm();
      return;
    }
    setShiftMode(nextMode);
  };

  if (isLoading) {
    return <LoadingScreen message="Loading attendance rules..." fullScreen={false} size="md" />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <p>Could not load attendance rules. Please try again.</p>
        <button type="button" onClick={() => refetch()} className={`${DASHBOARD_BTN_PRIMARY} mt-3`}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {attendanceRules?.updated_at && (
        <SettingsSectionMeta>
          Last updated {new Date(attendanceRules.updated_at).toLocaleString()}
        </SettingsSectionMeta>
      )}

      <SettingsContentGrid>
        <SettingsSection
          title="Shift schedule mode"
          subtitle="Same hours for everyone, or templates per employee"
          tourId="shift-schedule-mode"
        >
          <div className="space-y-3">
            <label
              className={clsx(
                'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all duration-200',
                shiftMode === 'same_for_all'
                  ? 'border-[#007AFF]/35 bg-[#007AFF]/5 shadow-sm'
                  : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/60'
              )}
            >
              <input
                type="radio"
                name="shiftMode"
                checked={shiftMode === 'same_for_all'}
                onChange={() => handleShiftModeChange('same_for_all')}
                className="mt-1 transition-transform duration-200"
              />
              <span>
                <span className="block text-sm font-medium text-gray-900">Same for all</span>
                <span className="text-xs text-gray-500">
                  Everyone uses the org working hours below.
                </span>
              </span>
            </label>
            <label
              className={clsx(
                'flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all duration-200',
                shiftMode === 'per_employee'
                  ? 'border-[#007AFF]/35 bg-[#007AFF]/5 shadow-sm'
                  : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/60'
              )}
            >
              <input
                type="radio"
                name="shiftMode"
                checked={shiftMode === 'per_employee'}
                onChange={() => handleShiftModeChange('per_employee')}
                className="mt-1 transition-transform duration-200"
              />
              <span>
                <span className="block text-sm font-medium text-gray-900">Per employee</span>
                <span className="text-xs text-gray-500">
                  Create templates under Settings → Shifts, then assign Mon–Sun on each employee.
                </span>
              </span>
            </label>
            {needsClearToSwitch && (
              <div className="ui-fade-slide-in flex items-start gap-2 rounded-xl border border-amber-200/80 bg-amber-50/80 px-3 py-2.5 text-xs text-amber-950">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">Weekly schedules must be cleared first</p>
                  <p className="mt-0.5 text-amber-900/80">
                    Confirm in the popup above to clear assignments and switch everyone to the same
                    hours.
                  </p>
                  <button
                    type="button"
                    className="ui-btn-motion mt-2 text-xs font-semibold text-[#007AFF] hover:underline"
                    onClick={openSwitchConfirm}
                  >
                    Show confirmation
                  </button>
                </div>
              </div>
            )}
          </div>
        </SettingsSection>

        {shiftMode === 'same_for_all' && (
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
            <p className="mt-3 text-xs text-gray-500">
              Everyone uses these hours. Overnight is allowed (e.g. 22:00–06:00). Timezone is under
              Kiosk &amp; device.
            </p>
          </SettingsSection>
        )}

        {shiftMode === 'per_employee' && (
          <div
            className="rounded-xl border border-[#007AFF]/20 bg-[#007AFF]/5 px-4 py-3 text-sm text-gray-700"
            data-tour="working-hours"
          >
            Working hours come from{' '}
            <Link to="/admin/settings/shifts" className="font-semibold text-[#007AFF] hover:underline">
              Shifts
            </Link>
            . Create templates there, then assign Mon–Sun on each employee.
          </div>
        )}

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
                max="120"
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
                max="120"
              />
            </div>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Kiosk scan"
          subtitle="Rules for clock-in and clock-out on the attendance tablet"
          tourId="kiosk-scan-rules"
        >
          <div className="max-w-xs">
            <label className={settingsLabelClass}>Minimum minutes before clock-out</label>
            <input
              type="number"
              value={kioskScan.minimumClockOutMinutes}
              onChange={(e) =>
                setKioskScan((p) => ({
                  ...p,
                  minimumClockOutMinutes: parseInt(e.target.value, 10) || 0,
                }))
              }
              className={settingsInputClass}
              min="0"
              max="480"
            />
            <p className="mt-2 text-xs text-gray-500">
              Staff must wait this long after clock-in before a scan can record clock-out.
              Set to 0 to allow immediate clock-out.
            </p>
          </div>
        </SettingsSection>

        <SettingsSection
          title="Manual attendance"
          subtitle="Allow admins to clock employees in or out from Live attendance"
          tourId="manual-attendance"
        >
          <label className="flex items-center justify-between gap-3">
            <span className="text-sm text-gray-700">Enable manual punch in / out</span>
            <button
              type="button"
              role="switch"
              aria-checked={manualAttendance.enabled}
              onClick={() => setManualAttendance((p) => ({ enabled: !p.enabled }))}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                manualAttendance.enabled ? 'bg-[#007AFF]' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  manualAttendance.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
          <p className="mt-3 text-xs text-gray-500">
            When enabled, Live attendance shows In / Out actions for today. Each punch requires
            typing <span className="font-mono text-[11px]">manual attendance approved</span> to
            confirm. Keep this off unless kiosk face scan is unavailable.
          </p>
        </SettingsSection>
      </SettingsContentGrid>

      <div
        data-tour="save-actions"
        className={`${SETTINGS_PANEL} flex justify-end px-4 py-4`}
      >
        <button
          type="button"
          onClick={handleSave}
          disabled={isUpdating || isClearing || !isDirty}
          className={DASHBOARD_BTN_PRIMARY}
        >
          {isUpdating || isClearing ? (
            <>
              <LottieLoader size="xs" />
              Saving…
            </>
          ) : needsClearToSwitch ? (
            'Review switch…'
          ) : (
            'Save changes'
          )}
        </button>
      </div>
    </div>
  );
};

export default AttendanceRules;
