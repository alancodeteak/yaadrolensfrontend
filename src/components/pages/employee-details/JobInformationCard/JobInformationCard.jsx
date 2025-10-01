import React from 'react';
import Card from '../../../common/Card/Card';

const JobInformationCard = ({ employee }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const jobDetails = [
    { 
      label: 'Department', 
      value: employee.department,
      icon: (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    { 
      label: 'Position', 
      value: employee.position,
      icon: (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V9a2 2 0 11-4 0V6m0 0V4.5a2 2 0 114 0V6m-4 0H8m8 0h2.5A1.5 1.5 0 0120 7.5V11h-2.5a2 2 0 11-4 0H11" />
        </svg>
      )
    },
    { 
      label: 'Employment Status', 
      value: employee.is_active ? 'Active' : 'Inactive',
      icon: (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      label: 'Date Joined', 
      value: formatDate(employee.created_at),
      icon: (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <Card title="Job Information" className="mb-6">
      <div className="space-y-6">
        {jobDetails.map((detail, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-150">
            <div className="flex-shrink-0 mt-0.5">
              {detail.icon}
            </div>
            <div className="flex-1 min-w-0">
              <dt className="text-sm font-medium text-gray-500 mb-1">{detail.label}</dt>
              <dd className="text-base text-gray-900">
                {detail.label === 'Employment Status' ? (
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    employee.is_active
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {detail.value}
                  </span>
                ) : (
                  detail.value
                )}
              </dd>
            </div>
          </div>
        ))}

        {/* Training Summary Section */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Training Overview
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{employee.training_photos_count || 0}</div>
              <div className="text-sm text-blue-800">Training Photos</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-lg font-bold text-green-600">
                {employee.training_quality_score ? `${(employee.training_quality_score * 100).toFixed(0)}%` : 'N/A'}
              </div>
              <div className="text-sm text-green-800">Quality Score</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default JobInformationCard;
