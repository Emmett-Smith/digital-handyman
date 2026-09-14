import { Logo } from "@/components/Icon";
import { site } from "@/content/site";
import { interfaceCopy } from "@/content/interface";
const copy = interfaceCopy.app_privacy_page;

export const metadata = { title: copy.privacy };
export default function Privacy() {
  return (
    <main className="privacy-page paper">
      <a href="/">
        <Logo />
      </a>
      <h1>{copy.a_clear_note_on_privacy}</h1>
      <p>{copy.the_calculator_and_scorecard_run_in}</p>
      <h2>{copy.trying_the_demo}</h2>
      <p>{copy.when_live_processing_is_connected_the}</p>
      <h2>{copy.booking_and_email}</h2>
      <p>{copy.when_you_open_the_calendar_the}</p>
      <h2>{copy.measurement}</h2>
      <p>{copy.the_site_records_meaningful_interaction_events}</p>
      <h2>{copy.your_details}</h2>
      <p>
        {site.contact.email
          ? `Contact ${site.contact.email} about your information.`
          : copy.contact_details_will_be_published_before}
      </p>
      <a className="button button-dark" href="/">
        {copy.back_to_throughline_ai}
      </a>
    </main>
  );
}
