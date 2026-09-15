# Digital Handyman — build note

## The design

The site uses two surfaces: a dark instrument surface for showing the work, and a cool document surface for reading and deciding. The consistent visual idea is work becoming orderly. The hero's strands and particles become parallel lanes; the automation library uses ruled task entries; the process drawing traces a supplier email into a reviewable purchase order.

The core palette is paper `#EDF0F3`, white `#FFFFFF`, instrument `#10161D`, ink `#0E1620`, and signal `#2B2BD9`. Teal `#16A38C` and red `#D33F3F` appear only in the calculator's positive and cost data. Derived neutral colors support borders and secondary text. Essential text never relies on low-contrast indigo against the dark surface.

Geist provides display, body, and control typography. Geist Mono is reserved for prices, hours, counts, and quantities. Both are self-hosted variable fonts, subsetted to the characters used by the site. Their combined files were reduced from roughly 138 KB to 41 KB. Font fallback metrics are handled by `next/font/local`. Optional font display avoids a late swap on weak connections.

The visual hierarchy uses large, tightly set headings, restrained corners, aligned rules, and distinct compositions. Pricing is a real table. Diagnosis uses unequal claims. The studio section uses an original flow diagram to explain understanding, building, and ownership. The demo is a connected source/result instrument. These sections do not reuse a uniform card template.

## Motion and the critique pass

- The hero uses OGL and custom GLSL. GPU-rendered points move through a noise field with a curl displacement, converge into lanes, and respond to the cursor. The field becomes calmer as the hero scrolls away. A server-rendered SVG figure remains visible before and without WebGL.
- The process is pinned on desktop, with ScrollTrigger drawing the connection and advancing the stages. It becomes a complete vertical list on mobile and with reduced motion.
- Component changes use Framer Motion in the scorecard, loaded only when someone starts the questions. Calculation input runs through `requestAnimationFrame` and numeric interpolation. Samples reveal their fields progressively; live processing streams complete extracted fields before the final validated result.
- Reading sections stay still. The text is never hidden while waiting for graphics or scripts.
- The critique pass removed the animated equalizer beside the process description. It looked technical but represented no real quantity. The replacement drawing explains a concrete piece of work. Copy was enlarged and muted text was darkened after browser and contrast review.

## Deliberate resolutions and limitations

1. Fully static industry HTML and arbitrary server-rendered company personalization are different rendering needs. Twelve canonical pages and twelve distinct OG images are prerendered. Query-bearing outbound requests are internally rewritten to a shared dynamic counterpart, preserving the visible URL and canonical industry metadata.
2. The hero paints its headline immediately. The requested canvas-first entrance sequence was not allowed to delay the headline. Phone and reduced-motion visitors get the static strand illustration.
3. `/call` aims to fit one desktop viewport. It scrolls naturally on short phones or with large text so information is never clipped.
4. The scorecard describes an **opportunity score**, rather than claiming to measure organizational readiness. Its questions measure repeated manual work. Task estimates are illustrative, may overlap, and are never presented as client results.
5. The site presents the business without an individual biography, education history, portrait, or personal credentials. Business contact channels and service settings remain configurable; unknown facts are omitted.
6. Booking, delivery, and live AI require their actual service credentials. The preview provides explicit sample, unavailable, and download states. No paid API call or real booking was claimed as verified without credentials. Production serverless rate limiting requires shared storage.
7. A public Vercel deployment requires the owner's Vercel account and final site origin. The project is ready for that deployment, but the delivered preview runs locally. Localhost metadata intentionally prevents indexing.

## Validation

Final production verification: TypeScript passed; all nine invariant tests and all twenty-two browser checks passed. Browser coverage includes the complete scorecard, calculator arithmetic, three sample demos, downloads, keyboard navigation, quote steps, personalization, all twelve industry pages and OG images, and 320/390 px layouts. Email submission is intercepted with a browser mock; no real message is sent.

| Mobile route | Performance | Accessibility | LCP | Layout shift |
| --- | --- | --- | --- | --- |
| Homepage | 99 | 100 | 2.12 s | 0 |
| Call page | 100 | 100 | 1.66 s | 0 |
| Dental industry | 98 | 100 | 2.48 s | 0 |

