import clsx from 'clsx';
import { LottieLoader } from '../../../common';

const clampPercent = (value) => Math.min(100, Math.max(0, Number(value) || 0));

const ActivityRing = ({ cx, cy, radius, strokeWidth, value, color, trackColor }) => {
  const circumference = 2 * Math.PI * radius;
  const progress = clampPercent(value);
  const offset = circumference - (progress / 100) * circumference;

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${cx} ${cy})`}
        className="transition-[stroke-dashoffset] duration-700 ease-out"
      />
    </g>
  );
};

const ActivityRingsChart = ({
  rings = [],
  title = 'Activity',
  loading = false,
  className,
  compact = false,
  dense = false,
  hideTitle = false,
}) => {
  const center = 110;
  const ringConfigs = [
    { radius: 92, strokeWidth: 16, trackColor: '#dbeafe' },
    { radius: 68, strokeWidth: 16, trackColor: '#ede9fe' },
    { radius: 44, strokeWidth: 16, trackColor: '#dcfce7' },
  ];

  return (
    <div
      className={clsx(
        'flex flex-col items-center',
        compact && 'h-full min-h-0 w-full justify-center',
        className
      )}
    >
      {!hideTitle && (
        <h2
          className={clsx(
            'font-semibold text-gray-900',
            compact ? 'mb-2 text-sm' : 'mb-6 text-lg'
          )}
        >
          {title}
        </h2>
      )}

      <div
        className={clsx(
          'relative shrink-0',
          dense && 'mx-auto aspect-square w-full max-h-24 max-w-24 sm:max-h-28 sm:max-w-28',
          !dense && compact && 'aspect-square h-28 w-28 sm:h-32 sm:w-32',
          !dense && !compact && 'aspect-square h-56 w-56 sm:h-64 sm:w-64'
        )}
      >
        <svg viewBox="0 0 220 220" className="h-full w-full" aria-hidden="true">
          {ringConfigs.map((config, index) => {
            const ring = rings[index];
            if (!ring) return null;

            return (
              <ActivityRing
                key={ring.label}
                cx={center}
                cy={center}
                radius={config.radius}
                strokeWidth={config.strokeWidth}
                value={loading ? 0 : ring.value}
                color={ring.color}
                trackColor={config.trackColor}
              />
            );
          })}
        </svg>

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <LottieLoader size="sm" />
          </div>
        )}
      </div>

      <ul
        className={clsx(
          'w-full shrink-0',
          dense ? 'mt-1 space-y-0.5' : compact ? 'mt-2 space-y-1' : 'mt-6 space-y-3'
        )}
      >
        {rings.map((ring) => (
          <li key={ring.label} className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5">
              <span
                className={clsx(
                  'shrink-0 rounded-full',
                  dense ? 'h-1.5 w-1.5' : compact ? 'h-2 w-2' : 'h-3 w-3'
                )}
                style={{ backgroundColor: ring.color }}
                aria-hidden="true"
              />
              <span
                className={clsx(
                  'truncate text-gray-600',
                  dense ? 'text-[9px]' : compact ? 'text-[10px]' : 'text-sm'
                )}
              >
                {ring.label}
              </span>
            </div>
            <span
              className={clsx(
                'font-semibold text-gray-900',
                dense ? 'text-[9px]' : compact ? 'text-[10px]' : 'text-sm'
              )}
            >
              {loading ? '—' : `${clampPercent(ring.value).toFixed(0)}%`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityRingsChart;
