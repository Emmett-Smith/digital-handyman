import type { DemoResult } from "../content/demo";
export function completeFields(text: string): DemoResult["fields"] {
  const matches = text.matchAll(
    /\{\s*"label"\s*:\s*"(?:\\.|[^"\\])*"\s*,\s*"value"\s*:\s*"(?:\\.|[^"\\])*"\s*\}/g,
  );
  const fields: DemoResult["fields"] = [];
  for (const match of matches) {
    try {
      const field = JSON.parse(match[0]);
      if (typeof field.label === "string" && typeof field.value === "string")
        fields.push({
          label: field.label.slice(0, 60),
          value: field.value.slice(0, 180),
        });
    } catch {}
    if (fields.length === 8) break;
  }
  return fields;
}
export function validateDemoOutput(value: unknown): DemoResult {
  if (!value || typeof value !== "object") throw new Error("Invalid result");
  const data = value as Partial<DemoResult>;
  if (
    !Array.isArray(data.fields) ||
    data.fields.length === 0 ||
    data.fields.length > 8 ||
    typeof data.summary !== "string" ||
    typeof data.reply !== "string" ||
    data.fields.some(
      (f) => !f || typeof f.label !== "string" || typeof f.value !== "string",
    )
  )
    throw new Error("Invalid result");
  return {
    fields: data.fields.map((f) => ({
      label: f.label.slice(0, 60),
      value: f.value.slice(0, 180),
    })),
    summary: data.summary.slice(0, 900),
    reply: data.reply.slice(0, 900),
  };
}
