import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetEmployeeByIdQuery } from '../../store/api';
import { LoadingScreen, NotFoundState, notFoundActionClass } from '../../components/common';

const EmployeeTraining = () => {
  const { id } = useParams();
  const { data: employee, isLoading, isError } = useGetEmployeeByIdQuery(id);

  if (isLoading) {
    return <LoadingScreen message="Loading employee..." />;
  }

  if (isError || !employee) {
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to={`/admin/employees/${id}`} className="text-blue-600 text-sm mb-4 inline-block">
        Back to employee
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Face Enrollment</h1>
      <p className="text-gray-600 mb-6">
        {employee?.name ? `${employee.name} — ` : ''}
        face enrollment is handled on the attendance kiosk, not in the org admin portal.
      </p>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <p className="text-sm text-gray-700 mb-2">
          Status:{' '}
          <span className="font-medium">
            {employee?.has_face_enrolled ? 'Face enrolled' : 'Not enrolled yet'}
          </span>
        </p>
        <p className="text-sm text-gray-500">
          Use the kiosk app to enroll or update employee face data via{' '}
          <code className="font-mono text-xs">POST /api/v1/kiosk/employees/:id/enroll-face</code>.
        </p>
      </div>
    </div>
  );
};

export default EmployeeTraining;
