import { Page, Locator } from "@playwright/test";

export class SearchResultsPage {
  readonly page: Page;
  readonly results: Locator;
  readonly firstResult: Locator;
  readonly priceFilter: Locator;
  readonly minPriceInput: Locator;
  readonly maxPriceInput: Locator;
  readonly priceSubmit: Locator;
  readonly sortDropdown: Locator;
  readonly reviewFilter: Locator;

  constructor(page: Page) {
    this.page = page;
    this.results = page.locator('[data-component-type="s-search-result"]');
    this.firstResult = page.locator('[data-component-type="s-search-result"]').first();
    this.minPriceInput = page.locator("#low-price");
    this.maxPriceInput = page.locator("#high-price");
    this.priceSubmit = page.locator(".a-button-text[aria-label='Go - Submit price range']");
    this.sortDropdown = page.locator("#s-result-sort-select");
    this.reviewFilter = page.locator("i.a-icon-star-medium").first();
  }

  async waitForResults() {
    await this.results.first().waitFor({ state: "visible", timeout: 15000 });
  }

  async getResultCount(): Promise<number> {
    return await this.results.count();
  }

  async filterByPriceRange(min: string, max: string) {
    await this.minPriceInput.fill(min);
    await this.maxPriceInput.fill(max);
    await this.priceSubmit.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async sortBy(option: string) {
    await this.sortDropdown.selectOption(option);
    await this.page.waitForLoadState("domcontentloaded");
  }

  async clickFirstResult() {
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.firstResult.locator("h2 a").first().click(),
    ]);
    return newPage;
  }
}
