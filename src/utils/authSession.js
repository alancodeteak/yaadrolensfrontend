import { API_BASE_URL } from '../config/apiBaseUrl';

export async function revokeRefreshToken(refreshToken, accessToken) {
  if (!refreshToken) {
    return;
  }
  const headers = { 'content-type': 'application/json' };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  } catch {
    // Offline or expired token — local sign-out still proceeds.
  }
}

export function clearLocalAuth() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
}
