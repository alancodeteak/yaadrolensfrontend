import clsx from 'clsx';

/** Collapsed rail is 72px; inner padding must fit a 40px icon (8 + 40 + 8 = 56… use 48px content) */
export const sidebarRowPadding = (collapsed) => (collapsed ? 'px-2' : 'px-3');

export const sidebarRowClass = (collapsed, extra) =>
  clsx(
    'flex h-10 w-full min-w-0 items-center gap-3',
    sidebarRowPadding(collapsed),
    extra
  );
