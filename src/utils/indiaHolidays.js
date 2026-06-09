import Holidays from 'date-holidays';

let indiaHolidays;

function getIndiaHolidays() {
  if (!indiaHolidays) {
    indiaHolidays = new Holidays('IN');
  }
  return indiaHolidays;
}

export function toDateKey(value) {
  if (!value) return '';
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  return String(value).slice(0, 10);
}

export function getTodayIndiaHolidays(date = new Date()) {
  const result = getIndiaHolidays().isHoliday(date);
  if (!result) return [];
  return Array.isArray(result) ? result : [result];
}

export function getUpcomingIndiaHolidays({ fromDate = new Date(), limit = 5 } = {}) {
  const hd = getIndiaHolidays();
  const year = fromDate.getFullYear();
  const fromKey = toDateKey(fromDate);
  const seen = new Set();

  const holidays = [...hd.getHolidays(year), ...hd.getHolidays(year + 1)]
    .filter((holiday) => {
      const key = toDateKey(holiday.date);
      if (seen.has(key)) return false;
      seen.add(key);
      return key >= fromKey;
    })
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, limit);

  return holidays;
}

export function formatHolidayDate(holiday) {
  const date = holiday.start instanceof Date ? holiday.start : new Date(holiday.start);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
