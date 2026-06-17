import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  PageInfoOverlay,
  PageTourButtons,
  SETTINGS_ATTENDANCE_STEPS,
  SETTINGS_HELP_STEPS,
  SETTINGS_KIOSK_STEPS,
  usePageTour,
} from '../../components/common';
import {
  SettingsSidebar,
  AttendanceRules,
  PaymentRules,
  CameraDeviceManagement,
  HelpContact,
} from '../../components/pages/settings';
import { getSettingsNavItem } from '../../components/pages/settings/settingsNav';

function getSettingsTourSteps(pathname) {
  if (pathname.includes('/cameras')) return SETTINGS_KIOSK_STEPS;
  if (pathname.includes('/help')) return SETTINGS_HELP_STEPS;
  return SETTINGS_ATTENDANCE_STEPS;
}

const Settings = () => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const steps = getSettingsTourSteps(location.pathname);
  const activeSection = getSettingsNavItem(location.pathname);
  const { infoOpen, startTutorial, startInfo, closeInfo } = usePageTour(
    steps,
    'settings_tour_completed'
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">{activeSection.subtitle}</p>
          {user?.organization_code && (
            <p className="mt-1 text-sm text-gray-600">
              Organization:{' '}
              <span className="font-medium">{user.organization_code}</span>
            </p>
          )}
        </div>
        <PageTourButtons onTutorial={startTutorial} onInfo={startInfo} />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <SettingsSidebar />
        <div className="min-w-0 flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/admin/settings/attendance" replace />} />
            <Route path="attendance" element={<AttendanceRules />} />
            <Route path="payment" element={<PaymentRules />} />
            <Route path="cameras" element={<CameraDeviceManagement />} />
            <Route path="help" element={<HelpContact />} />
            <Route path="*" element={<Navigate to="/admin/settings/attendance" replace />} />
          </Routes>
        </div>
      </div>

      {infoOpen && (
        <PageInfoOverlay steps={steps} onClose={closeInfo} pageLabel="Settings" />
      )}
    </div>
  );
};

export default Settings;
