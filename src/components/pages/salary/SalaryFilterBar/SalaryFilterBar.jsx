import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Search, ChevronDown, ArrowUpDown, Filter } from 'lucide-react';

const menuClass =
  'absolute z-10 mt-2 w-52 overflow-hidden rounded-2xl border border-gray-200/60 bg-white py-1 shadow-[0_2px_16px_rgba(0,0,0,0.06)]';

const menuItemClass = (active) =>
  clsx(
    'block w-full px-4 py-2 text-left text-sm transition-colors duration-150',
    active ? 'bg-blue-50 font-medium text-[#007AFF]' : 'text-gray-700 hover:bg-gray-50'
  );

const triggerClass =
  'inline-flex items-center gap-2 rounded-xl border border-gray-200/60 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20';

const inputClass =
  'block w-full rounded-xl border border-gray-200/60 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] placeholder:text-gray-400 focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All employees' },
  { value: 'active', label: 'Active only' },
  { value: 'inactive', label: 'Inactive only' },
  { value: 'unset', label: 'Salary not set' },
];

const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'salary', label: 'Salary' },
  { value: 'last_changed', label: 'Last changed' },
  { value: 'department', label: 'Department' },
];

const SalaryFilterBar = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  onClearFilters,
  hasActiveFilters,
}) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const statusRef = useRef(null);
  const sortRef = useRef(null);

  const activeStatusLabel =
    STATUS_OPTIONS.find((opt) => opt.value === statusFilter)?.label ?? 'All employees';
  const activeSortLabel = SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label ?? 'Name';

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setIsStatusOpen(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsStatusOpen(false);
        setIsSortOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div
      className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
      data-tour="salary-filters"
    >
      <div className="relative w-full lg:max-w-sm">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          strokeWidth={2}
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or code…"
          className={inputClass}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative" ref={statusRef}>
          <button
            type="button"
            onClick={() => {
              setIsStatusOpen((open) => !open);
              setIsSortOpen(false);
            }}
            className={triggerClass}
          >
            <Filter className="h-4 w-4 text-gray-500" strokeWidth={2} />
            {activeStatusLabel}
            <ChevronDown className="h-4 w-4 text-gray-400" strokeWidth={2} />
          </button>
          {isStatusOpen && (
            <div className={menuClass}>
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onStatusFilterChange(opt.value);
                    setIsStatusOpen(false);
                  }}
                  className={menuItemClass(statusFilter === opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={sortRef}>
          <button
            type="button"
            onClick={() => {
              setIsSortOpen((open) => !open);
              setIsStatusOpen(false);
            }}
            className={triggerClass}
          >
            <ArrowUpDown className="h-4 w-4 text-gray-500" strokeWidth={2} />
            {activeSortLabel}
            <ChevronDown className="h-4 w-4 text-gray-400" strokeWidth={2} />
          </button>
          {isSortOpen && (
            <div className={menuClass}>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onSortChange(opt.value);
                    setIsSortOpen(false);
                  }}
                  className={menuItemClass(sortBy === opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-sm font-medium text-[#007AFF] hover:text-[#0066DD]"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};

export default SalaryFilterBar;
