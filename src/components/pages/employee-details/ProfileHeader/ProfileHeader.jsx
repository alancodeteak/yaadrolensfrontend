import clsx from 'clsx';
import { UserAvatar } from '../../../common';

const ProfileHeader = ({ employee }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
      <div className="px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <UserAvatar
              className="h-16 w-16 shrink-0 rounded-full ring-2 ring-gray-100"
              src={employee.photo || employee.avatar}
              name={employee.name}
              seed={employee.id}
            />
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold text-gray-900 sm:text-2xl">
                {employee.name}
              </h1>
              <p className="truncate text-sm text-gray-600">{employee.position || '—'}</p>
              <p className="truncate text-xs text-gray-500">{employee.department || '—'}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={clsx(
                'inline-flex w-fit shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold',
                employee.is_active
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100 text-gray-600'
              )}
            >
              {employee.is_active ? 'Active' : 'Inactive'}
            </span>
            <span
              className={clsx(
                'inline-flex w-fit shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold',
                employee.has_face_enrolled
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-orange-100 text-orange-700'
              )}
            >
              {employee.has_face_enrolled ? 'Face enrolled' : 'Face not enrolled'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
