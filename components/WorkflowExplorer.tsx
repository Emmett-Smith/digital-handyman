"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "./Icon";
import "./workflow-explorer.css";

const workflows = [
  {
    id: "enquiries",
    label: "Enquiry to follow-up",
    icon: "mail",
    summary: "Turn an incoming request into an organized next step.",
    inputTitle: "A new enquiry arrives",
    inputSource: "INBOX / SAMPLE MESSAGE",
    input: "Hi, we’re opening a second location in October and need help connecting our booking system to our CRM. Could we talk next Tuesday? There are six people on our operations team.",
    steps: ["Read the enquiry", "Check the details", "Your team reviews", "Create the follow-up"],
    descriptions: ["Extract the useful context", "Flag what still needs asking", "Approve the record and reply", "Queue the agreed next step"],
    fields: [
      ["Request", "Booking system → CRM"],
      ["Timing", "October opening"],
      ["Team", "6 operations staff"],
      ["Missing detail", "Which booking system and CRM?"],
    ],
    checkpoint: "Check the proposed CRM record and draft reply before anything is saved or sent.",
    outcome: "Sample approved. A contact record and follow-up task would be created; a reply would be ready for sending.",
    tools: ["Gmail / Outlook", "HubSpot / Salesforce", "Zapier / Make"],
    rule: "Unclear requests stay with a person.",
  },
  {
    id: "invoices",
    label: "Invoice to review",
    icon: "file",
    summary: "Get the invoice details out of the attachment and into a review queue.",
    inputTitle: "An invoice needs checking",
    inputSource: "ATTACHMENT / SAMPLE INVOICE",
    input: "Northline Supplies · Invoice NS-1042\nPO reference: PO-286\n12 office chairs at $125 each\nTotal: $1,500 · Due: October 15\nDelivery location: not provided",
    steps: ["Read the invoice", "Validate the fields", "Your team reviews", "Prepare the record"],
    descriptions: ["Extract line items and dates", "Check totals and required data", "Resolve missing information", "Queue the approved draft"],
    fields: [
      ["Invoice", "NS-1042 / PO-286"],
      ["Amount", "12 × $125 = $1,500"],
      ["Due date", "October 15"],
      ["Needs review", "Confirm delivery location"],
    ],
    checkpoint: "Confirm the missing delivery location and purchase order match before an accounting draft is created.",
    outcome: "Sample approved. The invoice would move to the accounting draft queue. Payment would still require your existing approval process.",
    tools: ["Gmail / Outlook", "QuickBooks / Xero", "SharePoint / Drive"],
    rule: "Missing fields trigger review, never a guess.",
  },
  {
    id: "meetings",
    label: "Meeting to action",
    icon: "calendar",
    summary: "Make the agreed actions easier to follow through on.",
    inputTitle: "The meeting ends. Work begins.",
    inputSource: "NOTES / SAMPLE EXCERPT",
    input: "Alex will send the revised proposal by Thursday. Morgan is checking the integration requirements; we haven’t agreed a deadline. Let’s review both at Monday’s project meeting.",
    steps: ["Read the notes", "Identify the actions", "Your team reviews", "Prepare the tasks"],
    descriptions: ["Use the approved meeting notes", "Match owners and due dates", "Confirm commitments and gaps", "Queue tasks in your workspace"],
    fields: [
      ["Alex", "Send revised proposal · Thursday"],
      ["Morgan", "Check integration requirements"],
      ["Needs review", "Morgan’s deadline is not agreed"],
      ["Next check-in", "Monday’s project meeting"],
    ],
    checkpoint: "Confirm owners and dates, and agree the missing deadline before tasks are added to the project.",
    outcome: "Sample approved. Reviewed actions would become project tasks with the source notes attached for context.",
    tools: ["Teams / Google Meet", "Asana / Notion", "Slack / Outlook"],
    rule: "The source stays attached to the work.",
  },
] as const;

type Phase = "ready" | "reading" | "checking" | "approval" | "complete";
const phaseStep: Record<Phase, number> = {
  ready: -1,
  reading: 0,
  checking: 1,
  approval: 2,
  complete: 3,
};
const phaseLabels: Record<Phase, string> = {
  ready: "Ready to explore",
  reading: "Reading the sample…",
  checking: "Checking the details…",
  approval: "Paused for your review",
  complete: "Sample walkthrough complete",
};

