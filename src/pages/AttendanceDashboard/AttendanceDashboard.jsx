import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  ANALYTICS_GUIDE_STEPS,
  DashboardDatePicker,
  LoadingScreen,
  PageInfoOverlay,
  PageTourButtons,
  usePageTour,
} from '../../components/common';
import {
  ActivityRingsChart,
  AttendanceMonthCalendar,
  DashboardWidgetCard,
} from '../../components/pages/dashboard';
import { AttendanceAnalyticsCharts, DailyPresenceTrend } from '../../components/pages/analytics';
import { useGetDashboardSummaryQuery } from '../../store/api';
import { useGetAttendanceStatsQuery } from '../../store/api/attendanceApi';
import {
  USE_DUMMY_ANALYTICS,
  DUMMY_MONTH_STATS,
  DUMMY_TODAY_STATS,
} from '../../components/pages/analytics/analyticsDummy';

const ACCENT = {
  blue: '#007AFF',
  green: '#34C759',
  orange: '#FF9500',
  purple: '#5856D6',
  red: '#FF3B30',
};

const today = () => new Date().toISOString().split('T')[0];

function shiftMonth(iso, delta) {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(1);
  d.setMonth(d.getMonth() + delta);
  return d.toISOString().split('T')[0];
}

function formatMonthLabel(iso) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

