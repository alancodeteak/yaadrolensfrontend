import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  DASHBOARD_GUIDE_STEPS,
  PageInfoOverlay,
  PageTourButtons,
  usePageTour,
} from '../../components/common';
import { useGetDashboardSummaryQuery } from '../../store/api';
import { useGetAttendanceLogsQuery } from '../../store/api/attendanceApi';
import {
  ActivityRingsChart,
  DashboardWidgetCard,
  AttendanceMonthCalendar,
  IndiaHolidaysCard,
  RecentActivityFeed,
} from '../../components/pages/dashboard';
import { getDefaultAvatar } from '../../utils/avatar';

const ACCENT = {
  blue: '#007AFF',
  green: '#34C759',
  orange: '#FF9500',
  purple: '#5856D6',
  red: '#FF3B30',
  gray: '#8E8E93',
};

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const { infoOpen, startTutorial, startInfo, closeInfo } = usePageTour(
    DASHBOARD_GUIDE_STEPS,
    'dashboard_tour_completed'
  );
  const { data: summary, isLoading, isError } = useGetDashboardSummaryQuery({});
  const calendarRef = useRef(null);
  const [calendarHeight, setCalendarHeight] = useState(null);

  const { data: activityLogs = [], isLoading: activitiesLoading } = useGetAttendanceLogsQuery(
    { end_date: summary?.date, limit: 5 },
    { skip: !summary?.date }
  );

  useEffect(() => {
    const el = calendarRef.current;
    if (!el) return undefined;

    const updateHeight = () => setCalendarHeight(el.offsetHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isLoading, summary?.month, summary?.date]);

  const recentActivities = useMemo(
    () =>
      activityLogs.map((log) => ({
        id: log.id,
        name: log.employee_name,
        type: log.type,
        event: log.type === 'IN' ? 'Clocked in' : 'Clocked out',
        time: new Date(log.timestamp).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        avatar: getDefaultAvatar(log.id || log.employee_name),
      })),
    [activityLogs]
  );

  const activityRings = useMemo(() => {
    if (!summary) return [];
    return [
      {
        label: 'Present today',
        value: summary.today.present_rate,
        color: ACCENT.blue,
      },
      {
        label: 'Avg attendance',
        value: summary.month.avg_attendance_rate,
        color: ACCENT.purple,
      },
      {
        label: 'Punctuality',
        value: summary.month.punctuality_rate,
        color: ACCENT.green,
      },
    ];
  }, [summary]);

  const workforceStats = useMemo(() => {
    const wf = summary?.workforce;
    if (!wf) return [];
    const fullyEnrolled = wf.total_active > 0 && wf.face_enrolled === wf.total_active;
    return [
      { label: 'Active', value: wf.total_active, accent: ACCENT.blue },
      { label: 'New', value: wf.new_this_month, accent: ACCENT.purple },
      {
        label: 'Enrolled',
        value: `${wf.face_enrolled}/${wf.total_active}`,
        accent: fullyEnrolled ? ACCENT.green : ACCENT.gray,
      },
      { label: 'Depts', value: wf.department_count, accent: ACCENT.gray },
    ];
  }, [summary]);

  const todayStats = useMemo(() => {
    const t = summary?.today;
    if (!t) return [];
    return [
      { label: 'Present', value: t.present, accent: ACCENT.green, href: '/admin/attendance' },
      { label: 'Absent', value: t.absent, accent: ACCENT.red, href: '/admin/attendance' },
      { label: 'Late', value: t.late, accent: ACCENT.orange, href: '/admin/attendance' },
      {
        label: 'Present rate',
        value: `${Number(t.present_rate).toFixed(1)}%`,
        accent: ACCENT.purple,
        href: '/admin/attendance',
      },
    ];
  }, [summary]);

  const actionStats = useMemo(() => {
    const a = summary?.actions;
    if (!a) return [];
    return [
      {
        label: 'Need enroll',
        value: a.pending_face_enrollment,
        accent: a.pending_face_enrollment > 0 ? ACCENT.orange : ACCENT.gray,
        href: '/admin/employees',
      },
      {
        label: 'Profiles',
        value: a.profile_incomplete,
        accent: a.profile_incomplete > 0 ? ACCENT.orange : ACCENT.gray,
        href: '/admin/employees',
      },
      {
        label: 'Kiosk',
        value: a.kiosk_paired ? 'Paired' : 'Not paired',
        accent: a.kiosk_paired ? ACCENT.green : ACCENT.red,
        href: a.kiosk_paired ? undefined : '/admin/settings',
      },
    ];
  }, [summary]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          {summary?.date && (
            <p className="mt-1 text-sm text-gray-500">
              Summary for {summary.date}
            </p>
          )}
          {user && (
            <p className="mt-1 text-sm text-gray-600">
              Welcome back,{' '}
              <span className="font-medium">
                {user.name || user.login_id || user.organization_code}
              </span>
            </p>
          )}
        </div>
        <PageTourButtons onTutorial={startTutorial} onInfo={startInfo} />
      </div>

      {isError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Could not load dashboard summary. Please refresh or try again later.
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:items-stretch">
        <div data-tour="workforce" className="h-full">
          <DashboardWidgetCard
            title="Workforce"
            stats={workforceStats}
            loading={isLoading}
            href="/admin/employees"
            compact
          />
        </div>
        <div data-tour="today" className="h-full">
          <DashboardWidgetCard
            title="Today"
            stats={todayStats}
            loading={isLoading}
            href="/admin/attendance"
            compact
          />
        </div>
        <div data-tour="actions" className="h-full">
          <DashboardWidgetCard
            title="Actions"
            stats={actionStats}
            loading={isLoading}
            href="/admin/employees"
            compact
          />
        </div>
        <div data-tour="holidays" className="h-full">
          <IndiaHolidaysCard referenceDate={summary?.date} compact />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div ref={calendarRef} data-tour="calendar" className="h-fit">
          <AttendanceMonthCalendar
            month={summary?.month}
            calendar={summary?.month?.calendar}
            loading={isLoading}
            summaryDate={summary?.date}
          />
        </div>
        <div
          data-tour="activity-rings"
          className="flex flex-col overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
          style={calendarHeight ? { height: calendarHeight } : undefined}
        >
          <div className="shrink-0 border-b border-gray-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-900">Activity</h2>
            <p className="text-[11px] text-gray-500">Present rate, attendance & punctuality</p>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center px-2 py-1">
            <ActivityRingsChart
              rings={activityRings}
              loading={isLoading}
              compact
              dense
              hideTitle
            />
          </div>
        </div>
        <div
          data-tour="recent-activity"
          style={calendarHeight ? { height: calendarHeight } : undefined}
        >
          <RecentActivityFeed
            activities={recentActivities}
            loading={isLoading || activitiesLoading}
            className="h-full"
            compact
            maxItems={5}
          />
        </div>
      </div>

      {infoOpen && (
        <PageInfoOverlay
          steps={DASHBOARD_GUIDE_STEPS}
          onClose={closeInfo}
          pageLabel="Dashboard"
        />
      )}
    </div>
  );
};

export default Dashboard;
