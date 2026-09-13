import { expect, test } from '@playwright/test';
import { apiAuthed, apiLogin, cleanupPrefix } from './helpers';

const BC = `E2EPW${Date.now().toString(36).toUpperCase()}`;
let reference = '';

test.beforeAll(async () => {
  const { status, body } = await apiLogin('Ahmed Elseyad', 'weladhalal');
  if (status !== 200) throw new Error(`setup login failed: ${status}`);
  const token = body.accessToken;
  const cats = (await apiAuthed(token, 'GET', '/categories')).body;
  const p = (await apiAuthed(token, 'POST', '/products', {
    name: 'PW E2E Item', barcode: BC, basePrice: 60, categoryId: cats[0].id,
  })).body;
  await apiAuthed(token, 'POST', '/inventory/adjust', {
    productId: p.id, branchId: 'branch-main', newQty: 50, note: 'pw setup',
  });
});

test.afterAll(async () => {
  await cleanupPrefix('E2EPW');
});

test('cashier: search → add → F12 confirm → appears in orders log', async ({ page }) => {
  await page.goto('/login');
  const inputs = page.locator('form input');
  await inputs.nth(0).fill('Ahmed Elseyad');
  await inputs.nth(1).fill('weladhalal');
  await page.getByRole('button', { name: /دخول|Login/ }).click();
  await page.waitForURL('**/orders', { timeout: 15000 });
  await page.goto('/cashier');
  await page.locator('#search-input').fill('PW E2E');
  await expect(page.getByText('PW E2E Item').first()).toBeVisible({ timeout: 10000 });
  await page.getByText('PW E2E Item').first().click();
  // cart shows the line (yellow active row)
  await expect(page.locator('text=60.00').first()).toBeVisible();
  await page.keyboard.press('F12');
  await expect(page.getByText(/تم التأكيد/)).toBeVisible({ timeout: 15000 });
  const msg = (await page.getByText(/تم التأكيد/).first().textContent()) ?? '';
  const m = msg.match(/WH-[A-Z0-9]+/);
  expect(m).toBeTruthy();
  reference = m![0];
  await page.goto('/orders');
  await expect(page.getByText(reference).first()).toBeVisible({ timeout: 10000 });
});

test('cashier: F9 hold → appears in pending orders', async ({ page }) => {
  await page.goto('/login');
  const inputs = page.locator('form input');
  await inputs.nth(0).fill('Ahmed Elseyad');
  await inputs.nth(1).fill('weladhalal');
  await page.getByRole('button', { name: /دخول|Login/ }).click();
  await page.waitForURL('**/orders', { timeout: 15000 });
  await page.goto('/cashier');
  await page.locator('#search-input').fill('PW E2E');
  await expect(page.getByText('PW E2E Item').first()).toBeVisible({ timeout: 10000 });
  await page.getByText('PW E2E Item').first().click();
  await page.keyboard.press('F9');
  await expect(page.getByText(/تم التعليق/).first()).toBeVisible({ timeout: 15000 });
  await page.goto('/pending');
  await expect(page.locator('table').getByText(/WH-HOLD-/).first()).toBeVisible({ timeout: 10000 });
});
