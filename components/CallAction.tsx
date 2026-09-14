"use client";
import { useEffect } from "react";
import { attribution, track } from "@/lib/analytics";
import { site } from "@/content/site";
export function CallAction() {
  useEffect(() => {
    attribution();
  }, []);
  return (
    <a
      className="button button-signal"
      href={site.scheduler || "/#booking"}
      onClick={(e) => {
        track("booking_opened", { source: "call" });
        if (site.scheduler) {
          try {
            const url = new URL(site.scheduler);
            for (const [key, value] of Object.entries(attribution())) {
              if (key.startsWith("utm_")) url.searchParams.set(key, value);
            }
            url.searchParams.set("a3", JSON.stringify(attribution()));
            e.preventDefault();
            location.assign(url.toString());
          } catch {}
        }
      }}
    >
      {site.bookingLabel}
    </a>
  );
}
