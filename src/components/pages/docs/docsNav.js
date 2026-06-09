import {
  Rocket,
  LayoutDashboard,
  Users,
  CalendarCheck,
  BarChart3,
  Settings,
  TabletSmartphone,
  CircleHelp,
  Clock,
} from 'lucide-react';

export const DOCS_NAV_ITEMS = [
  { name: 'Getting started', href: '/docs/getting-started', icon: Rocket, tone: 'rocket' },
  { name: 'Dashboard', href: '/docs/dashboard', icon: LayoutDashboard, tone: 'dashboard' },
  { name: 'Employees', href: '/docs/employees', icon: Users, tone: 'users' },
  { name: 'Live attendance', href: '/docs/attendance', icon: CalendarCheck, tone: 'attendance' },
  { name: 'Analytics', href: '/docs/analytics', icon: BarChart3, tone: 'analytics' },
  { name: 'Settings', href: '/docs/settings', icon: Settings, tone: 'settings' },
  { name: 'Kiosk setup', href: '/docs/kiosk', icon: TabletSmartphone, tone: 'kiosk' },
  { name: 'Page tours', href: '/docs/help', icon: CircleHelp, tone: 'help' },
  { name: 'Coming soon', href: '/docs/coming-soon', icon: Clock, tone: 'clock' },
];
