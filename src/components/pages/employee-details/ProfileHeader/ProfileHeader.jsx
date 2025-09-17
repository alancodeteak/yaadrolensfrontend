import React from 'react';

const ProfileHeader = ({ employee }) => {
  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-8 mb-6 flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
      <div className="flex-shrink-0">
        <img
          className="h-28 w-28 rounded-full object-cover ring-4 ring-gray-100"
          src={employee.photo}
          alt={employee.name}
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=3b82f6&color=fff&size=112`;
          }}
        />
      </div>
      <div className="text-center sm:text-left">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">{employee.name}</h1>
        <p className="text-gray-600 text-lg mb-4">Employee ID: {employee.id}</p>
        <span
          className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${
            employee.status === 'Active'
              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
              : 'bg-gray-50 text-gray-600 ring-1 ring-gray-200'
          }`}
        >
          {employee.status}
        </span>
      </div>
    </div>
  );
};

export default ProfileHeader;
