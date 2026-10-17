import { expect, test, type Page } from "@playwright/test";

async function artworkFingerprint(page: Page) {
  return page.getByTestId("hero-topography").locator("canvas").evaluate((canvas) => {
    if (!(canvas instanceof HTMLCanvasElement)) throw new Error("The hero canvas is missing");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("The hero canvas did not initialize");
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    let hash = 2166136261;
    for (let index = 0; index < data.length; index += 16) {
      hash = Math.imul(hash ^ data[index], 16777619);
    }
    return hash >>> 0;
  });
}

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
    page.getByRole("heading", { name: "Experiments" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "My desk, rebuilt from photos." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Twenty books, rebuilt in Blender." }),
  ).toBeVisible();
  await expect(page.getByText("Open experiment")).toHaveCount(2);
  await expect(
    page.getByRole("link", { name: "Open the desk experiment" }),
  ).toHaveAttribute("href", "/desk");
  await expect(
    page.getByRole("link", { name: "Open the books experiment" }),
  ).toHaveAttribute("href", "/books");
  await expect(page.getByRole("link", { name: /Main site/i })).toHaveAttribute(
    "href",
    "https://smmeyer.dev",
  );
  await expect(page.getByText("© 2026 Steven Meyer")).toBeVisible();
  await expect(
    page.getByRole("link", { name: "smmeyer.dev", exact: true }),
  ).toHaveAttribute("href", "https://smmeyer.dev");

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
    page.getByRole("heading", { name: "Experiments" }),
  ).toBeInViewport();
});

test("draws the character surface without browser errors or a hero image", async ({ page }) => {
  const browserErrors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await page.goto("/");
  const canvas = page.getByTestId("hero-topography").locator("canvas");
  await expect(canvas).toHaveAttribute("data-ready", "true");
  const illuminatedPixels = await canvas.evaluate((element) => {
    if (!(element instanceof HTMLCanvasElement)) return 0;
    const context = element.getContext("2d");
    if (!context) return 0;
    const { data } = context.getImageData(0, 0, element.width, element.height);
    let count = 0;
    for (let index = 0; index < data.length; index += 16) {
      if (data[index] > 30) count++;
    }
    return count;
  });

  expect(illuminatedPixels).toBeGreaterThan(100);
  await expect(page.locator("#top img")).toHaveCount(0);
  expect(browserErrors).toEqual([]);
});

test("animates the surface and pauses it outside the viewport", async ({ page }) => {
  await page.goto("/");
  const canvas = page.getByTestId("hero-topography").locator("canvas");
  await expect(canvas).toHaveAttribute("data-ready", "true");
  const firstFrame = await artworkFingerprint(page);
  await expect.poll(() => artworkFingerprint(page)).not.toBe(firstFrame);

  // Scroll immediately so this check measures the paused canvas, not smooth scrolling.
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, document.getElementById("experiments")!.offsetTop + 60);
  });
  await expect(page.getByRole("heading", { level: 1 })).not.toBeInViewport();
  await page.waitForTimeout(150);
  const pausedFrame = await artworkFingerprint(page);
  await page.waitForTimeout(250);
  expect(await artworkFingerprint(page)).toBe(pausedFrame);

  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => artworkFingerprint(page)).not.toBe(pausedFrame);
});

test("keeps the hero and project navigation usable without canvas support", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value: () => null,
    });
  });
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "LAB." })).toBeVisible();
  await expect(page.locator(".topography-poster")).toBeVisible();
  await page.getByRole("link", { name: "See what I’m working on" }).click();
  await expect(page.getByRole("heading", { name: "Experiments" })).toBeInViewport();
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

    const canvas = page.getByTestId("hero-topography").locator("canvas");
    await expect(canvas).toHaveAttribute("data-ready", "true");
    // Allow the self-hosted font atlas to settle before checking the still composition.
    await page.evaluate(() => document.fonts.ready.then(() => undefined));
    await page.waitForTimeout(100);
    const frame = await artworkFingerprint(page);
    await page.mouse.move(800, 350);
    await page.waitForTimeout(300);
    expect(await artworkFingerprint(page)).toBe(frame);
  });
});
