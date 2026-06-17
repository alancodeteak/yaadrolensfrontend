import clsx from 'clsx';

const SIZE_CLASSES = {
  xs: 'h-5 w-5 border-2',
  sm: 'h-12 w-12 border-2',
  md: 'h-16 w-16 border-[3px]',
  lg: 'h-24 w-24 border-[3px]',
  xl: 'h-32 w-32 border-4',
};

const CssSpinner = ({ size = 'md', className, label }) => (
  <div
    role="status"
    aria-live="polite"
    aria-label={label || 'Loading'}
    className={clsx(
      'flex flex-col items-center justify-center text-center',
      className
    )}
  >
    <div
      className={clsx(
        'animate-spin rounded-full border-[#007AFF]/20 border-t-[#007AFF]',
        SIZE_CLASSES[size] || SIZE_CLASSES.md
      )}
      aria-hidden="true"
    />
    {label && <p className="mt-3 text-sm text-gray-600">{label}</p>}
  </div>
);

export default CssSpinner;
