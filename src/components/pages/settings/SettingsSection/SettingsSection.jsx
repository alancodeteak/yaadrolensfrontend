import clsx from 'clsx';
import { SETTINGS_PANEL } from '../settingsTheme';

export const SettingsSectionMeta = ({ children }) =>
  children ? <p className="text-xs text-gray-400">{children}</p> : null;

/** Backward-compatible no-op; page title lives in Settings.jsx */
export const SettingsPageHeader = ({ meta }) =>
  meta ? <SettingsSectionMeta>{meta}</SettingsSectionMeta> : null;

export const SettingsContentGrid = ({ children, className }) => (
  <div className={clsx('grid gap-4 xl:grid-cols-2', className)}>{children}</div>
);

const SettingsSection = ({ title, subtitle, children, className, tourId }) => (
  <section className={clsx(SETTINGS_PANEL, 'h-full overflow-visible', className)} data-tour={tourId}>
    {(title || subtitle) && (
      <div className="border-b border-gray-100 px-4 py-3">
        {title && <h3 className="text-sm font-semibold text-gray-900">{title}</h3>}
        {subtitle && <p className="mt-0.5 text-[11px] text-gray-500">{subtitle}</p>}
      </div>
    )}
    <div className="space-y-3 p-4">{children}</div>
  </section>
);

export const settingsInputClass =
  'w-full rounded-xl border border-gray-200/60 bg-white px-3 py-2 text-sm text-gray-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-colors duration-200 focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 disabled:opacity-50';

export const settingsLabelClass =
  'mb-1 block text-[10px] font-medium uppercase tracking-wide text-gray-400';

export default SettingsSection;
