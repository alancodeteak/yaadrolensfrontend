import clsx from 'clsx';
import Card from '../../../common/Card/Card';

const AttendanceLog = () => {
  const attendanceRecords = [
    { id: 1, date: '2024-05-10', clockIn: '08:55 AM', clockOut: '05:05 PM', totalHours: '8h 10m', status: 'Present' },
    { id: 2, date: '2024-05-09', clockIn: '09:15 AM', clockOut: '05:00 PM', totalHours: '7h 45m', status: 'Late' },
    { id: 3, date: '2024-05-08', clockIn: '08:58 AM', clockOut: '05:02 PM', totalHours: '8h 04m', status: 'Present' },
    { id: 4, date: '2024-05-07', clockIn: 'N/A', clockOut: 'N/A', totalHours: '0h 0m', status: 'Absence' },
  ];

  const statusClass = {
    Present: 'bg-emerald-100 text-emerald-700',
    Late: 'bg-orange-100 text-orange-700',
    Absence: 'bg-gray-100 text-gray-600',
  };

  return (
    <Card title="Recent attendance" subtitle="Last recorded clock events" variant="panel" bodyClassName="p-0 sm:p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px]">
          <thead>
            <tr className="border-b border-gray-100">
              {['Date', 'Clock in', 'Clock out', 'Hours', 'Status'].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 first:pl-5 last:pr-5"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {attendanceRecords.map((record) => (
              <tr key={record.id} className="transition-colors hover:bg-gray-50/80">
                <td className="whitespace-nowrap px-4 py-3 pl-5 text-sm text-gray-900">{record.date}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{record.clockIn}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">{record.clockOut}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm tabular-nums text-gray-700">{record.totalHours}</td>
                <td className="whitespace-nowrap px-4 py-3 pr-5">
                  <span
                    className={clsx(
                      'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                      statusClass[record.status] || 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default AttendanceLog;
