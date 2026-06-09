import clsx from 'clsx';
import { SETTINGS_ICON_TONES, SETTINGS_PANEL } from '../settingsTheme';

export const SettingsPageHeader = ({ title, subtitle, meta, icon: Icon, tone = 'settings' }) => {
  const iconTone = SETTINGS_ICON_TONES[tone] || SETTINGS_ICON_TONES.settings;

  return (
    <div className="mb-2 flex items-center gap-4">
      {Icon && (
        <span
          className={clsx(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl sm:h-12 sm:w-12',
            iconTone.bg,
            iconTone.fg
          )}
        >
          <Icon className="block h-5 w-5 shrink-0 sm:h-6 sm:w-6" strokeWidth={2} aria-hidden="true" />
        </span>
      )}
      <div className="min-w-0">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {subtitle && <div className="mt-1.5 text-base text-gray-500">{subtitle}</div>}
        {meta && <p className="mt-1 text-xs text-gray-400">{meta}</p>}
      </div>
    </div>
  );
};

export const SettingsContentGrid = ({ children, className }) => (
  <div className={clsx('grid gap-4 xl:grid-cols-2', className)}>{children}</div>
);

const SettingsSection = ({ title, subtitle, children, className, tourId }) => (
  <section className={clsx(SETTINGS_PANEL, 'h-full overflow-visible', className)} data-tour={tourId}>
    {(title || subtitle) && (
      <div className="border-b border-gray-100 px-4 py-3 sm:px-5 sm:py-4">
        {title && <h3 className="text-sm font-semibold text-gray-900 sm:text-base">{title}</h3>}
        {subtitle && <p className="mt-0.5 text-[11px] text-gray-500 sm:text-sm">{subtitle}</p>}
      </div>
    )}
    <div className="space-y-3 p-4 sm:p-5">{children}</div>
  </section>
);

export const settingsInputClass =
  'w-full rounded-xl border border-gray-200/60 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-colors duration-200 focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 disabled:opacity-50';

export const settingsLabelClass = 'mb-1.5 block text-xs font-medium text-gray-600 sm:text-sm';

export default SettingsSection;
