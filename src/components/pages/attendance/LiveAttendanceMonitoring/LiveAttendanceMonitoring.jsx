import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Search } from 'lucide-react';
import {
  ATTENDANCE_GUIDE_STEPS_BY_LANG,
  ATTENDANCE_PAGE_LABELS,
  DashboardDatePicker,
  LoadingScreen,
  PageInfoOverlay,
  PageTourButtons,
  dashboardToast,
  usePageTour,
} from '../../../common';
import {
  DASHBOARD_ACCENTS,
  DASHBOARD_BTN_PRIMARY,
  DASHBOARD_BTN_SECONDARY,
  DASHBOARD_PANEL,
} from '../../dashboard/dashboardTheme';
import { DashboardWidgetCard, RecentActivityFeed } from '../../dashboard';
import LiveAttendanceInsights from '../LiveAttendanceInsights';
import ManualPunchConfirmModal from '../ManualPunchConfirmModal';
import LiveAttendanceLiveClock from './LiveAttendanceLiveClock';
import LiveAttendanceEmployeeSection from './LiveAttendanceEmployeeSection';
import {
  useGetDailySummaryQuery,
  useManualPunchMutation,
} from '../../../../store/api/attendanceApi';
import { useGetSettingsQuery } from '../../../../store/api/settingsApi';
import {
  isLiveOnSiteStatus,
  mapDailyRowToLiveEmployee,
  orgToday,
  transformDailyRowsToLogs,
} from '../../../../store/api/transforms';
import {
  USE_DUMMY_LIVE_ATTENDANCE,
  DUMMY_SUMMARY,
  DUMMY_LIVE_ACTIVITIES,
} from '../liveAttendanceDummy';

const inputClass =
  'rounded-xl border border-gray-200/60 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20';

const STATUS_BADGE = {
  Present: 'bg-emerald-100 text-emerald-700',
  'Present (Late)': 'bg-orange-100 text-orange-700',
  Absent: 'bg-gray-100 text-gray-600',
  'Scheduled off': 'bg-violet-100 text-violet-700',
  'Clocked Out': 'bg-blue-100 text-blue-700',
  'Clocked Out (Late)': 'bg-orange-100 text-orange-800',
};

const STATUS_OPTIONS = [
  'All Status',
  'Present',
  'Present (Late)',
  'Absent',
  'Scheduled off',
  'Clocked Out',
  'Clocked Out (Late)',
];

const EMPTY_ROWS = [];

