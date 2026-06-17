import clsx from 'clsx';
import { useLocation } from 'react-router-dom';
import { SETTINGS_NAV_ITEMS } from '../settingsNav';
import { SETTINGS_PANEL } from '../settingsTheme';
import SettingsNavItem from './SettingsNavItem';

const SettingsSidebar = () => {
  const location = useLocation();

  return (
    <aside className={clsx(SETTINGS_PANEL, 'shrink-0 p-3 lg:sticky lg:top-6 lg:w-56')}>
      <p className="mb-2 hidden px-2 text-[11px] font-medium uppercase tracking-wide text-gray-400 lg:block">
        Settings
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
