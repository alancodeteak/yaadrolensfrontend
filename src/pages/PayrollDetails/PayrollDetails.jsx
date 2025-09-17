import React from 'react';
import { useParams } from 'react-router-dom';
import { PayrollDetails } from '../../components/pages/payroll';

const PayrollDetailsPage = () => {
  const { id } = useParams();

  // Mock employee data - in real app, this would come from API
  const employee = {
    id: id || 'EMP001',
    name: 'Sarah Chen',
    email: 'sarah.chen@acmeco.com',
    department: 'Marketing',
    position: 'Senior Marketing Specialist',
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
    status: 'Active'
  };

  return <PayrollDetails employee={employee} />;
};

export default PayrollDetailsPage;
