import { Clock, TabletSmartphone, CircleHelp } from 'lucide-react';

export const SETTINGS_NAV_ITEMS = [
  {
    name: 'Attendance rules',
    href: '/admin/settings/attendance',
    icon: Clock,
    tone: 'attendance',
  },
  {
    name: 'Kiosk',
    href: '/admin/settings/cameras',
    icon: TabletSmartphone,
    tone: 'kiosk',
  },
  {
    name: 'Help & support',
    href: '/admin/settings/help',
    icon: CircleHelp,
    tone: 'help',
  },
];

export function getSettingsNavItem(pathname) {
  return SETTINGS_NAV_ITEMS.find((item) => pathname.startsWith(item.href)) ?? SETTINGS_NAV_ITEMS[0];
}
