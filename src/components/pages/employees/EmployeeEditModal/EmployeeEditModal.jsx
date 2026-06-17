import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';
import { dashboardToast } from '../../../common';
import { useGetDepartmentsQuery, useGetSettingsQuery } from '../../../../store/api/settingsApi';

const WEEKDAY_OPTIONS = [
  { value: 0, label: 'Mon' },
  { value: 1, label: 'Tue' },
  { value: 2, label: 'Wed' },
  { value: 3, label: 'Thu' },
  { value: 4, label: 'Fri' },
  { value: 5, label: 'Sat' },
  { value: 6, label: 'Sun' },
];
import ProfilePhotoField from '../ProfilePhotoField';
import EmployeeDocumentsField from '../EmployeeDocumentsField';
import { EMPTY_DOCUMENT_STATE, hasDocumentChanges } from '../../../../utils/employeeDocumentConstants';

const labelClass = 'mb-1 block text-[10px] font-medium uppercase tracking-wide text-gray-400';
const inputClass =
  'w-full rounded-xl border border-gray-200/60 bg-white px-3.5 py-2.5 text-sm text-gray-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] placeholder:text-gray-400 transition-colors duration-200 focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 disabled:opacity-50';

const EmployeeEditModal = ({ isOpen, onClose, onSave, employee, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    department_id: '',
    position: '',
    phone: '',
    salary: '',
    is_active: true,
    useOrgWeeklyOff: true,
    weekly_off_days: [],
    paid_leaves_per_month: '',
  });

  const [errors, setErrors] = useState({});
  const [photoFile, setPhotoFile] = useState(null);
  const [removePhoto, setRemovePhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [documentState, setDocumentState] = useState(EMPTY_DOCUMENT_STATE);
  const {
    data: departments = [],
    isLoading: departmentsLoading,
    isError: departmentsError,
  } = useGetDepartmentsQuery({ active_only: true });
  const { data: orgSettings } = useGetSettingsQuery();

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        department_id: employee.department_id || '',
        position: employee.position || '',
        phone: employee.phone || '',
        salary: employee.salary != null ? String(employee.salary) : '',
        is_active: employee.is_active !== undefined ? employee.is_active : true,
        useOrgWeeklyOff: !employee.weekly_off_days || employee.weekly_off_days.length === 0,
        weekly_off_days: employee.weekly_off_days || orgSettings?.default_weekly_off_days || [6],
        paid_leaves_per_month:
          employee.paid_leaves_per_month != null ? String(employee.paid_leaves_per_month) : '',
      });
    }
    setPhotoFile(null);
    setRemovePhoto(false);
    setPhotoError('');
    setDocumentState({
      docType: employee?.identity_document?.type || 'aadhaar',
      otherLabel: employee?.identity_document?.label || '',
      uploads: { front: null, back: null },
      deletes: { front: false, back: false },
    });
  }, [employee]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      dashboardToast.error('Please fix the errors below', 'Validation failed');
      return;
    }

    try {
      const updateData = {};
      const originalData = {
        name: employee?.name || '',
        department_id: employee?.department_id || '',
        position: employee?.position || '',
        phone: employee?.phone || '',
        salary: employee?.salary != null ? String(employee.salary) : '',
        is_active: employee?.is_active !== undefined ? employee.is_active : true,
        useOrgWeeklyOff: !employee?.weekly_off_days || employee.weekly_off_days.length === 0,
        weekly_off_days: employee?.weekly_off_days || [],
        paid_leaves_per_month:
          employee?.paid_leaves_per_month != null ? String(employee.paid_leaves_per_month) : '',
      };

      Object.keys(formData).forEach((key) => {
        if (key === 'useOrgWeeklyOff' || key === 'weekly_off_days') return;
        if (formData[key] !== originalData[key]) {
          if (key === 'department_id' || key === 'position' || key === 'phone') {
            updateData[key] = formData[key] || null;
          } else if (key === 'salary') {
            updateData.salary = formData.salary === '' ? null : formData.salary;
          } else if (key === 'paid_leaves_per_month') {
            updateData.paid_leaves_per_month =
              formData.paid_leaves_per_month === '' ? null : Number(formData.paid_leaves_per_month);
          } else {
            updateData[key] =
              typeof formData[key] === 'string' ? formData[key].trim() : formData[key];
          }
        }
      });

      const weeklyOffChanged =
        formData.useOrgWeeklyOff !== originalData.useOrgWeeklyOff ||
        JSON.stringify([...formData.weekly_off_days].sort()) !==
          JSON.stringify([...(originalData.weekly_off_days || [])].sort());
      if (weeklyOffChanged) {
        updateData.weekly_off_days = formData.useOrgWeeklyOff ? null : formData.weekly_off_days;
      }

      const hasPhotoChange = Boolean(photoFile) || removePhoto;
      const hasDocChange = hasDocumentChanges(documentState);

      if (Object.keys(updateData).length === 0 && !hasPhotoChange && !hasDocChange) {
        dashboardToast.info('No changes to save.', 'Nothing changed');
        onClose();
        return;
      }

      await onSave(
        { id: employee.id, ...updateData },
        { photoFile, removePhoto, documentState }
      );
      setPhotoFile(null);
      setRemovePhoto(false);
      setErrors({});
      onClose();
    } catch {
      // Parent handles errors
    }
  };

  const handleClose = () => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        department_id: employee.department_id || '',
        position: employee.position || '',
        phone: employee.phone || '',
        salary: employee.salary != null ? String(employee.salary) : '',
        is_active: employee.is_active !== undefined ? employee.is_active : true,
      });
    }
    setErrors({});
    setPhotoFile(null);
    setRemovePhoto(false);
    setPhotoError('');
    setDocumentState(EMPTY_DOCUMENT_STATE);
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
        aria-labelledby="edit-employee-title"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div className="min-w-0">
            <h2 id="edit-employee-title" className="text-sm font-semibold text-gray-900">
              Edit employee
            </h2>
            <p className="truncate text-[11px] text-gray-500">
              {employee?.name ? `Update details for ${employee.name}` : 'Update employee information'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors duration-200 hover:bg-gray-50 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>

        <form id="edit-employee-form" onSubmit={handleSubmit} className="overflow-y-auto px-5 py-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2 rounded-xl border border-gray-200/60 bg-gray-50/40 p-4">
              <ProfilePhotoField
                name={formData.name || employee?.name}
                seed={employee?.id}
                currentPhotoUrl={employee?.photo}
                photoFile={photoFile}
                removePhoto={removePhoto}
                onPhotoFileChange={(file, error) => {
                  setPhotoFile(file);
                  setPhotoError(error || '');
                  if (error) dashboardToast.error(error, 'Invalid photo');
                }}
                onRemovePhotoChange={setRemovePhoto}
              />
              {photoError && <p className="mt-2 text-xs text-[#FF3B30]">{photoError}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="edit-name" className={labelClass}>
                Full name *
              </label>
              <input
                id="edit-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={clsx(
                  inputClass,
                  errors.name && 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-red-200'
                )}
                required
              />
              {errors.name && <p className="mt-1 text-xs text-[#FF3B30]">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="edit-department" className={labelClass}>
                Department
              </label>
              <select
                id="edit-department"
                name="department_id"
                value={formData.department_id}
                onChange={handleInputChange}
                disabled={departmentsLoading}
                className={inputClass}
              >
                <option value="">No department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
              {departmentsError && (
                <p className="mt-1 text-xs text-[#FF3B30]">Could not load departments.</p>
              )}
            </div>

            <div>
              <label htmlFor="edit-salary" className={labelClass}>
                Monthly salary
              </label>
              <input
                id="edit-salary"
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
              <label htmlFor="edit-position" className={labelClass}>
                Position
              </label>
              <input
                id="edit-position"
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className={inputClass}
                placeholder="e.g. Software Engineer"
              />
            </div>

            <div>
              <label htmlFor="edit-phone" className={labelClass}>
                Phone number
              </label>
              <input
                id="edit-phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2 rounded-xl border border-gray-200/60 bg-gray-50/40 p-4">
              <p className="mb-3 text-xs font-semibold text-gray-700">Weekly off days</p>
              <label className="mb-3 flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={formData.useOrgWeeklyOff}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      useOrgWeeklyOff: e.target.checked,
                      weekly_off_days: e.target.checked
                        ? orgSettings?.default_weekly_off_days || [6]
                        : prev.weekly_off_days,
                    }))
                  }
                  className="h-4 w-4 rounded border-gray-300 text-[#007AFF]"
                />
                Use organization default
              </label>
              {!formData.useOrgWeeklyOff && (
                <div className="flex flex-wrap gap-2">
                  {WEEKDAY_OPTIONS.map((wd) => (
                    <button
                      key={wd.value}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          weekly_off_days: prev.weekly_off_days.includes(wd.value)
                            ? prev.weekly_off_days.filter((d) => d !== wd.value)
                            : [...prev.weekly_off_days, wd.value].sort((a, b) => a - b),
                        }))
                      }
                      className={clsx(
                        'rounded-lg border px-3 py-1.5 text-xs font-semibold',
                        formData.weekly_off_days.includes(wd.value)
                          ? 'border-[#007AFF] bg-[#007AFF]/10 text-[#007AFF]'
                          : 'border-gray-200 text-gray-600'
                      )}
                    >
                      {wd.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="edit-paid-leaves" className={labelClass}>
                Paid leaves per month (override)
              </label>
              <input
                id="edit-paid-leaves"
                type="number"
                name="paid_leaves_per_month"
                min="0"
                max="31"
                value={formData.paid_leaves_per_month}
                onChange={handleInputChange}
                className={inputClass}
                placeholder={`Org default: ${orgSettings?.paid_leaves_per_month ?? 2}`}
              />
            </div>

            <div className="md:col-span-2 rounded-xl border border-gray-200/60 bg-gray-50/40 p-4">
              <EmployeeDocumentsField
                employeeId={employee?.id}
                identityDocument={employee?.identity_document}
                documentState={documentState}
                onDocumentStateChange={setDocumentState}
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200/60 bg-gray-50/50 px-3.5 py-3">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300 text-[#007AFF] focus:ring-[#007AFF]/20"
                />
                <span className="text-sm font-medium text-gray-900">Employee is active</span>
              </label>
            </div>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-5 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-gray-200/60 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="edit-employee-form"
            disabled={isLoading}
            className="rounded-xl bg-[#007AFF] px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#0066DD] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/30"
          >
            {isLoading ? 'Updating…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeEditModal;
