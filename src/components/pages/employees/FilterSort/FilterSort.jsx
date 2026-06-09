import { useState } from 'react';
import clsx from 'clsx';
import { ChevronDown, ArrowUpDown, Filter } from 'lucide-react';

const menuClass =
  'absolute z-10 mt-2 w-48 overflow-hidden rounded-2xl border border-gray-200/60 bg-white py-1 shadow-[0_2px_16px_rgba(0,0,0,0.06)]';

const menuItemClass = (active) =>
  clsx(
    'block w-full px-4 py-2 text-left text-sm transition-colors duration-150',
    active ? 'bg-blue-50 font-medium text-[#007AFF]' : 'text-gray-700 hover:bg-gray-50'
  );

const triggerClass =
  'inline-flex items-center gap-2 rounded-xl border border-gray-200/60 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20';

const FilterSort = ({
  filterDepartment,
  setFilterDepartment,
  sortBy,
  setSortBy,
  departmentOptions = [],
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const departments = [
    { value: 'all', label: 'All departments' },
    ...departmentOptions.map((dept) => ({ value: dept.name, label: dept.name })),
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'department', label: 'Department' },
    { value: 'status', label: 'Status' },
    { value: 'created_at', label: 'Date added' },
    { value: 'training_status', label: 'Training status' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <button type="button" onClick={() => setIsFilterOpen(!isFilterOpen)} className={triggerClass}>
          <Filter className="h-4 w-4 text-gray-500" strokeWidth={2} />
          Filter
          <ChevronDown className="h-4 w-4 text-gray-400" strokeWidth={2} />
        </button>

        {isFilterOpen && (
          <div className={menuClass}>
            {departments.map((dept) => (
              <button
                key={dept.value}
                type="button"
                onClick={() => {
                  setFilterDepartment(dept.value);
                  setIsFilterOpen(false);
                }}
                className={menuItemClass(filterDepartment === dept.value)}
              >
                {dept.label}
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
            {sortOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setSortBy(option.value);
                  setIsSortOpen(false);
                }}
                className={menuItemClass(sortBy === option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSort;
