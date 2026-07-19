import { test, expect } from "@playwright/test";

test("has correct title and loads successfully", async ({ page }) => {
  await page.goto("/");

  // Expect the title to contain "Center for Mental Health and Care, Bangladesh"
  await expect(page).toHaveTitle(/Center for Mental Health and Care, Bangladesh/);

  // Expect the header/navigation to be visible
  const header = page.locator("header");
  await expect(header).toBeVisible();
});
