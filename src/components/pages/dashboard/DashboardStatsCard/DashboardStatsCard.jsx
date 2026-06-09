import clsx from 'clsx';

const StatItem = ({ label, value, accent, loading, isLast }) => (
  <div
    className={clsx(
      'flex min-w-0 flex-1 flex-col items-center justify-center px-2 py-4 text-center sm:px-4',
      !isLast && 'sm:border-r sm:border-gray-100'
    )}
  >
    <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400 sm:text-[11px]">
      {label}
    </p>
    <p
      className="mt-1.5 text-xl font-semibold tabular-nums tracking-tight sm:text-3xl"
      style={{ color: loading ? '#111827' : accent }}
    >
      {loading ? '—' : value}
    </p>
  </div>
);

const DashboardStatsCard = ({ stats = [], loading = false, className }) => {
  return (
    <div
      className={clsx(
        'overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]',
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:divide-x sm:divide-gray-100">
        {stats.map((stat, index) => (
          <StatItem
            key={stat.label}
            label={stat.label}
            value={stat.value}
            accent={stat.accent}
            loading={loading}
            isLast={index === stats.length - 1}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardStatsCard;
