import clsx from 'clsx';
import { useMemo, useState } from 'react';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const DAY_STYLES = {
  all_present: 'bg-[#34C759]/25 border-[#34C759]/40 hover:bg-[#34C759]/40',
  some_absent: 'bg-[#FF9500]/20 border-[#FF9500]/35 hover:bg-[#FF9500]/35',
  future: 'bg-gray-50 border-gray-100 text-gray-300',
  empty: 'bg-white border-gray-100 text-gray-400',
};

function normalizeDateKey(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}

/** Use real attendance calendar data from the API */
const USE_DUMMY_CALENDAR = false;

const DUMMY_TOTAL_EMPLOYEES = 10;

function buildDummyCalendar(year, month, todayKey) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = [];

  for (let d = 1; d <= daysInMonth; d += 1) {
    const iso = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    if (todayKey && iso > todayKey) {
      days.push({
        date: iso,
        present: 0,
        absent: 0,
        total_employees: DUMMY_TOTAL_EMPLOYEES,
        day_type: 'future',
      });
    } else if (d % 4 === 0) {
      days.push({
        date: iso,
        present: 7,
        absent: 3,
        total_employees: DUMMY_TOTAL_EMPLOYEES,
        day_type: 'some_absent',
      });
    } else if (d % 4 === 2) {
      days.push({
        date: iso,
        present: 9,
        absent: 1,
        total_employees: DUMMY_TOTAL_EMPLOYEES,
        day_type: 'some_absent',
      });
    } else {
      days.push({
        date: iso,
        present: DUMMY_TOTAL_EMPLOYEES,
        absent: 0,
        total_employees: DUMMY_TOTAL_EMPLOYEES,
        day_type: 'all_present',
      });
    }
  }

  return days;
}

const AttendanceMonthCalendar = ({
  month,
  calendar = [],
  loading = false,
  summaryDate,
  useSampleData = true,
  title = 'This month',
}) => {
  const [tooltip, setTooltip] = useState(null);
  const todayKey =
    normalizeDateKey(summaryDate) || normalizeDateKey(new Date().toISOString());

  const effectiveCalendar = useMemo(() => {
    if (loading || !month?.year || !month?.month) return calendar;
    const showDummy = useSampleData && USE_DUMMY_CALENDAR;
    if (showDummy) {
      return buildDummyCalendar(month.year, month.month, todayKey);
    }
    if (!useSampleData) return calendar || [];
    return calendar?.length ? calendar : buildDummyCalendar(month.year, month.month, todayKey);
  }, [calendar, loading, month, todayKey, useSampleData]);

  const showSampleBadge =
    useSampleData && USE_DUMMY_CALENDAR && !loading && Boolean(month?.year);

  const { monthLabel, weeks, stats } = useMemo(() => {
    if (!month?.year || !month?.month) {
      return { monthLabel: '', weeks: [], stats: null };
    }

    const y = month.year;
    const m = month.month - 1;
    const label = new Date(y, m, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const byDate = {};
    (effectiveCalendar || []).forEach((day) => {
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

    return { monthLabel: label, weeks: weekRows, stats: month };
  }, [month, effectiveCalendar]);

  const showDayTooltip = (cell) => {
    if (!cell.data) return false;
    return cell.data.day_type === 'all_present' || cell.data.day_type === 'some_absent';
  };

  return (
    <div className="flex h-full min-h-[24rem] flex-col rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)] [contain:layout]">
      <div className="border-b border-gray-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[11px] text-gray-500">{loading ? 'Loading…' : monthLabel}</p>
          {showSampleBadge && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-medium text-amber-800">
              Sample data
            </span>
          )}
        </div>
        {!loading && stats && (
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-gray-600">
            <span>
              Avg{' '}
              <strong className="text-[#5856D6]">
                {Number(stats.avg_attendance_rate).toFixed(0)}%
              </strong>
            </span>
            <span>
              On time{' '}
              <strong className="text-[#34C759]">
                {Number(stats.punctuality_rate).toFixed(0)}%
              </strong>
            </span>
            <span>
              Late <strong className="text-[#FF9500]">{stats.total_late}</strong>
            </span>
          </div>
        )}
      </div>

      <div className="relative px-4 py-3">
        {/* Weekday headers */}
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

        {/* Day grid — fixed small cells */}
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
                const present = cell.data?.present ?? 0;
                const absent = cell.data?.absent ?? 0;
                const hasTooltip = showDayTooltip(cell);
                const isToday = cell.iso === todayKey;
                const tipText = hasTooltip
                  ? `Present: ${present} · Absent: ${absent}`
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
                        hasTooltip && 'cursor-pointer'
                      )}
                      onMouseEnter={() =>
                        hasTooltip &&
                        setTooltip({ iso: cell.iso, dayNum: cell.dayNum, present, absent })
                      }
                      onMouseLeave={() => setTooltip(null)}
                      aria-label={
                        hasTooltip
                          ? `${cell.dayNum}: ${present} present, ${absent} absent`
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
                        <p className="text-emerald-600">Present: {tooltip.present}</p>
                        <p className="text-orange-600">Absent: {tooltip.absent}</p>
                      </div>
                    )}
                  </div>
                );
              })}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-2 text-[9px] text-gray-500">
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded border border-[#34C759]/40 bg-[#34C759]/25" />
            All present
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded border border-[#FF9500]/35 bg-[#FF9500]/20" />
            Some absent
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

export default AttendanceMonthCalendar;
