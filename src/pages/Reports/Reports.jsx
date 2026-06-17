import React, { useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  CalendarCheck,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Users,
  Wallet,
} from 'lucide-react';
import {
  LoadingScreen,
  PageInfoOverlay,
  PageTourButtons,
  REPORTS_GUIDE_STEPS,
  dashboardToast,
  usePageTour,
} from '../../components/common';
import {
  DASHBOARD_ACCENTS,
  DASHBOARD_BTN_PRIMARY,
  DASHBOARD_BTN_SECONDARY,
  DASHBOARD_PANEL,
} from '../../components/pages/dashboard';
import {
  useGetReportTypesQuery,
  useExportOrgReportMutation,
} from '../../store/api/reportsApi';
import { useGetEmployeesQuery } from '../../store/api/employeeApi';
import { useGetDepartmentsQuery } from '../../store/api/settingsApi';
import { downloadBlob, parseContentDispositionFilename } from '../../utils/downloadFile';

const CATEGORIES = ['attendance', 'payroll', 'workforce'];

const CATEGORY_META = {
  attendance: {
    label: 'Attendance',
    shortLabel: 'Attendance',
    subtitle: 'Daily sheets, monthly summaries, and late arrival counts.',
    accent: DASHBOARD_ACCENTS.blue,
    icon: CalendarCheck,
  },
  payroll: {
    label: 'Payroll',
    shortLabel: 'Payroll',
    subtitle: 'Payment history, advances, bonuses, balances, and outstanding amounts.',
    accent: DASHBOARD_ACCENTS.purple,
    icon: Wallet,
  },
  workforce: {
    label: 'Salary & Workforce',
    shortLabel: 'Workforce',
    subtitle: 'Salary roster, employee directory, and dashboard snapshot exports.',
    accent: DASHBOARD_ACCENTS.green,
    icon: Users,
  },
};

const MONTHS = [
  { value: 1, label: 'Jan' },
  { value: 2, label: 'Feb' },
  { value: 3, label: 'Mar' },
  { value: 4, label: 'Apr' },
  { value: 5, label: 'May' },
  { value: 6, label: 'Jun' },
  { value: 7, label: 'Jul' },
  { value: 8, label: 'Aug' },
  { value: 9, label: 'Sep' },
  { value: 10, label: 'Oct' },
  { value: 11, label: 'Nov' },
  { value: 12, label: 'Dec' },
];

const TH = 'px-4 py-3 text-left text-xs font-medium text-gray-500 first:pl-5 last:pr-5';
const TD = 'px-4 py-4 align-top text-sm text-gray-900 first:pl-5 last:pr-5';

const todayIso = () => new Date().toISOString().split('T')[0];

const monthStartIso = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
};

const defaultFiltersForReport = () => {
  const now = new Date();
  return {
    day: todayIso(),
    year: String(now.getFullYear()),
    month: String(now.getMonth() + 1),
    start_date: monthStartIso(),
    end_date: todayIso(),
    employee_id: '',
    department_id: '',
    status: '',
    payment_type: '',
    period_year: String(now.getFullYear()),
    period_month: String(now.getMonth() + 1),
  };
};

const fieldClass =
  'w-full min-w-0 rounded-xl border border-gray-200/60 bg-white px-3 py-2 text-sm text-gray-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-colors focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20';

const labelClass = 'mb-1 block text-[10px] font-medium uppercase tracking-wide text-gray-400';

