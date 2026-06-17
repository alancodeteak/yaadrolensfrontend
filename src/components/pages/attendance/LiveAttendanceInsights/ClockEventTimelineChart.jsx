import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { UserAvatar } from '../../../common';
import { resolveRowProfilePhoto } from '../../../../store/api/transforms';

const WORK_START = 6;
const WORK_END = 20;
const VIEW_W = 800;
const VIEW_H = 168;
const PAD = { top: 20, right: 20, bottom: 28, left: 32 };
const CHART_W = VIEW_W - PAD.left - PAD.right;
const CHART_H = VIEW_H - PAD.top - PAD.bottom;
const AVATAR_SIZE = 18;
const RING_WIDTH = 1.25;
const LINE_WIDTH = 1;

const X_TICKS = [6, 9, 12, 15, 18, 20];

function timeFraction(iso) {
  const d = new Date(iso);
  return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
}

function formatTick(hour) {
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 || 12;
  return `${h}${suffix}`;
}

function formatEventTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function clampTime(fraction) {
  return Math.min(WORK_END, Math.max(WORK_START, fraction));
}

function timeToX(fraction) {
  const clamped = clampTime(fraction);
  return PAD.left + ((clamped - WORK_START) / (WORK_END - WORK_START)) * CHART_W;
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
    const base = {
      employeeId: row.employee_id,
      name: row.name,
      employeeCode: row.employee_code,
      profilePhotoUrl,
      photo,
      avatar,
    };
    if (row.clock_in) {
      events.push({ ...base, id: `${row.employee_id}-in`, type: 'IN', timestamp: row.clock_in });
    }
    if (row.clock_out) {
      events.push({ ...base, id: `${row.employee_id}-out`, type: 'OUT', timestamp: row.clock_out });
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
      primary: sorted[0],
      others: sorted.slice(1),
      all: sorted,
    };
  });
}

const ClockEventTimelineChart = ({ events = [] }) => {
  const gradientId = useId();
  const lineRef = useRef(null);
  const [lineLength, setLineLength] = useState(0);
  const [lineReady, setLineReady] = useState(false);
  const [hoveredGroupKey, setHoveredGroupKey] = useState(null);

  const { linePoints, markerGroups, maxCount } = useMemo(() => {
    let present = 0;
    let peak = 0;
    const linePts = [{ x: timeToX(WORK_START), y: 0, count: 0 }];
    const markers = [];

    events.forEach((event) => {
      if (event.type === 'IN') present += 1;
      else present = Math.max(0, present - 1);
      peak = Math.max(peak, present);

      const fraction = timeFraction(event.timestamp);
      const x = timeToX(fraction);

      linePts.push({ x, y: 0, count: present });
      markers.push({ ...event, x, present });
    });

    if (linePts.length === 1) {
      linePts.push({ x: timeToX(WORK_END), y: 0, count: 0 });
    } else {
      const last = linePts[linePts.length - 1];
      linePts.push({ x: timeToX(WORK_END), y: 0, count: last.count });
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
  }, [events]);

  const linePath = useMemo(() => buildPath(linePoints), [linePoints]);
  const areaPath = useMemo(() => buildAreaPath(linePoints), [linePoints]);

  useLayoutEffect(() => {
    if (lineRef.current) {
      setLineLength(lineRef.current.getTotalLength());
    }
  }, [linePath]);

  useEffect(() => {
    setLineReady(false);
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setLineReady(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [linePath]);

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
        aria-label="Attendance timeline with clock-in and clock-out events"
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

        {X_TICKS.map((hour) => (
          <text
            key={hour}
            x={timeToX(hour)}
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
              lineReady ? 'opacity-100' : 'opacity-0'
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
            strokeDasharray={lineLength || undefined}
            strokeDashoffset={lineReady ? 0 : lineLength}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        )}

        {markerGroups.map((group, index) => {
          const { primary, others, x, y, type } = group;
          const isIn = type === 'IN';
          const ringColor = isIn ? '#10B981' : '#EF4444';
          const glowColor = isIn ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)';
          const delay = `${0.3 + index * 0.05}s`;
          const hasOthers = others.length > 0;

          return (
            <g
              key={group.key}
              className="cursor-pointer"
              style={{
                opacity: lineReady ? 1 : 0,
                transform: lineReady ? 'scale(1)' : 'scale(0.5)',
                transformOrigin: `${x}px ${y}px`,
                transformBox: 'fill-box',
                transition: `opacity 0.4s ease ${delay}, transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}`,
              }}
              onMouseEnter={() => setHoveredGroupKey(group.key)}
              onMouseLeave={() => setHoveredGroupKey(null)}
              onFocus={() => setHoveredGroupKey(group.key)}
              onBlur={() => setHoveredGroupKey(null)}
              tabIndex={0}
              role="button"
              aria-label={`${primary.name}${hasOthers ? ` and ${others.length} more` : ''} ${isIn ? 'clocked in' : 'clocked out'} at ${formatEventTime(group.timestamp)}`}
            >
              <circle
                cx={x}
                cy={y}
                r={AVATAR_SIZE / 2 + 2}
                fill={glowColor}
                className="animate-pulse"
                style={{ animationDuration: '2.8s' }}
              />
              <circle
                cx={x}
                cy={y}
                r={AVATAR_SIZE / 2 + RING_WIDTH}
                fill="white"
                stroke={ringColor}
                strokeWidth={RING_WIDTH}
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
                        isIn ? 'ring-2 ring-emerald-500' : 'ring-2 ring-red-500'
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
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-1.5 text-center text-[10px] text-gray-500">
              {hoveredGroup.type === 'IN' ? 'Clocked in' : 'Clocked out'} ·{' '}
              {formatEventTime(hoveredGroup.timestamp)}
              {hoveredGroup.all.length > 1 && ` · ${hoveredGroup.all.length} people`}
            </p>
          </div>
        </div>
      )}

      <div className="mt-1.5 flex flex-wrap items-center justify-center gap-3 text-[10px] text-gray-500">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full ring-1 ring-emerald-500 ring-offset-1" />
          Clock in
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full ring-1 ring-red-500 ring-offset-1" />
          Clock out
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-px w-3 rounded bg-[#007AFF]" />
          On-site count
        </span>
      </div>
    </div>
  );
};

export default ClockEventTimelineChart;
