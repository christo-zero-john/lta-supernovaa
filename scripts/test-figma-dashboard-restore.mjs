import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
const base = process.env.FIGMA_TEST_URL || "http://localhost:3000";
const browser = await chromium.launch();
const output = ".codex/artifacts/dashboard-restored";
await mkdir(output, { recursive: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1425, height: 1000 },
  });
  await page.goto(base + "/figma/dashboard", {
    waitUntil: "networkidle",
  });
  await page
    .getByRole("heading", { name: "Good Morning Geen!", exact: true })
    .waitFor({ timeout: 3000 });
  assert.equal(await page.locator(".sn-focus,.sn-hero,.sn-journey").count(), 0);
  assert.equal(await page.locator("[data-university-card]").count(), 4);
  for (const title of [
    "Explore LTA Suit",
    "Upcoming Events",
    "Hear from our family",
  ])
    assert.ok(
      await page.getByRole("heading", { name: title, exact: true }).count(),
    );
  await page.getByRole("button", { name: "Documents", exact: true }).click();
  await page
    .getByRole("heading", { name: "One vault, every product", exact: true })
    .waitFor();
  await page.getByRole("button", { name: "Dashboard", exact: true }).click();
  await page
    .getByRole("heading", { name: "Good Morning Geen!", exact: true })
    .waitFor();
  for (const [name, view] of [
    ["Course Shortlisting", "cst"],
    ["LTA Connect", "connect"],
    ["LTA Zenna", "zenna"],
  ]) {
    await page
      .getByRole("button", { name: `Open ${name}`, exact: true })
      .click();
    await page.waitForURL((u) => u.searchParams.get("view") === view);
    assert.equal(new URL(page.url()).searchParams.get("view"), view);
    await page.getByRole("button", { name: "Dashboard", exact: true }).click();
    await page
      .getByRole("heading", { name: "Good Morning Geen!", exact: true })
      .waitFor();
  }
  for (const width of [1920, 1425, 1280, 1024, 960, 768, 640, 480]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => document.fonts.ready);
    const g = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      broken: [...document.images]
        .filter((i) => !i.complete || !i.naturalWidth)
        .map((i) => i.src),
      visible: (() => {
        const b = document
          .querySelector(".university-carousel")
          .getBoundingClientRect();
        return [...document.querySelectorAll("[data-university-card]")].filter(
          (e) => {
            const r = e.getBoundingClientRect();
            return r.left >= b.left - 1 && r.right <= b.right + 1;
          },
        ).length;
      })(),
    }));
    assert.equal(g.overflow, false, `overflow at ${width}`);
    assert.deepEqual(g.broken, []);
    if (width >= 1024)
      assert.ok(g.visible >= 3, `three visible university cards at ${width}`);
    await page.screenshot({
      path: `${output}/${width}.png`,
      fullPage: true,
      style: "nextjs-portal{display:none}",
    });
  }
  console.log(
    "PASS: original Figma dashboard sections, navigation to retained pages, responsive fit and assets",
  );
} finally {
  await browser.close();
}
