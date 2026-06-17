import { test, expect } from '@playwright/test';
import { getE2eCredentials } from './helpers.js';

test.describe('login', () => {
  test('org admin can sign in and reach dashboard', async ({ page }) => {
    const { login, password } = getE2eCredentials();

    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Sign in to YaadroLens' })).toBeVisible();

    await page.locator('input[name="login_id"]').fill(login);
    await page.locator('input[name="password"]').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    await page.waitForURL('**/admin/dashboard', { timeout: 30_000 });
    await expect(page.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeVisible({
      timeout: 30_000,
    });
  });
});
