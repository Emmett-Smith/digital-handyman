import { allowRequest, sameOrigin } from "@/lib/rate-limit";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json(
      { error: "Open this website to continue." },
      { status: 403 },
    );
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM)
    return Response.json(
      {
        error:
          "Email delivery is not available yet. Download your copy instead.",
      },
      { status: 503 },
    );
  let body: { email?: unknown; text?: unknown; kind?: unknown };
  try {
    const raw = await request.text();
    if (raw.length > 16000) throw Error();
    body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw Error();
  } catch {
    return Response.json(
      { error: "Check your details and try again." },
      { status: 400 },
    );
  }
  if (
    typeof body.email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) ||
    body.email.length > 254 ||
    typeof body.text !== "string" ||
    body.text.length > 8000
  )
    return Response.json(
      {
        error:
          "Enter a valid email and keep your request under 8,000 characters.",
      },
      { status: 400 },
    );
  if (!(await allowRequest(request, "email", 5)))
    return Response.json(
      {
        error: "You have reached the email limit. Download your copy instead.",
      },
      { status: 429 },
    );
  const quote = body.kind === "quote";
  if (quote && !process.env.QUOTE_TO)
    return Response.json(
      {
        error:
          "Written requests are not available yet. Download your request instead.",
      },
      { status: 503 },
    );
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: quote ? process.env.QUOTE_TO : body.email,
        reply_to: quote ? body.email : undefined,
        subject: quote
          ? "Digital Handyman — written quote request"
          : "Your Digital Handyman estimate",
        text: body.text,
      }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw Error();
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      {
        error: "Your email has not been sent. Download your copy or try again.",
      },
      { status: 502 },
    );
  }
}
