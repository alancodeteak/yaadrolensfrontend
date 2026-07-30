/** Shared visual tokens aligned with the main dashboard. */
export const DASHBOARD_PANEL =
  'rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]';

export const DASHBOARD_ACCENTS = {
  blue: '#007AFF',
  green: '#34C759',
  orange: '#FF9500',
  purple: '#5856D6',
  red: '#FF3B30',
  gray: '#8E8E93',
};

export const DASHBOARD_BTN_PRIMARY =
  'ui-btn-motion inline-flex items-center gap-2 rounded-xl bg-[#007AFF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0066DD] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30 disabled:cursor-not-allowed disabled:opacity-60';

export const DASHBOARD_BTN_SECONDARY =
  'ui-btn-motion inline-flex items-center gap-2 rounded-xl border border-gray-200/60 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 disabled:cursor-not-allowed disabled:opacity-60';

/** Desktop table wrapper — pair with DASHBOARD_MOBILE_STACK */
export const DASHBOARD_TABLE_DESKTOP = 'hidden overflow-x-auto overscroll-x-contain md:block';

/** Mobile card stack — pair with DASHBOARD_TABLE_DESKTOP */
export const DASHBOARD_MOBILE_STACK = 'space-y-3 p-4 md:hidden';

/** Icon action button with ~44px touch target on small screens */
export const DASHBOARD_ICON_BTN =
  'inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-0 sm:min-w-0 sm:p-1.5';

/** Modal panel height that respects mobile browser chrome */
export const DASHBOARD_MODAL_MAX_H = 'max-h-[min(90dvh,90vh)]';
