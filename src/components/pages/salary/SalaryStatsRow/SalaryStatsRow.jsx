import DashboardWidgetCard from '../../dashboard/DashboardWidgetCard/DashboardWidgetCard';
import { DASHBOARD_ACCENTS } from '../../dashboard/dashboardTheme';
import { formatCurrency } from '../../../../utils/helpers';

const SalaryStatsRow = ({ stats, loading, isHourly = false }) => (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 xl:items-stretch"
      data-tour="salary-stats"
    >
      <DashboardWidgetCard
        title="Employees"
        loading={loading}
        compact
        stats={[
          { label: 'Total', value: stats.total, accent: DASHBOARD_ACCENTS.blue },
          { label: 'Active', value: stats.activeCount, accent: DASHBOARD_ACCENTS.green },
        ]}
      />
      <DashboardWidgetCard
        title="Coverage"
        loading={loading}
        compact
        stats={[
          {
            label: isHourly ? 'Rate set' : 'Salary set',
            value: stats.salarySet,
            accent: DASHBOARD_ACCENTS.green,
          },
          { label: 'Not set', value: stats.unset, accent: DASHBOARD_ACCENTS.orange },
        ]}
      />
      <DashboardWidgetCard
        title={isHourly ? 'Hourly rates' : 'Monthly payroll'}
        loading={loading}
        compact
        stats={[
          {
            label: isHourly ? 'Active rates total' : 'Active total',
            value: formatCurrency(stats.totalMonthly, { maximumFractionDigits: 0 }),
            accent: DASHBOARD_ACCENTS.blue,
          },
          {
            label: isHourly ? 'Avg rate' : 'Avg salary',
            value: stats.avgActiveSalary
              ? formatCurrency(stats.avgActiveSalary, { maximumFractionDigits: 0 })
              : '—',
            accent: DASHBOARD_ACCENTS.purple,
          },
        ]}
      />
    </div>
);

export default SalaryStatsRow;
