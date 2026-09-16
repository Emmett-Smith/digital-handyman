# Digital Handyman

A custom Next.js 15 website for Digital Handyman: practical modernization for small businesses, presented with familiar language, tailored quotes, interactive examples, twelve industry landing pages, a calculator, a scorecard, and a shared booking flow.

## Website publication

GitHub source: https://github.com/Emmett-Smith/digital-handyman.
GitHub Pages address: https://emmett-smith.github.io/digital-handyman/

The `Publish website` workflow builds and publishes the preview on pushes to `main`. The public website and source use the same repository. Add public business details as repository Actions variables (`NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_PHONE`, and `NEXT_PUBLIC_CALENDLY_URL`), then rerun the workflow.

The published Pages distribution includes the interactive workflow explorer with human approval checkpoints, scroll progress and chapter navigation, delivery commitments and FAQs, all twelve industry pages, the calculator, scorecard, downloads, and recorded demo examples. It does not host the server API: live AI, email delivery, and server-rendered company personalization require full Next.js hosting. No information is submitted by the sample demonstrations; unconnected delivery shows an explicit unavailable state. A configured Calendly link can still open the actual scheduling service.

`npm run build:pages` creates an isolated distribution in `.publish/pages/out`; it leaves the complete Next application intact. `PAGES_BASE_PATH` and `NEXT_PUBLIC_SITE_URL` control the export destination. The staging directory, local artifacts, secrets, and delivery archives are excluded from Git.

## Run locally

Requires Node.js 22.18 or later.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production preview:

```sh
npm run build
npm run start
```

The provided fonts are self-hosted, subsetted Geist and Geist Mono. Their license is included in `public/fonts/LICENSE.txt`.

## Configure real services

Copy `.env.example` to `.env.local`. Rebuild after changing any `NEXT_PUBLIC_` value.

| Setting | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | The actual published origin. Also sets canonical URLs, social metadata, and the sitemap. The localhost preview intentionally has `noindex`. |
| `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_CONTACT_EMAIL` | Real public business contact details. Empty values are omitted. A supplied phone enables mobile click-to-call. |
| `NEXT_PUBLIC_CALENDLY_URL` | A real Calendly event URL for a 30-minute call. Configure optional text questions in this order: company, time-consuming work, call context. The site prefills them as `a1`, `a2`, and `a3`. |
| `OPENAI_API_KEY`, `OPENAI_MODEL` | Enable live message processing. Without a key, the demo explicitly replays samples. Clicking a sample always stays on the local sample path, even with a key. |
| `RESEND_API_KEY`, `EMAIL_FROM`, `QUOTE_TO` | Enable email copies and written quote delivery. Use a verified sending domain. Without these settings, the interface states that delivery is unavailable and provides a local download. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Shared production rate limiting. Paid endpoints fail closed on Vercel if this is missing. Local development uses an in-memory hourly limiter. |

**No calendar slots, bookings, sent messages, customer results, customer logos, or personal details are fabricated.** The unconfigured calendar has an honest unavailable state and a working agenda download. It cannot book a real meeting until an actual calendar is connected.

## Deploy to Vercel

Import this folder as a Next.js project, configure the environment variables above, and deploy. The standard `next build` output is ready for Vercel; no custom adapter or database is required. A Vercel account and production domain were not supplied, so this delivery does not claim a public deployment.

After connecting services, confirm one actual test booking, verify the calendar invite contains company/opportunity/campaign context, test an email to an address you control, and review the public business details before sending outbound traffic.

## Content and routes

- `content/industries.ts`: twelve industry profiles, three hooks each, example tasks, estimated hours, calculator defaults. Adding another profile generates its page and OG image without a new component.
- `content/automations.ts`: forty tasks, their department and industry mappings, input/output explanations, illustrative hours.
- `content/site.ts`: offers, quote language, guarantee, business contact settings, process, and ownership terms.
- `content/interface.ts`: typed interface copy.
- `content/demo.ts`: three clearly fictional input examples and their recorded results.
- `content/scorecard.ts`: eight questions and task mappings.
- `content/accounts.ts`: an intentionally empty typed map. Add only researched and approved account facts.
- `content/testimonials.ts`: an intentionally empty typed array. Its section renders nothing until real entries exist.
- `/for/[industry]`: twelve statically generated canonical pages. Valid or malformed `co`/`v` parameters take an internal server-rendered route, keeping the visible URL. Company text is stripped to ASCII letters, numbers and spaces, normalized, and capped at forty characters.
- `/c/[slug]`: approved named-account pages; unknown slugs render the generic homepage with HTTP 200.
- `/call`: a concise summary with engagement options, guarantee, and booking link. No canvas or scroll libraries. It allows natural scrolling on small screens or enlarged text.
- `/privacy`: the data handling description for this implementation.

## Analytics and attribution

`lib/analytics.ts` exposes one `track()` function. It dispatches `digital-handyman:analytics` events with first-touch session attribution. Attach your selected analytics provider there; no third-party analytics script is installed by default. The implementation uses `sessionStorage`, never `localStorage`.

The meaningful event names are `hero_cta`, `library_filtered`, `library_item_opened`, `demo_run`, `calculator_engaged`, `scorecard_start`, `scorecard_complete`, `booking_opened`, `booking_confirmed`, `quote_submitted`, and `phone_clicked`. A completed booking is recorded only on the scheduler's real confirmation event. A written quote is recorded only after successful delivery.

## Verification

```sh
npm run typecheck
npm test
npm run build
npm run test:browser
node scripts/performance.mjs
```

The browser scripts use an isolated headless Google Chrome installation at the macOS default path. Change `executablePath`/`chromePath` on another operating system. They operate against an already-running local production preview. Reports and screenshots are in `artifacts/`. Browser verification mocks email delivery and uses the local sample demo path; it does not send email or incur AI usage. Final verification: 9 logic tests and 22 browser checks passed, with mobile Lighthouse performance 98–100 across three measured routes. See the build note for the measured LCP limitation.

See `BUILD-NOTE.md` for design decisions, measured results, limitations, and the proposed JavaScript reduction plan.
