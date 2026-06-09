import React from 'react';
import { Link } from 'react-router-dom';
import { Banknote, ArrowRight } from 'lucide-react';
import Card from '../../../common/Card/Card';

const SalaryManagement = () => (
  <div className="p-6 max-w-3xl">
    <Card variant="panel">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#007AFF]/10">
          <Banknote className="h-5 w-5 text-[#007AFF]" strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Salary management</h2>
          <p className="text-sm text-gray-600 mb-4">
            Set and update monthly salaries for each employee, track change history, and view
            payroll totals from the dedicated Salary page.
          </p>
          <Link
            to="/admin/salary"
            className="inline-flex items-center gap-2 rounded-xl bg-[#007AFF] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0066DD]"
          >
            Open Salary page
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </Card>
  </div>
);

export default SalaryManagement;
