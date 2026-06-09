import { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { USE_DUMMY_LIVE_ATTENDANCE, DUMMY_HOURLY_COUNTS } from '../liveAttendanceDummy';

const PANEL =
  'rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]';

const WORK_HOURS = Array.from({ length: 15 }, (_, i) => i + 6);

const chartBase = {
  chart: { toolbar: { show: false }, background: 'transparent', fontFamily: 'inherit' },
  grid: { borderColor: '#F3F4F6', strokeDashArray: 4 },
  dataLabels: { enabled: false },
  tooltip: { theme: 'light', style: { fontSize: '11px' } },
};

function hasRealHourlyData(buckets) {
  return buckets.some((count) => count > 0);
}

const LiveAttendanceInsights = ({ rows = [], selectedDay }) => {
  const realHourlyCounts = useMemo(() => {
    const buckets = Array(24).fill(0);
    rows.forEach((row) => {
      if (row.clock_in) {
        buckets[new Date(row.clock_in).getHours()] += 1;
      }
    });
    return buckets;
  }, [rows]);

  const useDummyHourly = USE_DUMMY_LIVE_ATTENDANCE && !hasRealHourlyData(realHourlyCounts);
  const hourlyCounts = useDummyHourly ? DUMMY_HOURLY_COUNTS : realHourlyCounts;
  const hourlySeries = WORK_HOURS.map((h) => hourlyCounts[h]);

  const hourlyChartOptions = {
    ...chartBase,
    chart: { ...chartBase.chart, type: 'bar', height: 220 },
    plotOptions: { bar: { borderRadius: 6, columnWidth: '55%' } },
    colors: ['#007AFF'],
    xaxis: {
      categories: WORK_HOURS.map((h) => {
        const suffix = h >= 12 ? 'PM' : 'AM';
        const hour = h % 12 || 12;
        return `${hour}${suffix}`;
      }),
      labels: { style: { colors: '#9CA3AF', fontSize: '10px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: '#9CA3AF', fontSize: '10px' } },
      tickAmount: 4,
    },
  };

  return (
    <div className={PANEL}>
      <div className="border-b border-gray-100 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-900">Clock-ins by hour</h2>
          {useDummyHourly && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-medium text-amber-800">
              Sample data
            </span>
          )}
        </div>
        <p className="text-[11px] text-gray-500">
          Arrival distribution · {selectedDay || 'today'}
        </p>
      </div>
      <div className="p-4">
        <Chart
          type="bar"
          height={220}
          options={hourlyChartOptions}
          series={[{ name: 'Clock-ins', data: hourlySeries }]}
        />
      </div>
    </div>
  );
};

export default LiveAttendanceInsights;
