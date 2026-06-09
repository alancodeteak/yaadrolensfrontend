import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { SETTINGS_ICON_TONES } from '../settingsTheme';

const SettingsNavItem = ({ item, isActive }) => {
  const Icon = item.icon;
  const tone = SETTINGS_ICON_TONES[item.tone] || SETTINGS_ICON_TONES.settings;

  return (
    <Link
      to={item.href}
      aria-current={isActive ? 'page' : undefined}
      className={clsx(
        'relative flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors duration-200',
        isActive
          ? 'bg-[#007AFF]/10 font-semibold text-[#007AFF]'
          : 'font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      )}
    >
      {isActive && (
        <span
          className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-[#007AFF]"
          aria-hidden="true"
        />
      )}
      <span
        className={clsx(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
          isActive ? 'bg-white text-[#007AFF]' : tone.bg,
          !isActive && tone.fg
        )}
      >
        <Icon className="block h-3.5 w-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
      </span>
      <span className="whitespace-nowrap">{item.name}</span>
    </Link>
  );
};

export default SettingsNavItem;
