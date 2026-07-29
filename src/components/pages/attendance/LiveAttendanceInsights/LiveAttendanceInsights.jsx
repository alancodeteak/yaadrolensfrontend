import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { DASHBOARD_PANEL } from '../../dashboard/dashboardTheme';
import {
  USE_DUMMY_LIVE_ATTENDANCE,
  DUMMY_CLOCK_EVENTS,
} from '../liveAttendanceDummy';
import { resolveTimelineWorkWindow } from '../../../../utils/shiftHours';
import ClockEventTimelineChart, { buildClockEventsFromRows } from './ClockEventTimelineChart';
import TimelinePlaybackLog from './TimelinePlaybackLog';

const PLAYBACK_STEP_MS = 850;
const PLAYBACK_START_DELAY_MS = 350;

const LiveAttendanceInsights = ({
  rows = [],
  selectedDay,
  orgWorkStartTime = null,
  orgWorkEndTime = null,
}) => {
  const realEvents = useMemo(() => buildClockEventsFromRows(rows), [rows]);

  const workWindow = useMemo(
    () =>
      resolveTimelineWorkWindow(rows, {
        work_start_time: orgWorkStartTime,
        work_end_time: orgWorkEndTime,
      }),
    [rows, orgWorkStartTime, orgWorkEndTime]
  );

  const useDummy = USE_DUMMY_LIVE_ATTENDANCE && realEvents.length === 0;
  const events = useDummy ? DUMMY_CLOCK_EVENTS : realEvents;
  const eventsKey = useMemo(
    () => events.map((event) => `${event.id}-${event.timestamp}`).join('|'),
    [events]
  );

  const workStartTime = useDummy
    ? orgWorkStartTime
    : workWindow.workStartTime || workWindow.domainStartHint || orgWorkStartTime;
  const workEndTime = useDummy
    ? orgWorkEndTime
    : workWindow.workEndTime || workWindow.domainEndHint || orgWorkEndTime;
  const showWorkMarkers = useDummy || (!workWindow.mixed && Boolean(workWindow.workStartTime));
  const hasEvents = events.length > 0;
  const hasWorkHours = Boolean(workStartTime && workEndTime);
  const showChart = hasEvents || hasWorkHours;

  const [storyCount, setStoryCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const logRef = useRef(null);

  useEffect(() => {
    setStoryCount(0);
    setIsPlaying(false);
  }, [eventsKey, selectedDay]);

  useEffect(() => {
    if (!isPlaying) return undefined;

    if (storyCount >= events.length) {
      setIsPlaying(false);
      setStoryCount(0);
      return undefined;
    }

    const delay = storyCount === 0 ? PLAYBACK_START_DELAY_MS : PLAYBACK_STEP_MS;
    const timer = window.setTimeout(() => {
      setStoryCount((count) => Math.min(count + 1, events.length));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [isPlaying, storyCount, events.length]);

  useEffect(() => {
    if (!logRef.current || !isPlaying || storyCount === 0) return;
    logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [storyCount, isPlaying]);

  const chartEvents = isPlaying ? events.slice(0, storyCount) : events;

  const handlePlay = useCallback(() => {
    setStoryCount(0);
    setIsPlaying(true);
  }, []);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    setStoryCount(0);
  }, []);

  const playbackLabel = isPlaying
    ? `Playing ${storyCount} of ${events.length}`
    : 'Full timeline';

  return (
    <div className={DASHBOARD_PANEL}>
      <div className="border-b border-gray-100 px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-900">Attendance timeline</h2>
              {useDummy && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-medium text-amber-800">
                  Sample data
                </span>
              )}
              {workWindow.mixed && !useDummy && (
                <span className="rounded-full bg-[#007AFF]/10 px-2 py-0.5 text-[9px] font-medium text-[#007AFF]">
                  Mixed shifts
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500">
              Clock in / out timeline · {selectedDay || 'today'}
              {workWindow.label ? ` · ${workWindow.label}` : ''}
            </p>
          </div>

          {hasEvents && (
            <div className="flex shrink-0 flex-col items-end gap-1">
              {isPlaying ? (
                <button
                  type="button"
                  onClick={handleStop}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200/60 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                  aria-label="Stop timeline playback"
                >
                  <Pause className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Stop
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePlay}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#007AFF] px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-[#0066DD]"
                  aria-label="Play timeline from start"
                >
                  <Play className="h-3.5 w-3.5" strokeWidth={2.5} />
                  Play
                </button>
              )}
              <p className="text-[10px] text-gray-400">{playbackLabel}</p>
            </div>
          )}
        </div>
      </div>

      <div className="px-3 py-3 sm:px-4">
        {showChart ? (
          <div className="space-y-3">
            <ClockEventTimelineChart
              events={chartEvents}
              domainEvents={events}
              playbackMode={isPlaying}
              workStartTime={showWorkMarkers ? workWindow.workStartTime || workStartTime : null}
              workEndTime={showWorkMarkers ? workWindow.workEndTime || workEndTime : null}
              domainStartTime={!showWorkMarkers ? workStartTime : null}
              domainEndTime={!showWorkMarkers ? workEndTime : null}
            />

            {isPlaying && (
              <div ref={logRef}>
                <TimelinePlaybackLog
                  events={events}
                  visibleCount={storyCount}
                  isPlaying={isPlaying}
                />
              </div>
            )}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-gray-500">
            No clock-in or clock-out events for this date.
          </p>
        )}
      </div>
    </div>
  );
};

export default LiveAttendanceInsights;
