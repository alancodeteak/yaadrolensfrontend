import clsx from 'clsx';
import { CalendarDays, PartyPopper } from 'lucide-react';
import { useMemo } from 'react';
import {
  formatHolidayDate,
  getTodayIndiaHolidays,
  getUpcomingIndiaHolidays,
  toDateKey,
} from '../../../../utils/indiaHolidays';

const IndiaHolidaysCard = ({ referenceDate, className, compact = false }) => {
  const { todayHolidays, upcomingHolidays } = useMemo(() => {
    const date = referenceDate ? new Date(`${referenceDate}T12:00:00`) : new Date();
    const today = getTodayIndiaHolidays(date);
    const todayKeys = new Set(today.map((h) => toDateKey(h.date)));
    const upcoming = getUpcomingIndiaHolidays({ fromDate: date, limit: 6 }).filter(
      (h) => !todayKeys.has(toDateKey(h.date))
    );

    return {
      todayHolidays: today,
      upcomingHolidays: upcoming.slice(0, compact ? 2 : 5),
    };
  }, [referenceDate, compact]);

  const isHolidayToday = todayHolidays.length > 0;
  const nextHoliday = upcomingHolidays[0];

  if (compact) {
    return (
      <div
        className={clsx(
          'flex h-full flex-col rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]',
          className
        )}
      >
        <div className="border-b border-gray-100 px-3 py-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-gray-900">Holidays</h2>
            {isHolidayToday && (
              <span className="rounded-full bg-[#5856D6]/10 px-1.5 py-0.5 text-[9px] font-semibold text-[#5856D6]">
                Today
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-3">
          <div
            className={clsx(
              'flex min-h-[52px] items-center gap-2 rounded-xl px-2 py-2',
              isHolidayToday ? 'bg-[#5856D6]/5' : 'bg-gray-50/80'
            )}
          >
            <div
              className={clsx(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                isHolidayToday ? 'bg-[#5856D6]/15 text-[#5856D6]' : 'bg-white text-gray-400'
              )}
            >
              {isHolidayToday ? (
                <PartyPopper className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              ) : (
                <CalendarDays className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-gray-500">Today</p>
              <p className="truncate text-xs font-semibold text-gray-900">
                {isHolidayToday ? todayHolidays[0].name : 'No public holiday'}
              </p>
            </div>
          </div>

          {nextHoliday ? (
            <div className="min-h-[52px] rounded-xl bg-gray-50/80 px-2 py-2">
              <p className="text-[10px] font-medium text-gray-500">Next up</p>
              <p className="truncate text-xs font-semibold text-gray-900">{nextHoliday.name}</p>
              <p className="text-[10px] text-gray-500">{formatHolidayDate(nextHoliday)}</p>
            </div>
          ) : (
            <div className="flex min-h-[52px] items-center rounded-xl bg-gray-50/80 px-2 py-2">
              <p className="text-[10px] text-gray-500">No upcoming holidays</p>
            </div>
          )}

          {upcomingHolidays.length > 1 && (
            <div className="min-h-[52px] rounded-xl bg-gray-50/80 px-2 py-2">
              <p className="text-[10px] font-medium text-gray-500">Then</p>
              <p className="truncate text-xs font-semibold text-gray-900">
                {upcomingHolidays[1].name}
              </p>
              <p className="text-[10px] text-gray-500">
                {formatHolidayDate(upcomingHolidays[1])}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]',
        className
      )}
    >
      <div className="border-b border-gray-100 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-900">India holidays</h2>
          {isHolidayToday && (
            <span className="rounded-full bg-[#5856D6]/10 px-2 py-0.5 text-[9px] font-semibold text-[#5856D6]">
              Today
            </span>
          )}
        </div>
        <p className="text-[11px] text-gray-500">Public holidays in India</p>
      </div>

      <div className="space-y-3 p-4">
        <div
          className={clsx(
            'flex items-start gap-3 rounded-xl border px-3 py-2.5',
            isHolidayToday
              ? 'border-[#5856D6]/25 bg-[#5856D6]/5'
              : 'border-gray-100 bg-gray-50/80'
          )}
        >
          <div
            className={clsx(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
              isHolidayToday ? 'bg-[#5856D6]/15 text-[#5856D6]' : 'bg-white text-gray-400'
            )}
          >
            {isHolidayToday ? (
              <PartyPopper className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            ) : (
              <CalendarDays className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-900">
              {isHolidayToday ? 'Today is a public holiday' : 'No public holiday today'}
            </p>
            {isHolidayToday ? (
              <ul className="mt-1 space-y-0.5">
                {todayHolidays.map((holiday) => (
                  <li key={`${holiday.date}-${holiday.name}`} className="text-[11px] text-gray-600">
                    {holiday.name}
                    {holiday.note ? ` — ${holiday.note}` : ''}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-0.5 text-[11px] text-gray-500">
                Regular working day based on national public holidays.
              </p>
            )}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            Upcoming
          </p>
          {upcomingHolidays.length === 0 ? (
            <p className="text-[11px] text-gray-500">No upcoming holidays found.</p>
          ) : (
            <ul className="space-y-1.5">
              {upcomingHolidays.map((holiday) => (
                <li
                  key={`${holiday.date}-${holiday.name}`}
                  className="flex items-center justify-between gap-2 rounded-lg bg-gray-50/80 px-2.5 py-2"
                >
                  <span className="truncate text-xs font-medium text-gray-900">{holiday.name}</span>
                  <span className="shrink-0 text-[10px] text-gray-500">
                    {formatHolidayDate(holiday)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndiaHolidaysCard;
