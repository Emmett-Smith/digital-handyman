import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { writeFile, mkdir } from "node:fs/promises";
const origin = process.env.TEST_ORIGIN || "http://localhost:3000";
const browser = await chromium.launch({
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: [
    "--no-sandbox",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});
await mkdir("artifacts", { recursive: true });
const failures = [],
  checks = [];
async function check(name, fn) {
  try {
    await fn();
    checks.push(name);
    console.log("PASS", name);
  } catch (e) {
    failures.push({ name, error: String(e) });
    console.log("FAIL", name, String(e));
  }
}
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
// Email delivery is mocked at the browser boundary. No request reaches the
// application's email route, regardless of any deployment credentials.
await page.route("**/api/email", (route) =>
  route.fulfill({
    status: 503,
    contentType: "application/json",
    body: JSON.stringify({
      error: "Email delivery is not available yet. Download your copy instead.",
    }),
  }),
);
await page.goto(origin, { waitUntil: "networkidle" });
await check("Homepage renders without client errors", async () => {
  assert.equal(
    await page.locator("h1").innerText(),
    "Good people.\nToo much\nrepeat work.",
  );
  assert.deepEqual(errors, []);
  assert.doesNotMatch(await page.locator("body").innerText(), /aerospace|aircraft|flight software|founder/i);
  assert.equal(await page.locator("#studio").count(), 1);
});
await check("Library department filter and keyboard expansion", async () => {
  await page.getByRole("button", { name: "Finance", exact: true }).click();
  assert.ok((await page.locator(".automation-title").count()) > 0);
  await page
    .getByRole("textbox", { name: "Search automations" })
    .fill("unpaid");
  assert.equal(await page.locator(".automation-title").count(), 1);
  await page.locator(".automation-toggle").focus();
  await page.keyboard.press("Enter");
  assert.equal(
    await page.locator(".automation-toggle").getAttribute("aria-expanded"),
    "true",
  );
  await page.getByRole("textbox", { name: "Search automations" }).fill("");
});
await check("A deep link reveals an entry hidden by filters", async () => {
  await page.evaluate(() => {
    location.hash = "material-certs";
  });
  await page.waitForTimeout(100);
  assert.equal(
    await page
      .locator("#material-certs .automation-toggle")
      .getAttribute("aria-expanded"),
    "true",
  );
  assert.equal(
    await page.locator('select[aria-label="Filter by industry"]').inputValue(),
    "all",
  );
});
await check(
  "All three examples run with explicit sample labeling",
  async () => {
    for (const name of [
      "A messy quote request",
      "A patient message",
      "A supplier invoice",
    ]) {
      await page.getByRole("button", { name, exact: true }).click();
      await page.waitForFunction(
        () =>
          document.querySelector(".result-mode")?.textContent ===
          "Sample replay",
      );
      assert.ok((await page.locator(".result-table tr").count()) > 3);
      assert.match(
        await page.locator(".demo-note").innerText(),
        /recorded sample/,
      );
    }
  },
);
await check("Demo reply tab works", async () => {
  await page.getByRole("button", { name: "Draft reply", exact: true }).click();
  assert.match(await page.locator(".draft-reply").innerText(), /invoice 1048/);
});
await check(
  "Calculator changes with keyboard input and reports correct annual value",
  async () => {
    const slider = page.locator('input[type="range"]').first();
    await slider.focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(50);
    assert.equal(await slider.inputValue(), "4");
    assert.equal(await page.locator(".annual-number").innerText(), "$73,008");
  },
);
await check("Estimate download is available without email", async () => {
  const downloadPromise = page.waitForEvent("download");
  await page
    .locator("#calculator")
    .getByRole("button", { name: "Save a copy of your estimate" })
    .click();
  const download = await downloadPromise;
  assert.equal(download.suggestedFilename(), "throughline-estimate.txt");
});
await check(
  "Scorecard returns three opportunities without collecting an email",
  async () => {
    await page
      .getByRole("button", { name: "Find my starting point", exact: true })
      .click();
    for (let i = 0; i < 8; i++) {
      await page.locator(".question-answers button").first().click();
      await page.waitForTimeout(30);
    }
    assert.equal(await page.locator(".scorecard-results li").count(), 3);
    assert.match(await page.locator(".score-number").innerText(), /100/);
  },
);
await check("Booking takes the scorecard result as its agenda", async () => {
  await page
    .getByRole("button", { name: "Talk about my starting point" })
    .click();
  assert.ok(
    (await page.locator(".booking-preparation input").nth(1).inputValue())
      .length > 10,
  );
});
await check(
  "Command palette supports keyboard search and section navigation",
  async () => {
    await page.keyboard.press("Control+k");
    await page
      .getByRole("combobox", { name: "Search tasks and sections" })
      .fill("Pricing");
    await page.keyboard.press("Enter");
    assert.equal(
      await page.locator(".command-dialog").evaluate((d) => d.open),
      false,
    );
    assert.equal(new URL(page.url()).hash, "#pricing");
  },
);
await check(
  "Search keyboard selection remains visible through long results",
  async () => {
    await page.keyboard.press("Control+k");
    const search = page.getByRole("combobox", {
      name: "Search tasks and sections",
    });
    await search.fill("");
    for (let i = 0; i < 11; i++) await search.press("ArrowDown");
    await page.waitForTimeout(150);
    const visible = await page.locator("#command-11").evaluate((el) => {
      const bounds = el.getBoundingClientRect();
      const parent = el.parentElement.getBoundingClientRect();
      return bounds.top >= parent.top - 1 && bounds.bottom <= parent.bottom + 1;
    });
    assert.equal(visible, true);
    assert.equal(
      await search.evaluate((el) => el === document.activeElement),
      true,
    );
    await search.press("Escape");
  },
);
await check(
  "Quote request has three steps and honest unconfigured delivery",
  async () => {
    await page
      .getByRole("button", { name: "Send me a written quote instead" })
      .click();
    await page
      .locator(".quote-dialog select")
      .selectOption({ label: "Help me find the right starting point." });
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.waitForFunction(
      () => document.activeElement?.id === "quote-heading",
    );
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page
      .locator('.quote-dialog input[type="email"]')
      .fill("preview@example.com");
    await page
      .getByRole("button", { name: "Send quote request", exact: true })
      .click();
    await page.waitForTimeout(100);
    assert.match(
      await page.locator('.quote-dialog [role="status"]').innerText(),
      /not available/,
    );
    let delivered = 0;
    await page.route("**/api/email", (route) => {
      delivered++;
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });
    await page
      .getByRole("button", { name: "Send quote request", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Request sent", exact: true })
      .waitFor();
    assert.equal(
      await page
        .getByRole("button", { name: "Request sent", exact: true })
        .isDisabled(),
      true,
    );
    await page
      .locator(".quote-dialog form")
      .evaluate((form) => form.requestSubmit());
    await page.waitForTimeout(100);
    assert.equal(delivered, 1);
    await page.getByRole("button", { name: "Close quote request" }).click();
  },
);
await check("WCAG A/AA automated homepage audit", async () => {
  await page.goto(origin, { waitUntil: "networkidle" });
  const a = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  await writeFile(
    "artifacts/accessibility.json",
    JSON.stringify(a.violations, null, 2),
  );
  assert.deepEqual(
    a.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
    [],
  );
});
const slugs = [
  "dental",
  "legal",
  "accounting",
  "manufacturing",
  "construction",
  "property-management",
  "staffing",
  "insurance",
  "distribution",
  "automotive",
  "ecommerce",
  "marketing",
];
await check("All twelve industry pages and OG images respond", async () => {
  const titles = new Set();
  for (const slug of slugs) {
    const r = await page.request.get(`${origin}/for/${slug}`);
    assert.equal(r.status(), 200);
    const text = await r.text();
    titles.add(text.match(/<title>(.*?)<\/title>/)?.[1]);
    const image = await page.request.get(
      `${origin}/for/${slug}/opengraph-image`,
    );
    assert.equal(image.status(), 200);
    assert.match(image.headers()["content-type"], /image/);
  }
  assert.equal(titles.size, 12);
});
await check(
  "Personalization is present in server HTML and sanitized",
  async () => {
    const r = await page.request.get(
      `${origin}/for/dental?co=Riverside%20Dental%3Cscript%3E&v=recall`,
    );
    const html = await r.text();
    assert.equal(r.status(), 200);
    assert.ok(html.includes("Riverside Dentalscript"));
    assert.ok(html.includes("Recall calls are taking over your front desk."));
    assert.ok(!html.includes("Riverside Dental<script>"));
  },
);
await check("Unknown account falls back to the generic homepage", async () => {
  const r = await page.request.get(`${origin}/c/mistyped-account`);
  assert.equal(r.status(), 200);
  assert.match(await r.text(), /Good people/);
});
await check("Invalid demo input is rejected", async () => {
  const r = await page.request.post(`${origin}/api/demo`, {
    data: { input: "x" },
  });
  assert.equal(r.status(), 400);
  for (const payload of ["null", "[]", "42"]) {
    const malformed = await page.request.post(`${origin}/api/demo`, {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });
    assert.equal(malformed.status(), 400);
  }
});
await check(
  "Interrupted demo clears partial output and allows a sample retry",
  async () => {
    await page.goto(origin, { waitUntil: "networkidle" });
    const interrupt = (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/x-ndjson",
        body:
          JSON.stringify({
            type: "fields",
            fields: [{ label: "Customer", value: "Example customer" }],
          }) + "\n",
      });
    await page.route("**/api/demo", interrupt);
    await page
      .getByRole("button", { name: "See it organized", exact: true })
      .click();
    await page.locator("#demo [role=alert]").waitFor();
    assert.equal(await page.locator("#demo .result-table").count(), 0);
    assert.equal(
      await page
        .getByRole("button", { name: "See it organized", exact: true })
        .isEnabled(),
      true,
    );
    await page.unroute("**/api/demo", interrupt);
    await page
      .getByRole("button", { name: "A messy quote request", exact: true })
      .click();
    await page.locator("#demo .result-table").waitFor();
    assert.equal(await page.locator("#demo [role=alert]").count(), 0);
  },
);
await check(
  "Low-value calculator comparisons retain an honest scale",
  async () => {
    await page.goto(origin, { waitUntil: "networkidle" });
    for (const slider of await page
      .locator('#calculator input[type="range"]')
      .all()) {
      await slider.focus();
      await page.keyboard.press("Home");
      await page.waitForTimeout(35);
    }
    await page.waitForFunction(() => document.querySelector(".annual-number")?.textContent === "$39");
    assert.equal(await page.locator(".annual-number").innerText(), "$39");
    const widths = await page
      .locator(".comparison-bar")
      .evaluateAll((bars) => bars.map((bar) => parseFloat(bar.style.width)));
    assert.ok(widths[0] < widths[1]);
    assert.ok(widths[1] < widths[2]);
    assert.equal(widths[2], 100);
  },
);
await check(
  "Mobile 320px stays within its viewport, including maximum calculator values",
  async () => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto(origin, { waitUntil: "networkidle" });
    await page.screenshot({ path: "artifacts/home-320.png" });
    for (const slider of await page.locator('input[type="range"]').all()) {
      await slider.focus();
      await page.keyboard.press("End");
      await page.waitForTimeout(35);
    }
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth),
      320,
    );
    await page.screenshot({ path: "artifacts/full-320.png", fullPage: true });
    assert.equal(await page.locator(".flow-canvas canvas").count(), 0);
    assert.equal(await page.locator(".pin-spacer").count(), 0);
  },
);
await check(
  "Mobile 390px has no horizontal overflow and visible booking access",
  async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(origin, { waitUntil: "networkidle" });
    await page.screenshot({ path: "artifacts/home-390.png" });
    await page.screenshot({ path: "artifacts/full-390.png", fullPage: true });
    await page
      .locator("#library")
      .evaluate((el) =>
        el.scrollIntoView({ block: "start", behavior: "instant" }),
      );
    await page.waitForFunction(() =>
      document.querySelector(".mobile-booking")?.classList.contains("visible"),
    );
    assert.equal(
      await page.evaluate(() => document.documentElement.scrollWidth),
      390,
    );
    assert.match(
      await page.locator(".mobile-booking").getAttribute("class"),
      /visible/,
    );
  },
);
await check("Call page is short and contains no canvas", async () => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${origin}/call`, { waitUntil: "networkidle" });
  assert.equal(await page.locator("canvas").count(), 0);
  assert.equal(await page.locator(".call-offers article").count(), 3);
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollHeight <= innerHeight,
    ),
  );
  await page.screenshot({ path: "artifacts/call-1440.png" });
});
await writeFile(
  "artifacts/verification.json",
  JSON.stringify({ passed: checks, failures, pageErrors: errors }, null, 2),
);
await browser.close();
console.log(`${checks.length} passed; ${failures.length} failed.`);
if (failures.length) process.exitCode = 1;
