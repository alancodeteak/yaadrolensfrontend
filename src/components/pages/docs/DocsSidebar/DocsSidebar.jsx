import clsx from 'clsx';
import { Link, useLocation } from 'react-router-dom';
import { DOCS_NAV_ITEMS } from '../docsNav';
import { DOCS_ICON_TONES, DOCS_PANEL } from '../docsTheme';

const DocsSidebar = () => {
  const location = useLocation();

  return (
    <aside className={clsx(DOCS_PANEL, 'shrink-0 p-3 lg:sticky lg:top-6 lg:w-56')}>
      <p className="mb-2 hidden px-2 text-[11px] font-medium uppercase tracking-wide text-gray-400 lg:block">
        Guide
      </p>
      <nav
        aria-label="Guide sections"
        className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
      >
        {DOCS_NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          const tone = DOCS_ICON_TONES[item.tone] || DOCS_ICON_TONES.help;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={clsx(
                'flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#007AFF]/10 text-[#007AFF]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <span
                className={clsx(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                  isActive ? 'bg-white text-[#007AFF]' : tone.bg,
                  !isActive && tone.fg
                )}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={2} />
              </span>
              <span className="whitespace-nowrap">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default DocsSidebar;
