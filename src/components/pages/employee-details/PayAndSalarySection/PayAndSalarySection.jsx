import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { History, Scale, Wallet } from 'lucide-react';
import { LottieLoader, Pagination } from '../../../common';
import {
  DASHBOARD_BTN_SECONDARY,
  DASHBOARD_PANEL,
} from '../../dashboard/dashboardTheme';
import {
  BalanceHistoryPanel,
  PaymentHistoryPanel,
} from '../../payment';
import { SalaryHistoryPanel } from '../../salary';
import {
  ADVANCE_STATUS_LABELS,
  ADVANCE_STATUS_STYLES,
  BONUS_STATUS_LABELS,
  BONUS_STATUS_STYLES,
  formatDate,
  formatMoney,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_STYLES,
  PAYMENT_TYPE_LABELS,
  PAYMENT_TYPE_STYLES,
} from '../../payment/paymentUtils';
import { MONTHS } from '../../payment/PaymentPeriodBar';
import { formatCurrency, formatMonthlySalary } from '../../../../utils/helpers';
import {
  useGetAdvancesQuery,
  useGetBalanceTransactionsQuery,
  useGetBonusesQuery,
  useGetEmployeePaymentHistoryQuery,
  useGetEmployeePaymentSummaryQuery,
  useGetSalaryHistoryQuery,
} from '../../../../store/api';

const HISTORY_PER_PAGE = 8;
const PREVIEW_LIMIT = 5;

const TH =
  'px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wide text-gray-400 first:pl-5 last:pr-5';
const TD = 'px-4 py-3.5 text-sm text-gray-900 first:pl-5 last:pr-5';

const periodLabel = (year, month) =>
  year && month ? `${MONTHS[(month || 1) - 1]} ${year}` : '—';

const formatSalaryChange = (value) =>
  value != null ? formatCurrency(value, { maximumFractionDigits: 0 }) : '—';

const StatCard = ({ label, value, accent }) => (
  <div className="rounded-xl border border-gray-100 bg-gray-50/60 px-3 py-3">
    <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500">{label}</p>
    <p className="mt-1 text-lg font-semibold tabular-nums tracking-tight" style={{ color: accent || '#111827' }}>
      {value}
    </p>
  </div>
);

