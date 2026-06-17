/** Shared helpers for perf smoke tests. */

const DASHBOARD_WARN_MS = 5000;
const ATTENDANCE_WARN_MS = 5000;

export function getE2eCredentials() {
  const login = process.env.E2E_ORG_ADMIN_LOGIN;
  const password = process.env.E2E_ORG_ADMIN_PASSWORD;
  if (!login || !password) {
    throw new Error(
      'Set E2E_ORG_ADMIN_LOGIN and E2E_ORG_ADMIN_PASSWORD in .env.e2e or the environment'
    );
  }
  return {
    login,
    password,
    orgCode: process.env.E2E_ORG_CODE,
  };
}

export function logTiming(label, durationMs, warnThresholdMs) {
  const message = `[perf] ${label}: ${durationMs.toFixed(0)}ms`;
  if (durationMs > warnThresholdMs) {
    console.warn(`${message} (exceeds ${warnThresholdMs}ms soft threshold)`);
  } else {
    console.log(message);
  }
}

export async function loginAsOrgAdmin(page) {
  const { login, password } = getE2eCredentials();
  const started = Date.now();

  await page.goto('/login');
  await page.locator('input[name="login_id"]').fill(login);
  await page.locator('input[name="password"]').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForURL('**/admin/dashboard', { timeout: 30_000 });

  logTiming('login → dashboard', Date.now() - started, DASHBOARD_WARN_MS);
}

export { DASHBOARD_WARN_MS, ATTENDANCE_WARN_MS };
