import clsx from 'clsx';
import { UserAvatar } from '../../../common';
import { DASHBOARD_ACCENTS, DASHBOARD_PANEL } from '../../dashboard/dashboardTheme';
import { formatMoney } from '../paymentUtils';

const amountColor = (value, accent) => {
  const num = Number(value) || 0;
  return num > 0 ? accent : DASHBOARD_ACCENTS.gray;
};

const OutstandingAmounts = ({ salaryDue, advanceOutstanding }) => (
  <dl className="grid shrink-0 grid-cols-[auto_minmax(5.25rem,auto)] items-baseline gap-x-3 gap-y-1 text-right">
    <dt className="text-[10px] font-medium text-gray-500">Salary</dt>
    <dd
      className="tabular-nums text-xs font-semibold tracking-tight"
      style={{ color: amountColor(salaryDue, DASHBOARD_ACCENTS.blue) }}
    >
      {formatMoney(salaryDue)}
    </dd>
    <dt className="text-[10px] font-medium text-gray-500">Advance</dt>
    <dd
      className="tabular-nums text-xs font-semibold tracking-tight"
      style={{ color: amountColor(advanceOutstanding, DASHBOARD_ACCENTS.orange) }}
    >
      {formatMoney(advanceOutstanding)}
    </dd>
  </dl>
);

const SkeletonRow = () => (
  <li className="flex items-start gap-3 px-4 py-3">
    <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-gray-200" />
    <div className="min-w-0 flex-1 space-y-2">
      <div className="h-3.5 w-32 animate-pulse rounded bg-gray-200" />
      <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
    </div>
    <div className="shrink-0 space-y-2">
      <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
      <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
    </div>
  </li>
);

const OutstandingPanel = ({ items = [], onSelectEmployee, loading, photoMap }) => {
  if (loading) {
    return (
      <div className={clsx(DASHBOARD_PANEL, 'overflow-hidden')}>
        <div className="border-b border-gray-100 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">Outstanding by employee</h3>
          <p className="text-[11px] text-gray-500">Tap to view in payment ledger</p>
        </div>
        <ul className="divide-y divide-gray-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </ul>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className={clsx(DASHBOARD_PANEL, 'px-4 py-4')}>
        <h3 className="text-sm font-semibold text-gray-900">Outstanding by employee</h3>
        <p className="mt-1 text-sm text-gray-500">No unpaid salary or advance balances.</p>
      </div>
    );
  }

  return (
    <div className={clsx(DASHBOARD_PANEL, 'overflow-hidden')}>
      <div className="border-b border-gray-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-900">Outstanding by employee</h3>
        <p className="text-[11px] text-gray-500">Tap to view in payment ledger</p>
      </div>
      <ul className="max-h-64 divide-y divide-gray-100 overflow-y-auto">
        {items.map((row) => {
          const photos = photoMap?.get(String(row.employee_id)) || {};
          return (
            <li key={row.employee_id}>
              <button
                type="button"
                onClick={() => onSelectEmployee?.(row)}
                className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#007AFF]/40"
              >
                <UserAvatar
                  className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gray-100 object-cover ring-1 ring-gray-100"
                  src={photos.profilePhotoUrl || photos.photo || photos.avatar}
                  name={row.employee_name}
                  seed={row.employee_id}
                />
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {row.employee_name}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-gray-500">{row.employee_code}</p>
                </div>
                <div className="pt-0.5">
                  <OutstandingAmounts
                    salaryDue={row.salary_due}
                    advanceOutstanding={row.advance_outstanding}
                  />
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OutstandingPanel;
