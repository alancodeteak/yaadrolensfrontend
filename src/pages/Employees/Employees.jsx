import React, { useState } from 'react';
import { EmployeeTable, FilterSort, EmployeeModal } from '../../components/pages/employees';
import { Pagination } from '../../components/common';

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [employeesPerPage] = useState(10);
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Boilerplate test data
  const employees = [
    {
      id: 'EMP001',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      name: 'Ethan Carter',
      email: 'ethan.carter@example.com',
      department: 'Engineering',
      position: 'Software Engineer',
      status: 'Active',
      joinDate: '2023-01-15',
      salary: 75000
    },
    {
      id: 'EMP002',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      name: 'Olivia Bennett',
      email: 'olivia.bennett@example.com',
      department: 'Marketing',
      position: 'Marketing Specialist',
      status: 'Active',
      joinDate: '2023-02-20',
      salary: 65000
    },
    {
      id: 'EMP003',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      name: 'Liam Harper',
      email: 'liam.harper@example.com',
      department: 'Sales',
      position: 'Sales Manager',
      status: 'Active',
      joinDate: '2023-03-10',
      salary: 80000
    },
    {
      id: 'EMP004',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      name: 'Sophia Martinez',
      email: 'sophia.martinez@example.com',
      department: 'HR',
      position: 'HR Manager',
      status: 'Active',
      joinDate: '2023-01-05',
      salary: 70000
    },
    {
      id: 'EMP005',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      name: 'Noah Thompson',
      email: 'noah.thompson@example.com',
      department: 'Engineering',
      position: 'Senior Developer',
      status: 'Active',
      joinDate: '2022-11-15',
      salary: 95000
    },
    {
      id: 'EMP006',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      name: 'Emma Wilson',
      email: 'emma.wilson@example.com',
      department: 'Design',
      position: 'UI/UX Designer',
      status: 'Active',
      joinDate: '2023-04-01',
      salary: 68000
    },
    {
      id: 'EMP007',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      name: 'James Anderson',
      email: 'james.anderson@example.com',
      department: 'Finance',
      position: 'Financial Analyst',
      status: 'Inactive',
      joinDate: '2022-08-20',
      salary: 72000
    },
    {
      id: 'EMP008',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      name: 'Ava Garcia',
      email: 'ava.garcia@example.com',
      department: 'Operations',
      position: 'Operations Manager',
      status: 'Active',
      joinDate: '2023-01-30',
      salary: 78000
    },
    {
      id: 'EMP009',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      name: 'William Brown',
      email: 'william.brown@example.com',
      department: 'Engineering',
      position: 'DevOps Engineer',
      status: 'Active',
      joinDate: '2023-02-15',
      salary: 85000
    },
    {
      id: 'EMP010',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      name: 'Isabella Davis',
      email: 'isabella.davis@example.com',
      department: 'Marketing',
      position: 'Content Manager',
      status: 'Active',
      joinDate: '2023-03-25',
      salary: 62000
    }
  ];

  // Filter and search employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Sort employees
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'department':
        return a.department.localeCompare(b.department);
      case 'status':
        return a.status.localeCompare(b.status);
      case 'joinDate':
        return new Date(b.joinDate) - new Date(a.joinDate);
      default:
        return 0;
    }
  });

  // Pagination
  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = sortedEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  const totalPages = Math.ceil(sortedEmployees.length / employeesPerPage);

  const handleAddEmployee = () => {
    setIsModalOpen(true);
  };

  const handleSaveEmployee = (employeeData) => {
    // TODO: Implement save employee functionality
    console.log('Saving employee:', employeeData);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Employees</h1>
              <p className="text-gray-600">Manage your team members and their information</p>
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

              {/* Add Employee Button */}
              <button
                onClick={handleAddEmployee}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Employee
              </button>
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
          <EmployeeTable employees={currentEmployees} />
        </div>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={sortedEmployees.length}
            itemsPerPage={employeesPerPage}
          />
        </div>
      </div>

      {/* Employee Modal */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEmployee}
      />
    </div>
  );
};

export default Employees;
