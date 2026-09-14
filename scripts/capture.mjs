import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
await mkdir("artifacts", { recursive: true });
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
const errors = [];
for (const width of [1440, 1024, 768, 390, 320]) {
  const page = await browser.newPage({
    viewport: { width, height: width >= 768 ? 1000 : 844 },
    deviceScaleFactor: 1,
  });
  page.on("pageerror", (e) => errors.push({ width, error: e.message }));
  await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
  await page.screenshot({ path: `artifacts/home-${width}.png` });
  await page.screenshot({
    path: `artifacts/full-${width}.png`,
    fullPage: true,
  });
  const dimensions = await page.evaluate(() => ({
    viewport: innerWidth,
    document: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  }));
  console.log(width, dimensions);
  if (width === 1440) {
    for (const id of [
      "library",
      "process",
      "demo",
      "calculator",
      "pricing",
      "studio",
    ]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page.waitForTimeout(650);
      await page.screenshot({ path: `artifacts/${id}-1440.png` });
    }
  }
  await page.close();
}
await writeFile(
  "artifacts/browser-errors.json",
  JSON.stringify(errors, null, 2),
);
console.log("Page errors:", errors);
await browser.close();
