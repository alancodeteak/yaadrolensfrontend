const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const ALL_PERIODS = 'All';

const selectClass =
  'rounded-xl border border-gray-200/60 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-colors duration-200 focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20';

const PaymentPeriodBar = ({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  years,
  allowAll = true,
}) => {
  const isAll = selectedMonth === ALL_PERIODS;

  return (
    <div className="flex flex-wrap items-center gap-3" data-tour="payroll-period">
      <div className="min-w-0">
        <span className="text-xs font-medium text-gray-500">Payroll period</span>
        <p className="text-[10px] text-gray-400">
          {isAll ? 'Showing every recorded payment' : 'Filter by salary/bonus period month'}
        </p>
      </div>
      <select
        value={selectedMonth}
        onChange={(e) => onMonthChange(e.target.value)}
        className={selectClass}
        aria-label="Month"
      >
        {allowAll && <option value={ALL_PERIODS}>All periods</option>}
        {MONTHS.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
      <select
        value={selectedYear}
        onChange={(e) => onYearChange(e.target.value)}
        className={selectClass}
        aria-label="Year"
        disabled={isAll}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export { MONTHS };
export default PaymentPeriodBar;
