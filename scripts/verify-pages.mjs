import { chromium } from "playwright";
import assert from "node:assert/strict";

const origin = process.env.TEST_ORIGIN || "http://127.0.0.1:3100/throughline-ai/";
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--no-sandbox"] });
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = [], failedResponses = [], apiRequests = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("response", response => { if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`); });
  page.on("request", request => { if (request.url().includes("/api/")) apiRequests.push(request.url()); });
  assert.equal((await page.goto(origin, { waitUntil: "networkidle" })).status(), 200);
  for (const label of ["A messy quote request", "A patient message", "A supplier invoice"]) {
    await page.getByRole("button", { name: label, exact: true }).click();
    await page.waitForFunction(() => document.querySelector(".result-mode")?.textContent === "Sample replay");
    assert.equal(await page.locator(".result-mode").innerText(), "Sample replay");
    assert.ok(await page.locator(".result-table tr").count() > 3);
  }
  const links = await page.locator(".footer-industries a").evaluateAll(nodes => nodes.map(a => a.href));
  assert.equal(links.length, 12);
  for (const link of [...links, new URL("call/", origin).href, new URL("privacy/", origin).href]) {
    assert.equal((await context.request.get(link)).status(), 200, link);
  }
  await page.locator(".footer-industries a").first().click();
  await page.waitForURL("**/for/dental/");
  await page.waitForLoadState("networkidle");
  assert.equal(await page.locator("h1").innerText(), "Your front desk has more to do than recall calls.");
  const og = await page.locator('meta[property="og:image"]').getAttribute("content");
  const localOG = new URL(og); localOG.host = new URL(origin).host; localOG.protocol = new URL(origin).protocol;
  assert.equal((await context.request.get(localOG.href)).status(), 200);
  await page.locator(".site-header a").first().click();
  await page.waitForURL(origin);
  await page.locator('.footer a[href$="/call"]').click();
  await page.waitForURL("**/call/");
  await page.locator(".button-signal").click();
  await page.waitForURL("**/#booking");
  assert.deepEqual(apiRequests, []);
  assert.deepEqual(errors, []);
  assert.deepEqual(failedResponses, []);
  console.log("PASS published export: sample demos, 12 industry routes, client navigation, home/call/booking links, OG image, no API requests or failed assets");
} finally { await browser.close(); }
