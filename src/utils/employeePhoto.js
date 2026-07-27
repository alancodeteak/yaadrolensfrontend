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

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    return null;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    if (!data?.access_token) {
      return null;
    }
    localStorage.setItem('access_token', data.access_token);
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
    }
    return data.access_token;
  } catch {
    return null;
  }
}

async function fetchPhotoWithToken(url, token) {
  return fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchAuthenticatedPhotoBlob(profilePhotoUrl) {
  const url = resolveEmployeePhotoUrl(profilePhotoUrl);
  if (!url || !isAuthenticatedPhotoPath(profilePhotoUrl)) {
    return null;
  }
  let token = localStorage.getItem('access_token');
  if (!token) {
    return null;
  }

  let response = await fetchPhotoWithToken(url, token);
  if (response.status === 401) {
    token = await refreshAccessToken();
    if (!token) {
      return null;
    }
    response = await fetchPhotoWithToken(url, token);
  }

  if (!response.ok) {
    return null;
  }
  return response.blob();
}
