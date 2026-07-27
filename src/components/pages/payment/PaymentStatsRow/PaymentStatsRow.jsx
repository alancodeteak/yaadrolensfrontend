import DashboardWidgetCard from '../../dashboard/DashboardWidgetCard/DashboardWidgetCard';
import { DASHBOARD_ACCENTS } from '../../dashboard/dashboardTheme';
import { formatCurrency } from '../../../../utils/helpers';

const money = (value) =>
  formatCurrency(value ?? 0, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const resolvePeriodStats = (periodStats, summary = {}) =>
  periodStats ?? {
    paidTotal: summary.paid_this_month ?? 0,
    paidCount: summary.payment_count_this_month ?? 0,
    ledgerTotal: summary.paid_this_month ?? 0,
    ledgerCount: summary.payment_count_this_month ?? 0,
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
        title={periodLabel || 'Ledger'}
        loading={loading}
        compact
        stats={[
          {
            label: 'Amount paid',
            value: money(stats.paidTotal),
            accent: DASHBOARD_ACCENTS.blue,
          },
          {
            label: 'Paid count',
            value: stats.paidCount ?? 0,
            accent: DASHBOARD_ACCENTS.green,
          },
          {
            label: 'All ledger amounts',
            value: money(stats.ledgerTotal),
            accent: DASHBOARD_ACCENTS.purple,
          },
          {
            label: 'Rows in view',
            value: stats.ledgerCount ?? 0,
            accent: DASHBOARD_ACCENTS.gray,
          },
        ]}
      />
      <DashboardWidgetCard
        title="Outstanding (org-wide)"
        loading={loading}
        compact
        stats={[
          {
            label: 'Unpaid salary',
            value: money(summary.unpaid_salary_total),
            accent: DASHBOARD_ACCENTS.orange,
          },
          {
            label: 'Open advances',
            value: money(summary.outstanding_advance_total),
            accent: DASHBOARD_ACCENTS.purple,
          },
        ]}
      />
      <DashboardWidgetCard
        title="Needs action"
        loading={loading}
        compact
        stats={[
          {
            label: 'Pending salaries (this view)',
            value: stats.pendingSalaryCount ?? 0,
            accent:
              (stats.pendingSalaryCount ?? 0) > 0
                ? DASHBOARD_ACCENTS.orange
                : DASHBOARD_ACCENTS.gray,
          },
          {
            label: 'Advance requests (org)',
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
