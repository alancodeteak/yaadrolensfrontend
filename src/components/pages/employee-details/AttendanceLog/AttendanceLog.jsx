import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { dashboardToast } from '../../../common';
import { DASHBOARD_BTN_PRIMARY, DASHBOARD_PANEL } from '../../dashboard/dashboardTheme';
import EmployeeMonthCalendar from '../EmployeeMonthCalendar/EmployeeMonthCalendar';
import MarkLeaveModal from '../MarkLeaveModal/MarkLeaveModal';
import {
  useGetEmployeeMonthCalendarQuery,
  useGetEmployeeLeavesQuery,
  useMarkEmployeeLeaveMutation,
  useCancelEmployeeLeaveMutation,
  useGetSettingsQuery,
} from '../../../../store/api';
import { orgToday } from '../../../../store/api/transforms';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const leaveTypeLabel = {
  paid: 'Paid',
  unpaid: 'Unpaid',
  half: 'Half day',
};

const TH =
  'px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wide text-gray-400 first:pl-5 last:pr-5';

const TD = 'px-4 py-3.5 text-sm text-gray-900 first:pl-5 last:pr-5';

const navButtonClass =
  'rounded-xl border border-gray-200/60 p-2 text-gray-600 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-colors hover:bg-gray-50';

const AttendanceLog = ({ employeeId }) => {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [markLeaveOpen, setMarkLeaveOpen] = useState(false);
  const [selectedLeaveDate, setSelectedLeaveDate] = useState('');

  const { data: settings } = useGetSettingsQuery();
  const maxFutureLeaveDays = settings?.max_future_leave_days ?? 90;
  const orgTimezone = settings?.timezone ?? 'UTC';
  const today = orgToday(orgTimezone);

  const { data: calendarData, isLoading: calendarLoading, refetch: refetchCalendar } =
    useGetEmployeeMonthCalendarQuery(
      { employee_id: employeeId, year, month },
      { skip: !employeeId }
    );

  const { data: leavesData, isLoading: leavesLoading, refetch: refetchLeaves } =
    useGetEmployeeLeavesQuery({ employeeId, year, month }, { skip: !employeeId });

  const [markLeave, { isLoading: isMarking }] = useMarkEmployeeLeaveMutation();
  const [cancelLeave, { isLoading: isCancelling }] = useCancelEmployeeLeaveMutation();

  const isLeaveAware = calendarData?.salary_calculation_mode === 'leave_aware';

  const summaryStats = useMemo(() => {
    if (!calendarData) return [];
    const primaryLabel = calendarData.stats_label || 'Days present';
    const primaryValue =
      calendarData.salary_calculation_mode === 'fixed' ? '—' : calendarData.days_present;
    const stats = [{ label: primaryLabel, value: primaryValue }];
    if (isLeaveAware) {
      stats.push(
        { label: 'Leave days', value: calendarData.leave_days ?? 0 },
        {
          label: 'Paid leaves used',
          value: `${calendarData.paid_leaves_used ?? 0} / ${calendarData.paid_leave_quota ?? 0}`,
        }
      );
    }
    stats.push({ label: 'Late days', value: calendarData.late_count });
    return stats;
  }, [calendarData, isLeaveAware]);

  const monthLabel = useMemo(() => `${MONTHS[month - 1]} ${year}`, [month, year]);

  const shiftMonth = (delta) => {
    const d = new Date(year, month - 1 + delta, 1);
    setYear(d.getFullYear());
    setMonth(d.getMonth() + 1);
  };

  const openMarkLeave = (date = today) => {
    setSelectedLeaveDate(date);
    setMarkLeaveOpen(true);
  };

  const handleMarkLeave = async (payload) => {
    const isScheduled = payload.leave_date > today;
    try {
      await markLeave({ employeeId, ...payload }).unwrap();
      dashboardToast.success(
        isScheduled
          ? 'Leave scheduled for this employee.'
          : 'Leave marked for this employee.',
        isScheduled ? 'Leave scheduled' : 'Leave saved'
      );
      refetchCalendar();
      refetchLeaves();
    } catch (err) {
      dashboardToast.error(err?.data?.detail || 'Could not save leave.', 'Failed');
      throw err;
    }
  };

  const handleCancelLeave = async (leaveId) => {
    try {
      await cancelLeave({ employeeId, leaveId }).unwrap();
      dashboardToast.success('Leave cancelled.', 'Cancelled');
      refetchCalendar();
      refetchLeaves();
    } catch (err) {
      dashboardToast.error(err?.data?.detail || 'Could not cancel leave.', 'Failed');
    }
  };

  const leaves = leavesData?.items || [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            className={navButtonClass}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>
          <span className="min-w-[140px] text-center text-sm font-semibold text-gray-900">
            {monthLabel}
          </span>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            className={navButtonClass}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <button type="button" onClick={() => openMarkLeave(today)} className={DASHBOARD_BTN_PRIMARY}>
          <Plus className="h-4 w-4 shrink-0" strokeWidth={2} />
          Schedule leave
        </button>
      </div>

      {calendarData && (
        <div
          className={clsx(
            'grid grid-cols-2 gap-3',
            isLeaveAware ? 'sm:grid-cols-4' : 'sm:grid-cols-3'
          )}
        >
          {summaryStats.map((stat) => (
            <div
              key={stat.label}
              className={clsx(DASHBOARD_PANEL, 'px-3 py-2.5')}
            >
              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                {stat.label}
              </p>
              <p className="text-lg font-semibold tabular-nums text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      <EmployeeMonthCalendar
        year={year}
        month={month}
        calendar={calendarData?.calendar || []}
        loading={calendarLoading}
        title="Attendance & leave"
        summaryDate={today}
        onDayClick={(iso) => openMarkLeave(iso)}
      />

      <div className={clsx(DASHBOARD_PANEL, 'overflow-hidden')}>
        <div className="border-b border-gray-100 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">Leave records</h3>
          <p className="text-[11px] text-gray-500">
            Approved leave in {monthLabel}
            {leavesLoading ? ' · Loading…' : ''}
          </p>
        </div>

        {leaves.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-gray-500">
            No leave marked for this month.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Date', 'Type', 'Status', 'Reason', 'Actions'].map((h) => (
                    <th key={h} className={TH}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leaves.map((leave) => {
                  const isScheduled = leave.leave_date > today;
                  return (
                    <tr key={leave.id} className="hover:bg-gray-50/80">
                      <td className={clsx(TD, 'whitespace-nowrap')}>{leave.leave_date}</td>
                      <td className={clsx(TD, 'whitespace-nowrap text-gray-700')}>
                        {leaveTypeLabel[leave.leave_type] || leave.leave_type}
                      </td>
                      <td className={clsx(TD, 'whitespace-nowrap')}>
                        {isScheduled ? (
                          <span className="inline-flex rounded-full border border-dashed border-[#007AFF]/40 bg-[#007AFF]/10 px-2 py-0.5 text-[10px] font-semibold text-[#007AFF]">
                            Scheduled
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            Active
                          </span>
                        )}
                      </td>
                      <td className={clsx(TD, 'text-gray-600')}>{leave.reason || '—'}</td>
                      <td className={clsx(TD, 'whitespace-nowrap text-right')}>
                        <button
                          type="button"
                          disabled={isCancelling}
                          onClick={() => handleCancelLeave(leave.id)}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#FF3B30] transition-colors hover:bg-red-50 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MarkLeaveModal
        isOpen={markLeaveOpen}
        onClose={() => setMarkLeaveOpen(false)}
        onSubmit={handleMarkLeave}
        isLoading={isMarking}
        defaultDate={selectedLeaveDate || today}
        maxFutureLeaveDays={maxFutureLeaveDays}
      />
    </div>
  );
};

export default AttendanceLog;
