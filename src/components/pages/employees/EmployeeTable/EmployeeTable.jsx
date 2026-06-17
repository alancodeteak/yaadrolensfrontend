import clsx from 'clsx';
import { formatMonthlySalary } from '../../../../utils/helpers';
import { useNavigate } from 'react-router-dom';
import {
  Pencil,
  Eye,
  DollarSign,
  Trash2,
  RotateCcw,
  Users,
} from 'lucide-react';
import { useUpdateEmployeeMutation } from '../../../../store/api';
import { UserAvatar, dashboardToast } from '../../../common';
import { DASHBOARD_PANEL } from '../../dashboard/dashboardTheme';

const TH =
  'px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wide text-gray-400 first:pl-5 last:pr-5';

const TD = 'px-4 py-3.5 text-sm text-gray-900 first:pl-5 last:pr-5';

const ActionButton = ({ onClick, title, children, tone = 'neutral' }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={clsx(
      'rounded-lg p-1.5 transition-colors duration-200',
      tone === 'blue' && 'text-gray-400 hover:bg-blue-50 hover:text-[#007AFF]',
      tone === 'green' && 'text-gray-400 hover:bg-emerald-50 hover:text-[#34C759]',
      tone === 'red' && 'text-gray-400 hover:bg-red-50 hover:text-[#FF3B30]',
      tone === 'neutral' && 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
    )}
  >
    {children}
  </button>
);

const EmployeeTable = ({
  employees,
  totalCount = 0,
  isFetching = false,
  onRefresh,
  onEdit,
  onDeactivate,
  showActiveEmployees = true,
}) => {
  const navigate = useNavigate();
  const [updateEmployee] = useUpdateEmployeeMutation();

  const handleReactivate = async (employee) => {
    try {
      await updateEmployee({
        id: employee.id,
        is_active: true,
      }).unwrap();
      dashboardToast.success(`${employee.name} has been reactivated.`, 'Employee activated');
      onRefresh?.();
    } catch (error) {
      dashboardToast.error(
        error?.data?.message || 'Could not reactivate employee. Please try again.',
        'Activation failed'
      );
    }
  };

  const isEmpty = employees.length === 0;

  return (
    <div className={clsx(DASHBOARD_PANEL, 'relative overflow-hidden')}>
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Team roster</h2>
          <p className="text-[11px] text-gray-500">
            {totalCount} {totalCount === 1 ? 'employee' : 'employees'}
            {isFetching ? ' · Updating…' : ''}
          </p>
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50">
            <Users className="h-6 w-6 text-gray-400" strokeWidth={1.75} />
          </div>
          <p className="text-sm font-medium text-gray-900">
            {showActiveEmployees ? 'No active employees found' : 'No deactivated employees found'}
          </p>
          <p className="mt-1 max-w-sm text-xs text-gray-500">
            {showActiveEmployees
              ? 'Try adjusting your search or filter criteria.'
              : 'All employees are currently active, or try adjusting your search.'}
          </p>
        </div>
      ) : (
        <div
          className={clsx(
            'overflow-x-auto transition-opacity duration-200',
            isFetching && 'pointer-events-none opacity-60'
          )}
        >
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className={clsx(TH, 'min-w-32')}>Name</th>
                <th className={clsx(TH, 'min-w-32 hidden md:table-cell')}>Department</th>
                <th className={clsx(TH, 'min-w-28 hidden lg:table-cell')}>Salary</th>
                <th className={clsx(TH, 'min-w-32 hidden xl:table-cell')}>Position</th>
                <th className={clsx(TH, 'min-w-24 hidden lg:table-cell')}>Phone</th>
                {showActiveEmployees && <th className={clsx(TH, 'w-20')}>Status</th>}
                <th className={clsx(TH, 'min-w-28 hidden xl:table-cell')}>Face enrolled</th>
                <th className={clsx(TH, 'w-28')}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {employees.map((employee) => (
                <tr
                  key={employee.id}
                  className="group transition-colors duration-200 hover:bg-gray-50/80"
                >
                  <td className={TD}>
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-gray-100"
                        src={employee.photo || employee.avatar}
                        name={employee.name}
                        seed={employee.id}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">{employee.name}</p>
                        <p className="truncate text-xs text-gray-500 md:hidden">
                          {employee.department || '—'}
                        </p>
                        <p className="truncate text-xs text-gray-500 lg:hidden">
                          {employee.employee_code}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className={clsx(TD, 'hidden md:table-cell')}>
                    <span className="truncate text-gray-700">{employee.department || '—'}</span>
                  </td>
                  <td className={clsx(TD, 'hidden lg:table-cell')}>
                    <span className="tabular-nums text-gray-700">
                      {employee.salary != null && employee.salary !== ''
                        ? formatMonthlySalary(employee.salary)
                        : '—'}
                    </span>
                  </td>
                  <td className={clsx(TD, 'hidden xl:table-cell')}>
                    <span className="truncate text-gray-700">{employee.position || '—'}</span>
                  </td>
                  <td className={clsx(TD, 'hidden lg:table-cell')}>
                    <span className="truncate text-gray-600">{employee.phone || '—'}</span>
                  </td>
                  {showActiveEmployees && (
                    <td className={TD}>
                      <span
                        className={clsx(
                          'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                          employee.is_active
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {employee.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  )}
                  <td className={clsx(TD, 'hidden xl:table-cell')}>
                    <span
                      className={clsx(
                        'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                        employee.has_face_enrolled
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-orange-100 text-orange-700'
                      )}
                    >
                      {employee.has_face_enrolled ? 'Enrolled' : 'Not enrolled'}
                    </span>
                  </td>
                  <td className={TD}>
                    <div className="flex items-center gap-0.5">
                      <ActionButton
                        onClick={() => onEdit?.(employee)}
                        title="Edit employee"
                        tone="blue"
                      >
                        <Pencil className="h-3.5 w-3.5" strokeWidth={2} />
                      </ActionButton>
                      <ActionButton
                        onClick={() => navigate(`/admin/employees/${employee.id}`)}
                        title="View employee"
                        tone="neutral"
                      >
                        <Eye className="h-3.5 w-3.5" strokeWidth={2} />
                      </ActionButton>
                      <ActionButton
                        onClick={() => navigate(`/admin/salary?employeeId=${employee.id}`)}
                        title="Manage salary"
                        tone="green"
                      >
                        <DollarSign className="h-3.5 w-3.5" strokeWidth={2} />
                      </ActionButton>
                      {employee.is_active && showActiveEmployees && (
                        <ActionButton
                          onClick={() => onDeactivate?.(employee)}
                          title="Deactivate employee"
                          tone="red"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                        </ActionButton>
                      )}
                      {!employee.is_active && !showActiveEmployees && (
                        <ActionButton
                          onClick={() => handleReactivate(employee)}
                          title="Reactivate employee"
                          tone="green"
                        >
                          <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
                        </ActionButton>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
