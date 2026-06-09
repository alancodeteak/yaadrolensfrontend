import Card from '../../../common/Card/Card';

const DetailRow = ({ label, value, icon }) => (
  <div className="flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-gray-50/80">
    <div className="mt-0.5 shrink-0">{icon}</div>
    <div className="min-w-0 flex-1">
      <dt className="text-xs font-medium text-gray-500">{label}</dt>
      <dd className="mt-0.5 break-words text-sm text-gray-900">{value}</dd>
    </div>
  </div>
);

const PersonalDetailsCard = ({ employee }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const personalDetails = [
    {
      label: 'Employee code',
      value: employee.employee_code || '—',
      icon: (
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V4a2 2 0 114 0v2m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
        </svg>
      ),
    },
    {
      label: 'Phone',
      value: employee.phone || '—',
      icon: (
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
    {
      label: 'Date joined',
      value: formatDate(employee.created_at),
      icon: (
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <Card title="Personal details" variant="panel">
      <div className="divide-y divide-gray-100">
        {personalDetails.map((detail) => (
          <DetailRow key={detail.label} {...detail} />
        ))}
      </div>
    </Card>
  );
};

export default PersonalDetailsCard;
