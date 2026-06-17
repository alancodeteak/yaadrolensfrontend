import clsx from 'clsx';
import { Link } from 'react-router-dom';

const SettingsNavItem = ({ item, isActive }) => {
  const Icon = item.icon;

  return (
    <Link
      to={item.href}
      aria-current={isActive ? 'page' : undefined}
      className={clsx(
        'group relative flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors duration-200',
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
      <Icon
        className={clsx(
          'h-[18px] w-[18px] shrink-0',
          isActive ? 'text-[#007AFF]' : 'text-gray-500 group-hover:text-gray-700'
        )}
        strokeWidth={2}
        aria-hidden="true"
      />
      <span className="whitespace-nowrap">{item.name}</span>
    </Link>
  );
};

export default SettingsNavItem;
