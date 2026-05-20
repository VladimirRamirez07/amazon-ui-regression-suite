import { Page, Locator } from "@playwright/test";

export async function waitForDynamicContent(
  page: Page,
  selector: string,
  timeout: number = 15000
): Promise<void> {
  await page.waitForSelector(selector, { state: "visible", timeout });
  await page.waitForLoadState("networkidle", { timeout });
}

export async function waitForElementStable(
  locator: Locator,
  timeout: number = 10000
): Promise<void> {
  await locator.waitFor({ state: "visible", timeout });
  // Esperar que deje de moverse en el DOM
  await locator.evaluate((el) =>
    new Promise<void>((resolve) => {
      const observer = new MutationObserver(() => {
        observer.disconnect();
        resolve();
      });
      observer.observe(el, { childList: true, subtree: true });
      setTimeout(resolve, 500);
    })
  );
}

export async function retryClick(
  locator: Locator,
  maxRetries: number = 3
): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await locator.click({ timeout: 5000 });
      return;
    } catch {
      if (i === maxRetries - 1) throw new Error(`Failed to click after ${maxRetries} retries`);
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}

export async function scrollIntoViewIfNeeded(
  page: Page,
  locator: Locator
): Promise<void> {
  await locator.evaluate((el) => el.scrollIntoView({ behavior: "smooth", block: "center" }));
  await page.waitForTimeout(500);
}
