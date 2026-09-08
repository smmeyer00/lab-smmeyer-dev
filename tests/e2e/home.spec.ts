import { expect, test } from "@playwright/test";

test("renders the lab identity and current experiment", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Lab — SM Meyer");
  await expect(
    page.getByRole("heading", { level: 1, name: "LAB." }),
  ).toBeVisible();
  await expect(
    page.getByText("Things I build to figure out whether they’ll work."),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Building now" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "My desk, rebuilt from photos." }),
  ).toBeVisible();
  await expect(page.getByText("Interactive viewer is next")).toBeVisible();
  await expect(page.getByRole("link", { name: /Main site/i })).toHaveAttribute(
    "href",
    "https://smmeyer.dev",
  );

  await expect(page.locator("html")).toHaveClass(/dark/);
  await expect
    .poll(() =>
      page.locator("html").evaluate((node) => getComputedStyle(node).colorScheme),
    )
    .toBe("dark");
});

test("moves from the hero to the experiment index", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "See what I’m working on" }).click();

  await expect(page).toHaveURL(/#experiments$/);
  await expect(
    page.getByRole("heading", { name: "Building now" }),
  ).toBeInViewport();
});

test("loads its visual assets without browser errors", async ({ page }) => {
  const browserErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await page.goto("/");
  await page.locator("footer").scrollIntoViewIfNeeded();

  const imagesLoaded = await page.locator("img").evaluateAll((images) =>
    images.every((image) => {
      const element = image as HTMLImageElement;
      return element.complete && element.naturalWidth > 0;
    }),
  );

  expect(imagesLoaded).toBe(true);
  expect(browserErrors).toEqual([]);
});

test("keeps internal links valid and the layout within the viewport", async ({
  page,
}) => {
  await page.goto("/");

  const internalTargetsExist = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links.every((link) => {
        const target = link.getAttribute("href")?.slice(1);
        return target ? document.getElementById(target) !== null : false;
      }),
    );

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );

  expect(internalTargetsExist).toBe(true);
  expect(hasHorizontalOverflow).toBe(false);
});

test("uses the compact navigation only on mobile projects", async ({
  page,
}, testInfo) => {
  await page.goto("/");

  const experimentsLink = page
    .getByRole("navigation")
    .getByRole("link", { name: "Projects" });
  const isMobileProject = testInfo.project.name.startsWith("mobile-");

  if (isMobileProject) {
    await expect(experimentsLink).toBeHidden();
  } else {
    await expect(experimentsLink).toBeVisible();
  }

  await expect(page.getByRole("link", { name: /Main site/i })).toBeVisible();
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("removes decorative animation", async ({ page }) => {
    await page.goto("/");

    const heroTitle = page.getByRole("heading", { level: 1, name: "LAB." });
    await expect(heroTitle).toBeVisible();
    await expect
      .poll(() =>
        heroTitle.evaluate((node) => getComputedStyle(node).animationName),
      )
      .toBe("none");
  });
});
