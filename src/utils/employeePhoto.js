const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1').replace(/\/$/, '');

export function resolveEmployeePhotoUrl(profilePhotoUrl) {
  if (!profilePhotoUrl) return null;
  if (profilePhotoUrl.startsWith('http://') || profilePhotoUrl.startsWith('https://')) {
    return profilePhotoUrl;
  }
  const path = profilePhotoUrl.startsWith('/') ? profilePhotoUrl : `/${profilePhotoUrl}`;
  return `${API_BASE}${path}`;
}
