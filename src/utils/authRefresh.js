import { API_BASE_URL } from '../config/apiBaseUrl';
import { clearLocalAuth, revokeRefreshToken } from './authSession';

/** Single in-flight refresh so parallel 401s don't rotate/revoke tokens twice. */
let refreshPromise = null;

async function performRefresh(tokenUsed) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ refresh_token: tokenUsed }),
    });

    if (!response.ok) {
      if (localStorage.getItem('refresh_token') === tokenUsed) {
        await revokeRefreshToken(tokenUsed);
        clearLocalAuth();
      }
      return null;
    }

    const data = await response.json();
    if (!data?.access_token) {
      if (localStorage.getItem('refresh_token') === tokenUsed) {
        await revokeRefreshToken(tokenUsed);
        clearLocalAuth();
      }
      return null;
    }

    localStorage.setItem('access_token', data.access_token);
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
    }
    return data.access_token;
  } catch {
    if (localStorage.getItem('refresh_token') === tokenUsed) {
      await revokeRefreshToken(tokenUsed);
      clearLocalAuth();
    }
    return null;
  }
}

/** Refresh the access token once for all concurrent callers. */
export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    return null;
  }

  if (!refreshPromise) {
    const tokenUsed = refreshToken;
    refreshPromise = performRefresh(tokenUsed).finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}
