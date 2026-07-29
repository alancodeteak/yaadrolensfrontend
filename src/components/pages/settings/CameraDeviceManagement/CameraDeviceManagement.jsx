import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ButtonSpinner, LoadingScreen, dashboardToast } from '../../../common';
import { KIOSK_PLAY_STORE_URL } from '../../../../config/kioskApp';
import SettingsSection, {
  settingsInputClass,
  settingsLabelClass,
  SettingsSectionMeta,
  SettingsContentGrid,
} from '../SettingsSection/SettingsSection';
import { DASHBOARD_ACCENTS, DASHBOARD_BTN_PRIMARY, SETTINGS_PANEL } from '../settingsTheme';
import {
  useGetDeviceStatusQuery,
  useGetSettingsQuery,
  useUpdateKioskSettingsMutation,
} from '../../../../store/api/settingsApi';

const TIMEZONE_OPTIONS = [
  { value: 'UTC', label: 'UTC' },
  { value: 'Asia/Kolkata', label: 'India (Asia/Kolkata)' },
  { value: 'Asia/Dubai', label: 'UAE (Asia/Dubai)' },
  { value: 'Asia/Singapore', label: 'Singapore' },
  { value: 'Asia/Tokyo', label: 'Japan (Asia/Tokyo)' },
  { value: 'Europe/London', label: 'UK (Europe/London)' },
  { value: 'America/New_York', label: 'US Eastern' },
  { value: 'America/Los_Angeles', label: 'US Pacific' },
];

const CameraDeviceManagement = () => {
  const { data: deviceStatus, isLoading: deviceLoading, error: deviceError, refetch: refetchDevice } =
    useGetDeviceStatusQuery();
  const { data: settings, isLoading: settingsLoading, error: settingsError, refetch: refetchSettings } =
    useGetSettingsQuery();
  const [updateKioskSettings, { isLoading: isUpdating }] = useUpdateKioskSettingsMutation();

  const [timezone, setTimezone] = useState('UTC');

  useEffect(() => {
    if (!settings) return;
    setTimezone(settings.timezone ?? 'UTC');
  }, [settings]);

  const isDirty = useMemo(() => {
    if (!settings) return false;
    return (settings.timezone ?? 'UTC') !== timezone;
  }, [settings, timezone]);

  const handleSave = async () => {
    if (!isDirty) return;
    try {
      await updateKioskSettings({ timezone }).unwrap();
      dashboardToast.success('Kiosk settings were updated.', 'Changes saved');
      refetchSettings();
    } catch (err) {
      const detail = err?.data?.detail;
      const message =
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail)
            ? detail.map((e) => e.msg || e.message).join('; ')
            : 'Could not save kiosk settings. Please try again.';
      dashboardToast.error(message, 'Save failed');
    }
  };

  const isLoading = deviceLoading || settingsLoading;
  const error = deviceError || settingsError;

  if (isLoading) {
    return <LoadingScreen message="Loading kiosk settings..." fullScreen={false} size="md" />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <p>Could not load kiosk settings. Please try again.</p>
        <button
          type="button"
          onClick={() => {
            refetchDevice();
            refetchSettings();
          }}
          className={`${DASHBOARD_BTN_PRIMARY} mt-3`}
        >
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

      <SettingsContentGrid className="xl:grid-cols-1">
        <SettingsSection
          title="Organization timezone"
          subtitle="Used for today’s date, attendance, leave, and payroll"
        >
          <div className="max-w-md">
            <label className={settingsLabelClass}>Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className={settingsInputClass}
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </SettingsSection>

        <SettingsSection title="Device status" tourId="device-status">
          <dl className="space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
              <dt className="text-gray-500">Paired</dt>
              <dd
                className="font-semibold"
                style={{ color: deviceStatus?.paired ? DASHBOARD_ACCENTS.green : DASHBOARD_ACCENTS.gray }}
              >
                {deviceStatus?.paired ? 'Yes' : 'No'}
              </dd>
            </div>
            {deviceStatus?.device_id && (
              <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                <dt className="text-gray-500">Device ID</dt>
                <dd className="font-mono text-xs text-gray-900">{deviceStatus.device_id}</dd>
              </div>
            )}
            {deviceStatus?.paired_at && (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-gray-500">Paired at</dt>
                <dd className="text-gray-900">
                  {new Date(deviceStatus.paired_at).toLocaleString()}
                </dd>
              </div>
            )}
          </dl>
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

      <div
        data-tour="pairing-info"
        className={`${SETTINGS_PANEL} px-4 py-4`}
      >
        <p className="text-sm font-semibold text-gray-900">How to pair a kiosk</p>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Install the YaadroLens kiosk app on your attendance tablet, then sign in with your org
          admin username and password — the same ones you use for this website. After login, the
          tablet is linked to your company. Re-pairing replaces the existing device.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <a
            href={KIOSK_PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-xl border border-gray-200/60 bg-white px-3.5 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition hover:border-gray-300 hover:bg-gray-50"
          >
            <img src="/playstore.png" alt="" className="h-9 w-9 shrink-0" aria-hidden="true" />
            <span className="text-left leading-tight">
              <span className="block text-[10px] font-medium uppercase tracking-wide text-gray-500">
                Get it on
              </span>
              <span className="block text-sm font-semibold text-gray-900">Google Play</span>
            </span>
          </a>
          <Link
            to="/docs/kiosk"
            className="text-sm font-medium text-[#007AFF] hover:text-[#0066DD] hover:underline"
          >
            Read the full Kiosk setup guide
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CameraDeviceManagement;
