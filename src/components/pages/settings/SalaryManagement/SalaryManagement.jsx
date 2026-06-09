import React from 'react';
import Card from '../../../common/Card/Card';

const SalaryManagement = () => (
  <div className="p-6 max-w-3xl">
    <Card variant="flat">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Salary settings</h2>
      <p className="text-sm text-gray-600">
        Organization-wide salary bands and payroll rules are not available in Lens v2.
        Set each employee&apos;s <strong>monthly salary</strong> on the Employees page when creating or
        editing a profile.
      </p>
    </Card>
  </div>
);

export default SalaryManagement;
