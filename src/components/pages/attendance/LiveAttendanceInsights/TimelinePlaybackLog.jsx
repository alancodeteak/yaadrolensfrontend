import clsx from 'clsx';
import { UserAvatar } from '../../../common';

function formatEventTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function eventPhotoSrc(event) {
  return event.profilePhotoUrl || event.photo || event.avatar;
}

function eventLabel(event) {
  if (event.type === 'OUT') return 'clocked out';
  return event.late ? 'clocked in late' : 'clocked in';
}

const TimelinePlaybackLog = ({
  events = [],
  visibleCount = 0,
  isPlaying = false,
  className,
}) => {
  const visibleEvents = events.slice(0, visibleCount);
  const latestId = visibleEvents[visibleEvents.length - 1]?.id;

  if (visibleCount === 0 && isPlaying) {
    return (
      <div
        className={clsx(
          'rounded-xl border border-gray-100 bg-gray-50/50 px-3 py-3 text-center',
          className
        )}
      >
        <p className="text-xs text-gray-500">Starting playback…</p>
      </div>
    );
  }

  if (visibleCount === 0) {
    return null;
  }

  return (
    <div
      className={clsx(
        'max-h-32 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50/50 px-2 py-1.5',
        className
      )}
      aria-live="polite"
      aria-label="Timeline playback log"
    >
      <ol className="space-y-0.5">
        {visibleEvents.map((event, index) => {
          const isLatest = event.id === latestId;
          const isIn = event.type === 'IN';
          return (
            <li
              key={event.id}
              className={clsx(
                'flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors duration-300',
                isLatest && isPlaying && 'bg-white shadow-sm ring-1 ring-[#007AFF]/15'
              )}
            >
              <span className="w-4 shrink-0 text-[10px] font-semibold tabular-nums text-gray-400">
                {index + 1}
              </span>
              <UserAvatar
                src={eventPhotoSrc(event)}
                name={event.name}
                seed={event.employeeId}
                className="h-6 w-6 shrink-0 rounded-full"
              />
              <span className="min-w-0 truncate font-medium text-gray-800">{event.name}</span>
              <span
                className={clsx(
                  'shrink-0 font-medium',
                  isIn ? (event.late ? 'text-amber-600' : 'text-emerald-600') : 'text-red-500'
                )}
              >
                {eventLabel(event)}
              </span>
              <span className="ml-auto shrink-0 tabular-nums text-gray-400">
                {formatEventTime(event.timestamp)}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default TimelinePlaybackLog;
