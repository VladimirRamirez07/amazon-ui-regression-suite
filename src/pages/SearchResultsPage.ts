import { Page, Locator } from "@playwright/test";

export class SearchResultsPage {
  readonly page: Page;
  readonly results: Locator;
  readonly firstResult: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.results = page.locator('[data-component-type="s-search-result"]');
    this.firstResult = page.locator('[data-component-type="s-search-result"]').first();
    this.sortDropdown = page.locator("#s-result-sort-select");
  }

  async dismissLocationPopupIfPresent() {
    try {
      for (const text of ["Dismiss", "CONTINUAR"]) {
        const btn = this.page.locator(`text="${text}"`).first();
        if (await btn.isVisible({ timeout: 2000 })) {
          await btn.click();
          await this.page.waitForTimeout(800);
          break;
        }
      }
    } catch {
      // No popup, continue
    }
  }

  async waitForResults() {
    await this.dismissLocationPopupIfPresent();
    await this.results.first().waitFor({ state: "visible", timeout: 15000 });
  }

  async getResultCount(): Promise<number> {
    return await this.results.count();
  }

  async filterByFreeShipping() {
    try {
      await this.dismissLocationPopupIfPresent();
      await this.page.evaluate(() => window.scrollTo(0, 0));
      await this.page.waitForTimeout(500);

      const selectors = [
        "text=Elegible para Envío Gratis",
        "text=Eligible for Free Shipping",
        "label:has-text('Envío Gratis')",
        "[aria-label*='Envío Gratis']",
        "span:has-text('Elegible para Envío Gratis')",
      ];

      for (const sel of selectors) {
        const el = this.page.locator(sel).first();
        if (await el.isVisible({ timeout: 2000 })) {
          await el.click();
          await this.page.waitForLoadState("domcontentloaded");
          return;
        }
      }
      throw new Error("selector not found");
    } catch {
      throw new Error("Free shipping filter not found.");
    }
  }

  async sortBy(option: string) {
    await this.dismissLocationPopupIfPresent();
    await this.sortDropdown.selectOption(option);
    await this.page.waitForLoadState("domcontentloaded");
  }

  async clickFirstResult() {
    await this.dismissLocationPopupIfPresent();
    const linkSelectors = [
      '[data-component-type="s-search-result"] h2 a',
      '[data-component-type="s-search-result"] a.a-link-normal.s-no-outline',
      '[data-component-type="s-search-result"] .s-product-image-container a',
    ];
    for (const selector of linkSelectors) {
      const el = this.page.locator(selector).first();
      if (await el.isVisible({ timeout: 3000 })) {
        const href = await el.getAttribute("href");
        if (href) {
          const fullUrl = href.startsWith("http")
            ? href
            : `https://www.amazon.com${href}`;
          await this.page.goto(fullUrl);
          return this.page;
        }
      }
    }
    throw new Error("No clickable product link found in search results.");
  }
}