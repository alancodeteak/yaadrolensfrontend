import DashboardWidgetCard from '../../dashboard/DashboardWidgetCard/DashboardWidgetCard';

const ACCENT = {
  blue: '#007AFF',
  green: '#34C759',
  orange: '#FF9500',
  purple: '#5856D6',
};

const formatCurrency = (value) =>
  `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const SalaryStatsRow = ({ stats, loading }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" data-tour="salary-stats">
    <DashboardWidgetCard
      title="Workforce"
      loading={loading}
      stats={[
        { label: 'Total employees', value: stats.total, accent: ACCENT.blue },
        { label: 'Salary set', value: stats.salarySet, accent: ACCENT.green },
      ]}
    />
    <DashboardWidgetCard
      title="Coverage"
      loading={loading}
      stats={[
        { label: 'Not set', value: stats.unset, accent: ACCENT.orange },
        {
          label: 'Coverage',
          value: stats.total ? `${Math.round((stats.salarySet / stats.total) * 100)}%` : '—',
          accent: ACCENT.purple,
        },
      ]}
    />
    <DashboardWidgetCard
      title="Monthly payroll"
      loading={loading}
      className="sm:col-span-2 xl:col-span-2"
      stats={[
        { label: 'Total monthly', value: formatCurrency(stats.totalMonthly), accent: ACCENT.blue },
        {
          label: 'Active with salary',
          value: stats.activeWithSalary,
          accent: ACCENT.green,
        },
      ]}
    />
  </div>
);

export default SalaryStatsRow;
