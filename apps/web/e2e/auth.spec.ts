import { expect, test } from '@playwright/test';

test('owner login routes to orders shell with full menu', async ({ page }) => {
  await page.goto('/login');
  // two inputs only: username (text) + password
  const inputs = page.locator('form input');
  await expect(inputs).toHaveCount(2);
  await expect(inputs.nth(0)).toHaveAttribute('type', 'text');
  await inputs.nth(0).fill('Ahmed Elseyad');
  await inputs.nth(1).fill('weladhalal');
  await page.getByRole('button', { name: /دخول|Login/ }).click();
  await page.waitForURL('**/orders', { timeout: 15000 });
  await expect(page.getByText('سجل الطلبات')).toBeVisible();
  await expect(page.getByText('الإدارة')).toBeVisible();
});

test('wrong password shows generic error, no navigation', async ({ page }) => {
  await page.goto('/login');
  const inputs = page.locator('form input');
  await inputs.nth(0).fill('Ahmed Elseyad');
  await inputs.nth(1).fill('wrongpass');
  await page.getByRole('button', { name: /دخول|Login/ }).click();
  await expect(page.getByText('Invalid credentials')).toBeVisible({ timeout: 10000 });
  await expect(page).toHaveURL(/\/login/);
});
