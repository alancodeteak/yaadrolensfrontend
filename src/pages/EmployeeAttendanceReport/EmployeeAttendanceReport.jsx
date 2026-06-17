import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  useGetEmployeeByIdQuery,
  useGetEmployeeMonthCalendarQuery,
  useGetSettingsQuery,
} from '../../store/api';
import { DashboardWidgetCard } from '../../components/pages/dashboard';
import { EmployeeMonthCalendar } from '../../components/pages/employee-details';
import {
  UserAvatar,
  LoadingScreen,
  NotFoundState,
  notFoundActionClass,
} from '../../components/common';
import { formatDurationHours, orgToday } from '../../store/api/transforms';

function shiftMonth(iso, delta) {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(1);
  d.setMonth(d.getMonth() + delta);
  return d.toISOString().split('T')[0];
}

const ACCENT = {
  blue: '#007AFF',
  green: '#34C759',
  orange: '#FF9500',
  purple: '#5856D6',
};

const EmployeeAttendanceReport = () => {
  const { id } = useParams();
  const { data: settings } = useGetSettingsQuery();
  const orgTimezone = settings?.timezone ?? 'UTC';
  const todayKey = orgToday(orgTimezone);
  const [selectedDay, setSelectedDay] = useState(todayKey);

  const viewDate = useMemo(() => new Date(`${selectedDay}T12:00:00`), [selectedDay]);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth() + 1;

  const {
    data: employee,
    isLoading: employeeLoading,
    isError: employeeError,
  } = useGetEmployeeByIdQuery(id);

  const {
    data: calendarData,
    isLoading: calendarLoading,
    isError: calendarError,
  } = useGetEmployeeMonthCalendarQuery(
    { employee_id: id, year, month },
    { skip: employeeLoading || employeeError || !employee }
  );

  if (employeeLoading) {
    return <LoadingScreen message="Loading attendance report..." />;
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

  if (calendarError) {
    return (
      <NotFoundState
        title="Attendance report unavailable"
        message="Could not load attendance data for this employee."
      >
        <Link to={`/admin/employees/${id}`} className={notFoundActionClass}>
          Back to employee
        </Link>
      </NotFoundState>
    );
  }

  const monthKpis = [
    {
      label: calendarData?.stats_label || 'Days present',
      value:
        calendarData?.salary_calculation_mode === 'fixed'
          ? '—'
          : (calendarData?.days_present ?? 0),
      accent: ACCENT.green,
    },
    {
      label: 'Late arrivals',
      value: calendarData?.late_count ?? 0,
      accent: ACCENT.orange,
    },
    {
      label: 'Incomplete days',
      value: calendarData?.incomplete_days ?? 0,
      accent: ACCENT.purple,
    },
    {
      label: 'Total hours',
      value: formatDurationHours(calendarData?.total_hours),
      accent: ACCENT.blue,
    },
  ];

  const nextMonth = shiftMonth(selectedDay, 1);
  const canGoNext = nextMonth <= todayKey;

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
        <span className="font-medium text-gray-900">Attendance report</span>
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
            <h1 className="text-2xl font-bold text-gray-900">Attendance report</h1>
            <p className="text-sm text-gray-600">
              {employee.name} · {employee.employee_code}
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

      <div className="mb-4 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedDay((d) => shiftMonth(d, -1))}
          className="rounded-xl border border-gray-200/60 p-2 text-gray-600 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-colors hover:bg-gray-50"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
        </button>
        <span className="min-w-[10rem] text-center text-sm font-semibold text-gray-900">
          {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
        <button
          type="button"
          onClick={() => setSelectedDay((d) => shiftMonth(d, 1))}
          disabled={!canGoNext}
          className="rounded-xl border border-gray-200/60 p-2 text-gray-600 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <EmployeeMonthCalendar
          year={year}
          month={month}
          calendar={calendarData?.calendar || []}
          loading={calendarLoading}
          summaryDate={todayKey}
          title="Month calendar"
        />
        <DashboardWidgetCard
          title="Month summary"
          stats={monthKpis}
          loading={calendarLoading}
        />
      </div>
    </div>
  );
};

export default EmployeeAttendanceReport;
