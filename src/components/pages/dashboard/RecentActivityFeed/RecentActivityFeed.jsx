import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { UserAvatar } from '../../../common';

const DUMMY_ACTIVITIES = [
  { id: 'dummy-1', name: 'Priya Sharma', type: 'IN', event: 'Clocked in', time: '9:02 AM' },
  { id: 'dummy-2', name: 'Rahul Mehta', type: 'IN', event: 'Clocked in', time: '9:05 AM' },
  { id: 'dummy-3', name: 'Ananya Patel', type: 'OUT', event: 'Clocked out', time: '1:15 PM' },
  { id: 'dummy-4', name: 'Vikram Singh', type: 'IN', event: 'Clocked in', time: '9:18 AM' },
  { id: 'dummy-5', name: 'Sneha Reddy', type: 'IN', event: 'Clocked in', time: '9:22 AM' },
  { id: 'dummy-6', name: 'Arjun Nair', type: 'OUT', event: 'Clocked out', time: '12:45 PM' },
  { id: 'dummy-7', name: 'Kavya Iyer', type: 'IN', event: 'Clocked in', time: '9:31 AM' },
  { id: 'dummy-8', name: 'Dev Kapoor', type: 'IN', event: 'Clocked in', time: '9:44 AM' },
];

const RecentActivityFeed = ({
  activities = [],
  loading = false,
  className,
  useSampleData = false,
  showViewAll = true,
  title = 'Recent activity',
  subtitle = "Today's clock in / out",
  compact = false,
  maxItems,
}) => {
  const showDummy = useSampleData && !loading && activities.length === 0;
  const sourceActivities = showDummy ? DUMMY_ACTIVITIES : activities;
  const displayActivities =
    maxItems != null ? sourceActivities.slice(0, maxItems) : sourceActivities;

  return (
  <div
    className={clsx(
      'flex h-full flex-col rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]',
      className
    )}
  >
    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
          {showDummy && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-medium text-amber-800">
              Sample data
            </span>
          )}
        </div>
        <p className="text-[11px] text-gray-500">{subtitle}</p>
      </div>
      {showViewAll && (
        <Link
          to="/admin/attendance"
          className="text-xs font-medium text-blue-600 hover:text-blue-700"
        >
          View all
        </Link>
      )}
    </div>

    <div className={clsx('min-h-0 flex-1 overflow-y-auto', compact ? 'p-2' : 'p-3')}>
      {loading ? (
        <div className={clsx(compact ? 'space-y-1.5' : 'space-y-2')}>
          {Array.from({ length: compact ? 4 : 5 }).map((_, i) => (
            <div
              key={i}
              className={clsx(
                'animate-pulse rounded-lg bg-gray-100',
                compact ? 'h-10' : 'h-14'
              )}
            />
          ))}
        </div>
      ) : displayActivities.length === 0 ? (
        <div
          className={clsx(
            'flex flex-col items-center justify-center text-center',
            compact ? 'py-6' : 'py-10'
          )}
        >
          <p className={clsx('font-medium text-gray-500', compact ? 'text-xs' : 'text-sm')}>
            No activity yet
          </p>
          <p className={clsx('mt-1 text-gray-400', compact ? 'text-[10px]' : 'text-xs')}>
            Clock-in events from the kiosk will appear here.
          </p>
        </div>
      ) : (
        <ul className={clsx(compact ? 'space-y-1' : 'space-y-2')}>
          {displayActivities.map((item) => (
            <li
              key={item.id}
              className={clsx(
                'flex items-center rounded-lg bg-gray-50/80',
                compact ? 'gap-2 px-2 py-1.5' : 'gap-3 px-3 py-2.5'
              )}
            >
              <UserAvatar
                className={clsx(
                  'shrink-0 rounded-full object-cover ring-1 ring-gray-100',
                  compact ? 'h-7 w-7' : 'h-8 w-8'
                )}
                src={item.avatar}
                name={item.name}
                seed={item.id}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={clsx(
                      'truncate font-medium text-gray-900',
                      compact ? 'text-xs' : 'text-sm'
                    )}
                  >
                    {item.name}
                  </p>
                  <span className="shrink-0 text-[10px] text-gray-500">{item.time}</span>
                </div>
                {!compact && <p className="mt-0.5 text-xs text-gray-600">{item.event}</p>}
              </div>
              <span
                className={clsx(
                  'shrink-0 rounded-full font-semibold',
                  compact ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]',
                  item.type === 'IN'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-orange-100 text-orange-700'
                )}
              >
                {item.type === 'IN' ? 'In' : 'Out'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
  );
};

export default RecentActivityFeed;
