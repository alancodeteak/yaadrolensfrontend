import React from 'react';
import { PayrollDetails } from '../../components/pages/payroll';

const PayrollDetailsPage = () => {
  // PayrollDetails component now handles its own data fetching via useParams
  return <PayrollDetails />;
};

export default PayrollDetailsPage;
