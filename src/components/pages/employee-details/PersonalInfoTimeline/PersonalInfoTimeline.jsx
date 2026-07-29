import { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import {
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarDays,
  Eye,
  FileImage,
  IdCard,
  Phone,
  Scale,
  ScanFace,
  Shield,
  Wallet,
} from 'lucide-react';
import { dashboardToast } from '../../../common';
import { DASHBOARD_ACCENTS, DASHBOARD_PANEL } from '../../dashboard/dashboardTheme';
import { useLazyGetEmployeeDocumentViewUrlQuery } from '../../../../store/api/employeeApi';
import {
  DOCUMENT_SIDES,
  documentTypeLabel,
  sideLabel,
} from '../../../../utils/employeeDocumentConstants';
import { formatMoney } from '../../payment/paymentUtils';
import { formatMonthlySalary } from '../../../../utils/helpers';

const formatDate = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const StatChip = ({ label, value, accent }) => (
  <div className="min-w-0 rounded-lg bg-gray-50/80 px-2.5 py-2">
    <p className="text-[9px] font-medium uppercase tracking-wide text-gray-400">{label}</p>
    <p
      className="mt-0.5 truncate text-xs font-semibold tabular-nums text-gray-900"
      style={{ color: accent }}
    >
      {value}
    </p>
  </div>
);

const TimelineStep = ({
  icon: Icon,
  accent,
  title,
  subtitle,
  badge,
  badgeTone = 'neutral',
  isLast = false,
  children,
}) => (
  <li className="relative flex gap-2.5">
    {!isLast && (
      <span
        className="absolute left-[13px] top-7 bottom-0 w-px bg-gray-200"
        aria-hidden="true"
      />
    )}
    <div
      className="relative z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-4 ring-white"
      style={{ backgroundColor: `${accent}18`, color: accent }}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
    </div>
    <div className={clsx('min-w-0 flex-1 pb-4', isLast && 'pb-0')}>
      <div className="flex flex-wrap items-start justify-between gap-1.5">
        <div className="min-w-0">
          <h4 className="text-xs font-semibold text-gray-900">{title}</h4>
          {subtitle && <p className="mt-0.5 text-[10px] text-gray-500">{subtitle}</p>}
        </div>
        {badge && (
          <span
            className={clsx(
              'inline-flex shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold',
              badgeTone === 'green' && 'bg-emerald-100 text-emerald-700',
              badgeTone === 'orange' && 'bg-orange-100 text-orange-700',
              badgeTone === 'blue' && 'bg-[#007AFF]/10 text-[#007AFF]',
              badgeTone === 'purple' && 'bg-[#5856D6]/10 text-[#5856D6]',
              badgeTone === 'neutral' && 'bg-gray-100 text-gray-600'
            )}
          >
            {badge}
          </span>
        )}
      </div>
      {children && (
        <div className="mt-1.5 rounded-lg border border-gray-100 bg-gray-50/60 px-2.5 py-2">
          {children}
        </div>
      )}
    </div>
  </li>
);

const DetailGrid = ({ items }) => (
  <dl className="grid gap-1.5 sm:grid-cols-2">
    {items.map((item) => (
      <div key={item.label} className="flex min-w-0 items-start gap-1.5">
        <item.icon className="mt-0.5 h-3 w-3 shrink-0 text-gray-400" strokeWidth={2} />
        <div className="min-w-0">
          <dt className="text-[9px] font-medium uppercase tracking-wide text-gray-400">
            {item.label}
          </dt>
          <dd className="mt-0.5 truncate text-xs text-gray-900">{item.value}</dd>
        </div>
      </div>
    ))}
  </dl>
);

const PersonalInfoTimeline = ({
  employee,
  paymentSummary,
  onAdjustBalance,
  onOpenFaceEnrollment,
}) => {
  const [fetchViewUrl] = useLazyGetEmployeeDocumentViewUrlQuery();
  const [loadingSide, setLoadingSide] = useState(null);
  const doc = employee?.identity_document || {};
  const hasDoc = Boolean(doc.has_front || doc.has_back);
  const joined = formatDate(employee.created_at);

  const handleView = async (side) => {
    setLoadingSide(side);
    try {
      const result = await fetchViewUrl({ id: employee.id, side }).unwrap();
      window.open(result.url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      const detail = err?.data?.detail;
      if (err?.status === 503) {
        dashboardToast.error(
          detail || 'Document storage is not configured on the server.',
          'Storage unavailable'
        );
      } else {
        dashboardToast.error(detail || 'Could not open document.', 'View failed');
      }
    } finally {
      setLoadingSide(null);
    }
  };

  const salaryLabel =
    employee.salary != null && employee.salary !== ''
      ? formatMonthlySalary(employee.salary)
      : '—';

  return (
    <div
      className="grid grid-cols-1 gap-3 lg:h-[min(420px,70vh)] lg:grid-cols-[200px_minmax(0,1fr)]"
      data-tour="employee-personal-roadmap"
    >
      <div className={clsx(DASHBOARD_PANEL, 'flex max-h-[280px] min-h-0 flex-col overflow-hidden lg:max-h-none')}>
        <div className="shrink-0 border-b border-gray-100 px-3 py-2.5">
          <h3 className="text-xs font-semibold text-gray-900">Profile snapshot</h3>
          <p className="text-[10px] text-gray-500">Key details at a glance</p>
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-1.5 overflow-y-auto p-2.5 lg:grid-cols-1 lg:space-y-0">
          <StatChip
            label="Code"
            value={employee.employee_code || '—'}
            accent={DASHBOARD_ACCENTS.blue}
          />
          <StatChip
            label="Department"
            value={employee.department || '—'}
            accent={DASHBOARD_ACCENTS.purple}
          />
          <StatChip label="Salary" value={salaryLabel} accent={DASHBOARD_ACCENTS.green} />
          <StatChip
            label="Balance"
            value={paymentSummary ? formatMoney(paymentSummary.running_balance ?? 0) : '—'}
            accent={DASHBOARD_ACCENTS.orange}
          />
        </div>
      </div>

      <div className={clsx(DASHBOARD_PANEL, 'flex max-h-[360px] min-h-0 flex-col overflow-hidden lg:max-h-none')}>
        <div className="shrink-0 border-b border-gray-100 px-3 py-2.5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-xs font-semibold text-gray-900">Employee roadmap</h3>
              <p className="text-[10px] text-gray-500">
                Join → documents → role → pay → face
              </p>
            </div>
            <Link
              to="/admin/employees"
              className="text-[10px] font-medium text-[#007AFF] hover:underline"
            >
              Edit on Employees list
            </Link>
          </div>
        </div>

        <ol className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          <TimelineStep
            icon={CalendarDays}
            accent={DASHBOARD_ACCENTS.blue}
            title="Joined organization"
            subtitle={joined ? `Started ${joined}` : 'Join date not recorded'}
            badge={employee.is_active ? 'Active' : 'Inactive'}
            badgeTone={employee.is_active ? 'green' : 'neutral'}
          >
            <DetailGrid
              items={[
                {
                  label: 'Employee code',
                  value: employee.employee_code || '—',
                  icon: IdCard,
                },
                {
                  label: 'Phone',
                  value: employee.phone || '—',
                  icon: Phone,
                },
              ]}
            />
          </TimelineStep>

          <TimelineStep
            icon={FileImage}
            accent={DASHBOARD_ACCENTS.purple}
            title="Identity document"
            subtitle="Admin-only · secure short-lived links"
            badge={hasDoc ? documentTypeLabel(doc.type) : 'Not uploaded'}
            badgeTone={hasDoc ? 'purple' : 'orange'}
          >
            {!hasDoc ? (
              <p className="text-[11px] text-gray-500">
                No identity document yet. Upload when editing this employee.
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-[11px] font-medium text-gray-800">
                  {documentTypeLabel(doc.type)}
                  {doc.type === 'other' && doc.label ? (
                    <span className="ml-1 font-normal text-gray-500">({doc.label})</span>
                  ) : null}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {DOCUMENT_SIDES.map((side) => {
                    if (!doc[`has_${side}`]) return null;
                    return (
                      <button
                        key={side}
                        type="button"
                        onClick={() => handleView(side)}
                        disabled={loadingSide === side}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200/60 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-700 transition-colors hover:bg-white/80 disabled:opacity-50"
                      >
                        <Eye className="h-3 w-3 text-[#007AFF]" strokeWidth={2} />
                        View {sideLabel(side).toLowerCase()}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-start gap-1.5 rounded-lg border border-blue-100 bg-blue-50/60 px-2 py-1.5">
                  <Shield className="mt-0.5 h-3 w-3 shrink-0 text-[#007AFF]" strokeWidth={2} />
                  <p className="text-[9px] leading-relaxed text-gray-600">
                    Private storage. Links expire shortly; each view is logged. Not on kiosk.
                  </p>
                </div>
              </div>
            )}
          </TimelineStep>

          <TimelineStep
            icon={Briefcase}
            accent={DASHBOARD_ACCENTS.green}
            title="Role & department"
            subtitle="Current job placement"
            badge={employee.position || 'No position'}
            badgeTone="green"
          >
            <DetailGrid
              items={[
                {
                  label: 'Department',
                  value: employee.department || '—',
                  icon: Building2,
                },
                {
                  label: 'Position',
                  value: employee.position || '—',
                  icon: Briefcase,
                },
              ]}
            />
          </TimelineStep>

          <TimelineStep
            icon={Wallet}
            accent={DASHBOARD_ACCENTS.orange}
            title="Pay & balance"
            subtitle="Monthly salary and running ledger"
            badge={salaryLabel}
            badgeTone="orange"
          >
            <div className="space-y-2">
              <DetailGrid
                items={[
                  {
                    label: 'Monthly salary',
                    value: salaryLabel,
                    icon: Wallet,
                  },
                  {
                    label: 'Running balance',
                    value: paymentSummary
                      ? formatMoney(paymentSummary.running_balance ?? 0)
                      : '—',
                    icon: Scale,
                  },
                ]}
              />
              {onAdjustBalance && (
                <button
                  type="button"
                  onClick={() => onAdjustBalance(employee)}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200/60 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#007AFF] transition-colors hover:bg-[#007AFF]/10"
                >
                  <Scale className="h-3 w-3" strokeWidth={2} />
                  Adjust balance
                </button>
              )}
            </div>
          </TimelineStep>

          <TimelineStep
            icon={employee.has_face_enrolled ? BadgeCheck : ScanFace}
            accent={
              employee.has_face_enrolled ? DASHBOARD_ACCENTS.green : DASHBOARD_ACCENTS.orange
            }
            title="Face enrollment"
            subtitle="Required for kiosk attendance"
            badge={employee.has_face_enrolled ? 'Enrolled' : 'Pending'}
            badgeTone={employee.has_face_enrolled ? 'green' : 'orange'}
            isLast
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] text-gray-600">
                {employee.has_face_enrolled
                  ? 'Ready for kiosk clock-in.'
                  : 'Not enrolled yet — enroll from the attendance kiosk.'}
              </p>
              {onOpenFaceEnrollment && (
                <button
                  type="button"
                  onClick={onOpenFaceEnrollment}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200/60 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#007AFF] transition-colors hover:bg-[#007AFF]/10"
                >
                  <ScanFace className="h-3 w-3" strokeWidth={2} />
                  View status
                </button>
              )}
            </div>
          </TimelineStep>
        </ol>
      </div>
    </div>
  );
};

export default PersonalInfoTimeline;
