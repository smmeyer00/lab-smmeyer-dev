import { expect, test } from "@playwright/test";

test.describe.configure({ timeout: 60_000 });

test("loads the collection into the 3D viewer", async ({ page }) => {
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
    if (response.url().endsWith("/models/books/reading-arrangement.glb")) {
      modelResponseStatus = response.status();
    }
  });

  await page.goto("/books");

  await expect(page).toHaveTitle("Books — SM Meyer Lab");
  await expect(page.getByRole("heading", { level: 1, name: "BOOKS." })).toBeVisible();
  const viewer = page.getByTestId("books-viewer");
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
  await expect(page.getByText("Model ready")).toBeVisible();
  expect(modelResponseStatus).toBe(200);
  expect(browserErrors).toEqual([]);
});

test("switches from the collection to an individual book", async ({ page }) => {
  await page.goto("/books");
  const viewer = page.getByTestId("books-viewer");
  await expect(viewer).toHaveAttribute("data-ready", "true", { timeout: 30_000 });

  await page.getByRole("button", { name: /Madonna in a Fur Coat/i }).click();

  await expect(viewer).toHaveAttribute("data-selection", "madonna-fur-coat");
  await expect(viewer).toHaveAttribute("data-ready", "true", { timeout: 30_000 });
  await expect(page.getByRole("heading", { level: 2, name: "Madonna in a Fur Coat" })).toBeVisible();
  await expect(
    page.locator("section").getByText(/Sabahattin Ali \/ 129 × 198 × 14 mm/),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Madonna in a Fur Coat/i }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("links back to the lab and stays within the viewport", async ({ page }) => {
  await page.goto("/books");

  await expect(page.getByRole("link", { name: /Smmeyer.*Lab/i })).toHaveAttribute(
    "href",
    "/",
  );

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
