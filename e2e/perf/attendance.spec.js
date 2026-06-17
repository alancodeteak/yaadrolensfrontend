import { test, expect } from '@playwright/test';
import { loginAsOrgAdmin, logTiming, ATTENDANCE_WARN_MS } from './helpers.js';

test.describe('attendance', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsOrgAdmin(page);
  });

  test('live attendance page loads', async ({ page }) => {
    const started = Date.now();

    await page.goto('/admin/attendance');
    await expect(page.getByRole('heading', { name: 'Live attendance', level: 1 })).toBeVisible({
      timeout: 30_000,
    });

    // Table headers or search input indicate the sheet rendered
    await expect(
      page.getByPlaceholder('Search name or code…').or(page.getByText('All Status'))
    ).toBeVisible({ timeout: 30_000 });

    logTiming('attendance interactive', Date.now() - started, ATTENDANCE_WARN_MS);
  });
});
