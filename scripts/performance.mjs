import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { writeFile } from "node:fs/promises";
const chrome = await launch({
  chromePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu"],
});
try {
  for (const route of ["", "/call", "/for/dental"]) {
    const slug = route ? route.replaceAll("/", "-") : "home";
    const result = await lighthouse(`http://localhost:3000${route}`, {
      port: chrome.port,
      output: ["html", "json"],
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      formFactor: "mobile",
      screenEmulation: {
        mobile: true,
        width: 390,
        height: 844,
        deviceScaleFactor: 1,
        disabled: false,
      },
      throttling: {
        rttMs: 150,
        throughputKbps: 1638.4,
        cpuSlowdownMultiplier: 4,
        requestLatencyMs: 562.5,
        downloadThroughputKbps: 1474.56,
        uploadThroughputKbps: 675,
      },
      logLevel: "error",
    });
    await writeFile(`artifacts/lighthouse-${slug}.html`, result.report[0]);
    await writeFile(`artifacts/lighthouse-${slug}.json`, result.report[1]);
    console.log(
      route || "/",
      JSON.stringify({
        scores: Object.fromEntries(
          Object.entries(result.lhr.categories).map(([k, v]) => [
            k,
            v.score * 100,
          ]),
        ),
        LCP: result.lhr.audits["largest-contentful-paint"].numericValue,
        FCP: result.lhr.audits["first-contentful-paint"].numericValue,
        TBT: result.lhr.audits["total-blocking-time"].numericValue,
        CLS: result.lhr.audits["cumulative-layout-shift"].numericValue,
      }),
    );
  }
} finally {
  await chrome.kill();
}
