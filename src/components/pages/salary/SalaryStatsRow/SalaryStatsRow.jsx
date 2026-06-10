import DashboardWidgetCard from '../../dashboard/DashboardWidgetCard/DashboardWidgetCard';
import { DASHBOARD_ACCENTS } from '../../dashboard/dashboardTheme';

const formatCurrency = (value) =>
  `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const SalaryStatsRow = ({ stats, loading }) => {
  const avgSalary =
    stats.salarySet > 0 ? Math.round(stats.totalMonthly / stats.salarySet) : 0;

  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:items-stretch"
      data-tour="salary-stats"
    >
      <DashboardWidgetCard
        title="Employees"
        loading={loading}
        compact
        stats={[
          { label: 'Total', value: stats.total, accent: DASHBOARD_ACCENTS.blue },
          { label: 'Salary set', value: stats.salarySet, accent: DASHBOARD_ACCENTS.green },
        ]}
      />
      <DashboardWidgetCard
        title="Coverage"
        loading={loading}
        compact
        stats={[
          { label: 'Not set', value: stats.unset, accent: DASHBOARD_ACCENTS.orange },
          {
            label: 'Coverage',
            value: stats.total ? `${Math.round((stats.salarySet / stats.total) * 100)}%` : '—',
            accent: DASHBOARD_ACCENTS.purple,
          },
        ]}
      />
      <DashboardWidgetCard
        title="Monthly payroll"
        loading={loading}
        compact
        stats={[
          {
            label: 'Total monthly',
            value: formatCurrency(stats.totalMonthly),
            accent: DASHBOARD_ACCENTS.blue,
          },
          {
            label: 'Avg salary',
            value: stats.salarySet ? formatCurrency(avgSalary) : '—',
            accent: DASHBOARD_ACCENTS.purple,
          },
        ]}
      />
      <DashboardWidgetCard
        title="Active"
        loading={loading}
        compact
        stats={[
          {
            label: 'With salary',
            value: stats.activeWithSalary,
            accent: DASHBOARD_ACCENTS.green,
          },
          {
            label: 'Active total',
            value: stats.total,
            accent: DASHBOARD_ACCENTS.gray,
          },
        ]}
      />
    </div>
  );
};

export default SalaryStatsRow;
