import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, BarChart3, ScanFace, Pencil } from 'lucide-react';
import {
  useGetEmployeeByIdQuery,
  useGetEmployeePaymentSummaryQuery,
  useAdjustEmployeeBalanceMutation,
} from '../../store/api';
import { BalanceAdjustModal } from '../../components/pages/payment';
import { dashboardToast } from '../../components/common';
import {
  ProfileHeader,
  TabNavigation,
  PersonalDetailsCard,
  IdentityDocumentsCard,
  JobInformationCard,
  TrainingStatusCard,
  AttendanceLog,
} from '../../components/pages/employee-details';
import { LoadingScreen, NotFoundState, notFoundActionClass } from '../../components/common';

const quickActionClass =
  'inline-flex items-center gap-2 rounded-xl border border-gray-200/60 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-colors duration-200 hover:bg-gray-50 sm:text-sm';

const EmployeeDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('personal');
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);

  const { data: employee, isLoading, isError, error, refetch } = useGetEmployeeByIdQuery(id);
  const { data: paymentSummary, refetch: refetchPaymentSummary } =
    useGetEmployeePaymentSummaryQuery(id, { skip: !id });
  const [adjustBalance, { isLoading: isAdjustingBalance }] = useAdjustEmployeeBalanceMutation();

  const handleAdjustBalance = async (payload) => {
    try {
      await adjustBalance(payload).unwrap();
      setBalanceModalOpen(false);
      dashboardToast.success('Balance adjustment recorded in the ledger.', 'Adjustment saved');
      refetchPaymentSummary();
    } catch (err) {
      dashboardToast.error(
        err?.data?.detail || 'Could not update balance.',
        'Balance failed'
      );
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading employee details..." />;
  }

  if (isError) {
    return (
      <NotFoundState
        title="Employee not found"
        message={error?.data?.message || 'The requested employee could not be found.'}
      >
        <button type="button" onClick={() => refetch()} className={notFoundActionClass}>
          Try again
        </button>
        <Link to="/admin/employees" className={notFoundActionClass}>
          Back to employees
        </Link>
      </NotFoundState>
    );
  }

  if (!employee) {
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PersonalDetailsCard employee={employee} />
            <IdentityDocumentsCard employee={employee} />
            <JobInformationCard
              employee={employee}
              paymentSummary={paymentSummary}
              onAdjustBalance={() => setBalanceModalOpen(true)}
            />
          </div>
        );
      case 'attendance':
        return <AttendanceLog employeeId={employee.id} />;
      case 'training':
        return <TrainingStatusCard employee={employee} />;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
        <Link to="/admin/employees" className="hover:text-[#007AFF]">
          Employees
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-900">{employee.name}</span>
      </div>

      <div className="space-y-4">
        <ProfileHeader employee={employee} />

        <div className="rounded-2xl border border-gray-200/60 bg-white px-4 py-3 shadow-[0_2px_16px_rgba(0,0,0,0.06)] sm:px-5">
          <p className="mb-2 text-xs font-medium text-gray-500">Quick actions</p>
          <div className="flex flex-wrap gap-2">
            <Link to={`/admin/employees/${id}/today`} className={quickActionClass}>
              <Clock className="h-4 w-4 text-[#007AFF]" strokeWidth={2} />
              Today&apos;s attendance
            </Link>
            <Link to={`/admin/employees/${id}/attendance-report`} className={quickActionClass}>
              <BarChart3 className="h-4 w-4 text-[#34C759]" strokeWidth={2} />
              Attendance report
            </Link>
            <Link to={`/admin/employees/${id}/training`} className={quickActionClass}>
              <ScanFace className="h-4 w-4 text-[#5856D6]" strokeWidth={2} />
              Face enrollment
            </Link>
            <Link to="/admin/employees" className={quickActionClass}>
              <Pencil className="h-4 w-4 text-gray-500" strokeWidth={2} />
              Back to list
            </Link>
          </div>
        </div>

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {renderTabContent()}
      </div>

      <BalanceAdjustModal
        isOpen={balanceModalOpen}
        employee={employee}
        onClose={() => setBalanceModalOpen(false)}
        onSave={handleAdjustBalance}
        isLoading={isAdjustingBalance}
      />
    </div>
  );
};

export default EmployeeDetails;
