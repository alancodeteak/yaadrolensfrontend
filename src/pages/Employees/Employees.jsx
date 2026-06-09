import React, { useState } from 'react';
import { EmployeeTable, FilterSort, EmployeeModal, EmployeeEditModal } from '../../components/pages/employees';
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
} from '../../store/api';
import { useGetDepartmentsQuery } from '../../store/api/settingsApi';

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

  // RTK Query hooks
  const {
    data: employeesData,
    isLoading,
    isError,
    error,
    refetch
  } = useGetEmployeesQuery({
    page: currentPage,
    limit: employeesPerPage,
    search: searchTerm,
    department: filterDepartment,
    is_active: showActiveEmployees
  });

  const { data: departmentOptions = [] } = useGetDepartmentsQuery({ active_only: true });

  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();
  const [uploadProfilePhoto] = useUploadEmployeeProfilePhotoMutation();
  const [deleteProfilePhoto] = useDeleteEmployeeProfilePhotoMutation();

  // Extract employees array from API response
  const employees = employeesData || [];

  // Client-side filtering and sorting (since API might not support all filters)
  const processedEmployees = React.useMemo(() => {
    if (!employees.length) return [];
    
    let filtered = [...employees];
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'department':
          return (a.department || '').localeCompare(b.department || '');
        case 'status':
          return (a.is_active ? 'Active' : 'Inactive').localeCompare(b.is_active ? 'Active' : 'Inactive');
        case 'created_at':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'training_status':
          return (a.training_status || 'not_started').localeCompare(b.training_status || 'not_started');
        default:
          return 0;
      }
    });

    return filtered;
  }, [employees, sortBy]);

  // For pagination display (since API handles pagination)
  const totalPages = Math.ceil(employees.length / employeesPerPage);

  const handleAddEmployee = () => {
    setIsModalOpen(true);
  };

  const handleSaveEmployee = async (employeeData, photoOptions = {}) => {
    try {
      const created = await createEmployee(employeeData).unwrap();
      if (photoOptions.photoFile) {
        await uploadProfilePhoto({ id: created.id, file: photoOptions.photoFile }).unwrap();
      }
      dashboardToast.success(
        `${employeeData.name} has been added to your team.`,
        'Employee created'
      );
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      dashboardToast.error(
        error?.data?.message || 'Could not create employee. Please try again.',
        'Create failed'
      );
      throw error;
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
      await updateEmployee(employeeData).unwrap();
      if (photoOptions.removePhoto) {
        await deleteProfilePhoto(employeeData.id).unwrap();
      } else if (photoOptions.photoFile) {
        await uploadProfilePhoto({ id: employeeData.id, file: photoOptions.photoFile }).unwrap();
      }
      dashboardToast.success(
        `${selectedEmployee?.name || 'Employee'} details were updated.`,
        'Changes saved'
      );
      setIsEditModalOpen(false);
      setSelectedEmployee(null);
      refetch();
    } catch (error) {
      dashboardToast.error(
        error?.data?.message || 'Could not update employee. Please try again.',
        'Update failed'
      );
      throw error;
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
    } catch (error) {
      dashboardToast.error(
        error?.data?.message || 'Could not deactivate employee. Please try again.',
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
    setCurrentPage(1); // Reset to first page when switching views
  };

  // Handle loading state
  if (isLoading) {
    return <LoadingScreen message="Loading employees..." />;
  }

  // Handle error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load employees</h3>
          <p className="text-gray-600 mb-4">{error?.data?.message || 'Something went wrong'}</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {showActiveEmployees ? 'Active Employees' : 'Deactivated Employees'}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {showActiveEmployees
                  ? 'Manage your active team members and their information'
                  : 'View and manage deactivated employees'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3" data-tour="header-actions">
              {/* Search Bar */}
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-xl border border-gray-200/60 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] placeholder:text-gray-400 focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 sm:w-64"
                />
              </div>

              {/* Toggle Active/Deactivated Button */}
              <button
                onClick={handleToggleEmployeeStatus}
                className={`inline-flex items-center rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors duration-200 ${
                  showActiveEmployees
                    ? 'border-gray-200/60 bg-white text-gray-700 shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:bg-gray-50'
                    : 'border-gray-700 bg-gray-700 text-white hover:bg-gray-800'
                }`}
              >
                {showActiveEmployees ? (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878a3 3 0 00-.007 4.243m4.242-4.242L15.536 8.464M14.12 14.12a3 3 0 01-.007-4.243M14.12 14.12l1.415 1.415M14.12 14.12a3 3 0 004.243.007M8.464 8.464L6.05 6.05M15.536 8.464L17.95 6.05" />
                    </svg>
                    View Deactivated
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View Active
                  </>
                )}
              </button>

              {/* Add Employee Button - Only show for active employees view */}
              {showActiveEmployees && (
                <button
                  onClick={handleAddEmployee}
                  className="inline-flex items-center rounded-xl bg-[#007AFF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#0066DD] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Employee
                </button>
              )}
              <PageTourButtons onTutorial={startTutorial} onInfo={startInfo} />
            </div>
          </div>

          {/* Filter and Sort Controls */}
          <div className="mt-6" data-tour="filter-sort">
            <FilterSort
              filterDepartment={filterDepartment}
              setFilterDepartment={setFilterDepartment}
              sortBy={sortBy}
              setSortBy={setSortBy}
              departmentOptions={departmentOptions}
            />
          </div>
        </div>

        {/* Employee Table */}
        <div data-tour="employee-table">
        <EmployeeTable
          employees={processedEmployees}
          isLoading={isLoading}
          onRefresh={refetch}
          onEdit={handleEditEmployee}
          onDeactivate={handleDeactivateEmployee}
          showActiveEmployees={showActiveEmployees}
        />
        </div>

        {/* Pagination */}
        <div className="mt-6" data-tour="pagination">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={employees.length}
            itemsPerPage={employeesPerPage}
          />
        </div>

      {/* Employee Modal */}
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
