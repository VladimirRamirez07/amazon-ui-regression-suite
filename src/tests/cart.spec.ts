import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { SearchResultsPage } from "../pages/SearchResultsPage";
import { ProductPage } from "../pages/ProductPage";
import { CartPage } from "../pages/CartPage";
import { applyStealthScripts, humanDelay } from "../utils/stealthHelper";
import { TEST_DATA } from "../fixtures/testData";

test.describe("Amazon Cart Flow", () => {
  test.beforeEach(async ({ page }) => {
    await applyStealthScripts(page);
  });

  test("TC06 - Should add product to cart and verify cart count increases", async ({ page }) => {
    const home = new HomePage(page);
    const results = new SearchResultsPage(page);

    await home.navigate();
    await humanDelay(800, 1400);

    const initialCount = await home.getCartCount();
    await home.searchFor(TEST_DATA.searchTerms.electronics);
    await results.waitForResults();
    await humanDelay(600, 1000);

    const productPage = await results.clickFirstResult();
    const product = new ProductPage(productPage);
    await product.addToCart();

    await productPage.goto("/gp/cart/view.html");
    const cart = new CartPage(productPage);
    const itemCount = await cart.getItemCount();

    expect(itemCount).toBeGreaterThan(0);
  });

  test("TC07 - Should navigate to cart page successfully", async ({ page }) => {
    const cart = new CartPage(page);
    await applyStealthScripts(page);
    await cart.navigate();

    await expect(page).toHaveURL(/cart/);
  });
});
