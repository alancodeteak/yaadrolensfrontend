import { useMemo } from 'react';
import { useLazyGetEmployeesQuery } from '../store/api';
import { useFetchAllPages } from './useFetchAllPages';
import { filterEmployees, paginateEmployees, sortEmployees } from '../utils/employeeListUtils';

const PAGE_LIMIT = 100;

/**
 * The employees list endpoint has no server-side search and caps `limit`, so a
 * single page-1 fetch silently drops employees past the cap. This hook walks
 * every page via `useLazyGetEmployeesQuery`, caches the full roster in state,
 * and then applies search/department/active filtering, sorting, and pagination
 * entirely on the client against the complete data set.
 */
export function usePaginatedEmployees({
  searchTerm = '',
  filterDepartment = 'all',
  showActiveEmployees = true,
  sortBy = 'name',
  currentPage = 1,
  perPage = 10,
} = {}) {
  const [triggerGetEmployees] = useLazyGetEmployeesQuery();
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useFetchAllPages(triggerGetEmployees, {}, { limit: PAGE_LIMIT });

  const allEmployees = data.items;

  const filteredEmployees = useMemo(
    () =>
      sortEmployees(
        filterEmployees(allEmployees, {
          search: searchTerm,
          department: filterDepartment,
          is_active: showActiveEmployees,
        }),
        sortBy
      ),
    [allEmployees, searchTerm, filterDepartment, sortBy, showActiveEmployees]
  );

  const totalFilteredCount = filteredEmployees.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredCount / perPage));
  const paginatedEmployees = useMemo(
    () => paginateEmployees(filteredEmployees, currentPage, perPage),
    [filteredEmployees, currentPage, perPage]
  );

  return {
    allEmployees,
    filteredEmployees,
    paginatedEmployees,
    totalFilteredCount,
    totalCount: data.total,
    totalPages,
    isLoading,
    isFetching,
    error,
    refetch,
  };
}

export default usePaginatedEmployees;
