"use client";
import { useEffect, useRef, useState } from "react";
import { site, offers } from "@/content/site";
import { automations } from "@/content/automations";
import { attribution, track } from "@/lib/analytics";
import { downloadText } from "./EmailCopy";
import { Icon } from "./Icon";
import { interfaceCopy } from "@/content/interface";
const copy = interfaceCopy.Booking;

export function Booking({
  company: initialCompany = "",
  industry = "general",
}: {
  company?: string;
  industry?: string;
}) {
  const [company, setCompany] = useState(initialCompany);
  const [problem, setProblem] = useState("");
  const [embed, setEmbed] = useState("");
  const [quote, setQuote] = useState(false);
  const [step, setStep] = useState(0);
  const [task, setTask] = useState("");
  const [timeline, setTimeline] = useState<string>(copy.within_a_month);
  const [budget, setBudget] = useState("$2,500 — start with an Audit");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const quoteHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (!quote) return;
    const frame = requestAnimationFrame(() => quoteHeading.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [quote, step]);
  useEffect(() => {
    const prefill = (event?: Event) => {
      if (event instanceof CustomEvent && typeof event.detail === "string")
        setProblem(event.detail);
      try {
        const savedOpportunity = sessionStorage.getItem(
          "digital-handyman.opportunity",
        );
        if (savedOpportunity) setProblem(savedOpportunity);
        const data = attribution();
        if (!initialCompany && data.co) setCompany(data.co);
      } catch {}
    };
    prefill();
    window.addEventListener("digital-handyman:book", prefill);
    const message = (event: MessageEvent) => {
      if (
        event.origin === "https://calendly.com" &&
        event.data?.event === "calendly.event_scheduled"
      )
        track("booking_confirmed");
    };
    window.addEventListener("message", message);
    return () => {
      window.removeEventListener("digital-handyman:book", prefill);
      window.removeEventListener("message", message);
    };
  }, [initialCompany]);
  useEffect(() => {
    if (quote) dialog.current?.showModal();
    else dialog.current?.close();
  }, [quote]);
  useEffect(() => {
    if (!site.scheduler) return;
    const timeout = setTimeout(() => {
      try {
        const url = new URL(site.scheduler);
        if (
          url.protocol !== "https:" ||
          !["calendly.com", "www.calendly.com"].includes(url.hostname)
        )
          return;
        const data = attribution();
        url.searchParams.set("embed_type", copy.inline);
        url.searchParams.set("hide_gdpr_banner", "0");
        url.searchParams.set("hide_event_type_details", "1");
        url.searchParams.set("primary_color", "2b2bd9");
        url.searchParams.set("a1", company);
        url.searchParams.set("a2", problem);
        let score = "";
        try {
          score = sessionStorage.getItem("digital-handyman.scorecard") || "";
        } catch {}
        url.searchParams.set(
          "a3",
          JSON.stringify({ ...data, industry, scorecard: score }).slice(
            0,
            1500,
          ),
        );
        for (const key of [
          "utm_source",
          "utm_medium",
          "utm_campaign",
          "utm_content",
          "utm_term",
        ])
          if (data[key]) url.searchParams.set(key, data[key]);
        setEmbed(url.toString());
      } catch {}
    }, 500);
    return () => clearTimeout(timeout);
  }, [company, problem, industry]);
  const quoteText = `Digital Handyman — written quote request\nCompany: ${company || copy.not_provided}\nContact: ${email}\nWork: ${task || problem}\nTimeline: ${timeline}\nBudget: ${budget}\n${JSON.stringify(attribution())}`;
  return (
    <section id="booking" className="booking-section instrument">
      <div className="container">
        <div className="section-top">
          <span className="section-note">
            <span className="small-line" />{" "}
            {copy.a_conversation_not_a_commitment}
          </span>
          <span className="mono quiet">{copy["30_minutes"]}</span>
        </div>
        <div className="booking-layout">
          <div className="booking-intro">
            <h2>
              {copy.tell_us_what}
              <br />
              {copy.keeps_coming}
              <br />
              {copy.back_to_your_desk}
            </h2>
            <p>
              {copy.youll_talk_to_the_person_who}
              <br />
              {copy.well_start_with_your_week_and}
              <br className="desktop-break" /> {copy.the_audit_is_a_useful_next}
            </p>
            <div className="booking-facts">
              <span>
                <Icon name="clock" size={17} />{" "}
                {copy.thirty_minutes_focused_on_your_business}
              </span>
              <span>
                <Icon name="shield" size={17} />{" "}
                {copy.no_obligation_to_buy_an_audit}
              </span>
              <span>
                <Icon name="file" size={17} />{" "}
                {copy.clear_scope_published_prices}
              </span>
            </div>
            {site.contact.phone && (
              <a
                className="phone-link"
                href={`tel:${site.contact.phone.replace(/[^+\d]/g, "")}`}
                onClick={() => track("phone_clicked")}
              >
                <Icon name="phone" size={19} />
                {site.contact.phone}
              </a>
            )}
          </div>
          <div className="booking-terminal">
            <div className="panel-toolbar">
              <span>
                <Icon name="calendar" size={17} />{" "}
                {copy.your_first_conversation}
              </span>
              <span className="quiet">{copy.digital_handyman}</span>
            </div>
            <div className="booking-preparation">
              <label>
                {copy.company_name}
                <span>{copy.optional}</span>
                <input
                  autoComplete="organization"
                  maxLength={100}
                  placeholder={copy.your_company}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </label>
              <label>
                {copy.what_is_eating_the_most_time}
                <span>{copy.optional}</span>
                <input
                  maxLength={300}
                  placeholder={copy.we_spend_every_friday_chasing_invoices}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                />
              </label>
            </div>
            {embed ? (
              <iframe
                className="scheduler-frame"
                src={embed}
                title={copy.choose_a_time_for_your_30minute}
                loading="lazy"
              />
            ) : (
              <div className="scheduler-unavailable">
                <span className="calendar-symbol">
                  <Icon name="calendar" size={30} />
                </span>
                <h3>{copy.lets_make_time_for_better_work}</h3>
                <p>
                  {copy.online_scheduling_is_not_available_yet}
                  <br />
                  {copy.save_your_call_agenda_to_have}
                </p>
                <button
                  className="button button-white"
                  onClick={() =>
                    downloadText(
                      `Digital Handyman — 30-minute call agenda\nCompany: ${company || copy.your_company}\nThe work eating the most time: ${problem || copy.discuss_recurring_work_and_possible_starting}\n\nBusiness Tune-Up: $2,500, one week. Fee credited in full against any build.\n${site.guarantee}`,
                      "digital-handyman-call-agenda.txt",
                    )
                  }
                >
                  {copy.save_my_call_agenda}
                </button>
                {site.contact.email && (
                  <a
                    href={`mailto:${site.contact.email}?subject=30-minute%20call&body=${encodeURIComponent(problem)}`}
                    className="text-button"
                  >
                    {copy.request_a_call_by_email}
                  </a>
                )}
              </div>
            )}
            <div className="written-quote">
              <span>{copy.prefer_to_put_it_in_writing}</span>
              <button
                onClick={() => {
                  setQuote(true);
                  setStep(0);
                  setStatus("");
                  setSent(false);
                }}
              >
                {copy.send_me_a_written_quote_instead}
              </button>
            </div>
          </div>
        </div>
      </div>
      <dialog
        ref={dialog}
        className="quote-dialog"
        aria-labelledby="quote-heading"
        onCancel={() => setQuote(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setQuote(false);
        }}
      >
        <div className="dialog-inner">
          <button
            className="dialog-close"
            onClick={() => setQuote(false)}
            aria-label={copy.close_quote_request}
          >
            <Icon name="close" />
          </button>
          <span className="mono quiet">
            {step + 1} {copy["3"]}
          </span>
          <h2 id="quote-heading" ref={quoteHeading} tabIndex={-1}>
            {
              [
                copy.what_would_you_like_taken_care,
                copy.when_would_you_like_to_start,
                copy.what_budget_are_you_working_with,
              ][step]
            }
          </h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (busy || sent) return;
              if (step < 2) {
                setStep(step + 1);
                return;
              }
              setBusy(true);
              try {
                const r = await fetch("/api/email", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email,
                    kind: "quote",
                    text: quoteText,
                  }),
                });
                const data = await r.json();
                if (r.ok) {
                  setSent(true);
                  setStatus(copy.your_quote_request_has_been_sent);
                  track("quote_submitted", { task, timeline, budget });
                } else setStatus(data.error);
              } catch {
                setStatus(copy.your_request_has_not_been_sent);
              } finally {
                setBusy(false);
              }
            }}
          >
            {step === 0 ? (
              <label>
                {copy.the_work}
                <select
                  required
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                >
                  <option value="">{copy.choose_a_starting_point}</option>
                  {automations.map((a) => (
                    <option key={a.id}>{a.title}</option>
                  ))}
                  <option>{copy.help_me_find_the_right_starting}</option>
                </select>
              </label>
            ) : step === 1 ? (
              <fieldset>
                <legend>{copy.choose_a_timeline}</legend>
                {[
                  copy.within_a_month,
                  copy.within_three_months,
                  "I’m exploring for now",
                ].map((t) => (
                  <label className="quote-option" key={t}>
                    <input
                      type="radio"
                      name="timeline"
                      value={t}
                      checked={timeline === t}
                      onChange={() => setTimeline(t)}
                    />
                    {t}
                  </label>
                ))}
              </fieldset>
            ) : (
              <>
                <label>
                  {copy.approximate_budget}
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  >
                    {offers.map((o) => (
                      <option key={o.name}>
                        {o.price} {copy.text}
                        {o.name}
                      </option>
                    ))}
                    <option>{copy["2500_start_with_an_audit"]}</option>
                    <option>{copy.id_like_guidance_on_scope}</option>
                  </select>
                </label>
                <label>
                  {copy.your_email}
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={copy.youyourcompanycom}
                    maxLength={254}
                  />
                </label>
              </>
            )}
            <div className="dialog-actions">
              {step > 0 && !sent && (
                <button
                  className="text-button"
                  type="button"
                  onClick={() => setStep(step - 1)}
                >
                  {copy.go_back}
                </button>
              )}
              <button className="button button-dark" disabled={busy || sent}>
                {sent
                  ? "Request sent"
                  : busy
                    ? copy.sending
                    : step < 2
                      ? copy.continue
                      : copy.send_quote_request}
              </button>
            </div>
          </form>
          {status && <p role="status">{status}</p>}
          {step === 2 && (
            <button
              className="text-button"
              onClick={() =>
                downloadText(quoteText, "digital-handyman-quote-request.txt")
              }
            >
              {copy.save_a_copy_of_my_request}
            </button>
          )}
        </div>
      </dialog>
    </section>
  );
}
