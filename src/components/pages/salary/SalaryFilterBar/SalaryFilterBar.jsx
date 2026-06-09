import { useState } from 'react';
import clsx from 'clsx';
import { Search, ChevronDown, ArrowUpDown } from 'lucide-react';

const menuClass =
  'absolute z-10 mt-2 w-48 overflow-hidden rounded-2xl border border-gray-200/60 bg-white py-1 shadow-[0_2px_16px_rgba(0,0,0,0.06)]';

const menuItemClass = (active) =>
  clsx(
    'block w-full px-4 py-2 text-left text-sm transition-colors duration-150',
    active ? 'bg-blue-50 font-medium text-[#007AFF]' : 'text-gray-700 hover:bg-gray-50'
  );

const triggerClass =
  'inline-flex items-center gap-2 rounded-xl border border-gray-200/60 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20';

const inputClass =
  'w-full rounded-xl border border-gray-200/60 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] placeholder:text-gray-400 transition-colors duration-200 focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20';

const SalaryFilterBar = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
}) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All employees' },
    { value: 'active', label: 'Active only' },
    { value: 'inactive', label: 'Inactive only' },
    { value: 'unset', label: 'Salary not set' },
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'salary', label: 'Salary' },
    { value: 'last_changed', label: 'Last changed' },
    { value: 'department', label: 'Department' },
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" data-tour="salary-filters">
      <div className="relative max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or employee code..."
          className={inputClass}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <button type="button" onClick={() => setIsStatusOpen(!isStatusOpen)} className={triggerClass}>
            Status
            <ChevronDown className="h-4 w-4 text-gray-400" strokeWidth={2} />
          </button>
          {isStatusOpen && (
            <div className={menuClass}>
              {statusOptions.map((opt) => (
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

        <div className="relative">
          <button type="button" onClick={() => setIsSortOpen(!isSortOpen)} className={triggerClass}>
            <ArrowUpDown className="h-4 w-4 text-gray-500" strokeWidth={2} />
            Sort
            <ChevronDown className="h-4 w-4 text-gray-400" strokeWidth={2} />
          </button>
          {isSortOpen && (
            <div className={menuClass}>
              {sortOptions.map((opt) => (
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
      </div>
    </div>
  );
};

export default SalaryFilterBar;
