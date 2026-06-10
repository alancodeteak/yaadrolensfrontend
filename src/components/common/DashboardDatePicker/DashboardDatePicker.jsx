import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const POPUP_HEIGHT = 320;

function normalizeDateKey(value) {
  if (!value) return '';
  return String(value).slice(0, 10);
}

function toIso(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function parseIso(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  return { year, month, day };
}

function formatDisplay(iso) {
  if (!iso) return 'Select date';
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const DashboardDatePicker = ({
  value,
  onChange,
  maxDate,
  minDate,
  label = 'Date',
  className,
  id,
}) => {
  const rootRef = useRef(null);
  const popupRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [popupStyle, setPopupStyle] = useState({});

  const todayKey = normalizeDateKey(maxDate || new Date().toISOString());
  const selected = normalizeDateKey(value);

  const initial = selected ? parseIso(selected) : parseIso(todayKey);
  const [viewYear, setViewYear] = useState(initial.year);
  const [viewMonth, setViewMonth] = useState(initial.month);

  useEffect(() => {
    if (!open || !selected) return;
    const parsed = parseIso(selected);
    setViewYear(parsed.year);
    setViewMonth(parsed.month);
  }, [open, selected]);

  useEffect(() => {
    if (!open || !rootRef.current) return undefined;

    const updatePosition = () => {
      const rect = rootRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const openAbove = spaceBelow < POPUP_HEIGHT && rect.top > POPUP_HEIGHT;
      setPopupStyle({
        position: 'fixed',
        left: rect.left,
        top: openAbove ? rect.top - POPUP_HEIGHT - 8 : rect.bottom + 8,
        width: Math.max(rect.width, 280),
        zIndex: 10000,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    const handleClickOutside = (event) => {
      const inTrigger = rootRef.current?.contains(event.target);
      const inPopup = popupRef.current?.contains(event.target);
      if (!inTrigger && !inPopup) setOpen(false);
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const monthLabel = new Date(viewYear, viewMonth - 1, 1).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const cells = useMemo(() => {
    const firstDow = new Date(viewYear, viewMonth - 1, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth, 0).getDate();
    const result = [];

    for (let i = 0; i < firstDow; i += 1) {
      result.push({ type: 'pad' });
    }
    for (let d = 1; d <= daysInMonth; d += 1) {
      const iso = toIso(viewYear, viewMonth, d);
      result.push({ type: 'day', dayNum: d, iso });
    }
    while (result.length % 7 !== 0) {
      result.push({ type: 'pad' });
    }
    return result;
  }, [viewYear, viewMonth]);

  const goMonth = (delta) => {
    const date = new Date(viewYear, viewMonth - 1 + delta, 1);
    setViewYear(date.getFullYear());
    setViewMonth(date.getMonth() + 1);
  };

  const isDisabled = (iso) => {
    if (maxDate && iso > normalizeDateKey(maxDate)) return true;
    if (minDate && iso < normalizeDateKey(minDate)) return true;
    return false;
  };

  const handleSelect = (iso) => {
    if (isDisabled(iso)) return;
    onChange?.(iso);
    setOpen(false);
  };

  const triggerId = id || 'dashboard-date-picker';

  const calendarPopup = open ? (
    <div
      ref={popupRef}
      role="dialog"
      aria-label={`${label} calendar`}
      style={popupStyle}
      className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
    >
      <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2.5">
        <button
          type="button"
          onClick={() => goMonth(-1)}
          className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
        </button>
        <p className="text-xs font-semibold text-gray-900">{monthLabel}</p>
        <button
          type="button"
          onClick={() => goMonth(1)}
          className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <div className="px-3 py-3">
        <div className="mb-1 grid grid-cols-7 gap-0.5">
          {WEEKDAYS.map((wd, i) => (
            <div
              key={`${wd}-${i}`}
              className="flex h-5 w-8 items-center justify-center text-[9px] font-semibold text-gray-400"
            >
              {wd}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((cell, idx) => {
            if (cell.type === 'pad') {
              return <div key={`pad-${idx}`} className="h-8 w-8" aria-hidden="true" />;
            }

            const disabled = isDisabled(cell.iso);
            const isSelected = cell.iso === selected;
            const isToday = cell.iso === todayKey;

            return (
              <button
                key={cell.iso}
                type="button"
                disabled={disabled}
                onClick={() => handleSelect(cell.iso)}
                className={clsx(
                  'flex h-8 w-8 items-center justify-center rounded-lg border text-[11px] font-medium leading-none transition-colors',
                  disabled && 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300',
                  !disabled && !isSelected && 'border-gray-100 bg-white text-gray-700 hover:bg-gray-50',
                  isSelected &&
                    'border-[#007AFF]/40 bg-[#007AFF]/15 text-[#007AFF] font-semibold',
                  isToday && !isSelected && 'ring-1 ring-[#007AFF]/50 ring-offset-1'
                )}
                aria-label={formatDisplay(cell.iso)}
                aria-pressed={isSelected}
              >
                {cell.dayNum}
              </button>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2">
          <button
            type="button"
            onClick={() => handleSelect(todayKey)}
            className="text-[11px] font-medium text-[#007AFF] hover:text-[#0066DD]"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-[11px] font-medium text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  ) : null;

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
        className="inline-flex min-w-[200px] w-full items-center justify-between gap-2 rounded-xl border border-gray-200/60 bg-white px-3 py-2 text-sm text-gray-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-colors hover:bg-gray-50/80 focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
      >
        <span className="flex items-center gap-2 truncate">
          <Calendar className="h-4 w-4 shrink-0 text-[#007AFF]" strokeWidth={2} />
          <span className="truncate">{formatDisplay(selected)}</span>
        </span>
        <ChevronDown
          className={clsx('h-4 w-4 shrink-0 text-gray-400 transition-transform', open && 'rotate-180')}
          strokeWidth={2}
        />
      </button>

      {typeof document !== 'undefined' && calendarPopup
        ? createPortal(calendarPopup, document.body)
        : null}
    </div>
  );
};

export default DashboardDatePicker;
