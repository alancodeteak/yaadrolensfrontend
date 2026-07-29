import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchAllPages } from '../utils/fetchAllPages';

/**
 * Aggregates every page of an RTK Query "lazy" list query into flat state,
 * working around backend endpoints that cap `limit` (e.g. le=200) which would
 * otherwise silently truncate large rosters/ledgers.
 *
 * @param {Function} triggerQuery RTK Query lazy-query trigger, e.g. the function
 *   returned from `useLazyGetEmployeesQuery()[0]`. Called with `{ ...params, page, skip, limit }`.
 * @param {Object} [params] Extra query params merged into every page request (filters, etc).
 * @param {Object} [options]
 * @param {boolean} [options.skip=false] Skip fetching entirely (e.g. inactive tab).
 * @param {number} [options.limit=100] Page size requested per call.
 */
export function useFetchAllPages(triggerQuery, params = {}, { skip = false, limit = 100 } = {}) {
  const [data, setData] = useState({ items: [], total: 0 });
  const [isFetching, setIsFetching] = useState(!skip);
  const [error, setError] = useState(null);
  // Mirrors RTK Query's isLoading semantics: true only while the *first*
  // fetch (since this hook became active) is in flight; later refetches
  // only toggle isFetching so already-rendered data doesn't disappear.
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);
  const requestIdRef = useRef(0);
  const paramsKey = JSON.stringify(params);

  const run = useCallback(async () => {
    if (skip) return undefined;

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setIsFetching(true);
    setError(null);

    try {
      const result = await fetchAllPages({
        limit,
        fetchPage: ({ page, skip: skipCount, limit: pageLimit }) =>
          triggerQuery({ ...params, page, skip: skipCount, limit: pageLimit }).unwrap(),
      });

      if (requestIdRef.current !== requestId) return undefined;
      setData(result);
      return result;
    } catch (err) {
      if (requestIdRef.current === requestId) {
        setError(err);
      }
      throw err;
    } finally {
      if (requestIdRef.current === requestId) {
        setIsFetching(false);
        setHasFetchedOnce(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerQuery, paramsKey, skip, limit]);

  useEffect(() => {
    run().catch(() => {});
  }, [run]);

  const isLoading = isFetching && !hasFetchedOnce;

  return { data, isLoading, isFetching, error, hasFetchedOnce, refetch: run };
}

export default useFetchAllPages;
