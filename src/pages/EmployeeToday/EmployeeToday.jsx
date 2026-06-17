import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, Clock, LogIn, LogOut, Timer } from 'lucide-react';
import clsx from 'clsx';
import {
  useGetEmployeeByIdQuery,
  useGetEmployeeReportQuery,
} from '../../store/api';
import { useGetDailySummaryQuery } from '../../store/api/attendanceApi';
import {
  formatClockTime,
  formatDurationHours,
  mapDailyRowToLiveEmployee,
} from '../../store/api/transforms';
import { DashboardWidgetCard } from '../../components/pages/dashboard';
import { UserAvatar, LoadingScreen, NotFoundState, notFoundActionClass } from '../../components/common';

const today = () => new Date().toISOString().split('T')[0];

const STATUS_BADGE = {
  Present: 'bg-emerald-100 text-emerald-700',
  'Present (Late)': 'bg-orange-100 text-orange-700',
  Absent: 'bg-gray-100 text-gray-600',
  'Clocked Out': 'bg-blue-100 text-blue-700',
};

const ACCENT = {
  blue: '#007AFF',
  green: '#34C759',
  orange: '#FF9500',
  purple: '#5856D6',
};

const EmployeeToday = () => {
  const { id } = useParams();
  const selectedDay = today();

  const {
    data: employee,
    isLoading: employeeLoading,
    isError: employeeError,
  } = useGetEmployeeByIdQuery(id);

  const { data: dailyData, isLoading: dailyLoading } = useGetDailySummaryQuery(
    { date: selectedDay },
    { skip: employeeLoading || employeeError || !employee }
  );

  const { data: monthlyRow, isLoading: reportLoading } = useGetEmployeeReportQuery(
    { employee_id: id, end_date: selectedDay },
    { skip: employeeLoading || employeeError || !employee }
  );

  if (employeeLoading) {
    return <LoadingScreen message="Loading employee..." />;
  }

  if (employeeError || !employee) {
    return (
      <NotFoundState
        title="Employee not found"
        message="The requested employee could not be found."
      >
        <Link to="/admin/employees" className={notFoundActionClass}>
          Back to employees
        </Link>
      </NotFoundState>
    );
  }

  const rawRow = (dailyData?.rows || []).find(
    (row) => String(row.employee_id) === String(id)
  );
  const todayRow = rawRow ? mapDailyRowToLiveEmployee(rawRow) : null;
  const status = todayRow?.status || 'Absent';
  const clockIn = rawRow?.clock_in ? formatClockTime(rawRow.clock_in) : '—';
  const clockOut = rawRow?.clock_out ? formatClockTime(rawRow.clock_out) : '—';
  const hoursToday = formatDurationHours(rawRow?.total_hours);

  const monthKpis = [
    {
      label: 'Days present',
      value: monthlyRow?.days_present ?? 0,
      accent: ACCENT.green,
    },
    {
      label: 'Late arrivals',
      value: monthlyRow?.late_count ?? 0,
      accent: ACCENT.orange,
    },
    {
      label: 'Incomplete days',
      value: monthlyRow?.incomplete_days ?? 0,
      accent: ACCENT.purple,
    },
    {
      label: 'Total hours',
      value: formatDurationHours(monthlyRow?.total_hours),
      accent: ACCENT.blue,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
        <Link to="/admin/employees" className="hover:text-[#007AFF]">
          Employees
        </Link>
        <span>/</span>
        <Link to={`/admin/employees/${id}`} className="hover:text-[#007AFF]">
          {employee.name}
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-900">Today</span>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <UserAvatar
            className="h-14 w-14 shrink-0 rounded-full ring-2 ring-gray-100"
            src={employee.photo || employee.avatar}
            name={employee.name}
            seed={employee.id}
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Today&apos;s attendance</h1>
            <p className="text-sm text-gray-600">
              {employee.name} · {employee.employee_code}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(`${selectedDay}T12:00:00`).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
        <Link
          to={`/admin/employees/${id}`}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200/60 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-colors hover:bg-gray-50"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          Back to profile
        </Link>
      </div>

      <div className="mb-4 rounded-2xl border border-gray-200/60 bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        {dailyLoading ? (
          <LoadingScreen message="Loading today's status..." fullScreen={false} size="sm" />
        ) : (
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#007AFF]/10">
                <Clock className="h-6 w-6 text-[#007AFF]" strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Current status</p>
                <span
                  className={clsx(
                    'mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
                    STATUS_BADGE[status] || STATUS_BADGE.Absent
                  )}
                >
                  {status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-6">
              <div className="flex items-center gap-2">
                <LogIn className="h-4 w-4 text-[#34C759]" strokeWidth={2} />
                <div>
                  <p className="text-[10px] font-medium text-gray-500">Clock in</p>
                  <p className="text-sm font-semibold text-gray-900">{clockIn}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4 text-[#FF9500]" strokeWidth={2} />
                <div>
                  <p className="text-[10px] font-medium text-gray-500">Clock out</p>
                  <p className="text-sm font-semibold text-gray-900">{clockOut}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-[#5856D6]" strokeWidth={2} />
                <div>
                  <p className="text-[10px] font-medium text-gray-500">Logged time</p>
                  <p className="text-sm font-semibold text-gray-900">{hoursToday}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <DashboardWidgetCard
        title="This month"
        stats={monthKpis}
        loading={reportLoading}
        href={`/admin/employees/${id}/attendance-report`}
      />
    </div>
  );
};

export default EmployeeToday;
