import assert from "node:assert/strict";
import { chromium } from "playwright";
const base = process.env.FIGMA_TEST_URL || "http://localhost:3000";
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(base + "/figma/dashboard");
  assert.equal(new URL(page.url()).pathname, "/figma/dashboard");
  await page
    .getByRole("heading", { name: "Welcome back, Tino." })
    .waitFor({ timeout: 5000 });
  assert.equal(await page.locator(".sn-hero").count(), 3);
  await page.goto(base + "/figma/dashboard?view=cst&persona=paid");
  await page.getByRole("button", { name: "Check my chances" }).click();
  assert.equal(await page.locator(".sn-chance-row").count(), 5);
  await page.goto(base + "/figma/dashboard?view=connect&persona=paid");
  await page.getByRole("button", { name: "Book 1:1 with Geen Geo" }).click();
  await page.getByRole("dialog").waitFor({ timeout: 5000 });
  console.log("PASS shell, products and booking");
} finally {
  await browser.close();
}
