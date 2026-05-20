import { Page } from "@playwright/test";

export async function applyStealthScripts(page: Page): Promise<void> {
  await page.addInitScript(() => {
    // Ocultar webdriver
    Object.defineProperty(navigator, "webdriver", {
      get: () => undefined,
    });

    // Simular plugins reales
    Object.defineProperty(navigator, "plugins", {
      get: () => [1, 2, 3, 4, 5],
    });

    // Simular idiomas reales
    Object.defineProperty(navigator, "languages", {
      get: () => ["en-US", "en"],
    });

    // Ocultar automation en chrome
    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters: PermissionDescriptor) =>
      parameters.name === "notifications"
        ? Promise.resolve({ state: Notification.permission } as PermissionStatus)
        : originalQuery(parameters);
  });
}

export async function humanDelay(
  min: number = 500,
  max: number = 1500
): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

export async function humanType(
  page: Page,
  selector: string,
  text: string
): Promise<void> {
  await page.click(selector);
  await page.fill(selector, "");
  for (const char of text) {
    await page.type(selector, char, {
      delay: Math.floor(Math.random() * 100) + 50,
    });
  }
}
