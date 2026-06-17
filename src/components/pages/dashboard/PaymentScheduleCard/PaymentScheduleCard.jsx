import clsx from 'clsx';
import { CalendarCheck, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DASHBOARD_ACCENTS } from '../dashboardTheme';

const formatPayDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const PaymentScheduleCard = ({ schedule, loading = false, className, compact = true }) => {
  const daysLeft = schedule?.days_until_pay_day;
  const isUrgent = daysLeft != null && daysLeft <= 3;
  const isPayDayToday = daysLeft === 0;
  const generated = schedule?.generated_count ?? 0;
  const eligible = schedule?.eligible_count ?? 0;
  const autoOn = schedule?.auto_record_monthly_salary;

  if (compact) {
    return (
      <div
        className={clsx(
          'flex h-full flex-col rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]',
          className
        )}
      >
        <div className="border-b border-gray-100 px-3 py-2">
          <div className="flex items-center gap-2">
            <Link
              to="/admin/payroll"
              className="text-sm font-semibold text-gray-900 hover:text-blue-600"
            >
              Pay schedule
            </Link>
            {!loading && isPayDayToday && (
              <span className="rounded-full bg-[#FF3B30]/10 px-1.5 py-0.5 text-[9px] font-semibold text-[#FF3B30]">
                Today
              </span>
            )}
            {!loading && isUrgent && !isPayDayToday && (
              <span className="rounded-full bg-[#FF9500]/10 px-1.5 py-0.5 text-[9px] font-semibold text-[#FF9500]">
                Soon
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-3">
          <div
            className={clsx(
              'flex min-h-[52px] items-center gap-2 rounded-xl px-2 py-2',
              isUrgent ? 'bg-[#FF9500]/5' : 'bg-gray-50/80'
            )}
          >
            <div
              className={clsx(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                isUrgent ? 'bg-[#FF9500]/15 text-[#FF9500]' : 'bg-white text-gray-400'
              )}
            >
              <CalendarCheck className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-medium text-gray-500">Next pay day</p>
              <p
                className="truncate text-xs font-semibold text-gray-900"
                style={{ color: loading ? undefined : DASHBOARD_ACCENTS.blue }}
              >
                {loading ? '—' : formatPayDate(schedule?.next_pay_date)}
              </p>
            </div>
          </div>

          <div className="min-h-[52px] rounded-xl bg-gray-50/80 px-2 py-2">
            <p className="text-[10px] font-medium text-gray-500">Days remaining</p>
            <p
              className="text-xs font-semibold text-gray-900"
              style={{
                color: loading
                  ? undefined
                  : isUrgent
                    ? DASHBOARD_ACCENTS.orange
                    : DASHBOARD_ACCENTS.gray,
              }}
            >
              {loading ? '—' : daysLeft != null ? `${daysLeft} day${daysLeft === 1 ? '' : 's'}` : '—'}
            </p>
          </div>

          <div className="min-h-[52px] rounded-xl bg-gray-50/80 px-2 py-2">
            <div className="flex items-center gap-2">
              <Wallet className="h-3.5 w-3.5 shrink-0 text-gray-400" strokeWidth={2} aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-[10px] font-medium text-gray-500">Salaries generated</p>
                <p className="truncate text-xs font-semibold text-gray-900">
                  {loading ? '—' : `${generated}/${eligible}`}
                  {!loading && (
                    <span className="ml-1 text-[10px] font-normal text-gray-500">
                      · Auto {autoOn ? 'on' : 'off'}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentScheduleCard;
