import test from "node:test";
import assert from "node:assert/strict";
import { cleanCompany, cleanVariant } from "../lib/personalization.ts";
import { sameOrigin } from "../lib/rate-limit.ts";
import { industries } from "../content/industries.ts";
import { automations } from "../content/automations.ts";
import { completeFields, validateDemoOutput } from "../lib/demo-output.ts";
import { getAccount } from "../content/accounts.ts";
test("outbound company names cannot inject markup or exceed forty characters", () => {
  assert.equal(
    cleanCompany("<script>Riverside & Dental</script>"),
    "scriptRiverside Dentalscript",
  );
  assert.equal(cleanCompany("A".repeat(80)).length, 40);
  assert.equal(cleanCompany(["one", "two"]), "");
  assert.equal(cleanCompany(null), "");
  assert.equal(cleanCompany("A".repeat(301)), "");
  assert.equal(cleanCompany("   Riverside   Dental  "), "Riverside Dental");
});
test("hero variant lookup rejects inherited properties and repeated query parameters", () => {
  const hooks = { recall: "Recall calls" };
  assert.equal(cleanVariant("__proto__", hooks), "");
  assert.equal(cleanVariant("constructor", hooks), "");
  assert.equal(cleanVariant(["recall"], hooks), "");
  assert.equal(cleanVariant("recall", hooks), "recall");
});
test("unknown account slugs cannot resolve inherited object properties", () => {
  assert.equal(getAccount("constructor"), undefined);
  assert.equal(getAccount("__proto__"), undefined);
  assert.equal(getAccount("toString"), undefined);
});
test("origin verification works behind a proxy and rejects unrelated websites", () => {
  assert.equal(
    sameOrigin(
      new Request("http://0.0.0.0:3000/api/demo", {
        headers: { host: "localhost:3000", origin: "http://localhost:3000" },
      }),
    ),
    true,
  );
  assert.equal(
    sameOrigin(
      new Request("http://0.0.0.0:3000/api/demo", {
        headers: { host: "localhost:3000", origin: "https://example.com" },
      }),
    ),
    false,
  );
  assert.equal(
    sameOrigin(
      new Request("http://0.0.0.0:3000/api/demo", {
        headers: {
          host: "digital-handyman.example",
          origin: "https://digital-handyman.example",
          "x-forwarded-proto": "https",
        },
      }),
    ),
    true,
  );
});
test("every industry has distinct hooks and meaningful business defaults", () => {
  assert.ok(industries.length >= 12);
  assert.equal(new Set(industries.map((i) => i.slug)).size, industries.length);
  for (const i of industries) {
    assert.equal(Object.keys(i.hooks).length, 3);
    assert.equal(i.examples.length, 3);
    assert.equal(i.weeklyHours.length, 3);
    assert.ok(i.calculator.rate >= 15);
    assert.ok(automations.some((a) => a.industries.includes(i.slug)));
  }
});
test("all forty task deep links are unique and industry references resolve", () => {
  assert.ok(automations.length >= 40);
  assert.equal(new Set(automations.map((a) => a.id)).size, automations.length);
  for (const a of automations) {
    assert.match(a.id, /^[a-z0-9-]+$/);
    assert.ok(a.hours[1] >= a.hours[0]);
    assert.ok(a.industries.every((s) => industries.some((i) => i.slug === s)));
  }
});
test("stream parsing reveals only complete JSON fields and handles escaped quotes", () => {
  const first = { label: "Item", value: '40 aluminum "brackets"' };
  const raw = JSON.stringify({
    fields: [first, { label: "Due", value: "Friday" }],
  });
  const cut = raw.indexOf(',{"label":"Due"') + 10;
  assert.deepEqual(completeFields(raw.slice(0, cut)), [first]);
  assert.equal(completeFields(raw).length, 2);
  assert.deepEqual(
    completeFields('{"fields":[{"label":"Item","value":"unfinished'),
    [],
  );
});
test("untrusted demo output is bounded and malformed output is rejected", () => {
  assert.throws(() =>
    validateDemoOutput({
      fields: [{ label: "Item", value: 3 }],
      summary: "",
      reply: "",
    }),
  );
  assert.throws(() => validateDemoOutput(null));
  const result = validateDemoOutput({
    fields: [{ label: "Item", value: "x".repeat(1000) }],
    summary: "x".repeat(2000),
    reply: "x".repeat(2000),
  });
  assert.equal(result.fields[0].value.length, 180);
  assert.equal(result.summary.length, 900);
  assert.equal(result.reply.length, 900);
});

test("capacity comparisons preserve a common scale above and below the build price", async () => {
  const { calculateCapacity } = await import("../lib/calculator.ts");
  const usual = calculateCapacity({
    people: 3,
    hours: 12,
    rate: 45,
    share: 65,
  });
  assert.equal(usual.weeklyHours, 23.4);
  assert.equal(usual.annualValue, 54756);
  assert.equal(usual.recoveredWidth, 100);
  const low = calculateCapacity({ people: 1, hours: 1, rate: 15, share: 5 });
  assert.equal(low.annualValue, 39);
  assert.equal(low.sprintWidth, 100);
  assert.ok(low.recoveredWidth < low.auditWidth);
  assert.ok(Math.abs(low.auditWidth / low.recoveredWidth - 2500 / 39) < 0.0001);
  assert.equal(
    calculateCapacity({ people: 0, hours: 0, rate: 0, share: 0 }).sprintMonths,
    null,
  );
});
