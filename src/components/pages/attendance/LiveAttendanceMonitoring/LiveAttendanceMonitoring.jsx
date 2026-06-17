import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Search, Users } from 'lucide-react';
import {
  ATTENDANCE_GUIDE_STEPS,
  DashboardDatePicker,
  LoadingScreen,
  PageInfoOverlay,
  PageTourButtons,
  UserAvatar,
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
import { useGetDailySummaryQuery } from '../../../../store/api/attendanceApi';
import {
  mapDailyRowToLiveEmployee,
  transformDailyRowsToLogs,
} from '../../../../store/api/transforms';
import {
  USE_DUMMY_LIVE_ATTENDANCE,
  DUMMY_SUMMARY,
  DUMMY_LIVE_ACTIVITIES,
} from '../liveAttendanceDummy';

const today = () => new Date().toISOString().split('T')[0];

const TH =
  'px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wide text-gray-400 first:pl-5 last:pr-5';

const TD = 'px-4 py-3.5 text-sm text-gray-900 first:pl-5 last:pr-5';

const inputClass =
  'rounded-xl border border-gray-200/60 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20';

const STATUS_BADGE = {
  Present: 'bg-emerald-100 text-emerald-700',
  'Present (Late)': 'bg-orange-100 text-orange-700',
  Absent: 'bg-gray-100 text-gray-600',
  'Clocked Out': 'bg-blue-100 text-blue-700',
};

const STATUS_OPTIONS = ['All Status', 'Present', 'Present (Late)', 'Absent', 'Clocked Out'];

const LiveAttendanceMonitoring = () => {
  const navigate = useNavigate();
  const { infoOpen, startTutorial, startInfo, closeInfo } = usePageTour(
    ATTENDANCE_GUIDE_STEPS,
    'attendance_tour_completed'
  );
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedDay, setSelectedDay] = useState(today());

  const isToday = selectedDay === today();

  const {
    data: dailyData,
    isLoading: dailyLoading,
    isFetching: dailyFetching,
    error: dailyError,
    refetch,
  } = useGetDailySummaryQuery({ date: selectedDay }, { pollingInterval: isToday ? 30000 : 0 });

  useEffect(() => {
    if (!isToday) return undefined;
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isToday]);

  const employees = useMemo(
    () => (dailyData?.rows || []).map(mapDailyRowToLiveEmployee),
    [dailyData]
  );

  const realSummaryData = useMemo(() => {
    if (!employees.length) {
      return { currentlyPresent: 0, currentlyAbsent: 0, lateArrivalsToday: 0, totalEmployees: 0 };
    }
    return {
      currentlyPresent: employees.filter(
        (emp) => emp.status === 'Present' || emp.status === 'Present (Late)'
      ).length,
      currentlyAbsent: employees.filter((emp) => emp.status === 'Absent').length,
      lateArrivalsToday: employees.filter((emp) => emp.status === 'Present (Late)').length,
      totalEmployees: employees.length,
    };
  }, [employees]);

  const useDummyTop = USE_DUMMY_LIVE_ATTENDANCE && realSummaryData.totalEmployees === 0;
  const summaryData = useDummyTop ? DUMMY_SUMMARY : realSummaryData;

  const realRecentActivities = useMemo(() => {
    const logs = transformDailyRowsToLogs({ rows: dailyData?.rows || [] });
    return logs.slice(0, 10).map((log) => ({
      id: log.id,
      name: log.employee_name,
      type: log.type,
      event: log.type === 'IN' ? 'Clocked in' : 'Clocked out',
      time: new Date(log.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      avatar: log.profilePhotoUrl || log.photo || log.avatar,
    }));
  }, [dailyData]);

  const recentActivities = useDummyTop ? DUMMY_LIVE_ACTIVITIES : realRecentActivities;

  const filteredEmployees = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return employees
      .filter((employee) => {
        const matchesSearch =
          !term ||
          employee.name.toLowerCase().includes(term) ||
          String(employee.employee_code || '').toLowerCase().includes(term);
        const matchesStatus =
          selectedStatus === 'All Status' || employee.status === selectedStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [employees, searchTerm, selectedStatus]);

  const formatClock = (date) =>
    date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

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

  const openAttendanceReport = (employeeId) => {
    navigate(`/admin/employees/${employeeId}/attendance-report`);
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Live attendance</h1>
          <p className="mt-1 text-sm text-gray-500">
            {formatSelectedDate(selectedDay)}
            {isToday ? ` · ${formatClock(currentTime)}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {isToday && (
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Live updates
            </div>
          )}
          <PageTourButtons onTutorial={startTutorial} onInfo={startInfo} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:items-stretch">
        <div data-tour="live-activity">
          <RecentActivityFeed
            activities={recentActivities}
            loading={dailyFetching && !useDummyTop}
            useSampleData={useDummyTop}
            showViewAll={false}
            title={activityTitle}
            subtitle={activitySubtitle}
            className="min-h-[200px] lg:col-span-2"
          />
        </div>

        <div data-tour="today-kpis">
          <DashboardWidgetCard
            title={kpiTitle}
            compact
            stats={[
              { label: 'Present', value: summaryData.currentlyPresent, accent: DASHBOARD_ACCENTS.green },
              { label: 'Absent', value: summaryData.currentlyAbsent, accent: DASHBOARD_ACCENTS.red },
              { label: 'Late', value: summaryData.lateArrivalsToday, accent: DASHBOARD_ACCENTS.orange },
              { label: 'Total', value: summaryData.totalEmployees, accent: DASHBOARD_ACCENTS.blue },
            ]}
          />
        </div>
      </div>

      <div className={clsx(DASHBOARD_PANEL, 'p-4')} data-tour="filters">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                Date
              </span>
              <DashboardDatePicker
                id="attendance-date"
                label="Attendance date"
                value={selectedDay}
                onChange={setSelectedDay}
                maxDate={today()}
              />
            </div>

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

          <button type="button" onClick={() => refetch()} className={DASHBOARD_BTN_SECONDARY}>
            <RefreshCw className={clsx('h-4 w-4', dailyFetching && 'animate-spin')} strokeWidth={2} />
            Refresh
          </button>
        </div>
      </div>

      <div className={clsx(DASHBOARD_PANEL, 'relative overflow-hidden')} data-tour="employee-table">
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-900">Employee status</h2>
          <p className="text-[11px] text-gray-500">
            {filteredEmployees.length} of {employees.length} employees
            {dailyFetching ? ' · Updating…' : ''}
          </p>
        </div>

        {filteredEmployees.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
              <Users className="h-6 w-6 text-gray-400" strokeWidth={1.75} />
            </div>
            <p className="text-sm font-medium text-gray-900">No employees found</p>
            <p className="mt-1 max-w-sm text-xs text-gray-500">
              {searchTerm || selectedStatus !== 'All Status'
                ? 'Try adjusting your search or filters.'
                : 'No employee data for this date.'}
            </p>
            {(searchTerm || selectedStatus !== 'All Status') && (
              <button type="button" onClick={clearFilters} className={`${DASHBOARD_BTN_PRIMARY} mt-3`}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div
            className={clsx(
              'overflow-x-auto transition-opacity duration-200',
              dailyFetching && 'pointer-events-none opacity-60'
            )}
          >
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className={clsx(TH, 'min-w-36')}>Name</th>
                  <th className={clsx(TH, 'hidden md:table-cell')}>Department</th>
                  <th className={TH}>Status</th>
                  <th className={clsx(TH, 'hidden sm:table-cell')}>Clock in</th>
                  <th className={clsx(TH, 'hidden lg:table-cell')}>Last seen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="cursor-pointer transition-colors hover:bg-gray-50/80"
                    onClick={() => openAttendanceReport(employee.id)}
                    title="View attendance report"
                  >
                    <td className={TD}>
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          className="h-9 w-9 shrink-0 rounded-full ring-1 ring-gray-100"
                          src={employee.profilePhotoUrl || employee.photo || employee.avatar}
                          name={employee.name}
                          seed={employee.id}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {employee.name}
                          </p>
                          {employee.employee_code && (
                            <p className="truncate text-xs text-gray-500 md:hidden">
                              {employee.employee_code}
                            </p>
                          )}
                          <p className="truncate text-xs text-gray-500 sm:hidden">
                            {employee.clockIn || '—'}
                          </p>
                          <p className="truncate text-xs text-gray-500 md:hidden">
                            {employee.department || '—'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className={clsx(TD, 'hidden md:table-cell')}>
                      <span className="truncate text-gray-700">{employee.department || '—'}</span>
                    </td>
                    <td className={TD}>
                      <span
                        className={clsx(
                          'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                          STATUS_BADGE[employee.status] || 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className={clsx(TD, 'hidden sm:table-cell tabular-nums text-gray-700')}>
                      {employee.clockIn || '—'}
                    </td>
                    <td className={clsx(TD, 'hidden lg:table-cell text-gray-700')}>
                      {employee.lastSeen || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div data-tour="hourly-chart">
        <LiveAttendanceInsights rows={dailyData?.rows || []} selectedDay={selectedDay} />
      </div>

      {infoOpen && (
        <PageInfoOverlay
          steps={ATTENDANCE_GUIDE_STEPS}
          onClose={closeInfo}
          pageLabel="Live Attendance"
        />
      )}
    </div>
  );
};

export default LiveAttendanceMonitoring;
