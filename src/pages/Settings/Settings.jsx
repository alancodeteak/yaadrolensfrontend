import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  PageInfoOverlay,
  PageTourButtons,
  SETTINGS_ATTENDANCE_STEPS,
  SETTINGS_SHIFTS_STEPS,
  SETTINGS_HELP_STEPS,
  SETTINGS_KIOSK_STEPS,
  SETTINGS_PAYMENT_STEPS,
  usePageTour,
} from '../../components/common';
import {
  SettingsSidebar,
  AttendanceRules,
  ShiftTemplates,
  PaymentRules,
  CameraDeviceManagement,
  HelpContact,
  SettingsPageTransition,
} from '../../components/pages/settings';
import { getSettingsNavItem } from '../../components/pages/settings/settingsNav';

function getSettingsTourSteps(pathname) {
  if (pathname.includes('/payment')) return SETTINGS_PAYMENT_STEPS;
  if (pathname.includes('/cameras')) return SETTINGS_KIOSK_STEPS;
  if (pathname.includes('/help')) return SETTINGS_HELP_STEPS;
  if (pathname.includes('/shifts')) return SETTINGS_SHIFTS_STEPS;
  return SETTINGS_ATTENDANCE_STEPS;
}

function getSettingsTourStorageKey(pathname) {
  if (pathname.includes('/payment')) return 'settings_tour_completed_payment';
  if (pathname.includes('/cameras')) return 'settings_tour_completed_kiosk';
  if (pathname.includes('/help')) return 'settings_tour_completed_help';
  if (pathname.includes('/shifts')) return 'settings_tour_completed_shifts';
  return 'settings_tour_completed_attendance';
}

const Settings = () => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const steps = getSettingsTourSteps(location.pathname);
  const activeSection = getSettingsNavItem(location.pathname);
  const { infoOpen, startTutorial, startInfo, closeInfo } = usePageTour(
    steps,
    getSettingsTourStorageKey(location.pathname)
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
            <Route index element={<Navigate to="attendance" replace />} />
            <Route
              path="attendance"
              element={
                <SettingsPageTransition>
                  <AttendanceRules />
                </SettingsPageTransition>
              }
            />
            <Route
              path="shifts"
              element={
                <SettingsPageTransition>
                  <ShiftTemplates />
                </SettingsPageTransition>
              }
            />
            <Route
              path="payment"
              element={
                <SettingsPageTransition>
                  <PaymentRules />
                </SettingsPageTransition>
              }
            />
            <Route
              path="cameras"
              element={
                <SettingsPageTransition>
                  <CameraDeviceManagement />
                </SettingsPageTransition>
              }
            />
            <Route
              path="help"
              element={
                <SettingsPageTransition>
                  <HelpContact />
                </SettingsPageTransition>
              }
            />
            <Route path="*" element={<Navigate to="attendance" replace />} />
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