const AttendanceDashboard = () => {
  const [selectedDay, setSelectedDay] = useState(today());
  const heatmapRef = useRef(null);
  const [heatmapHeight, setHeatmapHeight] = useState(null);
  const { infoOpen, startTutorial, startInfo, closeInfo } = usePageTour(
    ANALYTICS_GUIDE_STEPS,
    'analytics_tour_completed'
  );

  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
    refetch,
  } = useGetDashboardSummaryQuery({ day: selectedDay });

  const { data: monthlyReport, isLoading: monthlyLoading } = useGetAttendanceStatsQuery({
    end_date: selectedDay,
  });

  const loading = summaryLoading || monthlyLoading;

  const month = summary?.month;
  const todayStats = summary?.today;
  const calendar = month?.calendar || [];
  const monthlyRows = monthlyReport?.rows || [];

  useEffect(() => {
    const el = heatmapRef.current;
    if (!el) return undefined;

    const updateHeight = () => setHeatmapHeight(el.offsetHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, [summaryLoading, month, calendar, selectedDay]);

  const useDummyMonth =
    USE_DUMMY_ANALYTICS && !loading && !month?.avg_attendance_rate && !monthlyRows.length;

  const monthKpis = useMemo(() => {
    const m = useDummyMonth ? DUMMY_MONTH_STATS : month;
    if (!m) return [];
    return [
      {
        label: 'Avg attendance',
        value: `${Number(m.avg_attendance_rate || 0).toFixed(1)}%`,
        accent: ACCENT.blue,
      },
      {
        label: 'Punctuality',
        value: `${Number(m.punctuality_rate || 0).toFixed(1)}%`,
        accent: ACCENT.green,
      },
      {
        label: 'Total hours',
        value: Number(m.total_hours || 0).toFixed(0),
        accent: ACCENT.purple,
      },
      {
        label: 'Total late',
        value: m.total_late ?? 0,
        accent: ACCENT.orange,
      },
    ];
  }, [month, useDummyMonth]);

  const snapshotKpis = useMemo(() => {
    const t = useDummyMonth ? DUMMY_TODAY_STATS : todayStats;
    if (!t) return [];
    return [
      { label: 'Present', value: t.present ?? 0, accent: ACCENT.green },
      { label: 'Absent', value: t.absent ?? 0, accent: ACCENT.red },
      { label: 'Late', value: t.late ?? 0, accent: ACCENT.orange },
      {
        label: 'Present rate',
        value: `${Number(t.present_rate || 0).toFixed(1)}%`,
        accent: ACCENT.blue,
      },
    ];
  }, [todayStats, useDummyMonth]);

  const activityRings = useMemo(() => {
    const m = useDummyMonth ? DUMMY_MONTH_STATS : month;
    const rows = monthlyRows.length ? monthlyRows : [];
    if (!m) return [];
    const hoursUtil =
      rows.length > 0
        ? Math.min(100, (Number(m.total_hours || 0) / (rows.length * 160)) * 100)
        : Number(m.avg_attendance_rate || 0);
    return [
      { label: 'Avg attendance', value: Number(m.avg_attendance_rate || 0), color: ACCENT.blue },
      { label: 'Punctuality', value: Number(m.punctuality_rate || 0), color: ACCENT.green },
      { label: 'Hours logged', value: hoursUtil, color: ACCENT.purple },
    ];
  }, [month, monthlyRows, useDummyMonth]);

  if (summaryLoading && !summary) {
    return <LoadingScreen message="Loading analytics..." />;
  }

  if (summaryError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Failed to load analytics</h3>
          <p className="mt-1 text-sm text-gray-500">Could not load dashboard summary.</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 rounded-xl bg-[#007AFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0066DD]"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500">{formatMonthLabel(selectedDay)}</p>
        </div>
        <PageTourButtons onTutorial={startTutorial} onInfo={startInfo} />
      </div>

      <div
        data-tour="month-picker"
        data-info="month-picker"
        className="rounded-2xl border border-gray-200/60 bg-white px-4 py-3 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <span className="shrink-0 text-xs font-medium text-gray-500">Month</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedDay((d) => shiftMonth(d, -1))}
              className="rounded-xl border border-gray-200/60 p-2 text-gray-600 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-colors hover:bg-gray-50"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            </button>
            <DashboardDatePicker
              id="analytics-month"
              label="Analytics month"
              value={selectedDay}
              onChange={setSelectedDay}
              maxDate={today()}
            />
            <button
              type="button"
              onClick={() => setSelectedDay((d) => shiftMonth(d, 1))}
              disabled={shiftMonth(selectedDay, 1) > today()}
              className="rounded-xl border border-gray-200/60 p-2 text-gray-600 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div data-tour="kpi-month" data-info="kpi-month">
          <DashboardWidgetCard
            title={useDummyMonth ? 'This month · sample' : 'This month'}
            stats={monthKpis}
            loading={loading}
          />
        </div>
        <div data-tour="kpi-snapshot" data-info="kpi-snapshot">
          <DashboardWidgetCard
            title={`Snapshot · ${new Date(`${selectedDay}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
            stats={snapshotKpis}
            loading={loading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div ref={heatmapRef} data-tour="heatmap" data-info="heatmap" className="h-fit">
          <AttendanceMonthCalendar
            month={month}
            calendar={calendar}
            loading={summaryLoading}
            summaryDate={summary?.date || selectedDay}
            useSampleData={false}
            title="Month heatmap"
          />
        </div>

        <div
          data-tour="month-overview"
          data-info="month-overview"
          className="flex flex-col overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
          style={heatmapHeight ? { height: heatmapHeight } : undefined}
        >
          <div className="shrink-0 border-b border-gray-100 px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-semibold text-gray-900">Month overview</h2>
              {useDummyMonth && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-medium text-amber-800">
                  Sample data
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500">Attendance, punctuality & hours</p>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center px-3 py-2">
            <ActivityRingsChart
              rings={activityRings}
              loading={loading && !useDummyMonth}
              compact
              hideTitle
            />
          </div>
        </div>

        <div data-tour="daily-trend" data-info="daily-trend">
          <DailyPresenceTrend
            calendar={calendar}
            month={month}
            summaryDate={summary?.date || selectedDay}
            loading={summaryLoading}
            panelHeight={heatmapHeight}
          />
        </div>
      </div>

      <AttendanceAnalyticsCharts monthlyRows={monthlyRows} loading={monthlyLoading} />

      {infoOpen && (
        <PageInfoOverlay
          steps={ANALYTICS_GUIDE_STEPS}
          onClose={closeInfo}
          pageLabel="Analytics"
        />
      )}
    </div>
  );
};

export default AttendanceDashboard;
