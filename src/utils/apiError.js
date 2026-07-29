const humanizeField = (field) => {
  if (!field) return '';
  const parts = String(field)
    .split('->')
    .map((p) => p.trim())
    .filter((p) => p && p !== 'body');
  if (parts.length === 0) return '';
  const last = parts[parts.length - 1];
  if (/^\d+$/.test(last) && parts.length > 1) {
    const parent = parts[parts.length - 2];
    return `${parent.replace(/_/g, ' ')} ${Number(last) + 1}`;
  }
  return last.replace(/_/g, ' ');
};

/**
 * Extract a user-facing message from an RTK Query / API error response.
 */
export const getApiErrorMessage = (err, fallback = 'Something went wrong. Please try again.') => {
  if (!err) return fallback;

  const data = err.data ?? err;

  const validationErrors = data?.error_data?.validation_errors ?? data?.validation_errors;
  if (Array.isArray(validationErrors) && validationErrors.length > 0) {
    return validationErrors
      .map((entry) => {
        const message = entry.message || entry.msg;
        const field = humanizeField(entry.field);
        if (message && field) return `${field}: ${message}`;
        return message || field || String(entry);
      })
      .join('\n');
  }

  const detail = data?.detail;
  if (typeof detail === 'string' && detail !== 'Request validation failed') {
    return detail;
  }
  if (Array.isArray(detail)) {
    const messages = detail.map((entry) => entry.msg || entry.message || String(entry)).filter(Boolean);
    if (messages.length > 0) return messages.join('; ');
  }
  if (typeof detail === 'string') return detail;

  if (typeof err.message === 'string' && err.message !== 'Rejected') {
    return err.message;
  }

  return fallback;
};
