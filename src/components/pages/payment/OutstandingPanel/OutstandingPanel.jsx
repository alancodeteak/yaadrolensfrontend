import { formatMoney } from '../paymentUtils';

const OutstandingPanel = ({ items = [], onSelectEmployee, loading }) => {
  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200/60 bg-white px-5 py-4 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <p className="text-sm text-gray-500">Loading outstanding…</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-gray-200/60 bg-white px-5 py-4 shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
        <h3 className="text-sm font-semibold text-gray-900">Outstanding by employee</h3>
        <p className="mt-1 text-sm text-gray-500">No unpaid salary or advance balances.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
      <div className="border-b border-gray-100 px-5 py-3">
        <h3 className="text-sm font-semibold text-gray-900">Outstanding by employee</h3>
        <p className="text-[11px] text-gray-500">Salary due and advance balances</p>
      </div>
      <ul className="max-h-64 divide-y divide-gray-100 overflow-y-auto">
        {items.map((row) => (
          <li key={row.employee_id}>
            <button
              type="button"
              onClick={() => onSelectEmployee?.(row)}
              className="flex w-full items-center justify-between gap-4 px-5 py-3 text-left transition-colors hover:bg-gray-50/80"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">{row.employee_name}</p>
                <p className="text-xs text-gray-500">{row.employee_code}</p>
              </div>
              <div className="shrink-0 text-right text-xs">
                <p className="font-medium text-[#007AFF]">Salary {formatMoney(row.salary_due)}</p>
                <p className="text-[#FF9500]">Advance {formatMoney(row.advance_outstanding)}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OutstandingPanel;
