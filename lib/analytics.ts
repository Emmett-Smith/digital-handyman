"use client";
export type EventName =
  | "hero_cta"
  | "library_filtered"
  | "library_item_opened"
  | "demo_run"
  | "calculator_engaged"
  | "scorecard_start"
  | "scorecard_complete"
  | "booking_opened"
  | "booking_confirmed"
  | "quote_submitted"
  | "phone_clicked";
export type Attribution = Record<string, string>;
const key = "digital-handyman.session";
export function attribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    const saved = sessionStorage.getItem(key);
    if (saved) return JSON.parse(saved) as Attribution;
    const p = new URLSearchParams(location.search);
    const data: Attribution = {
      industry: location.pathname.startsWith("/for/")
        ? location.pathname.split("/")[2]
        : "general",
      variant: p.get("v")?.slice(0, 40) || "default",
    };
    for (const name of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "co",
      "v",
    ]) {
      const v = p.get(name);
      if (v)
        data[name] = v
          .replace(/[^a-zA-Z0-9 _.-]/g, "")
          .slice(0, name === "co" ? 40 : 150);
    }
    sessionStorage.setItem(key, JSON.stringify(data));
    return data;
  } catch {
    return {};
  }
}
export function track(
  event: EventName,
  properties: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("digital-handyman:analytics", {
      detail: { event, ...attribution(), ...properties },
    }),
  );
}
export function book(
  opportunity?: string,
  event: EventName = "booking_opened",
) {
  if (opportunity)
    try {
      sessionStorage.setItem("digital-handyman.opportunity", opportunity);
    } catch {}
  track(event, { opportunity });
  window.dispatchEvent(
    new CustomEvent("digital-handyman:book", { detail: opportunity }),
  );
  document.getElementById("booking")?.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
  });
}
