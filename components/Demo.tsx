"use client";
import { useEffect, useRef, useState } from "react";
import { demoExamples, type DemoResult } from "@/content/demo";
import { track } from "@/lib/analytics";
import { Icon } from "./Icon";
import { interfaceCopy } from "@/content/interface";
const copy = interfaceCopy.Demo;

export function Demo() {
  const [selected, setSelected] = useState("quote");
  const [input, setInput] = useState(demoExamples[0].input);
  const [result, setResult] = useState<DemoResult | null>(null);
  const [mode, setMode] = useState("");
  const [busy, setBusy] = useState(false);
  const [visible, setVisible] = useState(0);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"fields" | "reply">("fields");
  const [copied, setCopied] = useState(false);
  const abort = useRef<AbortController | null>(null);
  useEffect(() => () => abort.current?.abort(), []);
  useEffect(() => {
    if (!result) return;
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      mode === "live"
    ) {
      setVisible(result.fields.length);
      return;
    }
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setVisible(count);
      if (count >= result.fields.length) clearInterval(interval);
    }, 110);
    return () => clearInterval(interval);
  }, [result, mode]);
  const run = async (exampleId?: string) => {
    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;
    const example = demoExamples.find((x) => x.id === exampleId);
    const message = example?.input || input;
    if (example) {
      setInput(example.input);
      setSelected(example.id);
    }
    setBusy(true);
    setCopied(false);
    setError("");
    setResult(null);
    setVisible(0);
    setTab("fields");
    track("demo_run", { example: exampleId || "custom" });
    try {
      const response = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: message,
          example: exampleId || selected,
          replay: Boolean(exampleId),
        }),
        signal: controller.signal,
      });
      if (
        response.headers
          .get("content-type")
          ?.includes("application/x-ndjson") &&
        response.body
      ) {
        setMode("live");
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let pending = "";
        let completed = false;
        try {
          while (true) {
            const chunk = await reader.read();
            if (controller.signal.aborted) return;
            if (chunk.done) break;
            pending += decoder.decode(chunk.value, { stream: true });
            const lines = pending.split("\n");
            pending = lines.pop() || "";
            for (const line of lines) {
              if (!line.trim()) continue;
              const event = JSON.parse(line);
              if (event.type === "error") throw Error(event.error);
              if (event.type === "fields")
                setResult({ fields: event.fields, summary: "", reply: "" });
              if (event.type === "complete") {
                setResult(event.result);
                completed = true;
              }
            }
          }
        } finally {
          await reader.cancel().catch(() => {});
          reader.releaseLock();
        }
        if (!completed) throw Error(copy.try_a_sample_message_to_continue);
      } else {
        const data = await response.json();
        if (controller.signal.aborted) return;
        if (!response.ok) throw Error(data.error);
        setMode(data.mode);
        if (data.mode === "sample") setInput(data.input);
        setResult(data.result);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setResult(null);
        setError(
          err instanceof Error
            ? err.message
            : copy.try_a_sample_message_to_continue,
        );
      }
    } finally {
      if (!controller.signal.aborted) setBusy(false);
    }
  };
  return (
    <section id="demo" className="demo-section instrument">
      <div className="container">
        <div className="section-top">
          <span className="section-note">
            <span className="small-line" /> {copy.dont_take_our_word_for_it}
          </span>
          <span className="demo-status">
            <span /> {copy.see_the_work_happen}
          </span>
        </div>
        <div className="demo-heading">
          <h2>
            {copy.messy_in}
            <br />
            {copy.ready_to_work_with}
          </h2>
          <p>
            {copy.a_customer_email_a_supplier_invoice}
            <br />
            {copy.see_what_happens_when_the_retyping}
          </p>
        </div>
        <div className="demo-workspace">
          <div className="demo-input-panel">
            <div className="panel-toolbar">
              <span>
                <Icon name="mail" size={17} /> {copy.what_arrived}
              </span>
              <span className="quiet">{copy.your_inbox_on_a_normal_day}</span>
            </div>
            <label className="sr-only" htmlFor="demo-input">
              {copy.paste_a_customer_message_or_choose}
            </label>
            <textarea
              id="demo-input"
              maxLength={4000}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
            <div className="demo-input-footer">
              <span className="mono quiet">
                {input.length} {copy["4000"]}
              </span>
              <button
                className="button button-white"
                disabled={busy || input.trim().length < 10}
                onClick={() => void run()}
              >
                <Icon name="spark" size={16} />
                {busy ? copy.working_on_it : copy.see_it_organized}
              </button>
            </div>
          </div>
          <div className="demo-connector" aria-hidden="true">
            <Icon name="spark" size={21} />
          </div>
          <div className="demo-result-panel">
            <div className="panel-toolbar">
              <span>
                <Icon name="file" size={17} /> {copy.ready_for_the_next_step}
              </span>
              <span className="result-mode">
                {busy
                  ? copy.processing
                  : result
                    ? mode === "sample"
                      ? copy.sample_replay
                      : copy.live_result
                    : copy.awaiting_your_message}
              </span>
            </div>
            <div
              className="result-tabs"
              role="group"
              aria-label={copy.result_view}
            >
              <button
                aria-pressed={tab === "fields"}
                className={tab === "fields" ? "active" : ""}
                onClick={() => setTab("fields")}
              >
                {copy.the_details}
              </button>
              <button
                aria-pressed={tab === "reply"}
                className={tab === "reply" ? "active" : ""}
                onClick={() => setTab("reply")}
              >
                {copy.draft_reply}
              </button>
            </div>
            <div className="result-content" aria-live="polite" aria-busy={busy}>
              {busy && !result ? (
                <div className="demo-waiting">
                  <div className="working-lines">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} />
                    ))}
                  </div>
                  <p>{copy.reading_the_message_and_checking_the}</p>
                </div>
              ) : result ? (
                tab === "fields" ? (
                  <>
                    <table className="result-table">
                      <tbody>
                        {result.fields.slice(0, visible).map((f) => (
                          <tr key={f.label}>
                            <th scope="row">{f.label}</th>
                            <td>{f.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {visible >= result.fields.length && (
                      <p className="result-summary">{result.summary}</p>
                    )}
                  </>
                ) : (
                  <div className="draft-reply">
                    <p>{result.reply}</p>
                    <button
                      className="text-button"
                      disabled={busy || !result.reply}
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(result.reply);
                          setCopied(true);
                        } catch {
                          setError(copy.select_the_draft_text_to_copy);
                        }
                      }}
                    >
                      <Icon name="copy" size={15} />
                      {copied ? copy.copied : copy.copy_draft}
                    </button>
                    <small>{copy.a_draft_for_your_team_to}</small>
                  </div>
                )
              ) : (
                <div className="demo-empty">
                  <div className="empty-document">
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                  <h3>{copy.the_useful_part_without_the_retyping}</h3>
                  <p>{copy.run_the_example_or_paste_a}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="demo-examples">
          <span>{copy.or_try_a_familiar_example}</span>
          {demoExamples.map((e) => (
            <button key={e.id} disabled={busy} onClick={() => void run(e.id)}>
              <Icon name="play" size={12} />
              {e.label}
            </button>
          ))}
        </div>
        <div className="demo-note">
          <p>
            {mode === "sample"
              ? copy.this_is_a_recorded_sample_not
              : copy.use_a_sample_or_remove_private}
          </p>
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
