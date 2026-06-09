import { useMemo } from 'react';
import clsx from 'clsx';
import Chart from 'react-apexcharts';
import { Users } from 'lucide-react';
import { USE_DUMMY_ANALYTICS, DUMMY_MONTHLY_ROWS } from './analyticsDummy';

const PANEL =
  'rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]';

const SampleBadge = () => (
  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-medium text-amber-800">
    Sample data
  </span>
);

const Panel = ({ title, subtitle, children, showSample, tourId }) => (
  <div className={PANEL} data-tour={tourId} data-info={tourId}>
    <div className="border-b border-gray-100 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        {showSample && <SampleBadge />}
      </div>
      {subtitle && <p className="text-[11px] text-gray-500">{subtitle}</p>}
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const chartBase = {
  chart: { toolbar: { show: false }, background: 'transparent', fontFamily: 'inherit' },
  grid: { borderColor: '#F3F4F6', strokeDashArray: 4 },
  dataLabels: { enabled: false },
  tooltip: { theme: 'light', style: { fontSize: '11px' } },
};

const TH = 'px-4 py-3 text-left text-xs font-medium text-gray-500 first:pl-5 last:pr-5';
const TD = 'px-4 py-3 text-sm text-gray-900 first:pl-5 last:pr-5';

function hasMonthlyRows(rows) {
  return (rows || []).length > 0;
}

const AttendanceAnalyticsCharts = ({ monthlyRows = [], loading = false }) => {
  const useDummyRows = USE_DUMMY_ANALYTICS && !loading && !hasMonthlyRows(monthlyRows);
  const effectiveRows = useDummyRows ? DUMMY_MONTHLY_ROWS : monthlyRows;

  const topLate = useMemo(
    () =>
      [...effectiveRows]
        .sort((a, b) => (b.late_count || 0) - (a.late_count || 0))
        .slice(0, 8),
    [effectiveRows]
  );

  const topHours = useMemo(
    () =>
      [...effectiveRows]
        .sort((a, b) => (b.total_hours || 0) - (a.total_hours || 0))
        .slice(0, 8),
    [effectiveRows]
  );

  const sortedTableRows = useMemo(
    () =>
      [...effectiveRows].sort((a, b) => (b.late_count || 0) - (a.late_count || 0)),
    [effectiveRows]
  );

  const horizontalBarOptions = (categories, color, formatter) => ({
    ...chartBase,
    chart: { ...chartBase.chart, type: 'bar', height: 240 },
    plotOptions: { bar: { borderRadius: 6, horizontal: true, barHeight: '55%' } },
    colors: [color],
    xaxis: {
      categories,
      labels: { style: { colors: '#9CA3AF', fontSize: '10px' } },
    },
    yaxis: { labels: { style: { colors: '#9CA3AF', fontSize: '10px' } } },
    tooltip: {
      ...chartBase.tooltip,
      y: { formatter },
    },
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Top late arrivals" subtitle="This month" showSample={useDummyRows} tourId="top-late">
          {topLate.length === 0 ? (
            <p className="py-10 text-center text-xs text-gray-500">No employee data</p>
          ) : (
            <Chart
              type="bar"
              height={240}
              options={horizontalBarOptions(
                topLate.map((r) => r.name),
                '#FF9500',
                (val) => `${val} late`
              )}
              series={[{ name: 'Late', data: topLate.map((r) => r.late_count || 0) }]}
            />
          )}
        </Panel>

        <Panel
          title="Hours worked"
          subtitle="Top employees this month"
          showSample={useDummyRows}
          tourId="hours-worked"
        >
          {topHours.length === 0 ? (
            <p className="py-10 text-center text-xs text-gray-500">No employee data</p>
          ) : (
            <Chart
              type="bar"
              height={240}
              options={horizontalBarOptions(
                topHours.map((r) => r.name),
                '#5856D6',
                (val) => `${val}h`
              )}
              series={[{ name: 'Hours', data: topHours.map((r) => Number(r.total_hours || 0)) }]}
            />
          )}
        </Panel>
      </div>

      <div className={PANEL} data-tour="employee-table" data-info="employee-table">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Employee summary</h2>
              <p className="text-[11px] text-gray-500">
                {sortedTableRows.length} {sortedTableRows.length === 1 ? 'employee' : 'employees'}
              </p>
            </div>
            {useDummyRows && <SampleBadge />}
          </div>
        </div>

        {sortedTableRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
              <Users className="h-6 w-6 text-gray-400" strokeWidth={1.75} />
            </div>
            <p className="text-sm font-medium text-gray-900">No monthly records</p>
            <p className="mt-1 text-xs text-gray-500">Attendance data will appear here once recorded.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className={clsx(TH, 'min-w-36')}>Name</th>
                  <th className={TH}>Days present</th>
                  <th className={TH}>Late</th>
                  <th className={TH}>Hours</th>
                  <th className={TH}>Incomplete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedTableRows.map((row) => (
                  <tr key={row.employee_id} className="transition-colors hover:bg-gray-50/80">
                    <td className={TD}>
                      <p className="truncate text-sm font-semibold text-gray-900">{row.name}</p>
                      <p className="truncate text-xs text-gray-500">{row.employee_code}</p>
                    </td>
                    <td className={clsx(TD, 'tabular-nums')}>{row.days_present ?? 0}</td>
                    <td className={TD}>
                      <span
                        className={clsx(
                          'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                          (row.late_count || 0) > 0
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {row.late_count ?? 0}
                      </span>
                    </td>
                    <td className={clsx(TD, 'tabular-nums text-gray-700')}>
                      {Number(row.total_hours || 0).toFixed(1)}
                    </td>
                    <td className={clsx(TD, 'tabular-nums text-gray-700')}>
                      {row.incomplete_days ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceAnalyticsCharts;
