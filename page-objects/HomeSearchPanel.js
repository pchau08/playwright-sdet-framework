class HomeSearchPanel {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Prefer role + accessible name for stability
    this.cityInput = page.getByRole('textbox', { name: /^city$/i });
    this.startSearchButton = page.getByRole('button', { name: /start search/i });
  }

  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }

  async searchByCity(city) {
    await this.cityInput.fill(city);
    await this.startSearchButton.click();
  }
}

module.exports = HomeSearchPanel;