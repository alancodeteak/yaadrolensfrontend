import { AlertTriangle } from 'lucide-react';

/**
 * Amber badge for admin shift mismatch warnings (tooltip lists all messages).
 */
export default function ShiftWarningsBadge({ warnings = [], className = '' }) {
  if (!warnings.length) return null;

  const title = warnings.map((warning) => warning.message).join('\n');

  return (
    <span
      title={title}
      aria-label={`Shift warning: ${title}`}
      className={`inline-flex shrink-0 items-center gap-0.5 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800 ${className}`}
    >
      <AlertTriangle className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
      {warnings.length > 1 ? warnings.length : null}
    </span>
  );
}
