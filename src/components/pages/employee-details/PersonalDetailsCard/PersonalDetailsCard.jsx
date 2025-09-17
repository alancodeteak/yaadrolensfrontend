import React from 'react';
import Card from '../../../common/Card/Card';

const PersonalDetailsCard = ({ employee }) => {
  const personalDetails = [
    { label: 'Full Name', value: employee.name },
    { label: 'Email Address', value: employee.email },
    { label: 'Phone Number', value: employee.phone },
    { label: 'Date of Birth', value: employee.dob },
    { label: 'Address', value: employee.address }
  ];

  return (
    <Card title="Personal Details" className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {personalDetails.map((detail, index) => (
          <div key={index} className="space-y-1">
            <dt className="text-sm font-medium text-gray-500">{detail.label}</dt>
            <dd className="text-base text-gray-900">{detail.value}</dd>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PersonalDetailsCard;
