"use client";
import { useState } from "react";
import { Icon } from "./Icon";
import { interfaceCopy } from "@/content/interface";
const copy = interfaceCopy.EmailCopy;

export function downloadText(
  text: string,
  filename = "throughline-estimate.txt",
) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function EmailCopy({
  text,
  label = copy.email_me_this_estimate,
}: {
  text: string;
  label?: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="email-copy">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setState("");
          try {
            const r = await fetch("/api/email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, text, kind: "estimate" }),
            });
            const data = await r.json();
            setState(r.ok ? copy.your_copy_is_on_its_way : data.error);
          } catch {
            setState(copy.your_email_has_not_been_sent);
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          <span>{label}</span>
          <div className="email-input">
            <Icon name="mail" size={18} />
            <input
              required
              type="email"
              autoComplete="email"
              maxLength={254}
              placeholder={copy.youyourcompanycom}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={busy}>
              {busy ? copy.sending : copy.send_copy}
            </button>
          </div>
        </label>
      </form>
      <div className="email-copy-bottom">
        <p role="status">{state || copy.your_estimate_is_yours_no_email}</p>
        <button
          className="text-button"
          onClick={() => downloadText(text)}
          aria-label={copy.save_a_copy_of_your_estimate}
        >
          <Icon name="download" size={15} /> {copy.save_a_copy}
        </button>
      </div>
    </div>
  );
}
