/**
 * Resolve expected work hours from a daily attendance row (shift-aware).
 * Falls back to org settings when the row has no per-employee hours.
 */

export function normalizeClockTime(value, fallback = null) {
  if (!value) return fallback;
  const str = String(value).trim();
  if (!str) return fallback;
  return str.length >= 5 ? str.slice(0, 5) : str;
}

export function formatShiftLabel(row) {
  if (!row) return '—';
  if (row.is_shift_off) return 'Off';
  const start = normalizeClockTime(row.work_start_time);
  const end = normalizeClockTime(row.work_end_time);
  if (!start || !end) return '—';
  const name = row.shift_template_name ? `${row.shift_template_name} · ` : '';
  return `${name}${start}–${end}`;
}

/**
 * @returns {{
 *   workStartTime: string|null,
 *   workEndTime: string|null,
 *   isShiftOff: boolean,
 *   shiftTemplateId: string|null,
 *   shiftTemplateName: string|null,
 *   breaks: array,
 *   overnight: boolean,
 * }}
 */
export function resolveRowWorkHours(row, orgSettings = null) {
  if (row?.is_shift_off) {
    return {
      workStartTime: null,
      workEndTime: null,
      isShiftOff: true,
      shiftTemplateId: row.shift_template_id || null,
      shiftTemplateName: row.shift_template_name || null,
      breaks: [],
      overnight: false,
    };
  }

  const rowStart = normalizeClockTime(row?.work_start_time);
  const rowEnd = normalizeClockTime(row?.work_end_time);
  if (rowStart && rowEnd) {
    return {
      workStartTime: rowStart,
      workEndTime: rowEnd,
      isShiftOff: false,
      shiftTemplateId: row.shift_template_id || null,
      shiftTemplateName: row.shift_template_name || null,
      breaks: Array.isArray(row.breaks) ? row.breaks : [],
      overnight: rowEnd <= rowStart,
    };
  }

  const orgStart = normalizeClockTime(orgSettings?.work_start_time);
  const orgEnd = normalizeClockTime(orgSettings?.work_end_time);
  return {
    workStartTime: orgStart,
    workEndTime: orgEnd,
    isShiftOff: false,
    shiftTemplateId: null,
    shiftTemplateName: null,
    breaks: [],
    overnight: Boolean(orgStart && orgEnd && orgEnd <= orgStart),
  };
}

/**
 * Aggregate work-window for a multi-employee timeline.
 * Same window for everyone → return that window.
 * Mixed / off-only → return null markers and a domain hint from all windows.
 */
export function resolveTimelineWorkWindow(rows = [], orgSettings = null) {
  const windows = rows
    .map((row) => resolveRowWorkHours(row, orgSettings))
    .filter((w) => !w.isShiftOff && w.workStartTime && w.workEndTime);

  if (windows.length === 0) {
    const fallback = resolveRowWorkHours(null, orgSettings);
    return {
      workStartTime: fallback.workStartTime,
      workEndTime: fallback.workEndTime,
      mixed: false,
      label: fallback.workStartTime
        ? `work ${fallback.workStartTime}–${fallback.workEndTime}`
        : null,
    };
  }

  const first = windows[0];
  const allSame = windows.every(
    (w) => w.workStartTime === first.workStartTime && w.workEndTime === first.workEndTime
  );

  if (allSame) {
    return {
      workStartTime: first.workStartTime,
      workEndTime: first.workEndTime,
      mixed: false,
      label: `work ${first.workStartTime}–${first.workEndTime}`,
    };
  }

  // Expand domain across all windows (overnight ends treated as 24 for span).
  let minStart = 24;
  let maxEnd = 0;
  windows.forEach((w) => {
    const [sh, sm] = w.workStartTime.split(':').map(Number);
    const [eh, em] = w.workEndTime.split(':').map(Number);
    const start = sh + sm / 60;
    let end = eh + em / 60;
    if (end <= start) end = 24;
    minStart = Math.min(minStart, start);
    maxEnd = Math.max(maxEnd, end);
  });

  const padStart = Math.max(0, Math.floor(minStart) - 1);
  const padEnd = Math.min(24, Math.ceil(maxEnd) + 1);
  const startLabel = `${String(Math.floor(padStart)).padStart(2, '0')}:00`;
  const endLabel = `${String(Math.floor(padEnd) % 24).padStart(2, '0')}:00`;

  return {
    workStartTime: null,
    workEndTime: null,
    mixed: true,
    domainStartHint: startLabel,
    domainEndHint: endLabel === '00:00' && padEnd >= 24 ? '23:59' : endLabel,
    label: 'mixed shifts',
  };
}
