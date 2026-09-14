export function cleanCompany(value: unknown): string {
  if (typeof value !== "string" || value.length > 300) return "";
  return value
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);
}
export function cleanVariant(
  value: unknown,
  hooks: Record<string, string>,
): string {
  return typeof value === "string" && Object.hasOwn(hooks, value) ? value : "";
}
