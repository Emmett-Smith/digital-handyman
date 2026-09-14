import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";

const origin = process.env.TEST_ORIGIN || "http://127.0.0.1:3000";
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
await mkdir("artifacts", { recursive: true });
try {
  for (const width of [1440, 768, 390, 320]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(origin, { waitUntil: "networkidle" });
    for (const label of ["Enquiry to follow-up", "Invoice to review", "Meeting to action"]) {
      await page.getByRole("tab", { name: new RegExp(label) }).click();
      await page.getByRole("button", { name: "Run the sample", exact: true }).click();
      await page.getByRole("button", { name: "Approve this sample", exact: true }).waitFor();
      assert.match(await page.locator(".workflow-status").innerText(), /Paused for your review/);
      await page.getByRole("button", { name: "Approve this sample", exact: true }).click();
      assert.match(await page.locator(".workflow-status").innerText(), /complete/);
    }
    await page.getByRole("tab", { name: /Meeting to action/ }).focus();
    await page.keyboard.press("Home");
    assert.equal(await page.getByRole("tab", { name: /Enquiry to follow-up/ }).getAttribute("aria-selected"), "true");
    await page.locator("#workflows").scrollIntoViewIfNeeded();
    await page.locator("#workflows").screenshot({ path: `artifacts/workflows-${width}.png` });
    for (const summary of await page.locator(".trust-question summary").all()) {
      await summary.click();
      assert.equal(await summary.evaluate(node => node.parentElement.open), true);
    }
    await page.locator("#questions").screenshot({ path: `artifacts/questions-${width}.png` });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}px layout overflow`);
    if (width === 1440) {
      await page.locator(".chapter-menu summary").click();
      await page.getByRole("navigation", { name: "Jump to a section" }).getByRole("link", { name: /Know the investment/ }).click();
      assert.equal(new URL(page.url()).hash, "#pricing");
      assert.equal(await page.locator(".chapter-menu").evaluate(node => node.open), false);
      const scan = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
      assert.deepEqual(scan.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), []);
    }
    assert.deepEqual(errors, []);
    console.log(`PASS ${width}px: workflow approvals, keyboard tabs, FAQs, layout, browser errors`);
    await context.close();
  }
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(origin, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Run the sample", exact: true }).click();
  await page.getByRole("tab", { name: /Invoice to review/ }).click();
  await page.waitForTimeout(1700);
  assert.match(await page.locator(".workflow-status").innerText(), /Ready to explore/);
  await page.getByRole("button", { name: "Run the sample", exact: true }).click();
  await page.getByRole("button", { name: "Approve this sample", exact: true }).waitFor();
  await page.locator("#workflows").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  assert.equal(await page.locator(".chapter-dock").evaluate(node => getComputedStyle(node).visibility), "visible");
  await page.screenshot({ path: "artifacts/launch-desktop.png" });
  console.log("PASS motion: timed approval, cancellation on tab change, scroll chapter navigation");
} finally { await browser.close(); }
