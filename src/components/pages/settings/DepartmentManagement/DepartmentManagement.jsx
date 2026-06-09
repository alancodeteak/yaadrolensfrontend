import React from 'react';
import Card from '../../../common/Card/Card';

const DepartmentManagement = () => (
  <div className="p-6 max-w-3xl">
    <Card variant="flat">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Departments</h2>
      <p className="text-sm text-gray-600">
        Departments are managed in the <strong>Super Admin</strong> portal per organization.
        Org admins can assign employees to departments from the Employees page (read-only department list).
      </p>
    </Card>
  </div>
);

export default DepartmentManagement;
