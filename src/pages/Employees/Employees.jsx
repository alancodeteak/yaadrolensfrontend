import React, { useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff, Search, UserPlus } from 'lucide-react';
import clsx from 'clsx';
import { EmployeeTable, FilterSort, EmployeeModal, EmployeeEditModal } from '../../components/pages/employees';
import {
  DASHBOARD_BTN_PRIMARY,
  DASHBOARD_BTN_SECONDARY,
  DASHBOARD_PANEL,
} from '../../components/pages/dashboard';
import {
  EMPLOYEES_GUIDE_STEPS,
  Pagination,
  ConfirmationDialog,
  LoadingScreen,
  PageInfoOverlay,
  PageTourButtons,
  usePageTour,
  dashboardToast,
} from '../../components/common';
import {
  useGetEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useUploadEmployeeProfilePhotoMutation,
  useDeleteEmployeeProfilePhotoMutation,
  useUploadEmployeeDocumentMutation,
  useDeleteEmployeeDocumentMutation,
} from '../../store/api';
import { applyEmployeeDocumentChanges } from '../../utils/applyEmployeeDocumentChanges';
import { hasDocumentChanges } from '../../utils/employeeDocumentConstants';
import {
  filterEmployees,
  paginateEmployees,
  sortEmployees,
} from '../../utils/employeeListUtils';
import { useGetDepartmentsQuery } from '../../store/api/settingsApi';

const LIST_FETCH_LIMIT = 200;

