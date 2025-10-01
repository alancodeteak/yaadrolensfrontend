import React from 'react';

const ProfileHeader = ({ employee }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-8 mb-6">
      <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
        <div className="flex-shrink-0">
          <img
            className="h-28 w-28 rounded-full object-cover ring-4 ring-gray-100"
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=3b82f6&color=fff&size=112`}
            alt={employee.name}
          />
        </div>
        
        <div className="flex-1 text-center lg:text-left">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">{employee.name}</h1>
              <p className="text-lg text-gray-600 mb-1">{employee.position}</p>
              <p className="text-sm text-gray-500 mb-4">{employee.department}</p>
            </div>
            
            <div className="flex flex-col items-center lg:items-end space-y-3">
              <span
                className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${
                  employee.is_active
                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                    : 'bg-gray-50 text-gray-600 ring-1 ring-gray-200'
                }`}
              >
                {employee.is_active ? 'Active' : 'Inactive'}
              </span>
              
              <div className="text-right">
                <p className="text-xs text-gray-500">Joined</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(employee.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Training Summary */}
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center lg:text-left">
              <p className="text-2xl font-bold text-blue-600">{employee.training_photos_count || 0}</p>
              <p className="text-sm text-gray-500">Training Photos</p>
            </div>
            <div className="text-center lg:text-left">
              <p className="text-2xl font-bold text-green-600">
                {employee.training_quality_score ? `${(employee.training_quality_score * 100).toFixed(0)}%` : 'N/A'}
              </p>
              <p className="text-sm text-gray-500">Quality Score</p>
            </div>
            <div className="text-center lg:text-left">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                employee.training_status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : employee.training_status === 'in_progress'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {employee.training_status || 'Not Started'}
              </span>
              <p className="text-sm text-gray-500 mt-1">Training Status</p>
            </div>
            <div className="text-center lg:text-left">
              <p className="text-sm font-medium text-gray-900">
                {employee.last_training_photo ? formatDate(employee.last_training_photo) : 'Never'}
              </p>
              <p className="text-sm text-gray-500">Last Photo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
