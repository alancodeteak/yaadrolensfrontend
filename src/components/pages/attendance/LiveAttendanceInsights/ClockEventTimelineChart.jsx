import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { UserAvatar } from '../../../common';
import { resolveRowProfilePhoto } from '../../../../store/api/transforms';

const DEFAULT_DOMAIN_START = 6;
const DEFAULT_DOMAIN_END = 20;
const DOMAIN_PAD_HOURS = 1;
const MIN_DOMAIN_SPAN = 8;
const VIEW_W = 800;
const VIEW_H = 168;
const PAD = { top: 20, right: 20, bottom: 28, left: 32 };
const CHART_W = VIEW_W - PAD.left - PAD.right;
const CHART_H = VIEW_H - PAD.top - PAD.bottom;
const AVATAR_SIZE = 18;
const RING_WIDTH = 1.25;
const LINE_WIDTH = 1;

const WORK_MARKER_COLOR = '#F59E0B';

function timeFraction(iso) {
  const d = new Date(iso);
  return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
}

/** Parse "HH:MM" / "HH:MM:SS" into hour fraction, or null if invalid. */
function parseClockTime(value) {
  if (!value || typeof value !== 'string') return null;
  const match = value.trim().match(/^(\d{1,2}):(\d{2})(?::\d{2})?/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (Number.isNaN(hours) || Number.isNaN(minutes) || hours > 23 || minutes > 59) {
    return null;
  }
  return hours + minutes / 60;
}

function formatTick(hour) {
  const normalized = ((hour % 24) + 24) % 24;
  const suffix = normalized >= 12 ? 'PM' : 'AM';
  const h = normalized % 12 || 12;
  return `${h}${suffix}`;
}

function formatHourFraction(fraction) {
  const hours = Math.floor(fraction);
  const minutes = Math.round((fraction - hours) * 60) % 60;
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

function formatEventTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Chart X domain from work hours, padded and expanded to fit punch events.
 * Overnight shifts (end <= start) span through midnight up to 24.
 * Optional domainStartTime/domainEndTime expand the axis without drawing markers.
 */
export function resolveChartDomain(
  workStartTime,
  workEndTime,
  events = [],
  domainStartTime = null,
  domainEndTime = null
) {
  const workStart = parseClockTime(workStartTime ?? domainStartTime);
  const workEnd = parseClockTime(workEndTime ?? domainEndTime);

  let domainStart = workStart != null ? workStart : DEFAULT_DOMAIN_START;
  let domainEnd = workEnd != null ? workEnd : DEFAULT_DOMAIN_END;

  if (domainEnd <= domainStart) {
    // Overnight / invalid end: show through end of day from start.
    domainEnd = 24;
  }

  domainStart = Math.max(0, Math.floor(domainStart) - DOMAIN_PAD_HOURS);
  domainEnd = Math.min(24, Math.ceil(domainEnd) + DOMAIN_PAD_HOURS);

  events.forEach((event) => {
    if (!event?.timestamp) return;
    const fraction = timeFraction(event.timestamp);
    if (!Number.isFinite(fraction)) return;
    domainStart = Math.min(domainStart, Math.max(0, Math.floor(fraction)));
    domainEnd = Math.max(domainEnd, Math.min(24, Math.ceil(fraction)));
  });

  if (domainEnd - domainStart < MIN_DOMAIN_SPAN) {
    const mid = (domainStart + domainEnd) / 2;
    domainStart = Math.max(0, mid - MIN_DOMAIN_SPAN / 2);
    domainEnd = Math.min(24, domainStart + MIN_DOMAIN_SPAN);
    domainStart = Math.max(0, domainEnd - MIN_DOMAIN_SPAN);
  }

  if (domainEnd <= domainStart) {
    domainStart = DEFAULT_DOMAIN_START;
    domainEnd = DEFAULT_DOMAIN_END;
  }

  return { domainStart, domainEnd };
}

function buildXTicks(domainStart, domainEnd) {
  const span = domainEnd - domainStart;
  const step = span <= 8 ? 1 : span <= 14 ? 2 : 3;
  const ticks = [];
  const first = Math.ceil(domainStart / step) * step;
  for (let hour = first; hour <= domainEnd + 1e-9; hour += step) {
    ticks.push(Number(hour.toFixed(4)));
  }
  if (ticks.length === 0 || ticks[0] > domainStart + 0.01) {
    ticks.unshift(domainStart);
  }
  if (ticks[ticks.length - 1] < domainEnd - 0.01) {
    ticks.push(domainEnd);
  }
  return ticks;
}

function clampTime(fraction, domainStart, domainEnd) {
  return Math.min(domainEnd, Math.max(domainStart, fraction));
}

function timeToX(fraction, domainStart, domainEnd) {
  const span = domainEnd - domainStart || 1;
  const clamped = clampTime(fraction, domainStart, domainEnd);
  return PAD.left + ((clamped - domainStart) / span) * CHART_W;
}

function isWithinChartWindow(fraction, domainStart, domainEnd) {
  return fraction != null && fraction >= domainStart && fraction <= domainEnd;
}

function countToY(count, maxCount) {
  const safeMax = Math.max(maxCount, 1);
  return PAD.top + CHART_H - (count / safeMax) * CHART_H;
}

function buildPath(points) {
  if (points.length < 2) return '';
  return points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');
}

function buildAreaPath(points) {
  if (points.length < 2) return '';
  const baseline = PAD.top + CHART_H;
  const line = buildPath(points);
  const last = points[points.length - 1];
  const first = points[0];
  return `${line} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`;
}

function groupKey(event) {
  const minute = new Date(event.timestamp).toISOString().slice(0, 16);
  return `${minute}-${event.type}`;
}

export function buildClockEventsFromRows(rows = []) {
  const events = [];
  rows.forEach((row) => {
    const { profilePhotoUrl, photo, avatar } = resolveRowProfilePhoto(row);
    const isLate = row.attendance_status === 'late';
    const base = {
      employeeId: row.employee_id,
      name: row.name,
      employeeCode: row.employee_code,
      profilePhotoUrl,
      photo,
      avatar,
    };
    const sessions = Array.isArray(row.sessions) && row.sessions.length > 0 ? row.sessions : null;

    if (sessions) {
      sessions.forEach((session, index) => {
        if (session.clock_in) {
          events.push({
            ...base,
            id: `${row.employee_id}-in-${index}`,
            type: 'IN',
            timestamp: session.clock_in,
            late: isLate && index === 0,
          });
        }
        if (session.clock_out) {
          events.push({
            ...base,
            id: `${row.employee_id}-out-${index}`,
            type: 'OUT',
            timestamp: session.clock_out,
            late: false,
          });
        }
      });
      return;
    }

    if (row.clock_in) {
      events.push({
        ...base,
        id: `${row.employee_id}-in`,
        type: 'IN',
        timestamp: row.clock_in,
        late: isLate,
      });
    }
    if (row.clock_out) {
      events.push({
        ...base,
        id: `${row.employee_id}-out`,
        type: 'OUT',
        timestamp: row.clock_out,
        late: false,
      });
    }
  });
  return events.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

function eventPhotoSrc(event) {
  return event.profilePhotoUrl || event.photo || event.avatar;
}

function buildMarkerGroups(markers) {
  const groups = new Map();

  markers.forEach((marker) => {
    const key = groupKey(marker);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(marker);
  });

  return Array.from(groups.entries()).map(([key, members]) => {
    const sorted = [...members].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    const last = sorted[sorted.length - 1];
    return {
      key,
      x: sorted[0].x,
      y: last.y,
      type: sorted[0].type,
      timestamp: sorted[0].timestamp,
      late: sorted.some((m) => m.late),
      primary: sorted[0],
      others: sorted.slice(1),
      all: sorted,
    };
  });
}

const ClockEventTimelineChart = ({
  events = [],
  domainEvents = null,
  workStartTime = null,
  workEndTime = null,
  domainStartTime = null,
  domainEndTime = null,
  playbackMode = false,
  highlightEventId = null,
}) => {
  const gradientId = useId();
  const lineRef = useRef(null);
  const [lineLength, setLineLength] = useState(0);
  const [lineReady, setLineReady] = useState(false);
  const [hoveredGroupKey, setHoveredGroupKey] = useState(null);
  const [hoveredWorkMarker, setHoveredWorkMarker] = useState(null);
  const [enteringGroupKey, setEnteringGroupKey] = useState(null);
  const prevGroupCountRef = useRef(0);

  const domainSource = domainEvents ?? events;

  const { domainStart, domainEnd } = useMemo(
    () =>
      resolveChartDomain(
        workStartTime,
        workEndTime,
        domainSource,
        domainStartTime,
        domainEndTime
      ),
    [workStartTime, workEndTime, domainSource, domainStartTime, domainEndTime]
  );

  const xTicks = useMemo(
    () => buildXTicks(domainStart, domainEnd),
    [domainStart, domainEnd]
  );

  const workMarkers = useMemo(() => {
    const markers = [];
    const start = parseClockTime(workStartTime);
    const end = parseClockTime(workEndTime);
    if (isWithinChartWindow(start, domainStart, domainEnd)) {
      markers.push({
        key: 'work-start',
        label: 'Work start',
        shortLabel: 'Start',
        fraction: start,
        x: timeToX(start, domainStart, domainEnd),
      });
    }
    if (isWithinChartWindow(end, domainStart, domainEnd)) {
      markers.push({
        key: 'work-end',
        label: 'Work end',
        shortLabel: 'End',
        fraction: end,
        x: timeToX(end, domainStart, domainEnd),
      });
    }
    return markers;
  }, [workStartTime, workEndTime, domainStart, domainEnd]);

  const { linePoints, markerGroups, maxCount } = useMemo(() => {
    let present = 0;
    let peak = 0;
    const linePts = [{ x: timeToX(domainStart, domainStart, domainEnd), y: 0, count: 0 }];
    const markers = [];

    events.forEach((event) => {
      if (event.type === 'IN') present += 1;
      else present = Math.max(0, present - 1);
      peak = Math.max(peak, present);

      const fraction = timeFraction(event.timestamp);
      const x = timeToX(fraction, domainStart, domainEnd);

      linePts.push({ x, y: 0, count: present });
      markers.push({ ...event, x, present });
    });

    if (linePts.length === 1) {
      linePts.push({ x: timeToX(domainEnd, domainStart, domainEnd), y: 0, count: 0 });
    } else {
      const last = linePts[linePts.length - 1];
      linePts.push({ x: timeToX(domainEnd, domainStart, domainEnd), y: 0, count: last.count });
    }

    const resolvedMax = Math.max(peak, 1);
    const normalizedLine = linePts.map((pt) => ({
      ...pt,
      y: countToY(pt.count, resolvedMax),
    }));
    const normalizedMarkers = markers.map((marker) => ({
      ...marker,
      y: countToY(marker.present, resolvedMax),
    }));

    return {
      linePoints: normalizedLine,
      markerGroups: buildMarkerGroups(normalizedMarkers),
      maxCount: resolvedMax,
    };
  }, [events, domainStart, domainEnd]);

  const linePath = useMemo(() => buildPath(linePoints), [linePoints]);
  const areaPath = useMemo(() => buildAreaPath(linePoints), [linePoints]);

  useLayoutEffect(() => {
    if (lineRef.current) {
      setLineLength(lineRef.current.getTotalLength());
    }
  }, [linePath]);

  useEffect(() => {
    if (playbackMode) {
      setLineReady(true);
      return undefined;
    }

    setLineReady(false);
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setLineReady(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [linePath, playbackMode]);

  useEffect(() => {
    if (!playbackMode) {
      prevGroupCountRef.current = markerGroups.length;
      setEnteringGroupKey(null);
      return undefined;
    }

    if (markerGroups.length > prevGroupCountRef.current) {
      const newest = markerGroups[markerGroups.length - 1];
      if (newest?.key) {
        setEnteringGroupKey(newest.key);
        const timer = window.setTimeout(() => setEnteringGroupKey(null), 520);
        prevGroupCountRef.current = markerGroups.length;
        return () => window.clearTimeout(timer);
      }
    }

    if (markerGroups.length === 0) {
      prevGroupCountRef.current = 0;
      setEnteringGroupKey(null);
    }

    return undefined;
  }, [markerGroups, playbackMode]);

  const yTicks = useMemo(() => {
    if (maxCount <= 1) return [0, 1];
    const mid = Math.ceil(maxCount / 2);
    return Array.from(new Set([0, mid, maxCount])).sort((a, b) => a - b);
  }, [maxCount]);

  const hoveredGroup = markerGroups.find((group) => group.key === hoveredGroupKey);

  return (
    <div className="relative mx-auto w-full max-w-4xl">
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="mx-auto h-auto max-h-[168px] w-full"
        role="img"
        aria-label="Attendance timeline with clock-in, clock-out, and work-hour markers"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#007AFF" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#007AFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {yTicks.map((tick) => {
          const y = countToY(tick, maxCount);
          return (
            <g key={tick}>
              <line
                x1={PAD.left}
                y1={y}
                x2={PAD.left + CHART_W}
                y2={y}
                stroke="#F3F4F6"
                strokeDasharray="3 3"
              />
              <text
                x={PAD.left - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-gray-400 text-[9px]"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {workMarkers.map((marker) => (
          <g
            key={marker.key}
            className="cursor-default"
            onMouseEnter={() => setHoveredWorkMarker(marker.key)}
            onMouseLeave={() => setHoveredWorkMarker(null)}
          >
            <line
              x1={marker.x}
              y1={PAD.top}
              x2={marker.x}
              y2={PAD.top + CHART_H}
              stroke={WORK_MARKER_COLOR}
              strokeWidth={1.25}
              strokeDasharray="4 3"
              strokeOpacity={0.85}
            />
            <circle
              cx={marker.x}
              cy={PAD.top}
              r={2.5}
              fill={WORK_MARKER_COLOR}
            />
            <text
              x={marker.x}
              y={PAD.top - 6}
              textAnchor="middle"
              className="fill-amber-600 text-[8px] font-semibold"
            >
              {marker.shortLabel}
            </text>
            {/* Wider hit area for hover */}
            <rect
              x={marker.x - 8}
              y={PAD.top - 12}
              width={16}
              height={CHART_H + 12}
              fill="transparent"
            />
          </g>
        ))}

        {xTicks.map((hour) => (
          <text
            key={hour}
            x={timeToX(hour, domainStart, domainEnd)}
            y={VIEW_H - 8}
            textAnchor="middle"
            className="fill-gray-400 text-[9px]"
          >
            {formatTick(hour)}
          </text>
        ))}

        {areaPath && (
          <path
            d={areaPath}
            fill={`url(#${gradientId})`}
            className={clsx(
              'transition-opacity duration-500 ease-out',
              lineReady || playbackMode ? 'opacity-100' : 'opacity-0'
            )}
          />
        )}

        {linePath && (
          <path
            ref={lineRef}
            d={linePath}
            fill="none"
            stroke="#007AFF"
            strokeWidth={LINE_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={playbackMode ? undefined : lineLength || undefined}
            strokeDashoffset={playbackMode || lineReady ? 0 : lineLength}
            style={
              playbackMode
                ? undefined
                : { transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }
            }
          />
        )}

        {markerGroups.map((group, index) => {
          const { primary, others, x, y, type, late } = group;
          const isIn = type === 'IN';
          const isLateIn = isIn && late;
          const ringColor = isLateIn ? '#F59E0B' : isIn ? '#10B981' : '#EF4444';
          const glowColor = isLateIn
            ? 'rgba(245,158,11,0.28)'
            : isIn
              ? 'rgba(16,185,129,0.25)'
              : 'rgba(239,68,68,0.25)';
          const delay = `${0.3 + index * 0.05}s`;
          const hasOthers = others.length > 0;
          const actionLabel = isLateIn ? 'clocked in late' : isIn ? 'clocked in' : 'clocked out';
          const isEntering = playbackMode && group.key === enteringGroupKey;
          const isVisible = playbackMode || lineReady;
          const isHighlighted =
            highlightEventId &&
            group.all.some((person) => person.id === highlightEventId);

          return (
            <g
              key={group.key}
              className={clsx(
                'cursor-pointer',
                isEntering && 'timeline-marker-enter',
                isHighlighted && 'timeline-marker-highlight'
              )}
              style={
                playbackMode
                  ? {
                      opacity: isVisible ? 1 : 0,
                      transform: isHighlighted ? 'scale(1.12)' : 'scale(1)',
                      transformOrigin: `${x}px ${y}px`,
                      transformBox: 'fill-box',
                      transition: 'transform 0.25s ease',
                    }
                  : {
                      opacity: lineReady ? 1 : 0,
                      transform: isHighlighted ? 'scale(1.12)' : lineReady ? 'scale(1)' : 'scale(0.5)',
                      transformOrigin: `${x}px ${y}px`,
                      transformBox: 'fill-box',
                      transition: `opacity 0.4s ease ${delay}, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}`,
                    }
              }
              onMouseEnter={() => setHoveredGroupKey(group.key)}
              onMouseLeave={() => setHoveredGroupKey(null)}
              onFocus={() => setHoveredGroupKey(group.key)}
              onBlur={() => setHoveredGroupKey(null)}
              tabIndex={0}
              role="button"
              aria-label={`${primary.name}${hasOthers ? ` and ${others.length} more` : ''} ${actionLabel} at ${formatEventTime(group.timestamp)}`}
            >
              <circle
                cx={x}
                cy={y}
                r={AVATAR_SIZE / 2 + 2}
                fill={glowColor}
                className={isHighlighted ? undefined : 'animate-pulse'}
                style={{
                  animationDuration: '2.8s',
                  ...(isHighlighted ? { fill: glowColor.replace('0.25', '0.45').replace('0.28', '0.5') } : {}),
                }}
              />
              <circle
                cx={x}
                cy={y}
                r={AVATAR_SIZE / 2 + RING_WIDTH + (isHighlighted ? 1.5 : 0)}
                fill="white"
                stroke={ringColor}
                strokeWidth={isHighlighted ? RING_WIDTH + 0.75 : RING_WIDTH}
              />
              <foreignObject
                x={x - AVATAR_SIZE / 2}
                y={y - AVATAR_SIZE / 2}
                width={AVATAR_SIZE}
                height={AVATAR_SIZE}
              >
                <div
                  xmlns="http://www.w3.org/1999/xhtml"
                  className="h-full w-full overflow-hidden rounded-full"
                >
                  <UserAvatar
                    src={eventPhotoSrc(primary)}
                    name={primary.name}
                    seed={primary.employeeId}
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
              </foreignObject>
              {hasOthers && (
                <g>
                  <circle
                    cx={x + AVATAR_SIZE / 2}
                    cy={y - AVATAR_SIZE / 2}
                    r={6}
                    fill="#374151"
                    stroke="white"
                    strokeWidth="1"
                  />
                  <text
                    x={x + AVATAR_SIZE / 2}
                    y={y - AVATAR_SIZE / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-white text-[7px] font-semibold"
                  >
                    +{others.length}
                  </text>
                </g>
              )}
              {isLateIn && !hasOthers && (
                <g>
                  <circle
                    cx={x + AVATAR_SIZE / 2 - 1}
                    cy={y + AVATAR_SIZE / 2 - 1}
                    r={5.5}
                    fill="#F59E0B"
                    stroke="white"
                    strokeWidth="1"
                  />
                  <text
                    x={x + AVATAR_SIZE / 2 - 1}
                    y={y + AVATAR_SIZE / 2 - 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="fill-white text-[6px] font-bold"
                  >
                    L
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {hoveredGroup && (
        <div
          className="pointer-events-none absolute z-10"
          style={{
            left: `${(hoveredGroup.x / VIEW_W) * 100}%`,
            top: `${(hoveredGroup.y / VIEW_H) * 100}%`,
            transform: 'translate(-50%, calc(-100% - 10px))',
          }}
        >
          <div className="rounded-lg border border-gray-200/80 bg-white px-2 py-1.5 shadow-md">
            <div className="flex items-end gap-1.5">
              {hoveredGroup.all.map((person, idx) => {
                const isIn = person.type === 'IN';
                const isLateIn = isIn && person.late;
                return (
                  <div
                    key={person.id}
                    className={clsx(
                      'flex shrink-0 flex-col items-center gap-1',
                      idx === 0 && hoveredGroup.all.length > 1 && 'pr-1'
                    )}
                  >
                    <div
                      className={clsx(
                        'rounded-full p-0.5',
                        isLateIn
                          ? 'ring-2 ring-amber-500'
                          : isIn
                            ? 'ring-2 ring-emerald-500'
                            : 'ring-2 ring-red-500'
                      )}
                    >
                      <UserAvatar
                        src={eventPhotoSrc(person)}
                        name={person.name}
                        seed={person.employeeId}
                        className="h-7 w-7 rounded-full object-cover"
                      />
                    </div>
                    <span className="max-w-[56px] truncate text-[9px] font-medium text-gray-700">
                      {person.name.split(' ')[0]}
                      {isLateIn ? ' · late' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-1.5 text-center text-[10px] text-gray-500">
              {hoveredGroup.late && hoveredGroup.type === 'IN'
                ? 'Clocked in late'
                : hoveredGroup.type === 'IN'
                  ? 'Clocked in'
                  : 'Clocked out'}{' '}
              · {formatEventTime(hoveredGroup.timestamp)}
              {hoveredGroup.all.length > 1 && ` · ${hoveredGroup.all.length} people`}
            </p>
          </div>
        </div>
      )}

      {!hoveredGroup &&
        hoveredWorkMarker &&
        (() => {
          const marker = workMarkers.find((m) => m.key === hoveredWorkMarker);
          if (!marker) return null;
          return (
            <div
              className="pointer-events-none absolute z-10"
              style={{
                left: `${(marker.x / VIEW_W) * 100}%`,
                top: `${(PAD.top / VIEW_H) * 100}%`,
                transform: 'translate(-50%, calc(-100% - 8px))',
              }}
            >
              <div className="rounded-lg border border-amber-200/80 bg-white px-2.5 py-1.5 shadow-md">
                <p className="text-center text-[10px] font-medium text-amber-700">
                  {marker.label}
                </p>
                <p className="text-center text-[10px] text-gray-500">
                  {formatHourFraction(marker.fraction)}
                </p>
              </div>
            </div>
          );
        })()}

      <div className="mt-1.5 flex flex-wrap items-center justify-center gap-3 text-[10px] text-gray-500">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full ring-1 ring-emerald-500 ring-offset-1" />
          Clock in
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full ring-1 ring-amber-500 ring-offset-1" />
          Late in
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full ring-1 ring-red-500 ring-offset-1" />
          Clock out
        </span>
        {workMarkers.length > 0 && (
          <span className="inline-flex items-center gap-1">
            <span
              className="inline-block h-3 w-0 border-l border-dashed"
              style={{ borderColor: WORK_MARKER_COLOR }}
            />
            Work hours
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <span className="h-px w-3 rounded bg-[#007AFF]" />
          On-site count
        </span>
      </div>
    </div>
  );
};

export default ClockEventTimelineChart;