export function WorkflowExplorer() {
  const [selected, setSelected] = useState(0);
  const [phase, setPhase] = useState<Phase>("ready");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const workflow = workflows[selected];
  const running = phase === "reading" || phase === "checking";
  const activeStep = phaseStep[phase];

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function choose(index: number) {
    if (timer.current) clearTimeout(timer.current);
    setSelected(index);
    setPhase("ready");
  }

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % workflows.length;
    else if (event.key === "ArrowLeft") next = (index + workflows.length - 1) % workflows.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = workflows.length - 1;
    else return;
    event.preventDefault();
    choose(next);
    tabs.current[next]?.focus();
  }

  function runSample() {
    if (timer.current) clearTimeout(timer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("approval");
      return;
    }
    setPhase("reading");
    timer.current = setTimeout(() => {
      setPhase("checking");
      timer.current = setTimeout(() => setPhase("approval"), 850);
    }, 750);
  }

  return (
    <section id="workflows" className="workflow-section paper" aria-labelledby="workflow-heading">
      <div className="container">
        <div className="workflow-heading">
          <div>
            <span className="section-note"><span className="small-line" /> The connections are where it gets useful</span>
            <h2 id="workflow-heading">Your tools.<br />Working together.</h2>
          </div>
          <p>Good AI implementation connects the work from start to finish. Explore what that could look like, including the moments that need a person.</p>
        </div>

        <div className="workflow-tabs" role="tablist" aria-label="Explore an example workflow">
          {workflows.map((item, index) => (
            <button
              key={item.id}
              ref={(element) => { tabs.current[index] = element; }}
              id={`workflow-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={selected === index}
              aria-controls={`workflow-panel-${item.id}`}
              tabIndex={selected === index ? 0 : -1}
              onClick={() => choose(index)}
              onKeyDown={(event) => onTabKey(event, index)}
            >
              <span className="workflow-tab-number mono">0{index + 1}</span>
              <span>{item.label}</span>
              <Icon name="chevron" size={15} />
            </button>
          ))}
        </div>

        <div
          className={`workflow-console instrument workflow-phase-${phase}`}
          id={`workflow-panel-${workflow.id}`}
          role="tabpanel"
          aria-labelledby={`workflow-tab-${workflow.id}`}
          tabIndex={0}
        >
          <div className="workflow-console-bar">
            <span><span className="workflow-console-dot" /> Workflow explorer</span>
            <span>Sample data <span aria-hidden="true">/</span> No systems connected</span>
          </div>

          <div className="workflow-console-body" key={workflow.id}>
            <div className="workflow-console-intro">
              <h3>{workflow.summary}</h3>
              <span className="workflow-sample-label mono">INTERACTIVE EXAMPLE</span>
            </div>

            <ol className="workflow-pipeline" aria-label="Workflow steps">
              {workflow.steps.map((step, index) => (
                <li
                  key={step}
                  className={`${index <= activeStep ? "is-reached" : ""} ${index === activeStep ? "is-current" : ""} ${index === 2 ? "is-human" : ""}`}
                  aria-current={index === activeStep ? "step" : undefined}
                >
                  <span className="workflow-node" aria-hidden="true">
                    {index < activeStep || phase === "complete" ? <Icon name="check" size={17} /> : <Icon name={index === 2 ? "shield" : index === 0 ? workflow.icon : index === 1 ? "spark" : "file"} size={19} />}
                  </span>
                  <span className="workflow-step-name">{step}</span>
                  <span className="workflow-step-description">{workflow.descriptions[index]}</span>
                  {index === 2 && <span className="workflow-human-label">Human checkpoint</span>}
                </li>
              ))}
            </ol>

            <div className="workflow-records">
              <article className="workflow-record workflow-source">
                <div className="workflow-record-label"><Icon name={workflow.icon} size={16} /><span className="mono">{workflow.inputSource}</span></div>
                <h4>{workflow.inputTitle}</h4>
                <p>{workflow.input}</p>
                <span className="workflow-record-footnote">Fictional example, familiar work.</span>
              </article>
              <span className="workflow-record-arrow" aria-hidden="true"><Icon name="chevron" size={21} /></span>
              <article className="workflow-record workflow-output">
                <div className="workflow-record-label"><Icon name="file" size={16} /><span className="mono">STRUCTURED / REVIEWABLE</span><span className="workflow-draft-badge">{phase === "complete" ? "Sample approved" : "Draft preview"}</span></div>
                <dl>
                  {workflow.fields.map(([label, value], index) => (
                    <div key={label} className={index === 2 && selected > 0 || label === "Missing detail" || label === "Needs review" ? "workflow-field-flagged" : ""}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                <span className="workflow-record-footnote"><Icon name="shield" size={13} /> {workflow.rule}</span>
              </article>
            </div>

            <div className="workflow-checkpoint">
              <div className="workflow-checkpoint-icon"><Icon name={phase === "complete" ? "check" : "shield"} size={21} /></div>
              <div className="workflow-checkpoint-copy">
                <strong>{phase === "complete" ? "A clear handoff, with a record of the decision." : "You decide what moves forward."}</strong>
                <p>{phase === "complete" ? workflow.outcome : workflow.checkpoint}</p>
              </div>
              <button
                type="button"
                className={`button ${phase === "approval" ? "workflow-approve" : "button-white"}`}
                aria-disabled={running}
                onClick={() => {
                  if (running) return;
                  if (phase === "approval") setPhase("complete");
                  else runSample();
                }}
              >
                <Icon name={phase === "approval" ? "check" : phase === "complete" ? "play" : "spark"} size={16} />
                {running ? "Running sample…" : phase === "approval" ? "Approve this sample" : phase === "complete" ? "Replay workflow" : "Run the sample"}
              </button>
            </div>
            <p className="workflow-status" role="status" aria-live="polite" aria-atomic="true"><span aria-hidden="true" />{phaseLabels[phase]}{phase === "approval" && " · Try approving this fictional example."}</p>
          </div>
        </div>

        <div className="workflow-compatibility">
          <div><span className="workflow-compatibility-label">Possible tools for this workflow</span><div className="workflow-tool-list">{workflow.tools.map((tool) => <span key={tool}>{tool}</span>)}</div></div>
          <p>Illustrative combinations, not partner claims. We confirm API access, permissions, and fit with your existing setup before scoping a build.</p>
        </div>
      </div>
    </section>
  );
}