const ReportFilterField = ({ filter, value, onChange, employees, departments }) => {
  const name = filter.name;

  if (name === 'employee_id') {
    return (
      <select className={fieldClass} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">All employees</option>
        {employees.map((emp) => (
          <option key={emp.id} value={emp.id}>
            {emp.employee_code} — {emp.name}
          </option>
        ))}
      </select>
    );
  }

  if (name === 'department_id') {
    return (
      <select className={fieldClass} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">All departments</option>
        {departments.map((dept) => (
          <option key={dept.id} value={dept.id}>
            {dept.name}
          </option>
        ))}
      </select>
    );
  }

  if (name === 'month' || name === 'period_month') {
    return (
      <select className={fieldClass} value={value} onChange={(e) => onChange(e.target.value)}>
        {MONTHS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
    );
  }

  if (name === 'status' && filter.label === 'Status') {
    return (
      <select className={fieldClass} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">All</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="paid">Paid</option>
        <option value="disbursed">Disbursed</option>
        <option value="fully_recovered">Fully recovered</option>
        <option value="cancelled">Cancelled</option>
      </select>
    );
  }

  if (name === 'payment_type') {
    return (
      <select className={fieldClass} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">All types</option>
        <option value="monthly_salary">Monthly salary</option>
        <option value="advance_disbursement">Advance disbursement</option>
        <option value="advance_recovery">Advance recovery</option>
        <option value="bonus">Bonus</option>
        <option value="other">Other</option>
      </select>
    );
  }

  if (name === 'year' || name === 'period_year') {
    const years = [];
    const current = new Date().getFullYear();
    for (let y = current - 5; y <= current + 1; y += 1) years.push(y);
    return (
      <select className={fieldClass} value={value} onChange={(e) => onChange(e.target.value)}>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    );
  }

  if (name === 'day' || name === 'start_date' || name === 'end_date') {
    return (
      <input
        type="date"
        className={fieldClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <input
      type="text"
      className={fieldClass}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={filter.label}
    />
  );
};

const CategoryTabBar = ({ activeCategory, onChange, grouped }) => (
  <nav
    className="flex gap-1 overflow-x-auto px-2 py-2 sm:px-3"
    aria-label="Report categories"
  >
    {CATEGORIES.map((category) => {
      const meta = CATEGORY_META[category];
      const Icon = meta.icon;
      const count = grouped[category]?.length || 0;
      const isActive = activeCategory === category;

      return (
        <button
          key={category}
          type="button"
          onClick={() => onChange(category)}
          className={clsx(
            'flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-colors duration-200 sm:px-4 sm:text-sm',
            isActive
              ? 'bg-[#007AFF]/10 text-[#007AFF]'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          )}
        >
          <Icon className="h-4 w-4 shrink-0" style={{ color: isActive ? meta.accent : undefined }} />
          <span>{meta.shortLabel}</span>
          <span
            className={clsx(
              'rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums',
              isActive ? 'bg-[#007AFF]/15 text-[#007AFF]' : 'bg-gray-100 text-gray-500'
            )}
          >
            {count}
          </span>
        </button>
      );
    })}
  </nav>
);

const ReportFilters = ({ report, filters, onFilterChange, employees, departments }) => {
  if (report.filters.length === 0) {
    return <span className="text-xs text-gray-400">No filters required</span>;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {report.filters.map((flt) => (
        <div key={flt.name}>
          <label className={labelClass}>
            {flt.label}
            {flt.required ? ' *' : ''}
          </label>
          <ReportFilterField
            filter={flt}
            value={filters[flt.name] ?? ''}
            onChange={(val) => onFilterChange(report.id, flt.name, val)}
            employees={employees}
            departments={departments}
          />
        </div>
      ))}
    </div>
  );
};

const ExportActions = ({ report, onExport, exportingKey, buildParams }) => {
  const handleExport = (format) => {
    onExport(`${report.id}-${format}`, { ...buildParams(), format });
  };

  return (
    <div className="flex flex-col gap-2 sm:items-end">
      <button
        type="button"
        disabled={!!exportingKey}
        onClick={() => handleExport('xlsx')}
        className={clsx(DASHBOARD_BTN_SECONDARY, 'w-full justify-center sm:w-auto')}
      >
        <FileSpreadsheet className="h-4 w-4" />
        {exportingKey === `${report.id}-xlsx` ? 'Exporting…' : 'Excel'}
      </button>
      <button
        type="button"
        disabled={!!exportingKey}
        onClick={() => handleExport('pdf')}
        className={clsx(DASHBOARD_BTN_PRIMARY, 'w-full justify-center sm:w-auto')}
      >
        <FileText className="h-4 w-4" />
        {exportingKey === `${report.id}-pdf` ? 'Exporting…' : 'PDF'}
      </button>
    </div>
  );
};

const ReportTableRow = ({
  report,
  filters,
  onFilterChange,
  onExport,
  exportingKey,
  employees,
  departments,
  accent,
}) => {
  const buildParams = () => {
    const params = { report_type: report.id };
    report.filters.forEach((flt) => {
      const val = filters[flt.name];
      if (val !== undefined && val !== null && val !== '') {
        params[flt.name] = val;
      }
    });
    return params;
  };

  return (
    <tr className="group transition-colors duration-200 hover:bg-gray-50/80">
      <td className={TD}>
        <div className="flex items-start gap-3">
          <div
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${accent}12` }}
          >
            <ChevronRight className="h-4 w-4" style={{ color: accent }} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900">{report.label}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{report.description}</p>
          </div>
        </div>
      </td>
      <td className={clsx(TD, 'min-w-[220px]')} data-tour="reports-filters">
        <ReportFilters
          report={report}
          filters={filters}
          onFilterChange={onFilterChange}
          employees={employees}
          departments={departments}
        />
      </td>
      <td className={clsx(TD, 'w-36')} data-tour="reports-download">
        <ExportActions
          report={report}
          onExport={onExport}
          exportingKey={exportingKey}
          buildParams={buildParams}
        />
      </td>
    </tr>
  );
};

const ReportMobileCard = ({
  report,
  filters,
  onFilterChange,
  onExport,
  exportingKey,
  employees,
  departments,
  accent,
}) => {
  const buildParams = () => {
    const params = { report_type: report.id };
    report.filters.forEach((flt) => {
      const val = filters[flt.name];
      if (val !== undefined && val !== null && val !== '') {
        params[flt.name] = val;
      }
    });
    return params;
  };

  return (
    <div
      className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.04)]"
      style={{ borderLeftWidth: 3, borderLeftColor: accent }}
    >
      <div className="border-b border-gray-100 px-4 py-3">
        <p className="text-sm font-semibold text-gray-900">{report.label}</p>
        <p className="mt-0.5 text-xs text-gray-500">{report.description}</p>
      </div>
      <div className="space-y-3 px-4 py-3">
        <div data-tour="reports-filters">
          <ReportFilters
            report={report}
            filters={filters}
            onFilterChange={onFilterChange}
            employees={employees}
            departments={departments}
          />
        </div>
        <div data-tour="reports-download">
          <ExportActions
            report={report}
            onExport={onExport}
            exportingKey={exportingKey}
            buildParams={buildParams}
          />
        </div>
      </div>
    </div>
  );
};

const Reports = () => {
  const { infoOpen, startTutorial, startInfo, closeInfo } = usePageTour(
    REPORTS_GUIDE_STEPS,
    'reports_tour_completed'
  );
  const { data: reportTypes = [], isLoading, error } = useGetReportTypesQuery();
  const { data: employeesData } = useGetEmployeesQuery({ page: 1, limit: 200 });
  const employees = employeesData?.items ?? [];
  const { data: departments = [] } = useGetDepartmentsQuery({ active_only: true });
  const [exportOrgReport] = useExportOrgReportMutation();
  const [exportingKey, setExportingKey] = useState(null);
  const [filterState, setFilterState] = useState({});
  const [activeCategory, setActiveCategory] = useState('attendance');

  const grouped = useMemo(() => {
    const groups = { attendance: [], payroll: [], workforce: [] };
    reportTypes.forEach((report) => {
      if (groups[report.category]) {
        groups[report.category].push(report);
      }
    });
    return groups;
  }, [reportTypes]);

  const activeMeta = CATEGORY_META[activeCategory];
  const ActiveCategoryIcon = activeMeta.icon;
  const activeReports = grouped[activeCategory] || [];

  const getFiltersForReport = (reportId) => ({
    ...defaultFiltersForReport(),
    ...(filterState[reportId] || {}),
  });

  const handleFilterChange = (reportId, name, value) => {
    setFilterState((prev) => ({
      ...prev,
      [reportId]: { ...(prev[reportId] || {}), [name]: value },
    }));
  };

  const handleExport = async (key, params) => {
    setExportingKey(key);
    try {
      const result = await exportOrgReport(params).unwrap();
      const filename =
        parseContentDispositionFilename(result.filename) ||
        `report-${params.report_type}.${params.format === 'xlsx' ? 'xlsx' : 'pdf'}`;
      downloadBlob(result.blob, filename);
      dashboardToast.success('Report downloaded successfully.', 'Download ready');
    } catch (err) {
      const detail = err?.data?.detail;
      dashboardToast.error(
        typeof detail === 'string' ? detail : 'Failed to download report.',
        'Export failed'
      );
    } finally {
      setExportingKey(null);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading reports..." />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className={clsx(DASHBOARD_PANEL, 'p-6 text-center')}>
          <p className="text-sm text-red-600">
            Could not load report types. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            Choose a category, set filters, and download Excel or PDF exports.
          </p>
        </div>
        <PageTourButtons onTutorial={startTutorial} onInfo={startInfo} />
      </div>

      <div className={clsx(DASHBOARD_PANEL, 'overflow-hidden')}>
        <div className="border-b border-gray-100" data-tour="reports-categories">
          <CategoryTabBar
            activeCategory={activeCategory}
            onChange={setActiveCategory}
            grouped={grouped}
          />
        </div>

        <div
          data-tour="reports-category-info"
          className="flex flex-col gap-3 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
          style={{ backgroundColor: `${activeMeta.accent}06` }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
              style={{ backgroundColor: `${activeMeta.accent}14` }}
            >
              <ActiveCategoryIcon className="h-5 w-5" style={{ color: activeMeta.accent }} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">{activeMeta.label}</h2>
              <p className="text-[11px] text-gray-500">{activeMeta.subtitle}</p>
            </div>
          </div>
          <p className="text-xs font-medium text-gray-500">
            {activeReports.length} {activeReports.length === 1 ? 'report' : 'reports'} available
          </p>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[880px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/40">
                <th className={clsx(TH, 'min-w-[240px]')}>Report</th>
                <th className={clsx(TH, 'min-w-[280px]')}>Filters</th>
                <th className={clsx(TH, 'w-36')}>Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activeReports.map((report) => (
                <ReportTableRow
                  key={report.id}
                  report={report}
                  filters={getFiltersForReport(report.id)}
                  onFilterChange={handleFilterChange}
                  onExport={handleExport}
                  exportingKey={exportingKey}
                  employees={employees}
                  departments={departments}
                  accent={activeMeta.accent}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="space-y-3 p-4 md:hidden">
          {activeReports.map((report) => (
            <ReportMobileCard
              key={report.id}
              report={report}
              filters={getFiltersForReport(report.id)}
              onFilterChange={handleFilterChange}
              onExport={handleExport}
              exportingKey={exportingKey}
              employees={employees}
              departments={departments}
              accent={activeMeta.accent}
            />
          ))}
        </div>

        {activeReports.length === 0 && (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-gray-500">No reports in this category.</p>
          </div>
        )}
      </div>

      {infoOpen && (
        <PageInfoOverlay
          steps={REPORTS_GUIDE_STEPS}
          onClose={closeInfo}
          pageLabel="Reports"
        />
      )}
    </div>
  );
};

export default Reports;