const Employees = () => {
  const { infoOpen, startTutorial, startInfo, closeInfo } = usePageTour(
    EMPLOYEES_GUIDE_STEPS,
    'employees_tour_completed'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(10);
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showActiveEmployees, setShowActiveEmployees] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeToDeactivate, setEmployeeToDeactivate] = useState(null);

  const {
    data: employeesData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetEmployeesQuery({ page: 1, limit: LIST_FETCH_LIMIT });

  const { data: departmentOptions = [] } = useGetDepartmentsQuery({ active_only: true });

  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();
  const [uploadProfilePhoto] = useUploadEmployeeProfilePhotoMutation();
  const [deleteProfilePhoto] = useDeleteEmployeeProfilePhotoMutation();
  const [uploadEmployeeDocument] = useUploadEmployeeDocumentMutation();
  const [deleteEmployeeDocument] = useDeleteEmployeeDocumentMutation();
  const documentMutations = {
    uploadEmployeeDocument,
    deleteEmployeeDocument,
  };

  const allEmployees = employeesData?.items ?? [];

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterDepartment, sortBy, showActiveEmployees]);

  const filteredEmployees = useMemo(
    () =>
      sortEmployees(
        filterEmployees(allEmployees, {
          search: searchTerm,
          department: filterDepartment,
          is_active: showActiveEmployees,
        }),
        sortBy
      ),
    [allEmployees, searchTerm, filterDepartment, sortBy, showActiveEmployees]
  );

  const totalFilteredCount = filteredEmployees.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredCount / employeesPerPage));
  const paginatedEmployees = useMemo(
    () => paginateEmployees(filteredEmployees, currentPage, employeesPerPage),
    [filteredEmployees, currentPage, employeesPerPage]
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleAddEmployee = () => {
    setIsModalOpen(true);
  };

  const handleSaveEmployee = async (employeeData, photoOptions = {}) => {
    try {
      const created = await createEmployee(employeeData).unwrap();
      if (photoOptions.photoFile) {
        await uploadProfilePhoto({ id: created.id, file: photoOptions.photoFile }).unwrap();
      }
      if (hasDocumentChanges(photoOptions.documentState)) {
        await applyEmployeeDocumentChanges(
          created.id,
          photoOptions.documentState,
          documentMutations,
          created.identity_document
        );
      }
      dashboardToast.success(
        `${employeeData.name} has been added to your team.`,
        'Employee created'
      );
      setIsModalOpen(false);
      refetch();
    } catch (saveError) {
      dashboardToast.error(
        saveError?.message ||
          saveError?.data?.detail ||
          saveError?.data?.message ||
          'Could not create employee. Please try again.',
        'Create failed'
      );
      throw saveError;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleUpdateEmployee = async (employeeData, photoOptions = {}) => {
    try {
      const { id, ...fields } = employeeData;
      const hasFieldUpdates = Object.keys(fields).length > 0;

      if (hasFieldUpdates) {
        await updateEmployee(employeeData).unwrap();
      }
      if (photoOptions.removePhoto) {
        await deleteProfilePhoto(id).unwrap();
      } else if (photoOptions.photoFile) {
        await uploadProfilePhoto({ id, file: photoOptions.photoFile }).unwrap();
      }
      if (hasDocumentChanges(photoOptions.documentState)) {
        await applyEmployeeDocumentChanges(
          id,
          photoOptions.documentState,
          documentMutations,
          selectedEmployee?.identity_document
        );
      }
      dashboardToast.success(
        `${selectedEmployee?.name || 'Employee'} details were updated.`,
        'Changes saved'
      );
      setIsEditModalOpen(false);
      setSelectedEmployee(null);
      refetch();
    } catch (updateError) {
      dashboardToast.error(
        updateError?.message ||
          updateError?.data?.detail ||
          updateError?.data?.message ||
          'Could not update employee. Please try again.',
        'Update failed'
      );
      throw updateError;
    }
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleDeactivateEmployee = (employee) => {
    setEmployeeToDeactivate(employee);
    setIsConfirmDialogOpen(true);
  };

  const confirmDeactivation = async () => {
    if (!employeeToDeactivate) return;

    try {
      await deleteEmployee(employeeToDeactivate.id).unwrap();
      dashboardToast.success(
        `${employeeToDeactivate.name} has been deactivated.`,
        'Employee deactivated'
      );
      setIsConfirmDialogOpen(false);
      setEmployeeToDeactivate(null);
      refetch();
    } catch (deactivateError) {
      dashboardToast.error(
        deactivateError?.data?.message || 'Could not deactivate employee. Please try again.',
        'Deactivation failed'
      );
    }
  };

  const handleCloseConfirmDialog = () => {
    setIsConfirmDialogOpen(false);
    setEmployeeToDeactivate(null);
  };

  const handleToggleEmployeeStatus = () => {
    setShowActiveEmployees(!showActiveEmployees);
  };

  if (isLoading && !employeesData) {
    return <LoadingScreen message="Loading employees..." />;
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>Could not load employees. {error?.data?.message || 'Please try again.'}</p>
          <button type="button" onClick={() => refetch()} className={`${DASHBOARD_BTN_PRIMARY} mt-3`}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
          <p className="mt-1 text-sm text-gray-500">
            {showActiveEmployees
              ? 'Manage your active team members and their information'
              : 'View and manage deactivated employees'}
          </p>
        </div>
        <PageTourButtons onTutorial={startTutorial} onInfo={startInfo} />
      </div>

      <div className={clsx(DASHBOARD_PANEL, 'mb-8 p-4')} data-tour="header-actions">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              strokeWidth={2}
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-xl border border-gray-200/60 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] placeholder:text-gray-400 focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <FilterSort
              filterDepartment={filterDepartment}
              setFilterDepartment={setFilterDepartment}
              sortBy={sortBy}
              setSortBy={setSortBy}
              departmentOptions={departmentOptions}
            />

            <button
              type="button"
              onClick={handleToggleEmployeeStatus}
              className={clsx(
                DASHBOARD_BTN_SECONDARY,
                !showActiveEmployees &&
                  'border-[#007AFF]/30 bg-[#007AFF]/10 text-[#007AFF] hover:bg-[#007AFF]/15'
              )}
            >
              {showActiveEmployees ? (
                <>
                  <EyeOff className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                  View Deactivated
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                  View Active
                </>
              )}
            </button>

            {showActiveEmployees && (
              <button type="button" onClick={handleAddEmployee} className={DASHBOARD_BTN_PRIMARY}>
                <UserPlus className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                Add Employee
              </button>
            )}
          </div>
        </div>
      </div>

      <div data-tour="employee-table">
        <EmployeeTable
          employees={paginatedEmployees}
          totalCount={totalFilteredCount}
          isFetching={isFetching}
          onRefresh={refetch}
          onEdit={handleEditEmployee}
          onDeactivate={handleDeactivateEmployee}
          showActiveEmployees={showActiveEmployees}
        />
      </div>

      <div className="mt-6" data-tour="pagination">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalFilteredCount}
          itemsPerPage={employeesPerPage}
        />
      </div>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEmployee}
        isLoading={isCreating}
      />

      <EmployeeEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleUpdateEmployee}
        employee={selectedEmployee}
        isLoading={isUpdating}
      />

      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        onConfirm={confirmDeactivation}
        title="Deactivate Employee"
        message={
          employeeToDeactivate
            ? `Are you sure you want to deactivate ${employeeToDeactivate.name}?\n\nThis will:\n• Remove them from active employee lists\n• Disable their face recognition access\n• Clear their cache data\n\nThis action can be reversed by reactivating the employee.`
            : ''
        }
        confirmText="Deactivate Employee"
        cancelText="Cancel"
        variant="destructive"
        isLoading={isDeleting}
      />

      {infoOpen && (
        <PageInfoOverlay
          steps={EMPLOYEES_GUIDE_STEPS}
          onClose={closeInfo}
          pageLabel="Employees"
        />
      )}
    </div>
  );
};

export default Employees;
