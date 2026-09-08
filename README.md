# SM Meyer Lab

The source for [lab.smmeyer.dev](https://lab.smmeyer.dev), a collection of experiments, prototypes, and field notes.

## Development

Install dependencies and start the Next.js development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Browser tests

The end-to-end suite builds the production app with Webpack, starts it on port `3100`, and tests it in desktop Chromium, Firefox, WebKit, mobile Chrome, and mobile Safari:

```bash
pnpm test:e2e
```

Useful focused commands:

```bash
pnpm exec playwright test --project=chromium
pnpm exec playwright test tests/e2e/home.spec.ts
pnpm test:e2e:ui
```

Tests live in `tests/e2e`. Add one spec per route or user flow and navigate with relative URLs such as `page.goto("/desk")`; the configured `baseURL` supplies the local origin. Screenshots are captured only on failure, while traces and video are retained for failed retries.

The Playwright GitHub Actions workflow runs the complete browser matrix for pushes and pull requests.
