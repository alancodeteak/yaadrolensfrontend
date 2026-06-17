import { useMemo } from 'react';
import { DASHBOARD_PANEL } from '../../dashboard/dashboardTheme';
import {
  USE_DUMMY_LIVE_ATTENDANCE,
  DUMMY_CLOCK_EVENTS,
} from '../liveAttendanceDummy';
import ClockEventTimelineChart, { buildClockEventsFromRows } from './ClockEventTimelineChart';

const LiveAttendanceInsights = ({ rows = [], selectedDay }) => {
  const realEvents = useMemo(() => buildClockEventsFromRows(rows), [rows]);

  const useDummy = USE_DUMMY_LIVE_ATTENDANCE && realEvents.length === 0;
  const events = useDummy ? DUMMY_CLOCK_EVENTS : realEvents;
  const hasData = events.length > 0;

  return (
    <div className={DASHBOARD_PANEL}>
      <div className="border-b border-gray-100 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-900">Attendance timeline</h2>
          {useDummy && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-medium text-amber-800">
              Sample data
            </span>
          )}
        </div>
        <p className="text-[11px] text-gray-500">
          Clock in / out timeline · {selectedDay || 'today'}
        </p>
      </div>
      <div className="px-3 py-3 sm:px-4">
        {hasData ? (
          <ClockEventTimelineChart events={events} />
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
