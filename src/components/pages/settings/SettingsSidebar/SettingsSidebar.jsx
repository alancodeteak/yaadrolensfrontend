import clsx from 'clsx';
import { useLocation } from 'react-router-dom';
import { Settings as SettingsIcon } from 'lucide-react';
import { SETTINGS_NAV_ITEMS } from '../settingsNav';
import { SETTINGS_ICON_TONES, SETTINGS_PANEL } from '../settingsTheme';
import SettingsNavItem from './SettingsNavItem';

const SettingsSidebar = () => {
  const location = useLocation();
  const settingsTone = SETTINGS_ICON_TONES.settings;

  return (
    <aside className={clsx(SETTINGS_PANEL, 'shrink-0 p-3 lg:sticky lg:top-6 lg:w-56')}>
      <div className="mb-3 hidden items-center gap-2.5 px-2 lg:flex">
        <span
          className={clsx(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
            settingsTone.bg,
            settingsTone.fg
          )}
        >
          <SettingsIcon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">Settings</p>
          <p className="text-[11px] text-gray-500">Organization preferences</p>
        </div>
      </div>

      <p className="mb-2 hidden px-2 text-[11px] font-medium uppercase tracking-wide text-gray-400 lg:block">
        Menu
      </p>
      <nav
        data-tour="settings-nav"
        aria-label="Settings sections"
        className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
      >
        {SETTINGS_NAV_ITEMS.map((item) => (
          <SettingsNavItem
            key={item.href}
            item={item}
            isActive={location.pathname === item.href}
          />
        ))}
      </nav>
    </aside>
  );
};

export default SettingsSidebar;
