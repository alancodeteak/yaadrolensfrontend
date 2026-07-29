import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { LoadingScreen } from '../../../common';
import { DASHBOARD_PANEL } from '../../dashboard/dashboardTheme';
import { useGetEmployeeTimelineQuery } from '../../../../store/api/attendanceApi';
import { formatDurationHours, resolveLiveAttendanceStatus } from '../../../../store/api/transforms';
import { formatShiftLabel, resolveRowWorkHours } from '../../../../utils/shiftHours';

const STATUS_BADGE = {
  Present: 'bg-emerald-100 text-emerald-700',
  'Present (Late)': 'bg-orange-100 text-orange-700',
  Absent: 'bg-gray-100 text-gray-600',
  'Scheduled off': 'bg-violet-100 text-violet-700',
  'Clocked Out': 'bg-blue-100 text-blue-700',
  'Clocked Out (Late)': 'bg-orange-100 text-orange-800',
};

const VIEW_W = 720;
const ROW_H = 22;
const PAD = { top: 20, right: 16, bottom: 12, left: 48 };
const DOMAIN_START = 6;
const DOMAIN_END = 22;
const WORK_LINE_COLOR = '#F59E0B';

const formatWeekday = (iso) => {
  if (!iso) return '';
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' });
};

const formatDayNum = (iso) => {
  if (!iso) return '';
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

const formatClock = (iso) => {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

const timeFraction = (iso) => {
  const d = new Date(iso);
  return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
};

const parseClockFraction = (value) => {
  if (!value || typeof value !== 'string') return null;
  const match = value.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (Number.isNaN(hours) || Number.isNaN(minutes) || hours > 23 || minutes > 59) {
    return null;
  }
  return hours + minutes / 60;
};

const formatTick = (hour) => {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 || 12;
  return `${h}${suffix}`;
};

const collectPunches = (row) => {
  const punches = [];
  const sessions = Array.isArray(row.sessions) && row.sessions.length > 0 ? row.sessions : null;
  if (sessions) {
    sessions.forEach((session, index) => {
      if (session.clock_in) {
        punches.push({
          type: 'IN',
          timestamp: session.clock_in,
          late: row.attendance_status === 'late' && index === 0,
        });
      }
      if (session.clock_out) {
        punches.push({ type: 'OUT', timestamp: session.clock_out, late: false });
      }
    });
    return punches;
  }
  if (row.clock_in) {
    punches.push({
      type: 'IN',
      timestamp: row.clock_in,
      late: row.attendance_status === 'late',
    });
  }
  if (row.clock_out) {
    punches.push({ type: 'OUT', timestamp: row.clock_out, late: false });
  }
  return punches;
};

/**
 * One week chart: X = time of day, Y = days of the week, markers for clock in / out.
 */
const WeekTimelineChart = ({ days = [] }) => {
  const [hovered, setHovered] = useState(null);

  const { domainStart, domainEnd, xTicks } = useMemo(() => {
    let start = DOMAIN_START;
    let end = DOMAIN_END;
    days.forEach((row) => {
      collectPunches(row).forEach((punch) => {
        const t = timeFraction(punch.timestamp);
        if (!Number.isFinite(t)) return;
        start = Math.min(start, Math.floor(t));
        end = Math.max(end, Math.ceil(t));
      });
      const hours = resolveRowWorkHours(row);
      const ws = parseClockFraction(hours.workStartTime);
      const we = parseClockFraction(hours.workEndTime);
      if (ws != null) start = Math.min(start, Math.floor(ws));
      if (we != null) end = Math.max(end, Math.ceil(we));
    });
    start = Math.max(0, start - 1);
    end = Math.min(24, end + 1);
    if (end - start < 8) {
      end = Math.min(24, start + 8);
      start = Math.max(0, end - 8);
    }
    const step = end - start <= 10 ? 2 : 3;
    const ticks = [];
    for (let h = Math.ceil(start); h <= end; h += step) ticks.push(h);
    return { domainStart: start, domainEnd: end, xTicks: ticks };
  }, [days]);

  const dayCount = Math.max(days.length, 1);
  const chartH = dayCount * ROW_H;
  const chartW = VIEW_W - PAD.left - PAD.right;
  const viewH = PAD.top + chartH + PAD.bottom;

  const timeToX = (fraction) => {
    const span = domainEnd - domainStart || 1;
    const clamped = Math.min(domainEnd, Math.max(domainStart, fraction));
    return PAD.left + ((clamped - domainStart) / span) * chartW;
  };

  const dayToY = (index) => PAD.top + index * ROW_H + ROW_H / 2;

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${VIEW_W} ${viewH}`}
        className="mx-auto h-auto max-h-[180px] w-full"
        role="img"
        aria-label="Weekly attendance timeline with clock-in and clock-out"
      >
        {xTicks.map((hour) => {
          const x = timeToX(hour);
          return (
            <g key={hour}>
              <line
                x1={x}
                y1={PAD.top}
                x2={x}
                y2={PAD.top + chartH}
                stroke="#F3F4F6"
                strokeDasharray="3 3"
              />
              <text
                x={x}
                y={PAD.top - 8}
                textAnchor="middle"
                className="fill-gray-400 text-[8px]"
              >
                {formatTick(hour)}
              </text>
            </g>
          );
        })}

        {days.map((row, index) => {
          const y = dayToY(index);
          const punches = collectPunches(row);
          const status = resolveLiveAttendanceStatus(row);
          const isOff = status === 'Scheduled off';
          const isAbsent = status === 'Absent';
          const hours = resolveRowWorkHours(row);
          const workStart = parseClockFraction(hours.workStartTime);
          const workEnd = parseClockFraction(hours.workEndTime);
          const showWorkLine =
            !hours.isShiftOff && workStart != null && workEnd != null && workEnd > workStart;

          return (
            <g key={row.date || index}>
              <line
                x1={PAD.left}
                y1={y}
                x2={PAD.left + chartW}
                y2={y}
                stroke="#F3F4F6"
                strokeWidth={1}
              />
              <text
                x={PAD.left - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-gray-700 text-[9px] font-semibold"
              >
                {formatWeekday(row.date)}
              </text>

              {showWorkLine && (
                <line
                  x1={timeToX(workStart)}
                  y1={y}
                  x2={timeToX(workEnd)}
                  y2={y}
                  stroke={WORK_LINE_COLOR}
                  strokeWidth={2}
                  strokeOpacity={0.35}
                  strokeLinecap="round"
                />
              )}

              {(isOff || isAbsent) && punches.length === 0 && (
                <text
                  x={PAD.left + chartW / 2}
                  y={y + 3}
                  textAnchor="middle"
                  className={clsx(
                    'text-[8px] font-medium',
                    isOff ? 'fill-violet-400' : 'fill-gray-300'
                  )}
                >
                  {isOff ? 'Off' : '—'}
                </text>
              )}

              {punches.map((punch, punchIndex) => {
                const x = timeToX(timeFraction(punch.timestamp));
                const isIn = punch.type === 'IN';
                const color = punch.late ? '#F59E0B' : isIn ? '#10B981' : '#EF4444';
                const next = punches[punchIndex + 1];
                const sessionLine =
                  isIn && next?.type === 'OUT'
                    ? {
                        x2: timeToX(timeFraction(next.timestamp)),
                      }
                    : null;

                return (
                  <g
                    key={`${row.date}-${punch.type}-${punchIndex}`}
                    className="cursor-pointer"
                    onMouseEnter={() =>
                      setHovered({
                        x,
                        y,
                        viewH,
                        day: formatWeekday(row.date),
                        date: formatDayNum(row.date),
                        type: punch.type,
                        late: punch.late,
                        time: formatClock(punch.timestamp),
                        shift: formatShiftLabel(row),
                        status,
                      })
                    }
                    onMouseLeave={() => setHovered(null)}
                  >
                    {sessionLine && (
                      <line
                        x1={x}
                        y1={y}
                        x2={sessionLine.x2}
                        y2={y}
                        stroke="#007AFF"
                        strokeWidth={2}
                        strokeOpacity={0.55}
                        strokeLinecap="round"
                      />
                    )}
                    <circle cx={x} cy={y} r={4} fill="white" stroke={color} strokeWidth={1.5} />
                    <circle cx={x} cy={y} r={1.75} fill={color} />
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute z-10 rounded-lg border border-gray-200/80 bg-white px-2.5 py-1.5 shadow-md"
          style={{
            left: `${(hovered.x / VIEW_W) * 100}%`,
            top: `${(hovered.y / hovered.viewH) * 100}%`,
            transform: 'translate(-50%, calc(-100% - 8px))',
          }}
        >
          <p className="text-[10px] font-semibold text-gray-900">
            {hovered.day} · {hovered.date}
          </p>
          <p className="text-[10px] text-gray-600">
            {hovered.late && hovered.type === 'IN'
              ? 'Late in'
              : hovered.type === 'IN'
                ? 'Clock in'
                : 'Clock out'}{' '}
            · {hovered.time}
          </p>
          {hovered.shift && hovered.shift !== '—' && (
            <p className="text-[9px] text-gray-400">{hovered.shift}</p>
          )}
        </div>
      )}

      <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-[10px] text-gray-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-3 rounded-full bg-amber-400" /> Shift hours
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Clock in
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" /> Late in
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-500" /> Clock out
        </span>
      </div>
    </div>
  );
};

/**
 * Last N days attendance as one weekly timeline (not one chart per day).
 */
const EmployeeAttendanceTimeline = ({ employeeId, days = 7, endDate = null }) => {
  const { data, isLoading, error, refetch } = useGetEmployeeTimelineQuery(
    { employee_id: employeeId, days, end_date: endDate || undefined },
    { skip: !employeeId }
  );

  const dayRows = useMemo(() => {
    const list = data?.days || [];
    return [...list].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }, [data]);

  const summaryLine = useMemo(() => {
    if (!dayRows.length) return null;
    const punched = dayRows.filter((row) => row.clock_in).length;
    const late = dayRows.filter((row) => row.attendance_status === 'late').length;
    const off = dayRows.filter(
      (row) => row.is_shift_off || row.attendance_status === 'shift_off'
    ).length;
    const hours = dayRows.reduce((sum, row) => sum + (Number(row.total_hours) || 0), 0);
    return { punched, late, off, hours };
  }, [dayRows]);

  if (isLoading) {
    return (
      <div className={DASHBOARD_PANEL}>
        <LoadingScreen message="Loading attendance timeline..." fullScreen={false} size="sm" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={clsx(DASHBOARD_PANEL, 'px-4 py-4')}>
        <p className="text-sm text-red-600">Could not load the last {days} days.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-2 text-xs font-semibold text-[#007AFF] hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={DASHBOARD_PANEL} data-tour="employee-attendance-timeline">
      <div className="border-b border-gray-100 px-4 py-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Attendance timeline</h3>
            <p className="text-[11px] text-gray-500">
              Last {days} days
              {data?.start_date && data?.end_date
                ? ` · ${data.start_date} → ${data.end_date}`
                : ''}
            </p>
          </div>
          {summaryLine && (
            <p className="text-[11px] text-gray-500">
              {summaryLine.punched} day{summaryLine.punched === 1 ? '' : 's'} punched
              {summaryLine.late > 0 ? ` · ${summaryLine.late} late` : ''}
              {summaryLine.off > 0 ? ` · ${summaryLine.off} off` : ''}
              {summaryLine.hours > 0
                ? ` · ${formatDurationHours(summaryLine.hours)}`
                : ''}
            </p>
          )}
        </div>
      </div>

      {dayRows.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-gray-500">No attendance data yet.</p>
      ) : (
        <div className="px-3 py-3 sm:px-4">
          <WeekTimelineChart days={dayRows} />

          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Day', 'Shift', 'In', 'Out', 'Status'].map((h) => (
                    <th
                      key={h}
                      className="px-2 py-2 text-left text-[10px] font-medium uppercase tracking-wide text-gray-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[...dayRows].reverse().map((row) => {
                  const status = resolveLiveAttendanceStatus(row);
                  return (
                    <tr key={row.date}>
                      <td className="px-2 py-2 text-sm text-gray-900">
                        <span className="font-medium">{formatWeekday(row.date)}</span>
                        <span className="ml-1.5 text-xs text-gray-400">
                          {formatDayNum(row.date)}
                        </span>
                      </td>
                      <td className="px-2 py-2 text-xs text-gray-600">
                        {formatShiftLabel(row)}
                      </td>
                      <td className="px-2 py-2 text-xs tabular-nums text-gray-700">
                        {formatClock(row.clock_in) || '—'}
                      </td>
                      <td className="px-2 py-2 text-xs tabular-nums text-gray-700">
                        {formatClock(row.clock_out) || '—'}
                      </td>
                      <td className="px-2 py-2">
                        <span
                          className={clsx(
                            'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                            STATUS_BADGE[status] || 'bg-gray-100 text-gray-600'
                          )}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeAttendanceTimeline;
