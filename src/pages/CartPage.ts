import { Page, Locator } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly subtotal: Locator;
  readonly deleteButtons: Locator;
  readonly emptyCartMessage: Locator;
  readonly proceedToCheckout: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('[data-name="Active Items"] .sc-list-item');
    this.subtotal = page.locator("#sc-subtotal-amount-activecart .a-price .a-offscreen").first();
    this.deleteButtons = page.locator('input[value="Delete"]');
    this.emptyCartMessage = page.locator(".sc-your-amazon-cart-is-empty");
    this.proceedToCheckout = page.locator('[name="proceedToRetailCheckout"]');
  }

  async navigate() {
    await this.page.goto("/gp/cart/view.html", { waitUntil: "domcontentloaded" });
  }

  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getSubtotal(): Promise<string> {
    await this.subtotal.waitFor({ state: "visible", timeout: 10000 });
    return (await this.subtotal.textContent())?.trim() ?? "";
  }

  async deleteFirstItem() {
    await this.deleteButtons.first().click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async isCartEmpty(): Promise<boolean> {
    return await this.emptyCartMessage.isVisible();
  }
}
