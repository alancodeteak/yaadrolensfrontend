/** Map admin app paths to the matching /docs guide section. */
const PAGE_DOCS_ROUTES = [
  { match: (path) => path === '/admin/dashboard', href: '/docs/dashboard' },
  { match: (path) => path.startsWith('/admin/employees'), href: '/docs/employees' },
  { match: (path) => path === '/admin/salary', href: '/docs/salary' },
  { match: (path) => path === '/admin/payroll', href: '/docs/payroll' },
  { match: (path) => path.startsWith('/admin/reports'), href: '/docs/reports' },
  { match: (path) => path === '/admin/attendance', href: '/docs/attendance' },
  { match: (path) => path === '/admin/attendance-dashboard', href: '/docs/analytics' },
  { match: (path) => path.startsWith('/admin/settings/cameras'), href: '/docs/kiosk' },
  { match: (path) => path.startsWith('/admin/settings/help'), href: '/docs/help' },
  { match: (path) => path.startsWith('/admin/settings'), href: '/docs/settings' },
];

export function resolvePageDocsHref(pathname) {
  const route = PAGE_DOCS_ROUTES.find((item) => item.match(pathname));
  return route?.href ?? '/docs/getting-started';
}