const SectionHeader = ({ title, subtitle, actions }) => (
  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 px-4 py-3 sm:px-5">
    <div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {subtitle ? <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p> : null}
    </div>
    {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
  </div>
);

const EmptyRow = ({ colSpan, message }) => (
  <tr>
    <td colSpan={colSpan} className="px-5 py-10 text-center text-sm text-gray-500">
      {message}
    </td>
  </tr>
);

const PayAndSalarySection = ({ employee, onAdjustBalance }) => {
  const employeeId = employee?.id;
  const [payoutPage, setPayoutPage] = useState(1);
  const [salaryHistoryOpen, setSalaryHistoryOpen] = useState(false);
  const [salaryHistoryPage, setSalaryHistoryPage] = useState(1);
  const [balanceHistoryOpen, setBalanceHistoryOpen] = useState(false);
  const [balanceHistoryPage, setBalanceHistoryPage] = useState(1);
  const [fullPayoutOpen, setFullPayoutOpen] = useState(false);
  const [fullPayoutPage, setFullPayoutPage] = useState(1);

  const { data: summary, isLoading: summaryLoading } = useGetEmployeePaymentSummaryQuery(
    employeeId,
    { skip: !employeeId }
  );

  const { data: payoutHistory, isLoading: payoutLoading } = useGetEmployeePaymentHistoryQuery(
    {
      employeeId,
      skip: (payoutPage - 1) * HISTORY_PER_PAGE,
      limit: HISTORY_PER_PAGE,
    },
    { skip: !employeeId }
  );

  const { data: fullPayoutHistory, isLoading: fullPayoutLoading } =
    useGetEmployeePaymentHistoryQuery(
      {
        employeeId,
        skip: (fullPayoutPage - 1) * HISTORY_PER_PAGE,
        limit: HISTORY_PER_PAGE,
      },
      { skip: !employeeId || !fullPayoutOpen }
    );

  const { data: advancesData, isLoading: advancesLoading } = useGetAdvancesQuery(
    { employee_id: employeeId, skip: 0, limit: 20 },
    { skip: !employeeId }
  );

  const { data: bonusesData, isLoading: bonusesLoading } = useGetBonusesQuery(
    { employee_id: employeeId, skip: 0, limit: 20 },
    { skip: !employeeId }
  );

  const { data: salaryHistory, isLoading: salaryHistoryLoading } = useGetSalaryHistoryQuery(
    {
      employeeId,
      skip: (salaryHistoryPage - 1) * HISTORY_PER_PAGE,
      limit: HISTORY_PER_PAGE,
    },
    { skip: !employeeId || !salaryHistoryOpen }
  );

  const { data: salaryPreview } = useGetSalaryHistoryQuery(
    { employeeId, skip: 0, limit: PREVIEW_LIMIT },
    { skip: !employeeId }
  );

  const { data: balanceTransactions, isLoading: balanceLoading } =
    useGetBalanceTransactionsQuery(
      {
        employeeId,
        skip: (balanceHistoryPage - 1) * HISTORY_PER_PAGE,
        limit: HISTORY_PER_PAGE,
      },
      { skip: !employeeId || !balanceHistoryOpen }
    );

  const payoutItems = payoutHistory?.items || [];
  const payoutTotal = payoutHistory?.total ?? 0;
  const payoutTotalPages = Math.max(1, Math.ceil(payoutTotal / HISTORY_PER_PAGE));

  const fullPayoutTotal = fullPayoutHistory?.total ?? 0;
  const fullPayoutTotalPages = Math.max(1, Math.ceil(fullPayoutTotal / HISTORY_PER_PAGE));

  const advances = advancesData?.items || [];
  const bonuses = bonusesData?.items || [];
  const salaryPreviewItems = salaryPreview?.items || [];

  const salaryHistoryTotal = salaryHistory?.total ?? 0;
  const salaryHistoryTotalPages = Math.max(1, Math.ceil(salaryHistoryTotal / HISTORY_PER_PAGE));

  const balanceTotal = balanceTransactions?.total ?? 0;
  const balanceTotalPages = Math.max(1, Math.ceil(balanceTotal / HISTORY_PER_PAGE));

  const currentSalary =
    summary?.current_salary ?? employee?.salary ?? null;

  const summaryStats = useMemo(
    () => [
      {
        label: 'Monthly salary',
        value:
          currentSalary != null && currentSalary !== ''
            ? formatMonthlySalary(currentSalary)
            : '—',
        accent: '#007AFF',
      },
      {
        label: 'Total paid',
        value: formatMoney(summary?.total_paid),
        accent: '#34C759',
      },
      {
        label: 'Outstanding advance',
        value: formatMoney(summary?.outstanding_advance),
        accent: '#FF9500',
      },
      {
        label: 'Running balance',
        value: formatMoney(summary?.running_balance ?? 0),
        accent: '#5856D6',
      },
      {
        label: 'Last payment',
        value: formatDate(summary?.last_payment_date),
        accent: '#111827',
      },
    ],
    [currentSalary, summary]
  );

  return (
    <div className="space-y-4">
      <div className={DASHBOARD_PANEL}>
        <SectionHeader
          title="Pay overview"
          subtitle="Salary, payouts, advances, and balance for this employee"
          actions={
            <>
              {onAdjustBalance ? (
                <button
                  type="button"
                  onClick={() => onAdjustBalance(employee)}
                  className={clsx(DASHBOARD_BTN_SECONDARY, '!px-3 !py-2 !text-xs')}
                >
                  <Scale className="h-3.5 w-3.5 text-[#007AFF]" strokeWidth={2} />
                  Adjust balance
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setSalaryHistoryPage(1);
                  setSalaryHistoryOpen(true);
                }}
                className={clsx(DASHBOARD_BTN_SECONDARY, '!px-3 !py-2 !text-xs')}
              >
                <History className="h-3.5 w-3.5 text-[#5856D6]" strokeWidth={2} />
                Salary history
              </button>
              <button
                type="button"
                onClick={() => {
                  setBalanceHistoryPage(1);
                  setBalanceHistoryOpen(true);
                }}
                className={clsx(DASHBOARD_BTN_SECONDARY, '!px-3 !py-2 !text-xs')}
              >
                <Wallet className="h-3.5 w-3.5 text-[#FF9500]" strokeWidth={2} />
                Balance ledger
              </button>
              <Link
                to={`/admin/salary?employeeId=${employeeId}`}
                className={clsx(DASHBOARD_BTN_SECONDARY, '!px-3 !py-2 !text-xs')}
              >
                Edit salary
              </Link>
              <Link
                to="/admin/payroll"
                className={clsx(DASHBOARD_BTN_SECONDARY, '!px-3 !py-2 !text-xs')}
              >
                Open payroll
              </Link>
            </>
          }
        />
        <div className="p-4 sm:p-5">
          {summaryLoading ? (
            <div className="flex justify-center py-8">
              <LottieLoader size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
              {summaryStats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={DASHBOARD_PANEL}>
        <SectionHeader
          title="Payout history"
          subtitle="Monthly salary, advances, bonuses, and other payments"
          actions={
            <button
              type="button"
              onClick={() => {
                setFullPayoutPage(1);
                setFullPayoutOpen(true);
              }}
              className={clsx(DASHBOARD_BTN_SECONDARY, '!px-3 !py-2 !text-xs')}
            >
              Expand history
            </button>
          }
        />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50/80">
                <th className={TH}>Date</th>
                <th className={TH}>Type</th>
                <th className={TH}>Period</th>
                <th className={TH}>Status</th>
                <th className={clsx(TH, 'text-right')}>Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {payoutLoading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center">
                    <LottieLoader size={36} />
                  </td>
                </tr>
              ) : payoutItems.length === 0 ? (
                <EmptyRow colSpan={5} message="No payouts recorded yet." />
              ) : (
                payoutItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70">
                    <td className={TD}>{formatDate(item.payment_date || item.created_at)}</td>
                    <td className={TD}>
                      <span
                        className={clsx(
                          'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                          PAYMENT_TYPE_STYLES[item.payment_type] || PAYMENT_TYPE_STYLES.other
                        )}
                      >
                        {PAYMENT_TYPE_LABELS[item.payment_type] || item.payment_type}
                      </span>
                    </td>
                    <td className={TD}>{periodLabel(item.period_year, item.period_month)}</td>
                    <td className={TD}>
                      <span
                        className={clsx(
                          'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                          PAYMENT_STATUS_STYLES[item.status] || 'bg-gray-100 text-gray-600'
                        )}
                      >
                        {PAYMENT_STATUS_LABELS[item.status] || item.status}
                      </span>
                    </td>
                    <td className={clsx(TD, 'text-right font-semibold tabular-nums')}>
                      {formatMoney(item.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {payoutTotal > HISTORY_PER_PAGE ? (
          <div className="border-t border-gray-100 px-4 py-3 sm:px-5">
            <Pagination
              currentPage={payoutPage}
              totalPages={payoutTotalPages}
              totalItems={payoutTotal}
              itemsPerPage={HISTORY_PER_PAGE}
              onPageChange={setPayoutPage}
            />
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className={DASHBOARD_PANEL}>
          <SectionHeader title="Advances" subtitle="Open and recent advance requests" />
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className={TH}>Requested</th>
                  <th className={TH}>Status</th>
                  <th className={clsx(TH, 'text-right')}>Amount</th>
                  <th className={clsx(TH, 'text-right')}>Outstanding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {advancesLoading ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center">
                      <LottieLoader size={32} />
                    </td>
                  </tr>
                ) : advances.length === 0 ? (
                  <EmptyRow colSpan={4} message="No advances for this employee." />
                ) : (
                  advances.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/70">
                      <td className={TD}>{formatDate(item.advance_date || item.created_at)}</td>
                      <td className={TD}>
                        <span
                          className={clsx(
                            'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                            ADVANCE_STATUS_STYLES[item.status] || 'bg-gray-100 text-gray-600'
                          )}
                        >
                          {ADVANCE_STATUS_LABELS[item.status] || item.status}
                        </span>
                      </td>
                      <td className={clsx(TD, 'text-right tabular-nums')}>
                        {formatMoney(item.amount)}
                      </td>
                      <td className={clsx(TD, 'text-right font-semibold tabular-nums')}>
                        {formatMoney(item.outstanding_amount ?? item.outstanding)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className={DASHBOARD_PANEL}>
          <SectionHeader title="Bonuses" subtitle="Recorded bonuses for this employee" />
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className={TH}>Period</th>
                  <th className={TH}>Status</th>
                  <th className={clsx(TH, 'text-right')}>Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bonusesLoading ? (
                  <tr>
                    <td colSpan={3} className="py-10 text-center">
                      <LottieLoader size={32} />
                    </td>
                  </tr>
                ) : bonuses.length === 0 ? (
                  <EmptyRow colSpan={3} message="No bonuses recorded yet." />
                ) : (
                  bonuses.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/70">
                      <td className={TD}>{periodLabel(item.period_year, item.period_month)}</td>
                      <td className={TD}>
                        <span
                          className={clsx(
                            'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                            BONUS_STATUS_STYLES[item.status] || 'bg-gray-100 text-gray-600'
                          )}
                        >
                          {BONUS_STATUS_LABELS[item.status] || item.status}
                        </span>
                      </td>
                      <td className={clsx(TD, 'text-right font-semibold tabular-nums')}>
                        {formatMoney(item.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className={DASHBOARD_PANEL}>
        <SectionHeader
          title="Salary changes"
          subtitle="Recent changes to monthly salary"
          actions={
            <button
              type="button"
              onClick={() => {
                setSalaryHistoryPage(1);
                setSalaryHistoryOpen(true);
              }}
              className={clsx(DASHBOARD_BTN_SECONDARY, '!px-3 !py-2 !text-xs')}
            >
              View all
            </button>
          }
        />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead>
              <tr className="bg-gray-50/80">
                <th className={TH}>Effective</th>
                <th className={TH}>Previous</th>
                <th className={TH}>New</th>
                <th className={TH}>Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {salaryPreviewItems.length === 0 ? (
                <EmptyRow colSpan={4} message="No salary changes recorded yet." />
              ) : (
                salaryPreviewItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/70">
                    <td className={TD}>{formatDate(item.effective_date)}</td>
                    <td className={clsx(TD, 'tabular-nums')}>
                      {formatSalaryChange(item.previous_amount)}
                    </td>
                    <td className={clsx(TD, 'font-semibold tabular-nums')}>
                      {formatSalaryChange(item.new_amount)}
                    </td>
                    <td className={clsx(TD, 'max-w-[16rem] truncate text-gray-600')}>
                      {item.reason || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PaymentHistoryPanel
        isOpen={fullPayoutOpen}
        employee={employee}
        summary={summary}
        history={fullPayoutHistory}
        isLoading={fullPayoutLoading}
        summaryLoading={summaryLoading}
        currentPage={fullPayoutPage}
        totalPages={fullPayoutTotalPages}
        totalItems={fullPayoutTotal}
        itemsPerPage={HISTORY_PER_PAGE}
        onPageChange={setFullPayoutPage}
        onClose={() => setFullPayoutOpen(false)}
        onAdjustBalance={onAdjustBalance ? () => onAdjustBalance(employee) : undefined}
      />

      <SalaryHistoryPanel
        isOpen={salaryHistoryOpen}
        employee={employee}
        history={salaryHistory}
        isLoading={salaryHistoryLoading}
        currentPage={salaryHistoryPage}
        totalPages={salaryHistoryTotalPages}
        totalItems={salaryHistoryTotal}
        itemsPerPage={HISTORY_PER_PAGE}
        onPageChange={setSalaryHistoryPage}
        onClose={() => setSalaryHistoryOpen(false)}
      />

      <BalanceHistoryPanel
        isOpen={balanceHistoryOpen}
        employee={employee}
        transactions={balanceTransactions}
        runningBalance={
          balanceTransactions?.running_balance ?? summary?.running_balance ?? 0
        }
        isLoading={balanceLoading}
        currentPage={balanceHistoryPage}
        totalPages={balanceTotalPages}
        totalItems={balanceTotal}
        itemsPerPage={HISTORY_PER_PAGE}
        onPageChange={setBalanceHistoryPage}
        onClose={() => setBalanceHistoryOpen(false)}
        onAdjust={onAdjustBalance ? () => onAdjustBalance(employee) : undefined}
      />
    </div>
  );
};

export default PayAndSalarySection;
