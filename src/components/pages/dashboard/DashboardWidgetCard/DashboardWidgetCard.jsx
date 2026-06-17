import { Link } from 'react-router-dom';
import clsx from 'clsx';

const cellClass = (compact, href, interactive) =>
  clsx(
    'relative z-[1] flex flex-col justify-center rounded-xl transition-colors',
    compact ? 'min-h-[52px] px-2 py-2' : 'min-h-[88px] px-3 py-3',
    interactive &&
      href &&
      'cursor-pointer hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'
  );

const labelClass = (compact) =>
  clsx(
    'font-medium leading-snug text-gray-500',
    compact ? 'text-[10px]' : 'min-h-[2.25rem] text-xs'
  );

const valueClass = (compact) =>
  clsx(
    'mt-0.5 font-bold tabular-nums tracking-tight text-gray-900',
    compact ? 'text-lg' : 'mt-1 text-2xl'
  );

const SkeletonStat = ({ label, compact }) => (
  <article className={cellClass(compact, null, false)} aria-hidden="true">
    <p className={labelClass(compact)}>{label}</p>
    <div className={clsx('animate-pulse rounded-md bg-gray-200', compact ? 'mt-0.5 h-6 w-12' : 'mt-1 h-8 w-16')} />
  </article>
);

const StatItem = ({ label, value, accent, href, compact }) => {
  const inner = (
    <>
      <p className={labelClass(compact)}>{label}</p>
      <p className={valueClass(compact)} style={{ color: accent || '#111827' }}>
        {value}
      </p>
    </>
  );

  if (href) {
    return (
      <Link to={href} className={cellClass(compact, href, true)} aria-label={`${label}: ${value}`}>
        {inner}
      </Link>
    );
  }

  return <article className={cellClass(compact, null, false)}>{inner}</article>;
};

const DashboardWidgetCard = ({
  title,
  stats = [],
  loading = false,
  skeletonLabels = [],
  className,
  href,
  compact = false,
}) => {
  const showSkeleton = loading && stats.length === 0 && skeletonLabels.length > 0;

  const titleEl = href ? (
    <Link to={href} className="text-sm font-semibold text-gray-900 hover:text-blue-600">
      {title}
    </Link>
  ) : (
    <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
  );

  return (
    <div
      className={clsx(
        'flex h-full min-h-[9.5rem] flex-col rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]',
        compact && '[contain:layout]',
        className
      )}
    >
      <div
        className={clsx(
          'border-b border-gray-100',
          compact ? 'px-3 py-2' : 'px-4 py-3 sm:px-5'
        )}
      >
        {titleEl}
      </div>
      <div
        className={clsx(
          'grid flex-1 gap-2',
          compact ? 'grid-cols-2 p-3' : 'grid-cols-2 gap-3 p-4'
        )}
      >
        {showSkeleton
          ? skeletonLabels.map((label) => <SkeletonStat key={label} label={label} compact={compact} />)
          : stats.map((stat, index) => (
              <StatItem
                key={`${stat.label}-${index}`}
                label={stat.label}
                value={stat.value}
                accent={stat.accent}
                href={stat.href}
                compact={compact}
              />
            ))}
      </div>
    </div>
  );
};

export default DashboardWidgetCard;
