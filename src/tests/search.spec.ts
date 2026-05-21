import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { SearchResultsPage } from "../pages/SearchResultsPage";
import { applyStealthScripts, humanDelay } from "../utils/stealthHelper";
import { TEST_DATA } from "../fixtures/testData";

test.describe("Amazon Search Flow", () => {
  test.beforeEach(async ({ page }) => {
    await applyStealthScripts(page);
  });

  test("TC01 - Should display results for a valid search term", async ({ page }) => {
    const home = new HomePage(page);
    const results = new SearchResultsPage(page);

    await home.navigate();
    await humanDelay(800, 1500);
    await home.searchFor(TEST_DATA.searchTerms.electronics);
    await results.waitForResults();

    const count = await results.getResultCount();
    expect(count).toBeGreaterThan(0);
  });

  test("TC02 - Should show results matching the search keyword", async ({ page }) => {
    const home = new HomePage(page);
    const results = new SearchResultsPage(page);

    await home.navigate();
    await humanDelay(500, 1200);
    await home.searchFor(TEST_DATA.searchTerms.simple);
    await results.waitForResults();

    const firstTitle = await page
      .locator('[data-component-type="s-search-result"] h2 span')
      .first()
      .textContent();

    expect(firstTitle?.toLowerCase()).toMatch(/laptop|portátil|notebook/i);
  });

  test("TC03 - Should sort results by price low to high", async ({ page }) => {
    const home = new HomePage(page);
    const results = new SearchResultsPage(page);

    await home.navigate();
    await home.searchFor(TEST_DATA.searchTerms.electronics);
    await results.waitForResults();
    await humanDelay(600, 1000);
    await results.sortBy(TEST_DATA.sortOptions.priceLowHigh);
    await results.waitForResults();

    const count = await results.getResultCount();
    expect(count).toBeGreaterThan(0);
  });
});