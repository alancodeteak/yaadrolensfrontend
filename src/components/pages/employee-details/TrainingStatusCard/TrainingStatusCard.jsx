import clsx from 'clsx';
import Card from '../../../common/Card/Card';

const TrainingStatusCard = ({ employee }) => {
  const enrolled = employee.has_face_enrolled;

  return (
    <Card
      title="Face enrollment"
      subtitle="Managed via the attendance kiosk"
      variant="panel"
    >
      <div className="flex items-center justify-between rounded-xl border border-gray-200/60 bg-gray-50/50 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-gray-900">
            {enrolled ? 'Face template enrolled' : 'Face not enrolled yet'}
          </p>
          <p className="mt-0.5 text-xs text-gray-500">
            {enrolled
              ? 'Employee can clock in/out using face recognition.'
              : 'Enroll this employee from the kiosk app.'}
          </p>
        </div>
        <span
          className={clsx(
            'shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold',
            enrolled ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
          )}
        >
          {enrolled ? 'Enrolled' : 'Pending'}
        </span>
      </div>
    </Card>
  );
};

export default TrainingStatusCard;
