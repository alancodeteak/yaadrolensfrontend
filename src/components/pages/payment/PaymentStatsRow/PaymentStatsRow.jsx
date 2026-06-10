import DashboardWidgetCard from '../../dashboard/DashboardWidgetCard/DashboardWidgetCard';
import { DASHBOARD_ACCENTS } from '../../dashboard/dashboardTheme';

const formatCurrency = (value) =>
  `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const PaymentStatsRow = ({ summary, loading }) => {
  const avgPayment =
    summary.payment_count_this_month > 0
      ? summary.paid_this_month / summary.payment_count_this_month
      : 0;

  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:items-stretch"
      data-tour="payroll-stats"
    >
      <DashboardWidgetCard
        title="This month"
        loading={loading}
        compact
        stats={[
          {
            label: 'Paid out',
            value: formatCurrency(summary.paid_this_month),
            accent: DASHBOARD_ACCENTS.blue,
          },
          {
            label: 'Payments',
            value: summary.payment_count_this_month,
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
            value: formatCurrency(summary.unpaid_salary_total ?? 0),
            accent: DASHBOARD_ACCENTS.blue,
          },
          {
            label: 'Advances',
            value: formatCurrency(summary.outstanding_advance_total),
            accent: DASHBOARD_ACCENTS.orange,
          },
        ]}
      />
      <DashboardWidgetCard
        title="Pending"
        loading={loading}
        compact
        stats={[
          {
            label: 'Salary pending',
            value: summary.pending_salary_count ?? 0,
            accent:
              (summary.pending_salary_count ?? 0) > 0
                ? DASHBOARD_ACCENTS.orange
                : DASHBOARD_ACCENTS.gray,
          },
          {
            label: 'Advances',
            value: summary.pending_advance_count,
            accent:
              summary.pending_advance_count > 0
                ? DASHBOARD_ACCENTS.orange
                : DASHBOARD_ACCENTS.green,
          },
        ]}
      />
      <DashboardWidgetCard
        title="Averages"
        loading={loading}
        compact
        stats={[
          {
            label: 'Avg payment',
            value:
              summary.payment_count_this_month > 0
                ? formatCurrency(avgPayment)
                : '—',
            accent: DASHBOARD_ACCENTS.blue,
          },
          {
            label: 'This month',
            value: summary.payment_count_this_month,
            accent: DASHBOARD_ACCENTS.gray,
          },
        ]}
      />
    </div>
  );
};

export default PaymentStatsRow;
