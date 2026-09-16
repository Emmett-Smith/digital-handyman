import { site, offers } from "@/content/site";
import { Logo, Icon } from "@/components/Icon";
import { CallAction } from "@/components/CallAction";
import { interfaceCopy } from "@/content/interface";
const copy = interfaceCopy.app_call_page;

export const metadata = {
  title: "A 30-minute conversation",
  description: copy.the_short_version_ai_automation_for,
};
export default function CallPage() {
  return (
    <main className="call-page">
      <header>
        <a href="/">
          <Logo />
        </a>
        <a href="/">{copy.explore_the_full_site}</a>
      </header>
      <div className="call-content">
        <span className="section-note">
          {copy.for_owners_and_teams_with_too}
        </span>
        <h1>
          {copy.a_clearer_week}
          <br />
          {copy.starts_with_a_conversation}
        </h1>
        <p>{site.positioning}</p>
        <div className="call-offers">
          {offers.map((o) => (
            <article key={o.name}>
              <h2>{o.name}</h2>
              <strong className="mono">
                {o.price}
                <small>{o.unit}</small>
              </strong>
              <span>{o.time}</span>
              <p>{o.description}</p>
            </article>
          ))}
        </div>
        <div className="call-guarantee">
          <Icon name="shield" />
          <p>
            {site.guarantee} {copy.tune_up_terms_are_in_your_quote}
          </p>
        </div>
        <CallAction />
        {site.contact.phone && (
          <a href={`tel:${site.contact.phone}`}>{site.contact.phone}</a>
        )}
      </div>
      <footer>{copy.digital_handyman_business_tagline}</footer>
    </main>
  );
}
