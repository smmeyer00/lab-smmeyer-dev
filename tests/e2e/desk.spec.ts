import { expect, test } from "@playwright/test";

test.describe.configure({ timeout: 45_000 });

test("loads the desk model into the interactive viewer", async ({ page }) => {
  const browserErrors: string[] = [];
  const failedRequests: string[] = [];
  let modelResponseStatus: number | undefined;

  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));
  page.on("requestfailed", (request) => {
    failedRequests.push(`${request.url()}: ${request.failure()?.errorText}`);
  });
  page.on("response", (response) => {
    if (response.url().endsWith("/models/desk-setup.glb")) {
      modelResponseStatus = response.status();
    }
  });

  await page.goto("/desk");

  await expect(page).toHaveTitle("Desk — SM Meyer Lab");
  await expect(page.getByRole("heading", { level: 1, name: "DESK." })).toBeVisible();
  const viewer = page.getByTestId("desk-viewer");
  try {
    await expect(viewer).toHaveAttribute("data-ready", "true", {
      timeout: 30_000,
    });
  } catch {
    throw new Error(
      `Scene did not become ready. Browser errors: ${JSON.stringify(browserErrors)}. Failed requests: ${JSON.stringify(failedRequests)}`,
    );
  }
  await expect(page.locator("canvas")).toBeVisible();
  await expect(page.getByText("Scene ready")).toBeVisible();

  expect(modelResponseStatus).toBe(200);
  expect(browserErrors).toEqual([]);
});

test("opens and closes the experiment details", async ({ page }) => {
  await page.goto("/desk");

  await page.getByRole("button", { name: "About this experiment" }).click();
  const details = page.locator('aside[aria-label="About the desk experiment"]');

  await expect(details).toHaveAttribute("aria-hidden", "false");
  await expect(
    page.getByRole("heading", { name: "Rebuilt from a handful of photos." }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Close about panel" }).click();
  await expect(details).toHaveAttribute("aria-hidden", "true");
});

test("enters and exits the keyboard walkthrough", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.startsWith("mobile-"), "Desktop projects only");

  await page.goto("/desk");
  const viewer = page.getByTestId("desk-viewer");
  await expect(viewer).toHaveAttribute("data-ready", "true", { timeout: 30_000 });

  await page.getByRole("button", { name: "Enter scene" }).click();
  await expect(viewer).toHaveAttribute("data-mode", "walk");

  await page.keyboard.press("Escape");
  await expect(viewer).toHaveAttribute("data-mode", "inspect");
});

test("links back to the lab and stays within the viewport", async ({ page }) => {
  await page.goto("/desk");

  await expect(page.getByRole("link", { name: /Smmeyer.*Lab/i })).toHaveAttribute(
    "href",
    "/",
  );

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test("shows touch controls on coarse-pointer devices", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile-"), "Mobile projects only");

  await page.goto("/desk");

  await expect(page.getByText("Drag orbit / pinch zoom")).toBeVisible();
  await expect(page.getByRole("button", { name: "Enter scene" })).toHaveCount(0);
});
