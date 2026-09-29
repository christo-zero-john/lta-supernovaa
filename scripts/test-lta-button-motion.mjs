import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
const base = process.env.FIGMA_TEST_URL || "http://localhost:3000";
const browser = await chromium.launch();
const output = ".codex/artifacts/button-motion";
await mkdir(output, { recursive: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1425, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const inspect = async (button) => {
    await button.scrollIntoViewIfNeeded();
    const before = await button.boundingBox();
    await button.hover();
    await page.waitForTimeout(250);
    const a = await button.evaluate((e) => {
      const s = getComputedStyle(e);
      return {
        shadow: s.boxShadow,
        animation: s.animationName,
        glass: s.backdropFilter,
        overlay: getComputedStyle(e, "::after").content,
      };
    });
    await page.waitForTimeout(350);
    const b = await button.evaluate((e) => getComputedStyle(e).boxShadow);
    assert.equal(a.animation, "lta-edge-reflection");
    assert.ok(a.shadow.includes("inset"));
    assert.notEqual(a.shadow, b, "Existing inset shade must move");
    assert.ok(a.glass.includes("blur(10px)"), JSON.stringify(a));
    assert.equal(a.overlay, "none", "No extra light overlay");
    assert.deepEqual(
      await button.boundingBox(),
      before,
      "Hover must not move or resize the button",
    );
  };
  await page.goto(
    base + "/figma/dashboard?view=zenna&persona=free",
    { waitUntil: "networkidle" },
  );
  await inspect(
    page.getByRole("button", { name: "Apply with LTA", exact: true }),
  );
  await page.screenshot({
    path: output + "/primary-hover.png",
    fullPage: true,
    style: "nextjs-portal{display:none}",
  });
  const demo = page.getByRole("button", {
    name: "Apply with LTA",
    exact: true,
  });
  const r = await demo.boundingBox();
  for (let i = 0; i < 18; i++) {
    await page.screenshot({
      path: `${output}/frame-${i}.png`,
      clip: {
        x: r.x - 12,
        y: r.y - 12,
        width: r.width + 24,
        height: r.height + 24,
      },
    });
    await page.waitForTimeout(100);
  }
  await inspect(
    page.getByRole("button", { name: "Talk to us first", exact: true }),
  );
  await page
    .getByRole("button", { name: "Talk to us first", exact: true })
    .click();
  await page.getByRole("dialog").waitFor();
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "Dashboard", exact: true }).click();
  await page
    .getByRole("heading", { name: "Good Morning Geen!", exact: true })
    .waitFor();
  await inspect(page.locator(".product-action").first());
  await inspect(
    page.getByRole("button", { name: "Book a session", exact: true }),
  );
  await page
    .getByRole("button", { name: "Book a session", exact: true })
    .click();
  await page.getByRole("dialog").waitFor();
  const day = page.locator(".sn-book-grid button:enabled").first();
  await day.click();
  await page.keyboard.press("Escape");
  const cell = page.getByRole("button", {
    name: "February 2026 6: Online Session with Mentor",
    exact: true,
  });
  await cell.hover();
  await page.screenshot({
    path: output + "/calendar-hover.png",
    fullPage: true,
    style: "nextjs-portal{display:none}",
  });
  await page.keyboard.press("Escape");
  await page.emulateMedia({ reducedMotion: "reduce" });
  const product = page.locator(".product-action").first();
  await product.hover();
  assert.equal(
    await product.evaluate((e) => getComputedStyle(e).animationName),
    "none",
  );
  const search = page.getByRole("searchbox", { name: "Search universities" });
  await search.focus();
  assert.deepEqual(
    await search.evaluate((e) => {
      const s = getComputedStyle(e);
      return [s.borderTopWidth, s.outlineStyle, s.boxShadow];
    }),
    ["0px", "none", "none"],
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: existing inset reflection moves on primary/secondary/product buttons, no extra overlay, translucent glass, stable geometry, clicks, reduced motion and borderless search",
  );
} finally {
  await browser.close();
}