These Lighthouse results use simulated slow 4G and 4× CPU throttling against the local production server. Performance exceeds the requested 95, but the strict 1.8 s LCP target is met only on the call page under this profile. Homepage LCP improved from approximately 2.71 s to 2.12 s. Automated WCAG A/AA scanning found no homepage violations; this is not a substitute for a full human accessibility audit. Local SEO scores reflect intentional noindex metadata. Deployed network and real scheduler behavior require measurement after publishing.

Initial route JavaScript is approximately 134 KB for the homepage and industry pages, and 105 KB for `/call`. The scorecard animation library loads only on interaction. Screenshots cover 320, 390, 768, 1024, and 1440 px. Reports and reproducible verification scripts accompany the project.

## If JavaScript had to fall another 40%

The Next.js/React baseline is roughly 103 KB compressed, so removing small flourishes cannot cut forty percent of the whole route. The practical order would be:

1. Keep the static hero artwork and remove OGL from desktop entirely.
2. Replace GSAP's pinned sequence with a native sticky layout and CSS progression. Keep every stage readable.
3. Replace Framer Motion's scorecard transition with a short CSS state change.
4. Load the command palette and interactive scorecard only on first use, and avoid bundling the entire task catalog into both search and scoring paths.
5. If the target is forty percent of **all** initial JavaScript rather than feature JavaScript, progressively enhance the library and forms from server HTML, with smaller independent event handlers. That changes the implementation strategy and should be measured before promising a percentage.

The published prices, full guarantee, static industry content, plain-language copy, and one-click access to booking should survive any bundle reduction.

## Implementation references

- Next.js 15 rendering behavior: https://nextjs.org/docs/15/app/api-reference/file-conventions/page#searchparams-optional
- Official OpenAI documentation for JSON output and streaming: https://developers.openai.com/api/docs/guides/structured-outputs

- Calendly custom-answer prefill: https://calendly.com/help/how-to-pre-fill-invitee-information-in-your-calendly-link

## Final refinement

The particle field now relaxes after the pointer becomes idle, with its timer cleaned up on unmount. Tablet figure labels have additional edge clearance. Both self-hosted fonts retain their preload behavior to preserve the intended typography. Production compilation and responsive screenshot checks were repeated after these changes. Lighthouse measurements vary between runs; the table records the latest complete run.

## Interaction review

Keyboard selection in search now stays visible as results scroll, while focus remains in the search field. Search opens with a fresh query; Escape closes mobile navigation and restores focus to its trigger. Quote steps focus their heading, and successful delivery disables repeat submission. The expanded suite passes all 22 browser checks, including mocked success and unavailable email responses. No external messages were sent. The production build passes; performance measurements above precede these small interaction changes.

## Demo reliability

Malformed JSON values are rejected as invalid requests rather than causing a server error. Stream cancellation now stops downstream writes and releases the upstream reader. The client releases its response reader on completion or failure, clears incomplete output, and allows an immediate sample retry. Result-view buttons expose their selected state to assistive technology; unfinished replies cannot be copied. All 22 browser checks and nine invariant tests pass, including malformed-body rejection and a mocked interrupted-stream recovery. Live paid processing remains unverified without credentials.

## Calculator review

Recovered capacity and both prices now share one proportional chart scale, including when the annual estimate is below the Sprint price. The initial annual estimate is server-rendered. Rapid changes retain pending values across controls, and interrupted number animations continue from the displayed amount. A shared calculation function has boundary and scale tests. The production build, nine logic tests, and 22 browser checks pass; the browser suite includes a $39/year estimate whose recovered-capacity bar correctly remains smaller than either price.

## Studio presentation

The site presents Digital Handyman as a dependable service business, with no individual biography, academic history, portrait configuration, or personal technical background. The profile section uses an original process drawing and practical commitments about scope, review, and ownership. Navigation, hero copy, the call page, configuration examples, documentation, and saved previews were updated together. All 22 browser checks pass, including a check that personal-profile language is absent.
