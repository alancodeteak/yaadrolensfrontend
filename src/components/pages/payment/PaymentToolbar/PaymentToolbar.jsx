import { DASHBOARD_PANEL } from '../../dashboard/dashboardTheme';
import PaymentTabBar from '../PaymentTabBar/PaymentTabBar';
import PaymentPeriodBar from '../PaymentPeriodBar/PaymentPeriodBar';
import PaymentFilterBar from '../PaymentFilterBar/PaymentFilterBar';

const TAB_SUBTITLES = {
  ledger: null,
  advances: 'Track requests, approvals, and recoveries',
  bonuses: 'Schedule bonuses or quick-release as separate payments',
  balance: 'Give or take balance — applied when salaries are generated',
};

const PaymentToolbar = ({
  activeTab,
  onTabChange,
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  years,
  actions,
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
  const showPeriod = activeTab === 'ledger' || activeTab === 'bonuses';

  return (
  <div className={DASHBOARD_PANEL} data-tour="payroll-toolbar">
    <div className="border-b border-gray-100 px-3 py-2 sm:px-4">
      <PaymentTabBar activeTab={activeTab} onTabChange={onTabChange} inline />
    </div>

    <div className="flex flex-col gap-4 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      {showPeriod ? (
        <PaymentPeriodBar
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onMonthChange={onMonthChange}
          onYearChange={onYearChange}
          years={years}
        />
      ) : (
        <p className="text-sm text-gray-500">{TAB_SUBTITLES[activeTab]}</p>
      )}
      <div className="flex flex-wrap items-center gap-3 sm:ml-auto" data-tour="payroll-actions">
        {actions}
      </div>
    </div>

    <div className="px-4 py-3 sm:px-5">
      <PaymentFilterBar
        activeTab={activeTab}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        typeFilter={typeFilter}
        onTypeFilterChange={onTypeFilterChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        paymentStatusFilter={paymentStatusFilter}
        onPaymentStatusFilterChange={onPaymentStatusFilterChange}
        bonusStatusFilter={bonusStatusFilter}
        onBonusStatusFilterChange={onBonusStatusFilterChange}
        balanceFilter={balanceFilter}
        onBalanceFilterChange={onBalanceFilterChange}
        onClearFilters={onClearFilters}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  </div>
  );
};

export default PaymentToolbar;
