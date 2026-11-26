import { expect, test } from "@playwright/test";

test("signed-out visitors are sent to sign-in", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(
    page.getByRole("heading", { name: "Sign in to REManagement" }),
  ).toBeVisible();
  await expect(page.getByLabel("Work email")).toBeVisible();
});
