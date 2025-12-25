const { test, expect } = require('@playwright/test');
const HomeSearchPanel = require('../../page-objects/HomeSearchPanel');

test.describe('@smoke', () => {
  test('Critical path: user can search listings by city', async ({ page }) => {
    const homeSearch = new HomeSearchPanel(page);

    await homeSearch.goto();
    await homeSearch.searchByCity('Chicago');

    // Keep this assertion lightweight + stable until we pick a better result anchor
    await expect(page).toHaveURL(/search|featured-listings|listings/i);
  });
});