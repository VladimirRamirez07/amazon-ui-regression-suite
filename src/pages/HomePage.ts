import { Page, Locator } from "@playwright/test";

export class HomePage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly cartCount: Locator;
  readonly logo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator("#twotabsearchtextbox");
    this.searchButton = page.locator("#nav-search-submit-button");
    this.cartCount = page.locator("#nav-cart-count");
    this.logo = page.locator("#nav-logo");
  }

  async navigate() {
    await this.page.goto("/", { waitUntil: "domcontentloaded" });
  }

  async searchFor(term: string) {
    await this.searchInput.waitFor({ state: "visible" });
    await this.searchInput.click();
    await this.searchInput.fill(term);
    await this.searchButton.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async getCartCount(): Promise<string> {
    return (await this.cartCount.textContent()) ?? "0";
  }
}
