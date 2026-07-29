import { MONTHS, ALL_PERIODS } from '../../components/pages/payment';

export const PER_PAGE = 10;
export const HISTORY_PER_PAGE = 10;
/**
 * Backend payment/employee list endpoints cap `limit` at 200 (le=200) per request.
 * Instead of relying on a single request (which silently truncates once a list
 * grows past the cap), each tab's data is aggregated across pages via
 * `useFetchAllPages`, requesting this many items per page.
 */
export const AGGREGATE_PAGE_LIMIT = 100;

export const getMonthNumber = (monthName) => {
  if (!monthName || monthName === ALL_PERIODS) return null;
  const n = MONTHS.indexOf(monthName) + 1;
  return n > 0 ? n : null;
};
