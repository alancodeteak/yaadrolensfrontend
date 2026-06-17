import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { formatClockTime, formatDurationHours } from '../../../../store/api/transforms';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const DAY_STYLES = {
  present: 'bg-[#34C759]/25 border-[#34C759]/40 hover:bg-[#34C759]/40',
  on_site: 'bg-[#34C759]/30 border-[#34C759]/50 hover:bg-[#34C759]/45',
  late: 'bg-[#FF9500]/20 border-[#FF9500]/35 hover:bg-[#FF9500]/35',
  early_leave: 'bg-[#5856D6]/20 border-[#5856D6]/35 hover:bg-[#5856D6]/35',
  incomplete: 'bg-amber-100/80 border-amber-300/50 hover:bg-amber-200/80',
  absent: 'bg-[#FF3B30]/15 border-[#FF3B30]/30 hover:bg-[#FF3B30]/25 text-[#FF3B30]',
  on_leave: 'bg-[#007AFF]/15 border-[#007AFF]/30 hover:bg-[#007AFF]/25 text-[#007AFF]',
  scheduled_leave:
    'bg-[#007AFF]/10 border-[#007AFF]/40 border-dashed hover:bg-[#007AFF]/20 text-[#007AFF]',
  weekly_off: 'bg-gray-100 border-gray-200 text-gray-400',
  future: 'bg-gray-50 border-gray-100 text-gray-300',
};

const STATUS_LABELS = {
  present: 'Present',
  on_site: 'On site',
  late: 'Late',
  early_leave: 'Early leave',
  incomplete: 'Incomplete',
  absent: 'Absent',
  on_leave: 'On leave',
  scheduled_leave: 'Scheduled leave',
  weekly_off: 'Weekly off',
  future: 'Upcoming',
};

function normalizeDateKey(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}

