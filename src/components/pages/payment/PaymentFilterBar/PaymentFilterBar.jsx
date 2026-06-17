import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Search, ChevronDown, Filter } from 'lucide-react';

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

const PAYMENT_TYPE_OPTIONS = [
  { value: '', label: 'All types' },
  { value: 'monthly_salary', label: 'Monthly salary' },
  { value: 'advance_disbursement', label: 'Advance disbursement' },
  { value: 'advance_recovery', label: 'Advance recovery' },
  { value: 'bonus', label: 'Bonus' },
  { value: 'other', label: 'Other' },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'paid', label: 'Paid' },
];

const ADVANCE_STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'disbursed', label: 'Disbursed' },
  { value: 'fully_recovered', label: 'Fully recovered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const BONUS_STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'released', label: 'Released' },
  { value: 'included_in_salary', label: 'In salary' },
];

const BALANCE_FILTER_OPTIONS = [
  { value: '', label: 'All employees' },
  { value: 'non_zero', label: 'Non-zero only' },
];

const PaymentFilterBar = ({
  activeTab,
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  paymentStatusFilter,
  onPaymentStatusFilterChange,
  bonusStatusFilter,
  onBonusStatusFilterChange,
  balanceFilter,
  onBalanceFilterChange,
  onClearFilters,
  hasActiveFilters,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const filterRef = useRef(null);
  const statusRef = useRef(null);

  const tabOptions = {
    ledger: PAYMENT_TYPE_OPTIONS,
    advances: ADVANCE_STATUS_OPTIONS,
    bonuses: BONUS_STATUS_OPTIONS,
    balance: BALANCE_FILTER_OPTIONS,
  };
  const options = tabOptions[activeTab] || [];

  const filterValue =
    activeTab === 'ledger'
      ? typeFilter
      : activeTab === 'bonuses'
        ? bonusStatusFilter
        : activeTab === 'balance'
          ? balanceFilter
          : statusFilter;

  const onFilterChange =
    activeTab === 'ledger'
      ? onTypeFilterChange
      : activeTab === 'bonuses'
        ? onBonusStatusFilterChange
        : activeTab === 'balance'
          ? onBalanceFilterChange
          : onStatusFilterChange;

  const filterLabel =
    activeTab === 'ledger' ? 'Type' : activeTab === 'balance' ? 'Show' : 'Status';

  const activeFilterLabel =
    options.find((opt) => opt.value === filterValue)?.label ?? options[0]?.label;
  const activeStatusLabel =
    PAYMENT_STATUS_OPTIONS.find((opt) => opt.value === paymentStatusFilter)?.label ??
    'All statuses';

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setIsStatusOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsFilterOpen(false);
        setIsStatusOpen(false);
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
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
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

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => {
              setIsFilterOpen((open) => !open);
              setIsStatusOpen(false);
            }}
            className={triggerClass}
          >
            <Filter className="h-4 w-4 text-gray-500" strokeWidth={2} />
            {activeFilterLabel || filterLabel}
            <ChevronDown className="h-4 w-4 text-gray-400" strokeWidth={2} />
          </button>
          {isFilterOpen && (
            <div className={menuClass}>
              {options.map((opt) => (
                <button
                  key={opt.value || 'all'}
                  type="button"
                  onClick={() => {
                    onFilterChange(opt.value);
                    setIsFilterOpen(false);
                  }}
                  className={menuItemClass(filterValue === opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {activeTab === 'ledger' && (
          <div className="relative" ref={statusRef}>
            <button
              type="button"
              onClick={() => {
                setIsStatusOpen((open) => !open);
                setIsFilterOpen(false);
              }}
              className={triggerClass}
            >
              {activeStatusLabel}
              <ChevronDown className="h-4 w-4 text-gray-400" strokeWidth={2} />
            </button>
            {isStatusOpen && (
              <div className={menuClass}>
                {PAYMENT_STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value || 'all-status'}
                    type="button"
                    onClick={() => {
                      onPaymentStatusFilterChange?.(opt.value);
                      setIsStatusOpen(false);
                    }}
                    className={menuItemClass(paymentStatusFilter === opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

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

export default PaymentFilterBar;
