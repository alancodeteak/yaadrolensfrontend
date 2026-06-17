import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { ChevronDown, Search, User } from 'lucide-react';

const POPUP_HEIGHT = 280;

const menuItemClass = (active) =>
  clsx(
    'block w-full px-3 py-2.5 text-left text-sm transition-colors duration-150',
    active ? 'bg-blue-50 font-medium text-[#007AFF]' : 'text-gray-700 hover:bg-gray-50'
  );

const DashboardEmployeeSelect = ({
  value,
  onChange,
  employees = [],
  disabled = false,
  placeholder = 'Select employee...',
  id,
  className,
}) => {
  const generatedId = useId();
  const popupId = `employee-select-popup-${id || generatedId}`;
  const rootRef = useRef(null);
  const popupRef = useRef(null);
  const searchRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [popupStyle, setPopupStyle] = useState({});

  const selected = employees.find((emp) => emp.id === value);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return employees;
    return employees.filter(
      (emp) =>
        emp.name?.toLowerCase().includes(term) ||
        emp.employee_code?.toLowerCase().includes(term)
    );
  }, [employees, search]);

  useEffect(() => {
    if (!open) {
      setSearch('');
      return undefined;
    }

    const updatePosition = () => {
      if (!rootRef.current) return;
      const rect = rootRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const openAbove = spaceBelow < POPUP_HEIGHT && rect.top > POPUP_HEIGHT;
      setPopupStyle({
        position: 'fixed',
        left: rect.left,
        top: openAbove ? rect.top - POPUP_HEIGHT - 8 : rect.bottom + 8,
        width: rect.width,
        zIndex: 10000,
      });
    };

    const handleScroll = (event) => {
      if (popupRef.current?.contains(event.target)) return;
      updatePosition();
    };

    const handleClickOutside = (event) => {
      if (rootRef.current?.contains(event.target)) return;
      if (popupRef.current?.contains(event.target)) return;
      setOpen(false);
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', handleScroll, true);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    requestAnimationFrame(() => {
      searchRef.current?.focus({ preventScroll: true });
    });

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', handleScroll, true);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const displayLabel = selected
    ? `${selected.name}${selected.employee_code ? ` (${selected.employee_code})` : ''}`
    : placeholder;

  const stopBackgroundScroll = (event) => {
    event.stopPropagation();
  };

  const popup = open ? (
    <div
      ref={popupRef}
      id={popupId}
      style={popupStyle}
      className="overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
      role="listbox"
      aria-label="Employees"
      onMouseDown={stopBackgroundScroll}
      onWheel={stopBackgroundScroll}
      onTouchMove={stopBackgroundScroll}
    >
      <div className="border-b border-gray-100 p-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            ref={searchRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault();
            }}
            placeholder="Search name or code..."
            autoComplete="off"
            className="w-full rounded-lg border border-gray-200/60 bg-gray-50/80 py-2 pl-8 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#007AFF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20"
          />
        </div>
      </div>

      <div
        className="max-h-52 overflow-y-auto overscroll-contain py-1"
        onWheel={stopBackgroundScroll}
        onTouchMove={stopBackgroundScroll}
      >
        {filtered.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-gray-500">No employees found</p>
        ) : (
          filtered.map((emp) => (
            <button
              key={emp.id}
              type="button"
              role="option"
              aria-selected={value === emp.id}
              onClick={() => {
                onChange(emp.id);
                setOpen(false);
              }}
              className={menuItemClass(value === emp.id)}
            >
              <span className="block font-medium">{emp.name}</span>
              {emp.employee_code && (
                <span className="text-xs text-gray-500">{emp.employee_code}</span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  ) : null;

  return (
    <div ref={rootRef} className={clsx('relative', className)}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={clsx(
          'inline-flex w-full items-center justify-between gap-2 rounded-xl border border-gray-200/60 bg-white px-3.5 py-2.5 text-sm shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition-colors duration-200 focus:border-[#007AFF] focus:outline-none focus:ring-2 focus:ring-[#007AFF]/20 disabled:cursor-not-allowed disabled:opacity-50',
          selected ? 'text-gray-900' : 'text-gray-400'
        )}
      >
        <span className="flex min-w-0 items-center gap-2 truncate">
          <User className="h-4 w-4 shrink-0 text-[#007AFF]" strokeWidth={2} />
          <span className="truncate">{displayLabel}</span>
        </span>
        <ChevronDown
          className={clsx('h-4 w-4 shrink-0 text-gray-400 transition-transform', open && 'rotate-180')}
          strokeWidth={2}
        />
      </button>

      {typeof document !== 'undefined' && popup ? createPortal(popup, document.body) : null}
    </div>
  );
};

export default DashboardEmployeeSelect;
