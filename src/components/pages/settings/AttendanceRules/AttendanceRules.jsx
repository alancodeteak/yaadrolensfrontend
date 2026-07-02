import { useState, useEffect, useMemo } from 'react';
import { DashboardTimePicker, LoadingScreen, LottieLoader, dashboardToast } from '../../../common';
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

const normalizeTime = (value, fallback) => {
  if (!value) return fallback;
  const str = String(value);
  return str.length >= 5 ? str.slice(0, 5) : str;
};

const buildApiPayload = (workingHours, gracePeriods, kioskScan) => ({
  work_start_time: normalizeTime(workingHours.startTime, '09:00'),
  work_end_time: normalizeTime(workingHours.endTime, '17:00'),
  late_arrival_grace_minutes: Number(gracePeriods.lateArrival ?? 10),
  early_departure_grace_minutes: Number(gracePeriods.earlyDeparture ?? 5),
  minimum_clock_out_minutes: Number(kioskScan.minimumClockOutMinutes ?? 30),
});

const hasApiChanges = (saved, workingHours, gracePeriods, kioskScan) => {
  if (!saved) return false;

  const current = buildApiPayload(workingHours, gracePeriods, kioskScan);
  return (
    normalizeTime(saved.work_start_time, '09:00') !== current.work_start_time ||
    normalizeTime(saved.work_end_time, '17:00') !== current.work_end_time ||
    Number(saved.late_arrival_grace_minutes ?? 10) !== current.late_arrival_grace_minutes ||
    Number(saved.early_departure_grace_minutes ?? 5) !== current.early_departure_grace_minutes ||
    Number(saved.minimum_clock_out_minutes ?? 30) !== current.minimum_clock_out_minutes
  );
};

const AttendanceRules = () => {
  const { data: attendanceRules, isLoading, error, refetch } = useGetAttendanceRulesQuery();
  const [updateAttendanceRules, { isLoading: isUpdating }] = useUpdateAttendanceRulesMutation();

  const [workingHours, setWorkingHours] = useState({
    startTime: '09:00',
    endTime: '17:00',
  });
  const [gracePeriods, setGracePeriods] = useState({ lateArrival: 10, earlyDeparture: 5 });
  const [kioskScan, setKioskScan] = useState({ minimumClockOutMinutes: 30 });

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
  }, [attendanceRules]);

  const isDirty = useMemo(
    () => hasApiChanges(attendanceRules, workingHours, gracePeriods, kioskScan),
    [attendanceRules, workingHours, gracePeriods, kioskScan]
  );

  const validateForm = () => {
    const errors = [];
    if (workingHours.startTime >= workingHours.endTime) {
      errors.push('End time must be after start time');
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

  const handleSave = async () => {
    if (!isDirty) return;

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach((msg) => dashboardToast.error(msg));
      return;
    }

    try {
      await updateAttendanceRules(buildApiPayload(workingHours, gracePeriods, kioskScan)).unwrap();
      dashboardToast.success('Your attendance rules were updated.', 'Changes saved');
      refetch();
    } catch (err) {
      const detail = err?.data?.detail;
      const message =
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail)
            ? detail.map((e) => e.msg || e.message).join('; ')
            : 'Could not save attendance rules. Please try again.';
      dashboardToast.error(message, 'Save failed');
    }
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
            Used for late and early-leave detection. Timezone is configured under Kiosk &amp; device.
          </p>
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
      </SettingsContentGrid>

      <div
        data-tour="save-actions"
        className={`${SETTINGS_PANEL} flex justify-end px-4 py-4`}
      >
        <button
          type="button"
          onClick={handleSave}
          disabled={isUpdating || !isDirty}
          className={DASHBOARD_BTN_PRIMARY}
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
