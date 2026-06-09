import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Clock } from 'lucide-react';

const PRESETS = [
  { label: '9:00 AM', value: '09:00' },
  { label: '12:00 PM', value: '12:00' },
  { label: '5:00 PM', value: '17:00' },
  { label: '6:00 PM', value: '18:00' },
];

function parseTime(value) {
  const [h, m] = String(value || '09:00').split(':').map(Number);
  return {
    hour: Number.isFinite(h) ? Math.min(23, Math.max(0, h)) : 9,
    minute: Number.isFinite(m) ? Math.min(59, Math.max(0, m)) : 0,
  };
}

function toTimeValue(hour, minute) {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function formatDisplay(value) {
  const { hour, minute } = parseTime(value);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function shiftByMinutes(hour, minute, delta, step) {
  let total = hour * 60 + minute + delta * step;
  total = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  return { hour: Math.floor(total / 60), minute: total % 60 };
}

const stepBtnClass =
  'rounded-xl border border-gray-200/60 p-2 text-gray-600 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-all duration-200 hover:bg-gray-50 active:scale-95';

const AnimatedValue = ({ value, className, animate = true }) => (
  <span
    key={animate ? value : undefined}
    className={clsx(
      animate && 'time-picker-value',
      'inline-block tabular-nums leading-none',
      className
    )}
  >
    {value}
  </span>
);

const TimeStepper = ({ label, display, onUp, onDown, upLabel, downLabel }) => (
  <div className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-gray-100 bg-gray-50/60 p-3 transition-colors duration-200">
    <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{label}</span>
    <button type="button" onClick={onUp} className={stepBtnClass} aria-label={upLabel}>
      <ChevronUp className="h-4 w-4" strokeWidth={2} />
    </button>
    <div className="flex h-12 w-full items-center justify-center overflow-hidden rounded-xl border border-[#007AFF]/30 bg-[#007AFF]/10 text-xl font-semibold text-[#007AFF] transition-colors duration-200">
      <AnimatedValue value={display} />
    </div>
    <button type="button" onClick={onDown} className={stepBtnClass} aria-label={downLabel}>
      <ChevronDown className="h-4 w-4" strokeWidth={2} />
    </button>
  </div>
);

const DashboardTimePicker = ({
  value,
  onChange,
  label = 'Time',
  className,
  id,
  minuteStep = 5,
}) => {
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const parsed = parseTime(value);
  const [draftHour, setDraftHour] = useState(parsed.hour);
  const [draftMinute, setDraftMinute] = useState(parsed.minute);

  useEffect(() => {
    if (!open) return;
    const next = parseTime(value);
    setDraftHour(next.hour);
    setDraftMinute(next.minute);
  }, [open, value]);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const applyTime = (hour, minute) => {
    setDraftHour(hour);
    setDraftMinute(minute);
    onChange?.(toTimeValue(hour, minute));
  };

  const shiftTime = (delta) => {
    const next = shiftByMinutes(draftHour, draftMinute, delta, 15);
    applyTime(next.hour, next.minute);
  };

  const adjustHour = (delta) => {
    applyTime((draftHour + delta + 24) % 24, draftMinute);
  };

  const adjustMinute = (delta) => {
    const next = shiftByMinutes(draftHour, draftMinute, delta, minuteStep);
    applyTime(next.hour, next.minute);
  };

  const triggerId = id || 'dashboard-time-picker';
  const currentValue = toTimeValue(draftHour, draftMinute);

  return (
    <div ref={rootRef} className={clsx('relative', className)}>
      <label htmlFor={triggerId} className="sr-only">
        {label}
      </label>
      <button
        id={triggerId}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={clsx(
          'inline-flex w-full min-w-[160px] items-center justify-between gap-2 rounded-xl border bg-white px-3 py-2.5 text-sm text-gray-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-all duration-200 hover:bg-gray-50/80 focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20',
          open ? 'border-[#007AFF]/40 ring-2 ring-[#007AFF]/10' : 'border-gray-200/60'
        )}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#007AFF]/10">
            <Clock className="h-3.5 w-3.5 text-[#007AFF]" strokeWidth={2} aria-hidden="true" />
          </span>
          <span className="truncate text-sm font-medium tabular-nums leading-none text-gray-900">
            {formatDisplay(value)}
          </span>
        </span>
        <ChevronDown
          className={clsx(
            'h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200',
            open && 'rotate-180'
          )}
          strokeWidth={2}
        />
      </button>

      <div
        role="dialog"
        aria-label={`${label} picker`}
        aria-hidden={!open}
        data-open={open ? 'true' : 'false'}
        className="time-picker-popover absolute left-0 z-50 mt-2 w-[260px] overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2.5">
          <button
            type="button"
            onClick={() => shiftTime(-1)}
            className="rounded-lg p-1.5 text-gray-500 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 active:scale-95"
            aria-label="15 minutes earlier"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>
          <p className="text-sm font-semibold text-gray-900">
            <AnimatedValue value={formatDisplay(currentValue)} />
          </p>
          <button
            type="button"
            onClick={() => shiftTime(1)}
            className="rounded-lg p-1.5 text-gray-500 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 active:scale-95"
            aria-label="15 minutes later"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        <div className="space-y-3 p-3">
          <div className="flex gap-2">
            <TimeStepper
              label="Hour"
              display={String(draftHour).padStart(2, '0')}
              onUp={() => adjustHour(1)}
              onDown={() => adjustHour(-1)}
              upLabel="Increase hour"
              downLabel="Decrease hour"
            />
            <TimeStepper
              label="Minute"
              display={String(draftMinute).padStart(2, '0')}
              onUp={() => adjustMinute(1)}
              onDown={() => adjustMinute(-1)}
              upLabel="Increase minute"
              downLabel="Decrease minute"
            />
          </div>

          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Quick pick
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((preset) => {
                const selected = preset.value === toTimeValue(draftHour, draftMinute);
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => {
                      const p = parseTime(preset.value);
                      applyTime(p.hour, p.minute);
                    }}
                    className={clsx(
                      'rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200 active:scale-95',
                      selected
                        ? 'border-[#007AFF]/40 bg-[#007AFF]/10 text-[#007AFF]'
                        : 'border-gray-100 bg-white text-gray-600 hover:bg-gray-50'
                    )}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end border-t border-gray-100 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-1 text-[11px] font-medium text-[#007AFF] transition-colors duration-200 hover:text-[#0066DD]"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTimePicker;
