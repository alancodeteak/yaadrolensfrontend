import { FileQuestion } from 'lucide-react';

export const notFoundActionClass =
  'rounded-xl bg-[#007AFF] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0066DD]';

export const notFoundSecondaryActionClass =
  'rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50';

const NotFoundState = ({
  title = 'Not found',
  message,
  children,
  fullScreen = false,
  className = '',
  animationClassName = 'h-24 w-24',
}) => {
  const containerClass = fullScreen
    ? 'flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12'
    : 'flex min-h-[50vh] flex-col items-center justify-center px-4 py-12';

  return (
    <div className={`${containerClass} ${className}`.trim()}>
      <div
        aria-hidden="true"
        className={`flex items-center justify-center rounded-full bg-gray-100 ${animationClassName}`}
      >
        <FileQuestion className="h-12 w-12 text-gray-400" strokeWidth={1.5} />
      </div>
      <h1 className="mt-4 text-center text-2xl font-bold text-gray-900">{title}</h1>
      {message ? (
        <p className="mt-2 max-w-md text-center text-sm text-gray-600">{message}</p>
      ) : null}
      {children ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{children}</div>
      ) : null}
    </div>
  );
};

export default NotFoundState;
