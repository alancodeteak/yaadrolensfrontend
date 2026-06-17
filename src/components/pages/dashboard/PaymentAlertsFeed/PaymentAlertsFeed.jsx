import clsx from 'clsx';
import { Link } from 'react-router-dom';

const SEVERITY_STYLES = {
  critical: 'bg-red-100 text-red-700',
  warning: 'bg-orange-100 text-orange-700',
  info: 'bg-blue-100 text-blue-700',
};

const SEVERITY_LABELS = {
  critical: 'Urgent',
  warning: 'Action',
  info: 'Info',
};

const PaymentAlertsFeed = ({
  alerts = [],
  loading = false,
  className,
  compact = false,
  maxItems = 5,
  showViewAll = true,
}) => {
  const displayAlerts = maxItems != null ? alerts.slice(0, maxItems) : alerts;

  return (
    <div
      className={clsx(
        'flex h-full flex-col rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Payment alerts</h2>
          <p className="text-[11px] text-gray-500">Upcoming pay day and items needing attention</p>
        </div>
        {showViewAll && (
          <Link
            to="/admin/payroll"
            className="text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            View all
          </Link>
        )}
      </div>

      <div className={clsx('min-h-0 flex-1 overflow-y-auto', compact ? 'p-2' : 'p-3')}>
        {loading ? (
          <div className={clsx(compact ? 'space-y-1.5' : 'space-y-2')}>
            {Array.from({ length: compact ? 3 : 4 }).map((_, i) => (
              <div
                key={i}
                className={clsx(
                  'animate-pulse rounded-lg bg-gray-100',
                  compact ? 'h-12' : 'h-14'
                )}
              />
            ))}
          </div>
        ) : displayAlerts.length === 0 ? (
          <div
            className={clsx(
              'flex flex-col items-center justify-center text-center',
              compact ? 'py-6' : 'py-10'
            )}
          >
            <p className={clsx('font-medium text-gray-500', compact ? 'text-xs' : 'text-sm')}>
              No payment actions needed
            </p>
            <p className={clsx('mt-1 text-gray-400', compact ? 'text-[10px]' : 'text-xs')}>
              Payroll is up to date for now.
            </p>
          </div>
        ) : (
          <ul className={clsx(compact ? 'space-y-1' : 'space-y-2')}>
            {displayAlerts.map((alert) => (
              <li key={alert.code}>
                <Link
                  to={alert.href || '/admin/payroll'}
                  className={clsx(
                    'flex items-start rounded-lg bg-gray-50/80 transition-colors hover:bg-gray-100/80',
                    compact ? 'gap-2 px-2 py-2' : 'gap-3 px-3 py-2.5'
                  )}
                >
                  <span
                    className={clsx(
                      'shrink-0 rounded-full font-semibold',
                      compact ? 'mt-0.5 px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]',
                      SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.info
                    )}
                  >
                    {SEVERITY_LABELS[alert.severity] || 'Info'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p
                      className={clsx(
                        'font-medium text-gray-900',
                        compact ? 'text-xs' : 'text-sm'
                      )}
                    >
                      {alert.title}
                    </p>
                    <p className={clsx('text-gray-600', compact ? 'text-[10px]' : 'text-xs')}>
                      {alert.body}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PaymentAlertsFeed;
