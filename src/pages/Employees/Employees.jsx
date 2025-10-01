import React, { useState } from 'react';
import { EmployeeTable, FilterSort, EmployeeModal, EmployeeEditModal } from '../../components/pages/employees';
import { Pagination, ConfirmationDialog } from '../../components/common';
import { useGetEmployeesQuery, useCreateEmployeeMutation, useUpdateEmployeeMutation, useDeleteEmployeeMutation } from '../../store/api';
import { toast } from 'react-toastify';

const Employees = () => {
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

  const [createEmployee, { isLoading: isCreating }] = useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();

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
          return a.department.localeCompare(b.department);
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

  const handleSaveEmployee = async (employeeData) => {
    try {
      await createEmployee(employeeData).unwrap();
      toast.success('Employee created successfully!');
      setIsModalOpen(false);
      refetch(); // Refresh the employee list
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to create employee');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleUpdateEmployee = async (employeeData) => {
    try {
      await updateEmployee(employeeData).unwrap();
      toast.success('Employee updated successfully!');
      setIsEditModalOpen(false);
      setSelectedEmployee(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update employee');
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
      toast.success(`${employeeToDeactivate.name} has been deactivated successfully!`);
      setIsConfirmDialogOpen(false);
      setEmployeeToDeactivate(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to deactivate employee');
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employees...</p>
        </div>
      </div>
    );
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
                {showActiveEmployees ? 'Active Employees' : 'Deactivated Employees'}
              </h1>
              <p className="text-gray-600">
                {showActiveEmployees 
                  ? 'Manage your active team members and their information' 
                  : 'View and manage deactivated employees'
                }
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6 sm:mt-0">
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                />
              </div>

              {/* Toggle Active/Deactivated Button */}
              <button
                onClick={handleToggleEmployeeStatus}
                className={`inline-flex items-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-semibold transition-all duration-200 hover:shadow-md ${
                  showActiveEmployees 
                    ? 'text-gray-700 bg-white hover:bg-gray-50' 
                    : 'text-white bg-gray-600 hover:bg-gray-700'
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
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-md"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Employee
                </button>
              )}
            </div>
          </div>

          {/* Filter and Sort Controls */}
          <div className="mt-6">
            <FilterSort
              filterDepartment={filterDepartment}
              setFilterDepartment={setFilterDepartment}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
        </div>

        {/* Employee Table */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
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
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={employees.length}
            itemsPerPage={employeesPerPage}
          />
        </div>
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
            message={employeeToDeactivate ? 
              `Are you sure you want to deactivate ${employeeToDeactivate.name}?\n\nThis will:\n• Remove them from active employee lists\n• Disable their face recognition access\n• Clear their cache data\n\nThis action can be reversed by reactivating the employee.` 
              : ''
            }
            confirmText="Deactivate Employee"
            cancelText="Cancel"
            isLoading={isDeleting}
          />
    </div>
  );
};

export default Employees;
