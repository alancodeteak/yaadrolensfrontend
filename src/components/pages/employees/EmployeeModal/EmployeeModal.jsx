import { useState } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { LottieLoader, dashboardToast } from '../../../common';
import { useGetDepartmentsQuery } from '../../../../store/api/settingsApi';
import ProfilePhotoField from '../ProfilePhotoField';

const labelClass = 'mb-1.5 block text-xs font-medium text-gray-500';
const inputClass =
  'w-full rounded-xl border border-gray-200/60 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] placeholder:text-gray-400 transition-colors duration-200 focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 disabled:opacity-50';

const EmployeeModal = ({ isOpen, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    department_id: '',
    position: '',
    phone: '',
    salary: '',
  });

  const [errors, setErrors] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const {
    data: departments = [],
    isLoading: departmentsLoading,
    isError: departmentsError,
  } = useGetDepartmentsQuery({ active_only: true });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      department_id: '',
      position: '',
      phone: '',
      salary: '',
    });
    setErrors({});
    setPhotoFile(null);
    setPhotoError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      dashboardToast.error('Please fix the errors below', 'Validation failed');
      return;
    }

    try {
      const employeeData = {
        name: formData.name.trim(),
        ...(formData.department_id && { department_id: formData.department_id }),
        ...(formData.position && { position: formData.position.trim() }),
        ...(formData.phone && { phone: formData.phone.trim() }),
        ...(formData.salary !== '' && { salary: formData.salary }),
      };

      await onSave(employeeData, { photoFile });
      resetForm();
      onClose();
    } catch {
      // Parent handles errors
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm"
      onClick={handleClose}
      role="presentation"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-employee-title"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div>
            <h2 id="add-employee-title" className="text-sm font-semibold text-gray-900">
              Add employee
            </h2>
            <p className="text-[11px] text-gray-500">Create a new team member profile</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="rounded-lg p-1.5 text-gray-400 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <form id="add-employee-form" onSubmit={handleSubmit} className="overflow-y-auto px-5 py-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2 rounded-xl border border-gray-200/60 bg-gray-50/40 p-4">
              <ProfilePhotoField
                name={formData.name}
                seed={formData.name || 'new-employee'}
                photoFile={photoFile}
                onPhotoFileChange={(file, error) => {
                  setPhotoFile(file);
                  setPhotoError(error || '');
                  if (error) dashboardToast.error(error, 'Invalid photo');
                }}
              />
              {photoError && <p className="mt-2 text-xs text-[#FF3B30]">{photoError}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="add-name" className={labelClass}>
                Full name *
              </label>
              <input
                id="add-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={clsx(
                  inputClass,
                  errors.name && 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200'
                )}
                placeholder="Enter employee's full name"
                required
              />
              {errors.name && <p className="mt-1 text-xs text-[#FF3B30]">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="add-department" className={labelClass}>
                Department
              </label>
              <select
                id="add-department"
                name="department_id"
                value={formData.department_id}
                onChange={handleInputChange}
                disabled={departmentsLoading}
                className={inputClass}
              >
                <option value="">Select department (optional)</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {departmentsError && (
                <p className="mt-1 text-xs text-[#FF3B30]">Could not load departments.</p>
              )}
              {!departmentsLoading && !departmentsError && departments.length === 0 && (
                <p className="mt-1 text-xs text-[#FF9500]">
                  No departments yet. Ask your super admin to add departments.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="add-salary" className={labelClass}>
                Monthly salary
              </label>
              <input
                id="add-salary"
                type="number"
                name="salary"
                min="0"
                step="0.01"
                value={formData.salary}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="Optional"
              />
            </div>

            <div>
              <label htmlFor="add-position" className={labelClass}>
                Position
              </label>
              <input
                id="add-position"
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="e.g. Software Engineer"
              />
            </div>

            <div>
              <label htmlFor="add-phone" className={labelClass}>
                Phone number
              </label>
              <input
                id="add-phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 px-3.5 py-3">
            <p className="text-xs font-medium text-[#007AFF]">Face enrollment</p>
            <p className="mt-0.5 text-[11px] text-gray-600">
              Face recognition training can be added later from the employee details page.
            </p>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-5 py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="rounded-xl border border-gray-200/60 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-employee-form"
            disabled={isLoading}
            className="inline-flex items-center rounded-xl bg-[#007AFF] px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#0066DD] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30"
          >
            {isLoading && <LottieLoader size="xs" className="mr-2" />}
            {isLoading ? 'Creating…' : 'Create employee'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;
