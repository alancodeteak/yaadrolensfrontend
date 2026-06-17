/**
 * Single source of truth for the Lens API base URL (includes /api/v1).
 * Set VITE_API_URL in .env; VITE_API_BASE_URL is accepted as a legacy alias.
 */
const raw =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8000/api/v1';

export const API_BASE_URL = raw.replace(/\/$/, '');

export default API_BASE_URL;
