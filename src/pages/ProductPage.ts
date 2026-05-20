import { Page, Locator } from "@playwright/test";

export class ProductPage {
  readonly page: Page;
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;
  readonly buyNowButton: Locator;
  readonly successBanner: Locator;
  readonly cartSidePanel: Locator;
  readonly subtotalInPanel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productTitle = page.locator("#productTitle");
    this.productPrice = page.locator(".a-price .a-offscreen").first();
    this.addToCartButton = page.locator("#add-to-cart-button");
    this.buyNowButton = page.locator("#buy-now-button");
    this.successBanner = page.locator("#NATC_SMART_WAGON_CONF_MSG_SUCCESS, #sw-atc-confirmation");
    this.cartSidePanel = page.locator("#sw-atc-details-single-container");
    this.subtotalInPanel = page.locator("#sw-subtotal");
  }

  async getTitle(): Promise<string> {
    await this.productTitle.waitFor({ state: "visible" });
    return (await this.productTitle.textContent())?.trim() ?? "";
  }

  async getPrice(): Promise<string> {
    return (await this.productPrice.textContent())?.trim() ?? "";
  }

  async addToCart() {
    await this.addToCartButton.waitFor({ state: "visible" });
    await this.addToCartButton.click();
    await this.page.waitForTimeout(2000);
  }

  async getSubtotalFromPanel(): Promise<string> {
    await this.subtotalInPanel.waitFor({ state: "visible", timeout: 8000 });
    return (await this.subtotalInPanel.textContent())?.trim() ?? "";
  }
}
