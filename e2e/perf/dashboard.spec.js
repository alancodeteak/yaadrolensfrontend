import { test, expect } from '@playwright/test';
import { loginAsOrgAdmin, logTiming, DASHBOARD_WARN_MS } from './helpers.js';

test.describe('dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsOrgAdmin(page);
  });

  test('dashboard widgets become visible', async ({ page }) => {
    const started = Date.now();

    await expect(page.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeVisible();
    await expect(page.locator('.dashboard-page')).toBeVisible();

    // Wait for summary subtitle or widget grid (API data landed)
    await expect(
      page.locator('.dashboard-page').getByText(/Summary for|Active|Present/).first()
    ).toBeVisible({ timeout: 30_000 });

    logTiming('dashboard interactive', Date.now() - started, DASHBOARD_WARN_MS);
  });
});
