import { useMemo } from 'react';
import { DASHBOARD_PANEL } from '../../dashboard/dashboardTheme';
import {
  USE_DUMMY_LIVE_ATTENDANCE,
  DUMMY_CLOCK_EVENTS,
} from '../liveAttendanceDummy';
import { resolveTimelineWorkWindow } from '../../../../utils/shiftHours';
import ClockEventTimelineChart, { buildClockEventsFromRows } from './ClockEventTimelineChart';

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
      <div className="px-3 py-3 sm:px-4">
        {showChart ? (
          <ClockEventTimelineChart
            events={events}
            workStartTime={showWorkMarkers ? workWindow.workStartTime || workStartTime : null}
            workEndTime={showWorkMarkers ? workWindow.workEndTime || workEndTime : null}
            domainStartTime={!showWorkMarkers ? workStartTime : null}
            domainEndTime={!showWorkMarkers ? workEndTime : null}
          />
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
