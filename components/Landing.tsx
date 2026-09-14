import Link from "next/link";
import { site, offers, diagnosis, reassurances } from "@/content/site";
import { industries, type Industry } from "@/content/industries";
import { testimonials } from "@/content/testimonials";
import { FlowField } from "./FlowField";
import { FlowPoster } from "./FlowPoster";
import { Library } from "./Library";
import { StageFlow } from "./StageFlow";
import { Demo } from "./Demo";
import { Calculator } from "./Calculator";
import { Scorecard } from "./Scorecard";
import { Booking } from "./Booking";
import { GlobalControls, HeroActions, BookButton } from "./GlobalControls";
import { Icon, Logo } from "./Icon";
import { interfaceCopy } from "@/content/interface";
import { ScrollExperience, DeliveryStrip } from "./ScrollExperience";
import { WorkflowExplorer } from "./WorkflowExplorer";
import { TrustSection } from "./TrustSection";
const copy = interfaceCopy.Landing;

export function Landing({
  industry,
  company = "",
  accountProblem = "",
  hook = "",
}: {
  industry?: Industry;
  company?: string;
  accountProblem?: string;
  hook?: string;
}) {
  return (
    <>
      <GlobalControls />
      <ScrollExperience />
      <main>
        <section id="hero" className="hero instrument">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-field">
            <FlowPoster />
            <FlowField />
            <div className="field-label field-label-start">
              <span className="field-dot" /> {copy.the_work_as_it_arrives}
            </div>
            <div className="field-label field-label-end">
              <span className="field-dot" /> {copy.a_little_more_order}
            </div>
            <div className="field-coordinate" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="container hero-container">
            <div className="hero-copy">
              <span className="hero-intro">
                <span className="hero-intro-symbol">
                  <Icon name="spark" size={13} />
                </span>
                {company
                  ? `Built for ${industry?.audience || "businesses"} like ${company}.`
                  : industry
                    ? `For ${industry.name.toLowerCase()}`
                    : "AI consulting, implementation & integration."}
              </span>
              <h1
                className={
                  industry || accountProblem ? "industry-headline" : ""
                }
              >
                {accountProblem ||
                  hook ||
                  industry?.headline ||
                  site.headline.map((line) => <span key={line}>{line}</span>)}
              </h1>
              <p className="hero-description">{site.positioning}</p>
              <HeroActions />
              <div className="hero-micro">
                <span className="micro-line" />
                <span>
                  {copy.built_for_your_business}
                  <br />
                  {copy.made_for_the_way_your_business}
                </span>
              </div>
            </div>
            <div className="hero-bottom">
              <div className="hero-offer">
                <span className="offer-small-title">
                  {copy.a_clear_place_to_start}
                </span>
                <span>
                  {copy.automation_audit}
                  <strong className="mono">{copy["2500"]}</strong>
                </span>
                <small>{copy.one_week_credited_in_full_toward}</small>
              </div>
              <div className="hero-guarantee">
                <Icon name="shield" size={22} />
                <p>{site.guarantee}</p>
              </div>
              <a
                href="#library"
                className="scroll-cue"
                aria-label={copy.scroll_to_the_automation_library}
              >
                <span>{copy.keep_exploring}</span>
                <Icon name="down" size={20} />
              </a>
            </div>
          </div>
        </section>
        <DeliveryStrip />
        <WorkflowExplorer />
        <Library industry={industry?.slug} />
        <section id="diagnosis" className="diagnosis-section paper">
          <div className="container">
            <div className="diagnosis-heading">
              <span className="section-note">
                <span className="small-line" />{" "}
                {copy.the_work_is_obvious_the_way}
              </span>
              <h2>
                {copy.youve_probably}
                <br />
                {copy.tried_to_fix_this}
              </h2>
            </div>
            <div className="diagnosis-claims">
              {diagnosis.map((d, i) => (
                <article
                  key={d.title}
                  className={i === 0 ? "primary-claim" : ""}
                >
                  <span className="claim-marker" aria-hidden="true">
                    {copy.text}
                  </span>
                  <h3>{d.title}</h3>
                  <p>{d.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <StageFlow />
        <Demo />
        <Calculator defaults={industry?.calculator} />
        <Scorecard industry={industry?.slug} />
        <section id="pricing" className="pricing-section paper">
          <div className="container">
            <div className="section-top">
              <span className="section-note">
                <span className="small-line" />{" "}
                {copy.you_should_know_what_this_costs}
              </span>
              <span className="quiet">
                {copy.a_scope_a_price_something_that}
              </span>
            </div>
            <div className="pricing-heading">
              <h2>
                {copy.no_openended}
                <br />
                {copy.lets_explore_ai}
              </h2>
              <p>
                {copy.start_with_the_audit_know_what}
                <br />
                {copy.then_decide_what_happens_next}
              </p>
            </div>
            <div className="pricing-table-wrap">
              <table className="pricing-table">
                <thead>
                  <tr>
                    <th scope="col">{copy.the_work}</th>
                    <th scope="col">{copy.what_you_get}</th>
                    <th scope="col">{copy.your_investment}</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((o) => (
                    <tr
                      key={o.name}
                      className={o.featured ? "featured-offer" : ""}
                    >
                      <th scope="row">
                        <span className="offer-name">{o.name}</span>
                        <span className="offer-time">{o.time}</span>
                        <span className="offer-description">
                          {o.description}
                        </span>
                        {o.featured && (
                          <span className="start-label">
                            <span /> {copy.start_here}
                          </span>
                        )}
                      </th>
                      <td>
                        <ul>
                          {o.items.map((item) => (
                            <li key={item}>
                              <Icon name="check" size={15} />
                              {item}
                            </li>
                          ))}
                        </ul>
                        <p className="offer-note">{o.note}</p>
                      </td>
                      <td className="price-cell">
                        <span className="price-unit">{o.unit}</span>
                        <strong className="mono">{o.price}</strong>
                        <BookButton
                          className={
                            o.featured
                              ? "button button-signal"
                              : "button button-outline"
                          }
                          opportunity={o.name}
                        >
                          {o.featured
                            ? copy.talk_about_the_audit
                            : copy.book_a_call}
                        </BookButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="guarantee-block">
              <span className="guarantee-icon">
                <Icon name="shield" size={29} />
              </span>
              <div>
                <h3>{copy.ten_hours_a_week_or_theres}</h3>
                <p>{site.guarantee}</p>
              </div>
              <span className="guarantee-number mono" aria-hidden="true">
                {copy["10"]}
                <span>{copy.hrs}</span>
              </span>
            </div>
          </div>
        </section>
        <section id="studio" className="studio-section paper">
          <div className="container">
            <div className="studio-layout">
              <div className="studio-visual">
                <StudioDrawing />
                <div className="studio-visual-caption">
                  <span>{copy.precision_is_a_habit}</span>
                  <span>{copy.studio_caption}</span>
                </div>
              </div>
              <div className="studio-copy">
                <span className="section-note">
                  <span className="small-line" />{" "}
                  {copy.studio_eyebrow}
                </span>
                <h2>
                  {copy.your_automation}
                  <br />
                  {copy.studio_headline_second}
                  <br />
                  {copy.studio_headline_third}
                </h2>
                <p className="studio-lead">
                  {copy.studio_lead}
                </p>
                <p>{copy.studio_scope}</p>
                <p>{copy.studio_review}</p>
                <p>{copy.studio_handoff}</p>
                <div className="studio-signoff">
                  <strong>Throughline AI</strong>
                  <span>{copy.studio_commitment}</span>
                </div>
              </div>
            </div>
            <div className="reassurances">
              {reassurances.map(([title, body]) => (
                <article key={title}>
                  <Icon name="check" size={18} />
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <Testimonials />
        <TrustSection />
        <Booking company={company} industry={industry?.slug} />
      </main>
      <Footer />
    </>
  );
}
function Testimonials() {
  if (!testimonials.length) return null;
  return (
    <section className="paper testimonials">
      <div className="container">
        <h2>{copy.in_their_own_words}</h2>
        {testimonials.map((t) => (
          <figure key={`${t.name}-${t.company}`}>
            <blockquote>{t.quote}</blockquote>
            <figcaption>
              {t.name}
              {copy.text_1}
              {t.role}
              {copy.text_1}
              {t.company}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
function StudioDrawing() {
  return (
    <div className="studio-drawing" aria-hidden="true">
      <svg viewBox="0 0 500 550" fill="none">
        <defs>
          <pattern
            id="studio-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path d="M32 0H0V32" stroke="#c2cee5" strokeOpacity=".09" />
          </pattern>
          <linearGradient
            id="studio-line"
            x1="80"
            y1="100"
            x2="420"
            y2="450"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#7878FF" />
            <stop offset="1" stopColor="#DCE4FA" />
          </linearGradient>
        </defs>
        <path fill="url(#studio-grid)" d="M0 0h500v550H0z" />
        <g stroke="#b4bcd0" opacity=".3">
          <circle cx="250" cy="275" r="190" strokeDasharray="2 8" />
          <path d="M250 35v480M20 275h460" />
        </g>
        {Array.from({ length: 18 }, (_, i) => (
          <path
            key={i}
            d={`M ${55 + i * 7} 85 C ${390 - i * 12} 170, ${50 + i * 12} 350, ${315 + i * 7} 465`}
            stroke="url(#studio-line)"
            strokeWidth={i % 3 === 0 ? 1.4 : 0.6}
            opacity=".7"
          />
        ))}
        {[
          { x: 100, y: 125, n: "01", label: "Understand" },
          { x: 250, y: 275, n: "02", label: "Build & review" },
          { x: 400, y: 425, n: "03", label: "Make it yours" },
        ].map((point) => (
          <g key={point.n}>
            <rect
              x={point.x - 27}
              y={point.y - 27}
              width="54"
              height="54"
              rx="27"
              fill="#17212E"
              stroke="#A9B5D0"
            />
            <text
              x={point.x}
              y={point.y + 5}
              textAnchor="middle"
              fill="#EDF0F3"
              fontSize="14"
              fontFamily="monospace"
            >
              {point.n}
            </text>
            <text
              x={point.x}
              y={point.y + 48}
              textAnchor="middle"
              fill="#CBD3E3"
              fontSize="12"
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="drawing-note">
        <span className="small-line" />
        {copy.care_in_every_detail}
      </div>
    </div>
  );
}
export function Footer() {
  return (
    <footer className="footer instrument">
      <div className="container">
        <div className="footer-top">
          <a href="/" aria-label={copy.throughline_ai_home}>
            <Logo />
          </a>
          <p>
            {copy.less_busywork}
            <br />
            {copy.more_room_for_your_business}
          </p>
          <div>
            <a href="#pricing">{copy.the_prices}</a>
            <a href="/call">{copy.the_short_version}</a>
            <a href="#booking">{copy.lets_talk}</a>
          </div>
        </div>
        <div className="footer-industries">
          <span>{copy.made_for_the_work_in_your}</span>
          <div>
            {industries.map((i) => (
              <Link href={`/for/${i.slug}`} key={i.slug} prefetch={false}>
                {i.shortName}
              </Link>
            ))}
          </div>
        </div>
        <div className="footer-word" aria-hidden="true">
          {copy.throughline}
          <span>{copy.ai}</span>
        </div>
        <div className="footer-bottom">
          <span>
            {copy.text_2}
            {new Date().getFullYear()} {copy.throughline_ai}
          </span>
          <span>{copy.built_with_care_built_to_be}</span>
          <a href="/privacy">{copy.privacy}</a>
        </div>
      </div>
    </footer>
  );
}
