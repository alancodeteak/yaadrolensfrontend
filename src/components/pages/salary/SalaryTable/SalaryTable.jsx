import clsx from 'clsx';
import { Pencil, History } from 'lucide-react';

const TH =
  'px-4 py-3 text-left text-xs font-medium text-gray-500 first:pl-5 last:pr-5';

const TD = 'px-4 py-3.5 text-sm text-gray-900 first:pl-5 last:pr-5';

const formatSalary = (value) =>
  value != null ? `$${Number(value).toLocaleString()}/mo` : '—';

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const ActionButton = ({ onClick, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className="rounded-lg p-1.5 text-gray-400 transition-colors duration-200 hover:bg-blue-50 hover:text-[#007AFF]"
  >
    {children}
  </button>
);

const SalaryTable = ({ rows, onEdit, onHistory, highlightId }) => (
  <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]" data-tour="salary-table">
    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
      <div>
        <h2 className="text-sm font-semibold text-gray-900">Employee salaries</h2>
        <p className="text-[11px] text-gray-500">
          {rows.length} {rows.length === 1 ? 'employee' : 'employees'}
        </p>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className={clsx(TH, 'min-w-28')}>Code</th>
            <th className={clsx(TH, 'min-w-40')}>Name</th>
            <th className={clsx(TH, 'min-w-32 hidden md:table-cell')}>Department</th>
            <th className={clsx(TH, 'min-w-28')}>Salary</th>
            <th className={clsx(TH, 'min-w-32 hidden lg:table-cell')}>Last changed</th>
            <th className={clsx(TH, 'w-20')}>Status</th>
            <th className={clsx(TH, 'w-28')} data-tour="salary-actions">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr
              key={row.employee_id || row.id}
              className={clsx(
                'group transition-colors duration-200 hover:bg-gray-50/80',
                highlightId && (row.employee_id === highlightId || row.id === highlightId) &&
                  'bg-blue-50/50'
              )}
            >
              <td className={TD}>
                <span className="font-mono text-xs text-gray-600">{row.employee_code}</span>
              </td>
              <td className={TD}>
                <p className="font-semibold text-gray-900">{row.name}</p>
              </td>
              <td className={clsx(TD, 'hidden md:table-cell')}>
                <span className="text-gray-700">{row.department || row.department_name || '—'}</span>
              </td>
              <td className={TD}>
                <span className="tabular-nums font-medium text-gray-900">
                  {formatSalary(row.current_salary)}
                </span>
              </td>
              <td className={clsx(TD, 'hidden lg:table-cell')}>
                <span className="text-gray-600">{formatDate(row.last_changed_at)}</span>
              </td>
              <td className={TD}>
                <span
                  className={clsx(
                    'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                    row.status === 'active' || row.is_active
                      ? 'bg-[#34C759]/10 text-[#34C759]'
                      : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {row.status === 'active' || row.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className={TD}>
                <div className="flex items-center gap-1">
                  <ActionButton onClick={() => onEdit(row)} title="Edit salary">
                    <Pencil className="h-4 w-4" strokeWidth={2} />
                  </ActionButton>
                  <ActionButton onClick={() => onHistory(row)} title="View history">
                    <History className="h-4 w-4" strokeWidth={2} />
                  </ActionButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {rows.length === 0 && (
        <div className="px-5 py-12 text-center text-sm text-gray-500">
          No employees match your filters.
        </div>
      )}
    </div>
  </div>
);

export default SalaryTable;
