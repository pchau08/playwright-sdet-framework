const { test, expect } = require('@playwright/test');

test.describe('@smoke', () => {
  test('Critical path: user can search listings by city', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // City textbox is labeled "City" (accessible name), not a placeholder
    await page.getByRole('textbox', { name: /^city$/i }).fill('Chicago');

    await page.getByRole('button', { name: /start search/i }).click();

    // Replace with a stable assertion once we confirm what results page shows for Chicago
    await expect(page).toHaveURL(/search|featured-listings|listings/i);
  });
});