const EmployeeMonthCalendar = ({
  year,
  month,
  calendar = [],
  loading = false,
  summaryDate,
  title = 'This month',
  onDayClick,
}) => {
  const [tooltip, setTooltip] = useState(null);
  const todayKey =
    normalizeDateKey(summaryDate) || normalizeDateKey(new Date().toISOString());

  const { monthLabel, weeks } = useMemo(() => {
    if (!year || !month) {
      return { monthLabel: '', weeks: [] };
    }

    const y = year;
    const m = month - 1;
    const label = new Date(y, m, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const byDate = {};
    (calendar || []).forEach((day) => {
      byDate[normalizeDateKey(day.date)] = day;
    });

    const firstDow = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const cells = [];

    for (let i = 0; i < firstDow; i += 1) {
      cells.push({ type: 'pad' });
    }
    for (let d = 1; d <= daysInMonth; d += 1) {
      const iso = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ type: 'day', dayNum: d, data: byDate[iso] || null, iso });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ type: 'pad' });
    }

    const weekRows = [];
    for (let i = 0; i < cells.length; i += 7) {
      weekRows.push(cells.slice(i, i + 7));
    }

    return { monthLabel: label, weeks: weekRows };
  }, [year, month, calendar]);

  const showDayTooltip = (cell) =>
    cell.data &&
    cell.data.day_type !== 'future' &&
    cell.data.day_type !== 'weekly_off';

  const isClickableDay = (cell) => {
    if (!onDayClick || !cell.data) return false;
    const dayType = cell.data.day_type;
    if (dayType === 'weekly_off') return false;
    if (dayType === 'on_leave' || dayType === 'scheduled_leave') return false;
    return cell.iso >= todayKey;
  };

  const handleDayClick = (cell) => {
    if (!isClickableDay(cell)) return;
    onDayClick(cell.iso);
  };

  return (
    <div className="rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
      <div className="border-b border-gray-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        <p className="text-[11px] text-gray-500">{loading ? 'Loading…' : monthLabel}</p>
      </div>

      <div className="relative px-4 py-3">
        <div className="mb-1 grid grid-cols-7 gap-0.5">
          {WEEKDAYS.map((wd, i) => (
            <div
              key={`${wd}-${i}`}
              className="flex h-5 w-7 items-center justify-center text-[9px] font-semibold text-gray-400"
            >
              {wd}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {loading
            ? Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className="h-7 w-7 animate-pulse rounded bg-gray-100" />
              ))
            : weeks.flat().map((cell, idx) => {
                if (cell.type === 'pad') {
                  return <div key={`pad-${idx}`} className="h-7 w-7" aria-hidden="true" />;
                }

                const dayType = cell.data?.day_type || 'future';
                const hasTooltip = showDayTooltip(cell);
                const clickable = isClickableDay(cell);
                const isToday = cell.iso === todayKey;
                const statusLabel = STATUS_LABELS[dayType] || dayType;
                const leaveHint =
                  (cell.data?.day_type === 'on_leave' ||
                    cell.data?.day_type === 'scheduled_leave') &&
                  cell.data?.leave_type
                    ? ` (${cell.data.leave_type}${
                        cell.data.is_within_quota ? ', paid' : ', over quota'
                      })`
                    : '';
                const hoursLabel = formatDurationHours(cell.data?.total_hours);
                const tipText = hasTooltip
                  ? `${statusLabel}${leaveHint}${hoursLabel ? ` · ${hoursLabel}` : ''}`
                  : undefined;

                return (
                  <div key={cell.iso} className="relative h-7 w-7">
                    <button
                      type="button"
                      title={tipText}
                      className={clsx(
                        'flex h-7 w-7 items-center justify-center rounded border text-[10px] font-medium leading-none transition-colors',
                        DAY_STYLES[dayType] || DAY_STYLES.future,
                        isToday && 'ring-1 ring-[#007AFF] ring-offset-1',
                        (hasTooltip || clickable) && 'cursor-pointer'
                      )}
                      onClick={() => handleDayClick(cell)}
                      onMouseEnter={() =>
                        hasTooltip &&
                        setTooltip({
                          iso: cell.iso,
                          dayNum: cell.dayNum,
                          dayType,
                          statusLabel,
                          hoursLabel,
                          clockIn: cell.data?.clock_in,
                          clockOut: cell.data?.clock_out,
                        })
                      }
                      onMouseLeave={() => setTooltip(null)}
                      aria-label={
                        hasTooltip
                          ? `${cell.dayNum}: ${statusLabel}${hoursLabel ? `, ${hoursLabel}` : ''}`
                          : clickable
                            ? `Schedule leave for day ${cell.dayNum}`
                            : `Day ${cell.dayNum}`
                      }
                    >
                      {cell.dayNum}
                    </button>

                    {tooltip?.iso === cell.iso && (
                      <div
                        role="tooltip"
                        className="absolute left-1/2 top-full z-[100] mt-1.5 w-max -translate-x-1/2 rounded-lg border border-gray-200/80 bg-white px-2.5 py-2 text-[10px] leading-snug text-gray-800 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
                      >
                        <p className="font-semibold text-gray-900">
                          {tooltip.dayNum} {monthLabel.split(' ')[0]}
                        </p>
                        <p className="text-gray-700">{tooltip.statusLabel}</p>
                        {tooltip.hoursLabel && (
                          <p className="font-medium text-[#007AFF]">
                            Logged: {tooltip.hoursLabel}
                          </p>
                        )}
                        {tooltip.clockIn && (
                          <p className="text-gray-500">
                            In {formatClockTime(tooltip.clockIn)}
                            {tooltip.clockOut ? ` · Out ${formatClockTime(tooltip.clockOut)}` : ''}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-2 text-[9px] text-gray-500">
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded border border-[#34C759]/40 bg-[#34C759]/25" />
            Present
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded border border-[#FF9500]/35 bg-[#FF9500]/20" />
            Late
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded border border-[#FF3B30]/30 bg-[#FF3B30]/15" />
            Absent
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded border border-amber-300/50 bg-amber-100/80" />
            Incomplete
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded border border-[#007AFF]/30 bg-[#007AFF]/15" />
            On leave
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded border border-dashed border-[#007AFF]/40 bg-[#007AFF]/10" />
            Scheduled
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded border border-gray-200 bg-gray-100" />
            Weekly off
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded border border-gray-100 bg-gray-50" />
            Upcoming
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeMonthCalendar;
