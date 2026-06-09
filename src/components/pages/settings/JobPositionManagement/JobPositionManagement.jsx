import React, { useState, useEffect } from 'react';
import Card from '../../../common/Card/Card';
import { LoadingScreen } from '../../../common';
import { toast } from 'react-toastify';
import {
  useGetJobPositionsQuery,
  useCreateJobPositionMutation,
  useUpdateJobPositionMutation,
  useDeleteJobPositionMutation,
  useGetDepartmentsQuery
} from '../../../../store/api/settingsApi';

const JobPositionManagement = ({ departmentId = null, departmentName = null }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(departmentId);

  // API hooks
  const { data: positionsData, isLoading, error, refetch } = useGetJobPositionsQuery({
    department_id: selectedDepartment,
    active_only: true
  });
  
  const { data: departmentsData } = useGetDepartmentsQuery({ active_only: true });
  const [createPosition, { isLoading: isCreating }] = useCreateJobPositionMutation();
  const [updatePosition, { isLoading: isUpdating }] = useUpdateJobPositionMutation();
  const [deletePosition, { isLoading: isDeleting }] = useDeleteJobPositionMutation();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    department_id: selectedDepartment || '',
    description: '',
    salary_per_hour: 0,
    min_salary_per_hour: 0,
    max_salary_per_hour: 0,
    required_skills: [],
    experience_level: 'entry',
    education_requirements: '',
    is_remote_allowed: true,
    max_employees: 1
  });

  // Process positions data
  const positions = positionsData || [];
  const departments = departmentsData || [];

  // Filter positions based on search term
  const filteredPositions = positions.filter(position =>
    position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    position.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    position.required_skills.some(skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isModalOpen) {
      if (editingPosition) {
        setFormData({
          title: editingPosition.title || '',
          department_id: editingPosition.department_id || selectedDepartment || '',
          description: editingPosition.description || '',
          salary_per_hour: parseFloat(editingPosition.salary_per_hour) || 0,
          min_salary_per_hour: parseFloat(editingPosition.min_salary_per_hour) || 0,
          max_salary_per_hour: parseFloat(editingPosition.max_salary_per_hour) || 0,
          required_skills: editingPosition.required_skills || [],
          experience_level: editingPosition.experience_level || 'entry',
          education_requirements: editingPosition.education_requirements || '',
          is_remote_allowed: editingPosition.is_remote_allowed || true,
          max_employees: editingPosition.max_employees || 1
        });
      } else {
        setFormData({
          title: '',
          department_id: selectedDepartment || '',
          description: '',
          salary_per_hour: 0,
          min_salary_per_hour: 0,
          max_salary_per_hour: 0,
          required_skills: [],
          experience_level: 'entry',
          education_requirements: '',
          is_remote_allowed: true,
          max_employees: 1
        });
      }
    }
  }, [isModalOpen, editingPosition, selectedDepartment]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillsChange = (value) => {
    const skills = value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData(prev => ({
      ...prev,
      required_skills: skills
    }));
  };

  const handleAddPosition = () => {
    setEditingPosition(null);
    setIsModalOpen(true);
  };

  const handleEditPosition = (position) => {
    setEditingPosition(position);
    setIsModalOpen(true);
  };

  const handleDeletePosition = async (positionId) => {
    if (!confirm('Are you sure you want to delete this job position?')) {
      return;
    }

    try {
      await deletePosition(positionId).unwrap();
      toast.success('Job position deleted successfully');
      refetch();
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error(error?.data?.message || 'Failed to delete job position');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingPosition) {
        await updatePosition({
          id: editingPosition.id,
          ...formData
        }).unwrap();
        toast.success('Job position updated successfully');
      } else {
        await createPosition(formData).unwrap();
        toast.success('Job position created successfully');
      }
      
      setIsModalOpen(false);
      setEditingPosition(null);
      refetch();
    } catch (error) {
      console.error('Submit failed:', error);
      toast.error(error?.data?.message || 'Failed to save job position');
    }
  };

  const getExperienceLevelBadge = (level) => {
    const colors = {
      entry: 'bg-green-50 text-green-700 ring-green-200',
      mid: 'bg-blue-50 text-blue-700 ring-blue-200',
      senior: 'bg-purple-50 text-purple-700 ring-purple-200',
      executive: 'bg-red-50 text-red-700 ring-red-200'
    };
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ring-1 ${colors[level] || colors.entry}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (isActive) => {
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ring-1 ${
        isActive 
          ? 'bg-green-50 text-green-700 ring-green-200'
          : 'bg-gray-50 text-gray-700 ring-gray-200'
      }`}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <LoadingScreen message="Loading job positions..." fullScreen={false} size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Job Positions</h3>
          <p className="text-gray-600 mb-4">Failed to load job positions. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {departmentName ? `${departmentName} - Job Positions` : 'Job Position Management'}
        </h1>
        <p className="text-gray-600">Manage job positions and their salary configurations</p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleAddPosition}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Job Position
          </button>

          {!departmentId && (
            <select
              value={selectedDepartment || ''}
              onChange={(e) => setSelectedDepartment(e.target.value || null)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search positions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Job Positions Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary/Hour
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPositions.map((position) => (
                <tr key={position.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{position.title}</div>
                      <div className="text-sm text-gray-500">{position.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{position.department_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${parseFloat(position.salary_per_hour).toFixed(2)}</div>
                    <div className="text-xs text-gray-500">
                      ${parseFloat(position.min_salary_per_hour).toFixed(2)} - ${parseFloat(position.max_salary_per_hour).toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getExperienceLevelBadge(position.experience_level)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {position.current_employees_count || 0} / {position.max_employees}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(position.is_active)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleEditPosition(position)}
                        className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePosition(position.id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-900 transition-colors duration-200 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPositions.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No job positions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new job position.'}
            </p>
          </div>
        )}
      </Card>

      {/* Add/Edit Position Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingPosition ? 'Edit Job Position' : 'Add New Job Position'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Senior Software Engineer"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department *
                    </label>
                    <select
                      value={formData.department_id}
                      onChange={(e) => handleInputChange('department_id', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Job description and responsibilities"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Min Salary/Hour *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.min_salary_per_hour}
                      onChange={(e) => handleInputChange('min_salary_per_hour', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Salary/Hour *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.salary_per_hour}
                      onChange={(e) => handleInputChange('salary_per_hour', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Salary/Hour *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.max_salary_per_hour}
                      onChange={(e) => handleInputChange('max_salary_per_hour', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience Level
                    </label>
                    <select
                      value={formData.experience_level}
                      onChange={(e) => handleInputChange('experience_level', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                      <option value="executive">Executive Level</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Employees
                    </label>
                    <input
                      type="number"
                      value={formData.max_employees}
                      onChange={(e) => handleInputChange('max_employees', parseInt(e.target.value) || 1)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Required Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={formData.required_skills.join(', ')}
                    onChange={(e) => handleSkillsChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Python, FastAPI, PostgreSQL, Docker"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Education Requirements
                  </label>
                  <input
                    type="text"
                    value={formData.education_requirements}
                    onChange={(e) => handleInputChange('education_requirements', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Bachelor degree in Computer Science"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_remote_allowed"
                    checked={formData.is_remote_allowed}
                    onChange={(e) => handleInputChange('is_remote_allowed', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_remote_allowed" className="ml-2 text-sm text-gray-700">
                    Remote work allowed
                  </label>
                </div>
                
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating || isUpdating ? 'Saving...' : (editingPosition ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPositionManagement;