const LiveAttendanceMonitoring = () => {
  const navigate = useNavigate();
  const { infoOpen, startTutorial, startInfo, closeInfo, steps, pageLabel, language } = usePageTour(
    ATTENDANCE_GUIDE_STEPS_BY_LANG,
    'attendance_tour_completed',
    ATTENDANCE_PAGE_LABELS
  );
  const { data: settings } = useGetSettingsQuery();
  const orgTimezone = settings?.timezone || 'Asia/Kolkata';
  const todayKey = orgToday(orgTimezone);
  const manualAttendanceEnabled = Boolean(settings?.manual_attendance_enabled);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedDay, setSelectedDay] = useState(todayKey);
  const [manualPunchTarget, setManualPunchTarget] = useState(null);
  const [manualPunch] = useManualPunchMutation();

  // Align default date with org timezone once settings load (without overriding a manual pick).
  useEffect(() => {
    if (!settings?.timezone) return;
    setSelectedDay((prev) => {
      const orgDay = orgToday(settings.timezone);
      // Only auto-correct if still on the previous default "today" guess.
      if (prev === orgDay) return prev;
      const utcGuess = new Date().toISOString().split('T')[0];
      if (prev === utcGuess && utcGuess !== orgDay) return orgDay;
      return prev;
    });
  }, [settings?.timezone]);

  const isToday = selectedDay === todayKey;

  const {
    data: dailyData,
    isLoading: dailyLoading,
    isFetching: dailyFetching,
    error: dailyError,
    refetch,
  } = useGetDailySummaryQuery({ date: selectedDay }, { pollingInterval: isToday ? 30000 : 0 });

  const baseEmployees = useMemo(
    () => (dailyData?.rows || []).map((row) => mapDailyRowToLiveEmployee(row, null)),
    [dailyData]
  );

  const dailyRows = useMemo(() => dailyData?.rows ?? EMPTY_ROWS, [dailyData?.rows]);

  const shiftWarningsToastKeyRef = useRef('');

  useEffect(() => {
    if (dailyLoading || !dailyData?.rows?.length) return;

    const flagged = dailyData.rows
      .filter((row) => Array.isArray(row.shift_warnings) && row.shift_warnings.length > 0)
      .map((row) => ({
        id: row.employee_id,
        name: row.employee_name || row.name || 'Employee',
        warnings: row.shift_warnings,
      }));

    if (!flagged.length) {
      shiftWarningsToastKeyRef.current = '';
      return;
    }

    const toastKey = `${selectedDay}:${flagged.map((item) => item.id).sort().join(',')}`;
    if (shiftWarningsToastKeyRef.current === toastKey) return;
    shiftWarningsToastKeyRef.current = toastKey;

    const preview = flagged.slice(0, 4).map((item) => {
      const detail = item.warnings.map((warning) => warning.message).join('; ');
      return `• ${item.name} — ${detail}`;
    });
    const overflow =
      flagged.length > 4 ? `\n…and ${flagged.length - 4} more employee${flagged.length - 4 === 1 ? '' : 's'}` : '';

    dashboardToast.warning(
      `${preview.join('\n')}${overflow}`,
      `Shift schedule alerts (${flagged.length})`
    );
  }, [dailyData, dailyLoading, selectedDay]);

  const realSummaryData = useMemo(() => {
    if (!baseEmployees.length) {
      return {
        currentlyPresent: 0,
        currentlyAbsent: 0,
        lateArrivalsToday: 0,
        totalEmployees: 0,
        presentRate: '0.0%',
      };
    }
    const currentlyPresent = baseEmployees.filter((emp) => isLiveOnSiteStatus(emp.status)).length;
    const totalEmployees = baseEmployees.length;
    return {
      // On-site only: clocked in, not yet clocked out (includes late arrivals still present).
      currentlyPresent,
      currentlyAbsent: baseEmployees.filter((emp) => emp.status === 'Absent').length,
      lateArrivalsToday:
        dailyData?.late_count ??
        (dailyData?.rows || []).filter((row) => row.attendance_status === 'late').length,
      totalEmployees,
      presentRate: `${((currentlyPresent / totalEmployees) * 100).toFixed(1)}%`,
    };
  }, [baseEmployees, dailyData]);

  const useDummyTop = USE_DUMMY_LIVE_ATTENDANCE && realSummaryData.totalEmployees === 0;
  const summaryData = useDummyTop
    ? {
        ...DUMMY_SUMMARY,
        presentRate: `${(
          (DUMMY_SUMMARY.currentlyPresent / Math.max(DUMMY_SUMMARY.totalEmployees, 1)) *
          100
        ).toFixed(1)}%`,
      }
    : realSummaryData;

  const realRecentActivities = useMemo(() => {
    const logs = transformDailyRowsToLogs({ rows: dailyData?.rows || [] }, 30);
    return logs.map((log) => ({
      id: log.id,
      name: log.employee_name,
      type: log.type,
      late: Boolean(log.late),
      event:
        log.type === 'IN'
          ? log.late
            ? 'Clocked in (late)'
            : 'Clocked in'
          : 'Clocked out',
      time: new Date(log.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      avatar: log.profilePhotoUrl || log.photo || log.avatar,
    }));
  }, [dailyData]);

  const recentActivities = useDummyTop ? DUMMY_LIVE_ACTIVITIES : realRecentActivities;

  const formatSelectedDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All Status');
  };

  const kpiTitle = useDummyTop
    ? 'Day summary · sample'
    : isToday
      ? 'Today'
      : 'Day summary';

  const activityTitle = isToday ? 'Live activity' : 'Activity';
  const activitySubtitle = useDummyTop
    ? 'Sample clock in / out events'
    : isToday
      ? 'Clock in / out events today'
      : `Clock in / out for ${formatSelectedDate(selectedDay)}`;

  const openAttendanceReport = useCallback(
    (employeeId) => {
      navigate(`/admin/employees/${employeeId}/attendance-report`);
    },
    [navigate]
  );

  const openManualPunch = useCallback((employee, action, event) => {
    event.stopPropagation();
    setManualPunchTarget({ employee, action, openedAt: Date.now() });
  }, []);

  const handleManualPunchConfirm = async ({ employee_id, action, confirmation, punch_time }) => {
    const result = await manualPunch({ employee_id, action, confirmation, punch_time }).unwrap();
    dashboardToast.success(
      result?.message || `Manual ${action === 'clock_in' ? 'clock in' : 'clock out'} recorded`,
      'Manual attendance'
    );
    setManualPunchTarget(null);
    refetch();
  };

  if (dailyLoading && !dailyData) {
    return <LoadingScreen message="Loading attendance data..." />;
  }

  if (dailyError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>Could not load attendance for this date. Please try again.</p>
          <button type="button" onClick={() => refetch()} className={`${DASHBOARD_BTN_PRIMARY} mt-3`}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-gray-900">Live attendance</h1>
          <p className="mt-1 text-sm text-gray-500">
            {formatSelectedDate(selectedDay)}
            <LiveAttendanceLiveClock active={isToday} />
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
          {isToday && (
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Live updates
            </div>
          )}
          <div
            className={clsx(
              DASHBOARD_PANEL,
              'flex w-full flex-col gap-3 px-3 py-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center'
            )}
            data-tour="date-refresh"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-none">
              <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                Date
              </span>
              <DashboardDatePicker
                id="attendance-date"
                label="Attendance date"
                value={selectedDay}
                onChange={setSelectedDay}
                maxDate={todayKey}
              />
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className={clsx(DASHBOARD_BTN_SECONDARY, 'min-h-11 w-full justify-center sm:min-h-0 sm:w-auto')}
            >
              <RefreshCw
                className={clsx('h-4 w-4', dailyFetching && 'animate-spin')}
                strokeWidth={2}
              />
              Refresh
            </button>
          </div>
          <PageTourButtons onTutorial={startTutorial} onInfo={startInfo} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-stretch">
        {/* On mobile: expand with page scroll; on lg match Today card height */}
        <div data-tour="live-activity" className="min-h-0 lg:overflow-hidden">
          <RecentActivityFeed
            activities={recentActivities}
            loading={dailyFetching && !useDummyTop}
            useSampleData={useDummyTop}
            showViewAll={false}
            title={activityTitle}
            subtitle={activitySubtitle}
            className="h-full min-h-[9.5rem]"
          />
        </div>

        <div data-tour="today-kpis" className="h-full">
          <DashboardWidgetCard
            title={kpiTitle}
            compact
            stats={[
              { label: 'Present', value: summaryData.currentlyPresent, accent: DASHBOARD_ACCENTS.green },
              { label: 'Absent', value: summaryData.currentlyAbsent, accent: DASHBOARD_ACCENTS.red },
              { label: 'Late', value: summaryData.lateArrivalsToday, accent: DASHBOARD_ACCENTS.orange },
              {
                label: 'Present rate',
                value: summaryData.presentRate,
                accent: DASHBOARD_ACCENTS.purple,
              },
            ]}
          />
        </div>
      </div>

      <div className={clsx(DASHBOARD_PANEL, 'p-4')} data-tour="filters">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="relative min-w-0 flex-1 sm:min-w-[200px] sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              strokeWidth={2}
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search name or code…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={clsx(inputClass, 'w-full pl-9')}
            />
          </div>

          <label className="flex min-w-0 flex-col gap-1 sm:w-auto">
            <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              Status
            </span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={clsx(inputClass, 'w-full sm:min-w-[160px]')}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <LiveAttendanceEmployeeSection
        dailyData={dailyData}
        isToday={isToday}
        dailyFetching={dailyFetching}
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        manualAttendanceEnabled={manualAttendanceEnabled}
        statusBadgeMap={STATUS_BADGE}
        onOpenReport={openAttendanceReport}
        onManualPunch={openManualPunch}
        onClearFilters={clearFilters}
      />

      <div data-tour="hourly-chart">
        <LiveAttendanceInsights
          rows={dailyRows}
          selectedDay={selectedDay}
          orgWorkStartTime={settings?.work_start_time}
          orgWorkEndTime={settings?.work_end_time}
        />
      </div>

      <ManualPunchConfirmModal
        key={
          manualPunchTarget
            ? `${manualPunchTarget.employee.id}-${manualPunchTarget.action}-${manualPunchTarget.openedAt}`
            : 'closed'
        }
        isOpen={Boolean(manualPunchTarget)}
        employee={manualPunchTarget?.employee}
        action={manualPunchTarget?.action}
        timezone={orgTimezone}
        onClose={() => setManualPunchTarget(null)}
        onConfirm={handleManualPunchConfirm}
      />

      {infoOpen && (
        <PageInfoOverlay
          steps={steps}
          onClose={closeInfo}
          pageLabel={pageLabel || 'Live Attendance'}
          language={language}
        />
      )}
    </div>
  );
};

export default LiveAttendanceMonitoring;
