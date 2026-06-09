import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Chart from 'react-apexcharts';
import clsx from 'clsx';
import { USE_DUMMY_ANALYTICS, buildDummyCalendar } from './analyticsDummy';

const PANEL =
  'rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]';

const SCROLL_STEP = 140;
const MIN_BAR_WIDTH = 28;

const chartBase = {
  chart: { toolbar: { show: false }, background: 'transparent', fontFamily: 'inherit' },
  grid: { borderColor: '#F3F4F6', strokeDashArray: 4 },
  dataLabels: { enabled: false },
  tooltip: { theme: 'light', style: { fontSize: '11px' } },
};

function normalizeDateKey(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}

function hasCalendarData(calendar) {
  return (calendar || []).some(
    (day) => day.day_type === 'all_present' || day.day_type === 'some_absent'
  );
}

const DailyPresenceTrend = ({
  calendar = [],
  month,
  summaryDate,
  loading = false,
  panelHeight,
  className,
}) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const useDummy =
    USE_DUMMY_ANALYTICS && !loading && !hasCalendarData(calendar) && month?.year;

  const effectiveCalendar = useMemo(() => {
    if (useDummy) {
      return buildDummyCalendar(month.year, month.month, normalizeDateKey(summaryDate));
    }
    return calendar;
  }, [calendar, useDummy, month, summaryDate]);

  const trendData = useMemo(() => {
    const pastDays = (effectiveCalendar || []).filter(
      (day) => day.day_type === 'all_present' || day.day_type === 'some_absent'
    );
    return pastDays.map((day) => {
      const d = new Date(`${normalizeDateKey(day.date)}T12:00:00`);
      return {
        label: d.getDate().toString(),
        present: day.present ?? 0,
        absent: day.absent ?? 0,
      };
    });
  }, [effectiveCalendar]);

  const chartHeight = panelHeight ? Math.max(120, panelHeight - 108) : 220;
  const chartWidth = Math.max(280, trendData.length * MIN_BAR_WIDTH);
  const showScrollControls = trendData.length > 10;

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, [showScrollControls]);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return undefined;

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(el);
    return () => observer.disconnect();
  }, [trendData.length, chartWidth, chartHeight, updateScrollState]);

  const scrollChart = (delta) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const chartOptions = useMemo(
    () => ({
      ...chartBase,
      chart: { ...chartBase.chart, type: 'bar', height: chartHeight, stacked: true },
      plotOptions: { bar: { borderRadius: 4, columnWidth: '70%' } },
      colors: ['#34C759', '#FF9500'],
      xaxis: {
        categories: trendData.map((d) => d.label),
        labels: {
          style: { colors: '#9CA3AF', fontSize: '10px' },
          rotate: 0,
          hideOverlappingLabels: false,
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: { style: { colors: '#9CA3AF', fontSize: '10px' } },
        tickAmount: 4,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        fontSize: '10px',
        markers: { size: 5 },
      },
    }),
    [trendData, chartHeight]
  );

  const scrollButtonClass = (disabled) =>
    clsx(
      'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-gray-200/80 bg-white text-gray-600 shadow-sm transition-colors',
      disabled
        ? 'cursor-not-allowed opacity-35'
        : 'hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900'
    );

  return (
    <div
      className={clsx(PANEL, 'flex flex-col overflow-hidden', className)}
      style={panelHeight ? { height: panelHeight } : undefined}
    >
      <div className="shrink-0 border-b border-gray-100 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-900">Daily trend</h2>
          {useDummy && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-medium text-amber-800">
              Sample data
            </span>
          )}
        </div>
        <p className="text-[11px] text-gray-500">Present vs absent by day</p>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-center px-2 py-2">
        {trendData.length === 0 ? (
          <p className="w-full py-8 text-center text-xs text-gray-500">No data for this month</p>
        ) : (
          <div className="flex min-h-0 flex-1 items-center gap-1">
            {showScrollControls && (
              <button
                type="button"
                className={scrollButtonClass(!canScrollLeft)}
                onClick={() => scrollChart(-SCROLL_STEP)}
                disabled={!canScrollLeft}
                aria-label="Scroll chart left"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2} />
              </button>
            )}

            <div
              ref={scrollRef}
              onScroll={updateScrollState}
              className={clsx(
                'min-h-0 min-w-0 flex-1',
                showScrollControls && 'overflow-x-auto overflow-y-hidden'
              )}
              style={{ scrollbarWidth: 'thin' }}
            >
              <Chart
                type="bar"
                width={showScrollControls ? chartWidth : '100%'}
                height={chartHeight}
                options={chartOptions}
                series={[
                  { name: 'Present', data: trendData.map((d) => d.present) },
                  { name: 'Absent', data: trendData.map((d) => d.absent) },
                ]}
              />
            </div>

            {showScrollControls && (
              <button
                type="button"
                className={scrollButtonClass(!canScrollRight)}
                onClick={() => scrollChart(SCROLL_STEP)}
                disabled={!canScrollRight}
                aria-label="Scroll chart right"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyPresenceTrend;
