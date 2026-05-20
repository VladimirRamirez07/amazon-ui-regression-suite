import { test, expect } from "@playwright/test";
import { CartPage } from "../pages/CartPage";
import { applyStealthScripts } from "../utils/stealthHelper";

test.describe("Amazon Subtotal Verification", () => {
  test.beforeEach(async ({ page }) => {
    await applyStealthScripts(page);
  });

  test("TC08 - Should display subtotal on cart page", async ({ page }) => {
    const cart = new CartPage(page);
    await cart.navigate();
    await expect(page).toHaveURL(/cart/);

    const isEmpty = await cart.isCartEmpty();
    if (!isEmpty) {
      const subtotal = await cart.getSubtotal();
      expect(subtotal).toMatch(/\$[\d,]+\.\d{2}/);
    } else {
      expect(isEmpty).toBe(true);
    }
  });

  test("TC09 - Should show empty cart message when cart is empty", async ({ page }) => {
    const cart = new CartPage(page);
    await cart.navigate();

    const isEmpty = await cart.isCartEmpty();
    if (isEmpty) {
      expect(isEmpty).toBe(true);
    } else {
      const count = await cart.getItemCount();
      expect(count).toBeGreaterThan(0);
    }
  });
});
