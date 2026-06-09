import clsx from 'clsx';
import { sidebarRowClass } from './sidebarLayout';

const SidebarIdentityChip = ({
  avatarLabel,
  primary,
  secondary,
  onClick,
  trailingIcon: TrailingIcon,
  collapsed = false,
  className,
  ariaLabel,
}) => {
  const content = (
    <>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#007AFF] text-sm font-semibold text-white shadow-[0_2px_8px_rgba(0,122,255,0.35)]">
        {avatarLabel}
      </div>
      <div
        className={clsx(
          'flex min-w-0 flex-1 items-center gap-2 overflow-hidden transition-[opacity,width] duration-200',
          collapsed ? 'w-0 opacity-0' : 'opacity-100'
        )}
        aria-hidden={collapsed}
      >
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-sm font-semibold text-gray-900">{primary}</p>
          <p className="truncate text-[11px] text-gray-500">{secondary}</p>
        </div>
        {TrailingIcon && (
          <TrailingIcon className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
        )}
      </div>
    </>
  );

  const sharedClassName = sidebarRowClass(
    collapsed,
    clsx(
      'rounded-xl transition-colors duration-200',
      collapsed ? 'border-transparent bg-transparent' : 'border border-gray-200/60 bg-gray-50/50',
      onClick && 'cursor-pointer hover:bg-gray-50',
      className
    )
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={collapsed ? primary : undefined}
        aria-label={ariaLabel || primary}
        className={sharedClassName}
      >
        {content}
      </button>
    );
  }

  return (
    <div title={collapsed ? primary : undefined} className={sharedClassName}>
      {content}
    </div>
  );
};

export default SidebarIdentityChip;
