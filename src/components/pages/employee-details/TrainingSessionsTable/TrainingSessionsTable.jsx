import Card from '../../../common/Card/Card';

const TrainingSessionsTable = ({ employee }) => {
  const enrolled = employee.has_face_enrolled;

  return (
    <Card title="Enrollment history" subtitle="Face templates from the kiosk" variant="panel">
      {!enrolled ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 px-4 py-8 text-center">
          <p className="text-sm font-medium text-gray-900">No enrollment yet</p>
          <p className="mt-1 text-xs text-gray-500">
            Enroll this employee from the attendance kiosk using face recognition.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200/60 bg-emerald-50/50 px-4 py-3">
          <p className="text-sm font-medium text-emerald-800">Face template active</p>
          <p className="mt-0.5 text-xs text-emerald-700">
            Employee is enrolled and can use kiosk clock-in/out.
          </p>
        </div>
      )}
    </Card>
  );
};

export default TrainingSessionsTable;
