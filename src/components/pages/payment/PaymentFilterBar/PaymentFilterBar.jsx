import { useState } from 'react';
import clsx from 'clsx';
import { Search, ChevronDown } from 'lucide-react';

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
  'w-full rounded-xl border border-gray-200/60 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] placeholder:text-gray-400 transition-colors duration-200 focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20';

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
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

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

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <button type="button" onClick={() => setIsFilterOpen(!isFilterOpen)} className={triggerClass}>
            {filterLabel}
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
          <div className="relative">
            <button type="button" onClick={() => setIsStatusOpen(!isStatusOpen)} className={triggerClass}>
              Status
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
      </div>
    </div>
  );
};

export default PaymentFilterBar;
