import { createHash } from "node:crypto";
const memory = new Map<string, { count: number; expires: number }>();
export async function allowRequest(
  request: Request,
  scope: string,
  limit = 8,
): Promise<boolean> {
  const ip =
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    "local";
  const bucket = Math.floor(Date.now() / 3600000);
  const key = `digital-handyman:${scope}:${createHash("sha256").update(ip).digest("hex").slice(0, 24)}:${bucket}`;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    try {
      const r = await fetch(`${url}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", key],
          ["EXPIRE", key, 3600],
        ]),
        signal: AbortSignal.timeout(4000),
      });
      if (!r.ok) return false;
      const data = (await r.json()) as { result: number }[];
      return data[0].result <= limit;
    } catch {
      return false;
    }
  }
  // Fail closed for paid endpoints on serverless production without shared limiting.
  if (process.env.VERCEL) return false;
  for (const [k, v] of memory) if (v.expires < Date.now()) memory.delete(k);
  const item = memory.get(key) || { count: 0, expires: Date.now() + 3600000 };
  item.count++;
  memory.set(key, item);
  return item.count <= limit;
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const source = new URL(origin);
    // Next's internal request URL can use the bind address behind a proxy.
    // The public Host header still identifies the browser's actual destination.
    const host = request.headers.get("host");
    const protocol =
      request.headers.get("x-forwarded-proto")?.split(",")[0] ||
      new URL(request.url).protocol.replace(":", "");
    return (
      origin === new URL(request.url).origin ||
      origin === process.env.NEXT_PUBLIC_SITE_URL ||
      (source.host === host && source.protocol === `${protocol}:`)
    );
  } catch {
    return false;
  }
}
