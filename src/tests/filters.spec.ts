import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { SearchResultsPage } from "../pages/SearchResultsPage";
import { applyStealthScripts, humanDelay } from "../utils/stealthHelper";
import { TEST_DATA } from "../fixtures/testData";

test.describe("Amazon Advanced Filters", () => {
  test.beforeEach(async ({ page }) => {
    await applyStealthScripts(page);
  });

  test("TC04 - Should filter results by free shipping", async ({ page }) => {
    const home = new HomePage(page);
    const results = new SearchResultsPage(page);

    await home.navigate();
    await humanDelay(700, 1300);
    await home.searchFor(TEST_DATA.searchTerms.electronics);
    await results.waitForResults();
    await humanDelay(500, 900);

    await results.filterByFreeShipping();
    await results.waitForResults();

    const count = await results.getResultCount();
    expect(count).toBeGreaterThan(0);
  });

  test("TC05 - Should maintain results after applying sort + filter", async ({ page }) => {
    const home = new HomePage(page);
    const results = new SearchResultsPage(page);

    await home.navigate();
    await home.searchFor(TEST_DATA.searchTerms.simple);
    await results.waitForResults();
    await results.sortBy(TEST_DATA.sortOptions.avgReview);
    await results.waitForResults();

    const count = await results.getResultCount();
    expect(count).toBeGreaterThan(0);
  });
});