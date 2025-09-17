import React from 'react';
import Card from '../../../common/Card/Card';

const JobInformationCard = ({ employee }) => {
  const jobDetails = [
    { label: 'Department', value: employee.department },
    { label: 'Position', value: employee.position },
    { label: 'Hire Date', value: employee.hireDate },
    { label: 'Manager', value: employee.manager }
  ];

  return (
    <Card title="Job Information" className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {jobDetails.map((detail, index) => (
          <div key={index} className="space-y-1">
            <dt className="text-sm font-medium text-gray-500">{detail.label}</dt>
            <dd className="text-base text-gray-900">{detail.value}</dd>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default JobInformationCard;
