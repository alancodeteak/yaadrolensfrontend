import { Link } from 'react-router-dom';
import { TabletSmartphone } from 'lucide-react';
import { LoadingScreen } from '../../../common';
import SettingsSection, { SettingsPageHeader, SettingsContentGrid } from '../SettingsSection';
import { SETTINGS_PANEL } from '../settingsTheme';
import { useGetDeviceStatusQuery } from '../../../../store/api/settingsApi';

const CameraDeviceManagement = () => {
  const { data: deviceStatus, isLoading, error, refetch } = useGetDeviceStatusQuery();

  if (isLoading) {
    return <LoadingScreen message="Loading device status..." fullScreen={false} size="md" />;
  }

  if (error) {
    return (
      <div className={`${SETTINGS_PANEL} px-5 py-8 text-center`}>
        <p className="text-sm font-medium text-red-800">Failed to load kiosk status</p>
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
        icon={TabletSmartphone}
        tone="kiosk"
        title="Kiosk device"
        subtitle="Pair attendance kiosks with your organization and monitor device status"
      />

      <SettingsContentGrid className="xl:grid-cols-1">
        <SettingsSection title="Status" tourId="device-status">
          <dl className="space-y-4 text-sm sm:text-base">
            <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
              <dt className="text-gray-500">Paired</dt>
              <dd
                className={`font-semibold ${
                  deviceStatus?.paired ? 'text-[#34C759]' : 'text-gray-400'
                }`}
              >
                {deviceStatus?.paired ? 'Yes' : 'No'}
              </dd>
            </div>
            {deviceStatus?.device_id && (
              <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                <dt className="text-gray-500">Device ID</dt>
                <dd className="font-mono text-xs text-gray-900 sm:text-sm">{deviceStatus.device_id}</dd>
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
        className={`${SETTINGS_PANEL} px-4 py-4 text-sm leading-relaxed text-gray-600 sm:px-5 sm:py-5`}
      >
        <p className="font-semibold text-gray-900">How to pair a kiosk</p>
        <p className="mt-2">
          From the kiosk app, call{' '}
          <code className="rounded-lg bg-gray-50 px-1.5 py-0.5 font-mono text-xs">
            POST /api/v1/kiosk/auth/login
          </code>{' '}
          with your org admin user ID and password. Re-pairing replaces the existing device.
        </p>
        <p className="mt-3">
          <Link to="/docs/kiosk" className="font-medium text-[#007AFF] hover:underline">
            Read the full Kiosk setup guide
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CameraDeviceManagement;
