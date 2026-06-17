import clsx from 'clsx';
import { sidebarRowClass } from './sidebarLayout';

const SidebarNavItem = ({ icon: Icon, label, isActive, collapsed, comingSoon = false, onClick }) => {
  return (
    <button
      type="button"
      onClick={comingSoon ? undefined : onClick}
      disabled={comingSoon}
      title={collapsed ? (comingSoon ? `${label} (Coming soon)` : label) : undefined}
      aria-current={isActive ? 'page' : undefined}
      aria-label={collapsed ? (comingSoon ? `${label}, coming soon` : label) : undefined}
      aria-disabled={comingSoon || undefined}
      className={clsx(
        'relative rounded-xl transition-colors duration-200',
        collapsed
          ? 'mx-auto flex h-10 w-10 shrink-0 items-center justify-center'
          : sidebarRowClass(false),
        comingSoon ? 'cursor-default text-gray-400' : 'cursor-pointer',
        !comingSoon && isActive && 'bg-[#007AFF]/10 font-semibold text-[#007AFF]',
        'group',
        !comingSoon && !isActive && 'font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      )}
    >
      {!comingSoon && isActive && !collapsed && (
        <span
          className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-[#007AFF]"
          aria-hidden="true"
        />
      )}
      <Icon
        className={clsx(
          'h-[18px] w-[18px] shrink-0',
          !comingSoon && isActive ? 'text-[#007AFF]' : 'text-gray-500 group-hover:text-gray-700'
        )}
        strokeWidth={2}
        aria-hidden="true"
      />
      <span
        className={clsx(
          collapsed
            ? 'hidden'
            : 'flex min-w-0 flex-1 items-center gap-2 overflow-hidden whitespace-nowrap opacity-100'
        )}
        aria-hidden={collapsed}
      >
        {comingSoon ? (
          <>
            <span className="truncate text-sm">{label}</span>
            <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
              Soon
            </span>
          </>
        ) : (
          <span className="truncate text-sm">{label}</span>
        )}
      </span>
    </button>
  );
};

export default SidebarNavItem;
