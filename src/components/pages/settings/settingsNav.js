import { Clock, Wallet, TabletSmartphone, CircleHelp } from 'lucide-react';

export const SETTINGS_NAV_ITEMS = [
  {
    name: 'Attendance rules',
    href: '/admin/settings/attendance',
    icon: Clock,
    subtitle: 'Work hours, grace periods, overtime, and weekend settings',
  },
  {
    name: 'Payment rules',
    href: '/admin/settings/payment',
    icon: Wallet,
    subtitle: 'Salary generation, weekly off days, and leave policy',
  },
  {
    name: 'Kiosk',
    href: '/admin/settings/cameras',
    icon: TabletSmartphone,
    subtitle: 'Pair attendance kiosks and monitor device status',
  },
  {
    name: 'Help & support',
    href: '/admin/settings/help',
    icon: CircleHelp,
    subtitle: 'Contact CodeTeak for product support and office locations',
  },
];

export function getSettingsNavItem(pathname) {
  return SETTINGS_NAV_ITEMS.find((item) => pathname.startsWith(item.href)) ?? SETTINGS_NAV_ITEMS[0];
}
