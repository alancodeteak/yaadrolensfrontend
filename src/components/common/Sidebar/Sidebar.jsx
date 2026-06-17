import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Home,
  Users,
  CalendarCheck,
  BarChart3,
  Settings,
  GraduationCap,
  FileText,
  CreditCard,
  Banknote,
  Receipt,
  HandCoins,
  Landmark,
  Boxes,
  MessageCircle,
  LogOut,
} from 'lucide-react';
import { logout } from '../../../store/slices';
import { useAppDispatch } from '../../../hooks/redux';
import SidebarNavItem from './SidebarNavItem';
import { sidebarRowClass, sidebarRowPadding } from './sidebarLayout';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Home, match: (path) => path === '/admin/dashboard' },
  { name: 'Employees', href: '/admin/employees', icon: Users, match: (path) => path.startsWith('/admin/employees') },
  { name: 'Attendance', href: '/admin/attendance', icon: CalendarCheck, match: (path) => path === '/admin/attendance' },
  { name: 'Analytics', href: '/admin/attendance-dashboard', icon: BarChart3, match: (path) => path === '/admin/attendance-dashboard' },
  { name: 'Salary', href: '/admin/salary', icon: Banknote, match: (path) => path.startsWith('/admin/salary') },
  { name: 'Payment', href: '/admin/payroll', icon: CreditCard, match: (path) => path.startsWith('/admin/payroll') },
  { name: 'Reports', href: '/admin/reports', icon: FileText, match: (path) => path.startsWith('/admin/reports') },
  { name: 'Get Started', href: '/docs/getting-started', icon: GraduationCap, match: (path) => path.startsWith('/docs') },
  { name: 'Settings', href: '/admin/settings', icon: Settings, match: (path) => path.startsWith('/admin/settings') },
];

const COMING_SOON_ITEMS = [
  { name: 'Tax', icon: Receipt },
  { name: 'Reimbursements', icon: HandCoins },
  { name: 'Loan', icon: Landmark },
  { name: 'Asset Management', icon: Boxes },
  { name: 'WhatsApp', icon: MessageCircle },
];

const YAADRO_LOGO = '/assets/yaadrolens-logo.png';
const YAADRO_ICON = '/assets/yaadrolens-icon.png';
const CODETEAK_LOGO = '/assets/Copy of logo-with-text-ho.png';
const CODETEAK_URL = 'https://www.codeteak.com/';

const sectionLabelClass =
  'mb-1 h-5 text-[11px] font-medium uppercase leading-5 tracking-wide text-gray-400';

const SidebarHeader = ({ collapsed, subtitle }) => (
  <div className="mb-3 shrink-0 border-b border-gray-100 pb-3">
    <div className={clsx(sidebarRowClass(collapsed), !collapsed && 'items-start')}>
      <img
        src={collapsed ? YAADRO_ICON : YAADRO_LOGO}
        alt="YaadroLens"
        className={clsx(
          'shrink-0 object-contain',
          collapsed
            ? 'h-10 w-10 rounded-xl'
            : 'h-11 w-auto max-w-[168px] rounded-lg'
        )}
      />
      <div
        className={clsx(
          'min-w-0 overflow-hidden transition-[opacity,width] duration-200',
          collapsed ? 'w-0 opacity-0' : 'opacity-100'
        )}
        aria-hidden={collapsed}
      >
        <p className="truncate text-[11px] text-gray-500">{subtitle}</p>
      </div>
    </div>

    <div
      className={clsx(
        'overflow-hidden transition-[height,opacity] duration-200',
        collapsed ? 'h-0 opacity-0' : 'h-14 opacity-100'
      )}
    >
      <a
        href={CODETEAK_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          'mt-2 flex flex-col gap-1 rounded-xl py-1 transition-colors hover:bg-gray-50',
          sidebarRowPadding(collapsed)
        )}
        aria-label="Powered by CodeTeak — opens codeteak.com"
        tabIndex={collapsed ? -1 : undefined}
      >
        <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
          Powered by
        </span>
        <img
          src={CODETEAK_LOGO}
          alt="CodeTeak"
          className="h-6 w-auto max-w-[180px] object-contain object-left"
        />
      </a>
    </div>
  </div>
);

