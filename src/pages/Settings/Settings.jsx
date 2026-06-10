import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Settings as SettingsIcon } from 'lucide-react';
import clsx from 'clsx';
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
import { SETTINGS_ICON_TONES } from '../../components/pages/settings/settingsTheme';

function getSettingsTourSteps(pathname) {
  if (pathname.includes('/cameras')) return SETTINGS_KIOSK_STEPS;
  if (pathname.includes('/help')) return SETTINGS_HELP_STEPS;
  return SETTINGS_ATTENDANCE_STEPS;
}

const Settings = () => {
  const location = useLocation();
  const steps = getSettingsTourSteps(location.pathname);
  const activeSection = getSettingsNavItem(location.pathname);
  const ActiveIcon = activeSection.icon;
  const activeTone = SETTINGS_ICON_TONES[activeSection.tone];
  const { infoOpen, startTutorial, startInfo, closeInfo } = usePageTour(
    steps,
    'settings_tour_completed'
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-4">
          <span
            className={clsx(
              'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
              SETTINGS_ICON_TONES.settings.bg,
              SETTINGS_ICON_TONES.settings.fg
            )}
          >
            <SettingsIcon className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
          </span>
          <div>
            <span className="mb-2 inline-block rounded-full bg-[#007AFF]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#007AFF]">
              Organization
            </span>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <span
                className={clsx(
                  'inline-flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-xs font-medium',
                  activeTone.bg,
                  activeTone.fg
                )}
              >
                <ActiveIcon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                {activeSection.name}
              </span>
              <span className="text-gray-400">·</span>
              <span>Manage rules, kiosk, and support for your organization</span>
            </p>
          </div>
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
