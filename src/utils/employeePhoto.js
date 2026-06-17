import { API_BASE_URL } from '../config/apiBaseUrl';

export function resolveEmployeePhotoUrl(profilePhotoUrl) {
  if (!profilePhotoUrl) return null;
  if (profilePhotoUrl.startsWith('http://') || profilePhotoUrl.startsWith('https://')) {
    return profilePhotoUrl;
  }
  const path = profilePhotoUrl.startsWith('/') ? profilePhotoUrl : `/${profilePhotoUrl}`;
  return `${API_BASE_URL}${path}`;
}

export function isAuthenticatedPhotoPath(url) {
  return Boolean(url && url.includes('/profile-photo'));
}

export async function fetchAuthenticatedPhotoBlob(profilePhotoUrl) {
  const url = resolveEmployeePhotoUrl(profilePhotoUrl);
  if (!url || !isAuthenticatedPhotoPath(profilePhotoUrl)) {
    return null;
  }
  const token = localStorage.getItem('access_token');
  if (!token) {
    return null;
  }
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    return null;
  }
  return response.blob();
}
