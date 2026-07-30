import { API_BASE_URL } from '../config/apiBaseUrl';
import { refreshAccessToken } from './authRefresh';

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

async function fetchPhotoWithToken(url, token) {
  return fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

const blobInflight = new Map();
const objectUrlCache = new Map();

export function clearAuthenticatedPhotoCache() {
  objectUrlCache.forEach((objectUrl) => URL.revokeObjectURL(objectUrl));
  objectUrlCache.clear();
  blobInflight.clear();
}

export async function fetchAuthenticatedPhotoBlob(profilePhotoUrl) {
  const url = resolveEmployeePhotoUrl(profilePhotoUrl);
  if (!url || !isAuthenticatedPhotoPath(profilePhotoUrl)) {
    return null;
  }

  if (blobInflight.has(profilePhotoUrl)) {
    return blobInflight.get(profilePhotoUrl);
  }

  const fetchPromise = (async () => {
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
  })();

  blobInflight.set(profilePhotoUrl, fetchPromise);

  try {
    return await fetchPromise;
  } finally {
    blobInflight.delete(profilePhotoUrl);
  }
}

export async function ensureAuthenticatedPhotoObjectUrl(profilePhotoUrl) {
  if (!profilePhotoUrl || !isAuthenticatedPhotoPath(profilePhotoUrl)) {
    return null;
  }

  const cached = objectUrlCache.get(profilePhotoUrl);
  if (cached) {
    return cached;
  }

  const blob = await fetchAuthenticatedPhotoBlob(profilePhotoUrl);
  if (!blob) {
    return null;
  }

  const objectUrl = URL.createObjectURL(blob);
  objectUrlCache.set(profilePhotoUrl, objectUrl);
  return objectUrl;
}
