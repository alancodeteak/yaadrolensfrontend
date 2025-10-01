import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  useGetDepartmentsQuery,
  useGetJobPositionsQuery
} from '../../../../store/api/settingsApi';

const EmployeeEditModal = ({ isOpen, onClose, onSave, employee, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    phone: '',
    is_active: true
  });

  const [errors, setErrors] = useState({});
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');

  // API hooks
  const { data: departmentsData, isLoading: departmentsLoading } = useGetDepartmentsQuery({ active_only: true });
  const { data: positionsData, isLoading: positionsLoading } = useGetJobPositionsQuery({ 
    department_id: selectedDepartmentId || null,
    active_only: true 
  });

  // Process data
  const departments = departmentsData || [];
  const positions = positionsData || [];

  // Populate form when employee data is available
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        department: employee.department || '',
        position: employee.position || '',
        phone: employee.phone || '',
        is_active: employee.is_active !== undefined ? employee.is_active : true
      });
      
      // Set selected department ID for position filtering
      if (employee.department) {
        const department = departments.find(dept => dept.name === employee.department);
        if (department) {
          setSelectedDepartmentId(department.id);
        }
      }
    }
  }, [employee, departments]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'department') {
      // Find department by name and set ID for position filtering
      const department = departments.find(dept => dept.name === value);
      setSelectedDepartmentId(department ? department.id : '');
      
      // Reset position when department changes
      setFormData(prev => ({
        ...prev,
        [name]: value,
        position: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    try {
      // Only send changed fields
      const updateData = {};
      const originalData = {
        name: employee?.name || '',
        email: employee?.email || '',
        department: employee?.department || '',
        position: employee?.position || '',
        phone: employee?.phone || '',
        is_active: employee?.is_active !== undefined ? employee.is_active : true
      };

      // Compare and only include changed fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== originalData[key]) {
          if (key === 'department' || key === 'position' || key === 'phone') {
            // For optional fields, only include if not empty
            if (formData[key].trim()) {
              updateData[key] = formData[key].trim();
            } else if (originalData[key]) {
              // If field was cleared, send empty string
              updateData[key] = '';
            }
          } else {
            // For required fields or boolean fields
            updateData[key] = typeof formData[key] === 'string' ? formData[key].trim() : formData[key];
          }
        }
      });

      // If no changes were made
      if (Object.keys(updateData).length === 0) {
        toast.info('No changes detected');
        onClose();
        return;
      }

      await onSave({ id: employee.id, ...updateData });
      
      setErrors({});
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handleClose = () => {
    // Reset form to original values
    if (employee) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        department: employee.department || '',
        position: employee.position || '',
        phone: employee.phone || '',
        is_active: employee.is_active !== undefined ? employee.is_active : true
      });
    }
    setErrors({});
    onClose();
  };

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name - Required */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="Enter employee's full name"
              required
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          
          {/* Email - Required */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              placeholder="e.g., john.doe@company.com"
              required
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          
          {/* Department - Optional */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              disabled={departmentsLoading}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select department (optional)</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
            {departmentsLoading && (
              <p className="mt-1 text-sm text-gray-500">Loading departments...</p>
            )}
          </div>
          
          {/* Position - Optional */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Position
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              disabled={positionsLoading || !selectedDepartmentId}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select position (optional)</option>
              {positions.map(pos => (
                <option key={pos.id} value={pos.title}>{pos.title}</option>
              ))}
            </select>
            {!selectedDepartmentId && formData.department && (
              <p className="mt-1 text-sm text-gray-500">Select a department first to see positions</p>
            )}
            {positionsLoading && selectedDepartmentId && (
              <p className="mt-1 text-sm text-gray-500">Loading positions...</p>
            )}
            {selectedDepartmentId && positions.length === 0 && !positionsLoading && (
              <p className="mt-1 text-sm text-gray-500">No positions available for this department</p>
            )}
          </div>
          
          {/* Phone - Optional */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="e.g., +1234567890 (optional)"
            />
          </div>

          {/* Active Status */}
          <div className="md:col-span-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                Employee is active
              </label>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Inactive employees won't be able to access the system
            </p>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-amber-50 p-4 rounded-lg">
          <div className="flex">
            <svg className="w-5 h-5 text-amber-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-amber-900">Update Employee Information</p>
              <p className="text-amber-700 mt-1">
                Only changed fields will be updated. Training data and embeddings will be preserved.
              </p>
            </div>
          </div>
        </div>
      </form>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Employee</h2>
            <p className="text-sm text-gray-600 mt-1">
              Update employee information
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderForm()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-6 py-3 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            disabled={isLoading}
          >
            Cancel
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>{isLoading ? 'Updating...' : 'Update Employee'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeEditModal;

