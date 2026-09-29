import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import {
  PAGE_COPY,
  NOTIFICATIONS,
} from "../src/app/figma/dashboard/_lib/fixtures.ts";
const base = process.env.FIGMA_TEST_URL || "http://localhost:3000",
  output = ".codex/artifacts/supernova";
const selected = process.argv.includes("--suite")
  ? process.argv[process.argv.indexOf("--suite") + 1]
  : "all";
const runs = (name) => selected === "all" || selected === name;
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
      viewport: { width: 1425, height: 1000 },
    }),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const go = async (view = "dashboard", persona = "paid") => {
    await page.goto(`${base}/figma/dashboard?view=${view}&persona=${persona}`, {
      waitUntil: "networkidle",
    });
    await page.evaluate(() => document.fonts.ready);
  };
  if (runs("shell")) {
    await page.goto(base + "/figma/dashoard", { waitUntil: "networkidle" });
    assert.equal(new URL(page.url()).pathname, "/figma/dashboard");
    await page
      .getByRole("heading", { name: "Welcome back, Tino.", exact: true })
      .waitFor();
    await page.goto(base + "/figma/dashboard?view=unknown&persona=unknown");
    await page
      .getByRole("heading", { name: "Welcome back, Tino.", exact: true })
      .waitFor();
    await page.getByRole("button", { name: "Zenna", exact: true }).click();
    await page.getByRole("button", { name: "All (9)", exact: true }).waitFor();
    await page.getByRole("button", { name: /Free user/ }).click();
    await page
      .getByRole("heading", {
        name: "Zenna unlocks when you apply through LTA",
        exact: true,
      })
      .waitFor();
    assert.equal(await page.locator("[data-application]").count(), 0);
    await page.goBack();
    await page.getByRole("button", { name: "All (9)", exact: true }).waitFor();
    await page.reload();
    assert.equal(await page.locator("[data-application]").count(), 9);
    const search = page.getByRole("combobox", {
      name: "Search applications, documents, mentors",
    });
    await search.fill("Geen");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await page.getByRole("dialog").waitFor();
    assert.equal(new URL(page.url()).searchParams.get("view"), "connect");
    await page.keyboard.press("Escape");
    assert.equal(await page.getByRole("dialog").count(), 0);
    await search.fill("NO MATCH");
    await page
      .getByText("No matching applications, documents or mentors.")
      .waitFor();
    await page.keyboard.press("Escape");
    assert.equal(await page.getByRole("listbox").count(), 0);
    await search.fill("");
    await search.focus();
    assert.deepEqual(
      await search.evaluate((e) => {
        const s = getComputedStyle(e);
        return [s.borderTopWidth, s.outlineStyle, s.boxShadow];
      }),
      ["0px", "none", "none"],
    );
    await go();
    const before = await page.locator(".sn-sidebar").boundingBox();
    await page.evaluate(() => scrollTo(0, 600));
    const after = await page.locator(".sn-sidebar").boundingBox();
    assert.ok(Math.abs(before.y - after.y) < 1);
    console.log(
      "PASS: canonical/legacy routing, URL fallback/history/refresh, persona gates, keyboard search, borderless focus, sticky navigation",
    );
  }
  if (runs("products")) {
    for (const persona of ["free", "paid", "p004"])
      for (const view of [
        "dashboard",
        "zenna",
        "connect",
        "cst",
        "p004",
        "documents",
        "notifications",
        "support",
      ]) {
        await go(view, persona);
        await page
          .getByRole("heading", {
            name: PAGE_COPY[persona][view].title,
            exact: true,
          })
          .waitFor();
        if (view === "dashboard") {
          assert.equal(await page.locator(".sn-hero").count(), 3);
          assert.equal(await page.locator(".sn-suite-card").count(), 4);
        }
        if (view === "zenna") {
          assert.equal(
            await page.locator("[data-application]").count(),
            persona === "free" ? 0 : 9,
          );
          if (persona === "paid") {
            for (const [name, count] of [
              ["Offers (2)", 2],
              ["In progress (2)", 2],
              ["Waiting (2)", 2],
              ["Closed (3)", 3],
              ["All (9)", 9],
            ]) {
              await page.getByRole("button", { name, exact: true }).click();
              assert.equal(
                await page.locator("[data-application]").count(),
                count,
              );
            }
          }
        }
        if (view === "connect")
          assert.equal(
            await page.locator("[data-mentor]").count(),
            persona === "free" ? 0 : 6,
          );
        if (view === "p004")
          assert.equal(
            await page.locator("[data-job]").count(),
            persona === "p004" ? 3 : 0,
          );
        if (view === "documents")
          assert.equal(
            await page.locator("[data-document]").count(),
            persona === "free" ? 0 : 4,
          );
        if (view === "notifications")
          assert.equal(
            await page.locator("[data-notification]").count(),
            NOTIFICATIONS[persona].length,
          );
        if (view === "support") {
          assert.equal(await page.locator(".sn-help").count(), 3);
          assert.equal(await page.locator(".sn-faq").count(), 3);
          await page.locator(".sn-faq").first().locator("summary").click();
          assert.equal(
            await page.locator(".sn-faq").first().getAttribute("open"),
            "",
          );
        }
        await page.screenshot({
          path: `${output}/${persona}-${view}.png`,
          fullPage: true,
          style: "nextjs-portal{display:none}",
        });
      }
    await go("cst");
    await page.getByLabel("CGPA (out of 10)").fill("11");
    await page.getByRole("button", { name: "Check my chances" }).click();
    assert.equal(await page.locator(".sn-chance-row").count(), 0);
    await page.getByLabel("CGPA (out of 10)").fill("7.8");
    await page.getByRole("button", { name: "Check my chances" }).click();
    assert.equal(await page.locator(".sn-chance-row").count(), 5);
    const chances = await page.locator(".sn-chance-pct").allTextContents();
    assert.deepEqual(chances, ["58%", "55%", "48%", "40%", "38%"]);
    await page.getByRole("button", { name: "Check my chances" }).click();
    assert.deepEqual(
      await page.locator(".sn-chance-pct").allTextContents(),
      chances,
    );
    await page
      .getByRole("button", { name: "Talk to our team about these results" })
      .click();
    await page.getByRole("dialog").waitFor();
    await page.keyboard.press("Escape");
    await go("zenna", "p004");
    const record = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download full record" }).click();
    assert.equal(
      (await record).suggestedFilename(),
      "LTA-admissions-record.txt",
    );
    await go("p004", "p004");
    await page.getByRole("button", { name: "Share to LinkedIn" }).click();
    await page.getByRole("dialog").waitFor();
    assert.match(await page.locator("pre").innerText(), /2,340 points/);
    const share = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download profile" }).click();
    assert.equal(
      (await share).suggestedFilename(),
      "Tino-Sunny-Project004.txt",
    );
    await page.keyboard.press("Escape");
    await page
      .getByRole("button", { name: "View Klinikum Nordbayern gGmbH" })
      .click();
    await page
      .getByRole("dialog", { name: "Klinikum Nordbayern gGmbH" })
      .waitFor();
    await page.keyboard.press("Escape");
    console.log(
      "PASS: all 24 source view/persona states, source counts/copy, filters, FAQs, deterministic form and invalid input, archived/profile downloads, job details",
    );
  }
  if (runs("interactions")) {
    await go("connect");
    await page.getByRole("button", { name: "Book 1:1 with Geen Geo" }).click();
    const dialog = page.getByRole("dialog");
    await dialog.waitFor();
    await page
      .getByRole("button", { name: "Confirm booking", exact: true })
      .click();
    await page.locator(".sn-error[role=alert]").waitFor();
    await page.getByRole("button", { name: "Next booking month" }).click();
    const day = page.locator(".sn-book-grid button:enabled").first();
    const picked = (await day.getAttribute("aria-label")).replace(
      "Choose ",
      "",
    );
    await day.click();
    await page.getByRole("button", { name: "17:00", exact: true }).click();
    await page
      .getByRole("button", { name: "Confirm booking", exact: true })
      .click();
    assert.equal(await dialog.count(), 0);
    assert.ok(
      (await page.locator(".sn-session").allTextContents()).some((t) =>
        t.includes(picked),
      ),
    );
    await page.getByRole("button", { name: "Reschedule", exact: true }).click();
    await page.getByRole("button", { name: "Next booking month" }).click();
    await page.locator(".sn-book-grid button:enabled").first().click();
    await page.getByRole("button", { name: "15:00", exact: true }).click();
    await page.getByRole("button", { name: "Confirm reschedule" }).click();
    assert.match(
      await page.locator(".sn-session").first().innerText(),
      /15:00/,
    );
    await page.getByRole("button", { name: "Join call", exact: true }).click();
    await page.getByRole("dialog", { name: "Your session details" }).waitFor();
    await page.keyboard.press("Escape");
    await page.getByRole("button", { name: "Settings", exact: true }).click();
    await page.getByLabel("WhatsApp updates", { exact: true }).uncheck();
    await page.getByRole("button", { name: "Save preferences" }).click();
    await page
      .getByRole("button", { name: "WhatsApp OFF", exact: true })
      .waitFor();
    await page.getByRole("button", { name: /Free user/ }).click();
    await page
      .getByRole("heading", {
        name: "LTA Connect is launching to everyone soon",
        exact: true,
      })
      .waitFor();
    await page
      .getByRole("button", { name: "Join the waitlist", exact: true })
      .click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Join the waitlist" })
      .click();
    assert.equal(await page.locator("[data-mentor]").count(), 0);
    await page.getByRole("button", { name: /on the list/ }).waitFor();
    await page
      .getByRole("button", { name: "WhatsApp ON", exact: true })
      .waitFor();
    await go("zenna");
    await page.getByRole("button", { name: "Confirm & notify" }).click();
    await page
      .getByText("Your two deadline reminders are confirmed.")
      .waitFor();
    await page
      .getByRole("button", { name: "Notifications 5", exact: true })
      .click();
    await page.waitForFunction(
      () => document.querySelectorAll("[data-notification]").length === 5,
    );
    assert.equal(await page.locator("[data-notification]").count(), 5);
    await page.locator("[data-notification]").first().click();
    await page
      .getByRole("button", { name: "Notifications 4", exact: true })
      .waitFor();
    await go("zenna");
    await page.getByRole("button", { name: "Dismiss", exact: true }).click();
    await page.getByText("These findings have been dismissed.").waitFor();
    await go("connect", "p004");
    await page.getByRole("button", { name: "Review requests" }).click();
    await page
      .getByRole("button", { name: "Accept", exact: true })
      .first()
      .click();
    await page.getByText(/Handled/, { exact: false }).waitFor();
    assert.equal(await page.getByText(/Handled/, { exact: false }).count(), 1);
    await page.keyboard.press("Escape");
    await page
      .getByRole("heading", {
        name: "2 aspirants requested your DIT story this week.",
      })
      .waitFor();
    await page.getByRole("button", { name: "Log out", exact: true }).click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Log out", exact: true })
      .click();
    await page.getByRole("heading", { name: "See you soon, Tino." }).waitFor();
    await page.getByRole("button", { name: "Sign back in" }).click();
    await page
      .getByRole("heading", {
        name: "3 aspirants requested your DIT story this week.",
      })
      .waitFor();
    await go("support", "free");
    await page.locator(".sn-help").nth(1).click();
    await page.getByRole("button", { name: "Next booking month" }).click();
    await page.locator(".sn-book-grid button:enabled").first().click();
    await page.getByRole("button", { name: "17:00", exact: true }).click();
    await page
      .getByRole("button", { name: "Confirm booking", exact: true })
      .click();
    await page.getByRole("dialog").waitFor({ state: "detached" });
    assert.equal(await page.locator(".sn-session").count(), 1);
    await page
      .getByRole("button", { name: "View session", exact: true })
      .click();
    assert.match(await page.getByRole("dialog").innerText(), /LTA team/);
    assert.doesNotMatch(await page.getByRole("dialog").innerText(), /Geen Geo/);
    await page.keyboard.press("Escape");
    console.log(
      "PASS: booking validation/confirmation/reschedule, session preview, settings/persona isolation, waitlist gate, AI confirm/dismiss, read notifications, mentor requests, concept logout",
    );
  }
  if (runs("documents")) {
    await page.addInitScript(() => {
      window.__urls = { created: [], revoked: [] };
      const create = URL.createObjectURL.bind(URL),
        revoke = URL.revokeObjectURL.bind(URL);
      URL.createObjectURL = (b) => {
        const u = create(b);
        window.__urls.created.push(u);
        return u;
      };
      URL.revokeObjectURL = (u) => {
        window.__urls.revoked.push(u);
        revoke(u);
      };
    });
    await go("documents", "free");
    const input = page.getByLabel("Upload documents");
    await input.setInputFiles({
      name: "invalid.exe",
      mimeType: "application/octet-stream",
      buffer: Buffer.from("bad"),
    });
    await page.locator(".sn-error[role=alert]").waitFor();
    assert.equal(await page.locator("[data-document]").count(), 0);
    await page.getByRole("button", { name: /Paid client/ }).click();
    await page.waitForFunction(
      () => document.querySelectorAll("[data-document]").length === 4,
    );
    assert.equal(await page.locator(".sn-error[role=alert]").count(), 0);
    await page.getByRole("button", { name: /Free user/ }).click();
    await page.waitForFunction(
      () => document.querySelectorAll("[data-document]").length === 0,
    );
    await input.setInputFiles({
      name: "large.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.alloc(10 * 1024 * 1024 + 1),
    });
    assert.match(
      await page.locator(".sn-error[role=alert]").innerText(),
      /10 MB/,
    );
    const name =
      "Transcript_with_a_very_long_filename_for_all_responsive_states_\u00e4\u00f6\u00fc.pdf";
    await input.setInputFiles([
      {
        name,
        mimeType: "application/pdf",
        buffer: Buffer.from("%PDF-1.4 local sample"),
      },
      {
        name,
        mimeType: "application/pdf",
        buffer: Buffer.from("%PDF-1.4 another sample"),
      },
    ]);
    assert.equal(await page.locator("[data-document]").count(), 2);
    await page.getByRole("button", { name: /Paid client/ }).click();
    await page.waitForFunction(
      () => document.querySelectorAll("[data-document]").length === 4,
    );
    assert.equal(await page.locator("[data-document]").count(), 4);
    await page.getByRole("button", { name: /Free user/ }).click();
    await page.waitForFunction(
      () => document.querySelectorAll("[data-document]").length === 2,
    );
    assert.equal(await page.locator("[data-document]").count(), 2);
    await page.getByRole("combobox").fill("Transcript_with");
    assert.equal(await page.getByRole("option").count(), 2);
    await page.keyboard.press("Enter");
    await page.locator(".sn-doc-selected").waitFor();
    assert.equal(
      await page
        .locator(".sn-doc-selected")
        .evaluate((e) => e === document.activeElement),
      true,
    );
    await page.keyboard.press("Escape");
    await page.getByRole("combobox").fill("");
    await page
      .getByRole("button", { name: `Remove ${name}`, exact: true })
      .first()
      .click();
    assert.equal(await page.locator("[data-document]").count(), 1);
    let urls = await page.evaluate(() => window.__urls);
    assert.equal(urls.revoked.length, 1);
    await page.getByRole("button", { name: "Log out", exact: true }).click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Log out", exact: true })
      .click();
    urls = await page.evaluate(() => window.__urls);
    assert.equal(urls.created.length, 2);
    assert.equal(urls.revoked.length, 2);
    assert.equal(new Set(urls.revoked).size, 2);
    await page.getByRole("button", { name: "Sign back in" }).click();
    assert.equal(await page.locator("[data-document]").count(), 0);
    console.log(
      "PASS: upload type/size rejection, duplicate names, persona-local files, search, remove/reset object URL cleanup",
    );
  }
  if (runs("responsive")) {
    for (const width of [1920, 1425, 1280, 1024, 960, 768, 640, 480]) {
      await page.setViewportSize({ width, height: 900 });
      for (const view of [
        "dashboard",
        "zenna",
        "connect",
        "cst",
        "p004",
        "documents",
        "notifications",
        "support",
      ]) {
        await go(view, view === "p004" ? "p004" : "paid");
        const g = await page.evaluate(() => ({
          width: innerWidth,
          scroll: document.documentElement.scrollWidth,
          broken: [...document.images]
            .filter((i) => !i.complete || !i.naturalWidth)
            .map((i) => i.src),
          out: [
            ...document.querySelectorAll(".sn-card,.sn-hero,.sn-suite-card"),
          ]
            .filter((el) => {
              const b = el.getBoundingClientRect(),
                w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
              while (w.nextNode()) {
                const n = w.currentNode;
                if (
                  n.parentElement.closest("details:not([open])") &&
                  !n.parentElement.closest("summary")
                )
                  continue;
                for (let i = 0; i < n.textContent.length; i++) {
                  if (!n.textContent[i].trim()) continue;
                  const r = document.createRange();
                  r.setStart(n, i);
                  r.setEnd(n, i + 1);
                  const a = r.getBoundingClientRect();
                  if (
                    a.width &&
                    (a.left < b.left - 1 ||
                      a.right > b.right + 1 ||
                      a.top < b.top - 1 ||
                      a.bottom > b.bottom + 1)
                  )
                    return true;
                }
              }
              return false;
            })
            .map((e) => e.className),
        }));
        assert.ok(
          g.scroll <= g.width,
          `Page overflow ${width}/${view}: ${JSON.stringify(g)}`,
        );
        assert.deepEqual(g.broken, []);
        assert.deepEqual(g.out, [], `Text outside card ${width}/${view}`);
        if (view === "dashboard" && width >= 1024) {
          const cards = await page
            .locator(".sn-hero")
            .evaluateAll((es) => es.map((e) => e.getBoundingClientRect().y));
          assert.ok(
            cards.every((y) => Math.abs(y - cards[0]) < 1),
            "Three desktop hero cards stay in one row",
          );
        }
      }
      await go();
      await page.screenshot({
        path: `${output}/desktop-${width}.png`,
        fullPage: true,
        style: "nextjs-portal{display:none}",
      });
    }
    await page.setViewportSize({ width: 480, height: 900 });
    await page.getByRole("button", { name: "Open navigation" }).click();
    await page
      .getByRole("button", { name: "Close navigation", exact: true })
      .waitFor();
    await page.keyboard.press("Escape");
    assert.equal(await page.locator(".sn-sidebar.open").count(), 0);
    for (const zoom of [0.5, 0.67, 0.8, 1, 1.25, 1.5, 1.75, 2]) {
      const ctx = await browser.newContext({
        viewport: {
          width: Math.round(1920 / zoom),
          height: Math.round(960 / zoom),
        },
        deviceScaleFactor: zoom,
      });
      try {
        const p = await ctx.newPage();
        await p.goto(base + "/figma/dashboard", { waitUntil: "networkidle" });
        assert.ok(
          await p.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        );
        await p.screenshot({
          path: `${output}/zoom-${Math.round(zoom * 100)}.png`,
          fullPage: true,
          style: "nextjs-portal{display:none}",
        });
      } finally {
        await ctx.close();
      }
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(
      await page
        .locator(".sn-content")
        .evaluate((e) => getComputedStyle(e).animationName),
      "none",
    );
    console.log(
      "PASS: 8 widths ? 8 views, glyph containment/assets, three desktop heroes, mobile drawer, 8 zoom equivalents, reduced motion",
    );
  }
  assert.deepEqual(errors, [], "No browser runtime errors");
  console.log("PASS: Supernova browser acceptance");
} finally {
  await browser.close();
}
