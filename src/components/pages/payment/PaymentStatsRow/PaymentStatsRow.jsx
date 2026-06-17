import DashboardWidgetCard from '../../dashboard/DashboardWidgetCard/DashboardWidgetCard';
import { DASHBOARD_ACCENTS } from '../../dashboard/dashboardTheme';
import { formatCurrency } from '../../../../utils/helpers';

const resolvePeriodStats = (periodStats, summary = {}) =>
  periodStats ?? {
    paidTotal: summary.paid_this_month ?? 0,
    paidCount: summary.payment_count_this_month ?? 0,
    pendingSalaryCount: summary.pending_salary_count ?? 0,
  };

const PaymentStatsRow = ({ summary = {}, periodStats, periodLabel, loading }) => {
  const stats = resolvePeriodStats(periodStats, summary);

  return (
  <div
    className="grid min-h-[9.5rem] grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:items-stretch [contain:layout]"
    data-tour="payroll-stats"
  >
    <DashboardWidgetCard
      title={periodLabel || 'This month'}
      loading={loading}
      compact
      stats={[
        {
          label: 'Paid out',
          value: formatCurrency(stats.paidTotal, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          accent: DASHBOARD_ACCENTS.blue,
        },
        {
          label: 'Payments',
          value: stats.paidCount,
          accent: DASHBOARD_ACCENTS.green,
        },
      ]}
    />
    <DashboardWidgetCard
      title="Outstanding"
      loading={loading}
      compact
      stats={[
        {
          label: 'Salary due',
          value: formatCurrency(summary.unpaid_salary_total ?? 0, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          accent: DASHBOARD_ACCENTS.orange,
        },
        {
          label: 'Advances',
          value: formatCurrency(summary.outstanding_advance_total ?? 0, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }),
          accent: DASHBOARD_ACCENTS.purple,
        },
      ]}
    />
    <DashboardWidgetCard
      title="Pending"
      loading={loading}
      compact
      stats={[
        {
          label: 'Period salaries',
          value: stats.pendingSalaryCount,
          accent:
            stats.pendingSalaryCount > 0
              ? DASHBOARD_ACCENTS.orange
              : DASHBOARD_ACCENTS.gray,
        },
        {
          label: 'Advance requests',
          value: summary.pending_advance_count ?? 0,
          accent:
            (summary.pending_advance_count ?? 0) > 0
              ? DASHBOARD_ACCENTS.orange
              : DASHBOARD_ACCENTS.green,
        },
      ]}
    />
  </div>
  );
};

export default PaymentStatsRow;
