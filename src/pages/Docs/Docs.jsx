import { Routes, Route, Navigate } from 'react-router-dom';
import {
  DocsSidebar,
  GettingStarted,
  DashboardGuide,
  EmployeesGuide,
  SalaryGuide,
  PayrollGuide,
  ReportsGuide,
  LiveAttendanceGuide,
  AnalyticsGuide,
  SettingsGuide,
  KioskGuide,
  InAppHelpGuide,
  ComingSoonGuide,
} from '../../components/pages/docs';
import { DocsLanguageProvider } from '../../components/pages/docs/DocsLanguageContext';

const Docs = () => (
  <DocsLanguageProvider>
  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div className="mb-6">
      <span className="inline-block rounded-full bg-[#007AFF]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#007AFF]">
        Help & Guide
      </span>
    </div>

    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <DocsSidebar />
      <div className="min-w-0 flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/docs/getting-started" replace />} />
          <Route path="getting-started" element={<GettingStarted />} />
          <Route path="dashboard" element={<DashboardGuide />} />
          <Route path="employees" element={<EmployeesGuide />} />
          <Route path="salary" element={<SalaryGuide />} />
          <Route path="payroll" element={<PayrollGuide />} />
          <Route path="reports" element={<ReportsGuide />} />
          <Route path="attendance" element={<LiveAttendanceGuide />} />
          <Route path="analytics" element={<AnalyticsGuide />} />
          <Route path="settings" element={<SettingsGuide />} />
          <Route path="kiosk" element={<KioskGuide />} />
          <Route path="help" element={<InAppHelpGuide />} />
          <Route path="coming-soon" element={<ComingSoonGuide />} />
          <Route path="*" element={<Navigate to="/docs/getting-started" replace />} />
        </Routes>
      </div>
    </div>
  </div>
  </DocsLanguageProvider>
);

export default Docs;
