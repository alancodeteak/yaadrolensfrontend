import Card from '../../../common/Card/Card';

const DetailRow = ({ label, value, icon, badge }) => (
  <div className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-gray-50/80">
    <div className="mt-0.5 shrink-0">{icon}</div>
    <div className="min-w-0 flex-1">
      <dt className="text-xs font-medium text-gray-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-gray-900">
        {badge ?? value}
      </dd>
    </div>
  </div>
);

const JobInformationCard = ({ employee }) => {
  const jobDetails = [
    {
      label: 'Department',
      value: employee.department || '—',
      icon: (
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      label: 'Position',
      value: employee.position || '—',
      icon: (
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V9a2 2 0 11-4 0V6m0 0V4.5a2 2 0 114 0V6m-4 0H8m8 0h2.5A1.5 1.5 0 0120 7.5V11h-2.5a2 2 0 11-4 0H11" />
        </svg>
      ),
    },
    {
      label: 'Monthly salary',
      value:
        employee.salary != null && employee.salary !== ''
          ? `$${Number(employee.salary).toLocaleString()}/mo`
          : '—',
      icon: (
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <Card title="Job information" variant="panel">
      <div className="divide-y divide-gray-100">
        {jobDetails.map((detail) => (
          <DetailRow key={detail.label} {...detail} />
        ))}
      </div>
    </Card>
  );
};

export default JobInformationCard;