const SidebarFooter = ({ collapsed, onLogout }) => (
  <div className="mt-auto shrink-0 border-t border-gray-100 pt-3">
    <button
      type="button"
      onClick={onLogout}
      title={collapsed ? 'Log out' : undefined}
      className={clsx(
        collapsed
          ? 'mx-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-xl'
          : sidebarRowClass(false),
        'font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-[#FF3B30]'
      )}
    >
      <LogOut className="h-[18px] w-[18px] shrink-0" strokeWidth={2} aria-hidden="true" />
      <span
        className={clsx('truncate text-sm', collapsed ? 'hidden' : 'opacity-100')}
        aria-hidden={collapsed}
      >
        Log out
      </span>
    </button>
  </div>
);

const SidebarPanel = ({ collapsed, location, subtitle, onNavClick, onLogout }) => (
  <div className="flex h-full min-h-0 flex-col">
    <SidebarHeader collapsed={collapsed} subtitle={subtitle} />

    <nav
      aria-label="Main navigation"
      className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden"
    >
      <p className={clsx(sectionLabelClass, sidebarRowPadding(collapsed), collapsed && 'invisible')}>
        Menu
      </p>

      {NAV_ITEMS.map((item) => (
        <SidebarNavItem
          key={item.name}
          icon={item.icon}
          label={item.name}
          collapsed={collapsed}
          isActive={item.match(location.pathname)}
          onClick={() => onNavClick(item.href)}
        />
      ))}

      <div
        className={clsx(
          'mt-4 shrink-0 border-t pt-3',
          collapsed ? 'border-transparent' : 'border-gray-100'
        )}
      >
        <p className={clsx(sectionLabelClass, sidebarRowPadding(collapsed), collapsed && 'invisible')}>
          Coming soon
        </p>
      </div>

      {COMING_SOON_ITEMS.map((item) => (
        <SidebarNavItem
          key={`soon-${item.name}`}
          icon={item.icon}
          label={item.name}
          collapsed={collapsed}
          comingSoon
        />
      ))}
    </nav>

    <SidebarFooter collapsed={collapsed} onLogout={onLogout} />
  </div>
);

const Sidebar = ({ className, forceExpanded = false, onNavigate, onExpandedChange }) => {
  const [hovered, setHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useSelector((state) => state.auth);

  const expanded = forceExpanded || hovered;
  const collapsed = !expanded;
  const orgLabel = user?.organization_code || user?.organization_name;

  useEffect(() => {
    if (forceExpanded) return;
    onExpandedChange?.(hovered);
  }, [hovered, forceExpanded, onExpandedChange]);

  const handleNavClick = (href) => {
    navigate(href);
    onNavigate?.();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  return (
    <aside
      onMouseEnter={() => !forceExpanded && setHovered(true)}
      onMouseLeave={() => !forceExpanded && setHovered(false)}
      className={clsx(
        'z-40 shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out',
        forceExpanded
          ? 'fixed inset-y-0 left-0 flex h-screen w-[260px] py-3 pl-2'
          : 'hidden h-screen w-[72px] lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:py-3 lg:pl-2',
        !forceExpanded && hovered && 'lg:w-[260px]',
        className
      )}
    >
      <div
        className={clsx(
          'flex h-full w-full flex-col overflow-hidden py-3',
          forceExpanded
            ? 'rounded-2xl border border-gray-200/60 bg-white pl-3 pr-3 shadow-[0_2px_16px_rgba(0,0,0,0.06)]'
            : clsx(
                'rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]',
                collapsed ? 'pl-0 pr-0' : 'pl-3 pr-3'
              )
        )}
      >
        <SidebarPanel
          collapsed={collapsed}
          location={location}
          subtitle={orgLabel}
          onNavClick={handleNavClick}
          onLogout={handleLogout}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
