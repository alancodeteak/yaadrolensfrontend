import { Link } from 'react-router-dom';
import { LoadingScreen } from '../../../common';
import SettingsSection, { SettingsContentGrid } from '../SettingsSection/SettingsSection';
import { DASHBOARD_ACCENTS, DASHBOARD_BTN_PRIMARY, SETTINGS_PANEL } from '../settingsTheme';
import { useGetDeviceStatusQuery } from '../../../../store/api/settingsApi';

const CameraDeviceManagement = () => {
  const { data: deviceStatus, isLoading, error, refetch } = useGetDeviceStatusQuery();

  if (isLoading) {
    return <LoadingScreen message="Loading device status..." fullScreen={false} size="md" />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <p>Could not load kiosk status. Please try again.</p>
        <button type="button" onClick={() => refetch()} className={`${DASHBOARD_BTN_PRIMARY} mt-3`}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SettingsContentGrid className="xl:grid-cols-1">
        <SettingsSection title="Status" tourId="device-status">
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

      <div
        data-tour="pairing-info"
        className={`${SETTINGS_PANEL} px-4 py-4 text-sm leading-relaxed text-gray-600`}
      >
        <p className="text-sm font-semibold text-gray-900">How to pair a kiosk</p>
        <p className="mt-2">
          From the kiosk app, call{' '}
          <code className="rounded-lg bg-gray-50 px-1.5 py-0.5 font-mono text-xs">
            POST /api/v1/kiosk/auth/login
          </code>{' '}
          with your org admin user ID and password. Re-pairing replaces the existing device.
        </p>
        <p className="mt-3">
          <Link
            to="/docs/kiosk"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Read the full Kiosk setup guide
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CameraDeviceManagement;
