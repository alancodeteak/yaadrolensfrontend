import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetEmployeeByIdQuery, useGetEmployeeReportQuery } from '../../store/api';
import { LoadingScreen } from '../../components/common';

const EmployeeToday = () => {
  const { id } = useParams();
  const today = new Date().toISOString().split('T')[0];
  const { data: employee, isLoading: employeeLoading } = useGetEmployeeByIdQuery(id);
  const { data: monthlyRow, isLoading: reportLoading } = useGetEmployeeReportQuery({
    employee_id: id,
    end_date: today,
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to={`/admin/employees/${id}`} className="text-blue-600 text-sm mb-4 inline-block">
        Back to employee
      </Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Employee Summary</h1>

      {employeeLoading ? (
        <LoadingScreen message="Loading employee..." fullScreen={false} size="sm" />
      ) : employee ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold">{employee.name}</h2>
          <p className="text-sm text-gray-500">{employee.employee_code}</p>
          <p className="text-sm text-gray-500 mt-2">
            Face enrolled: {employee.has_face_enrolled ? 'Yes' : 'No'}
          </p>
        </div>
      ) : null}

      {reportLoading ? (
        <LoadingScreen message="Loading monthly stats..." fullScreen={false} size="sm" />
      ) : monthlyRow ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Days present (this month)</p>
            <p className="text-xl font-semibold">{monthlyRow.days_present}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Late count</p>
            <p className="text-xl font-semibold">{monthlyRow.late_count}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Incomplete days</p>
            <p className="text-xl font-semibold">{monthlyRow.incomplete_days}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total hours</p>
            <p className="text-xl font-semibold">{monthlyRow.total_hours}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No attendance data for this month yet.</p>
      )}
    </div>
  );
};

export default EmployeeToday;
