"use client";

import { useId, useRef, useState } from "react";
import { CheckCircle2, Download } from "lucide-react";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Honeypot, TextField, postForm } from "@/components/forms/fields";
import { Turnstile, turnstileEnabled } from "@/components/forms/Turnstile";
import { validateLead, type Errors, type LeadFields } from "@/lib/forms";
import { site } from "@/content/site";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "done"; url: string } | { kind: "error"; message: string };

/**
 * "Download the IAAC overview". Gated (default): name, work email and company are emailed to
 * AegisZ, then the PDF downloads. With GATED_DOWNLOAD=false it's a plain download button.
 */
export function DownloadGate({ gated }: { gated: boolean }) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors<LeadFields>>({});
  const [state, setState] = useState<State>({ kind: "idle" });
  const [token, setToken] = useState<string>();
  const [resetSignal, setResetSignal] = useState(0);
  const id = (f: string) => `${uid}-${f}`;

  if (!gated) {
    return (
      <a href="/api/download" className={buttonClasses("primary", "lg")} download>
        <span className="relative z-[2] inline-flex items-center gap-2">
          <Download aria-hidden className="size-4" /> Download the IAAC overview (PDF)
        </span>
      </a>
    );
  }

  if (state.kind === "done") {
    return (
      <div role="status" className="rounded-tile border border-allow/60 bg-surface p-8 sm:p-10">
        <CheckCircle2 className="size-7 text-allow" aria-hidden strokeWidth={1.5} />
        <h3 className="mt-6 text-h3 text-fg">Your download has started.</h3>
        <p className="mt-2 text-fg-muted">
          If it didn&apos;t,{" "}
          <a href={state.url} className="text-fg underline underline-offset-4">
            download the IAAC overview
          </a>
          . The link works for 10 minutes.
        </p>
      </div>
    );
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const data = Object.fromEntries(new FormData(ev.currentTarget));
    const v = validateLead(data);
    if (!v.ok) {
      setErrors(v.errors);
      const first = Object.keys(v.errors)[0];
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(first))}`)?.focus();
      return;
    }
    if (turnstileEnabled && !token) {
      setState({ kind: "error", message: "Please complete the verification check." });
      return;
    }
    setErrors({});
    setState({ kind: "sending" });
    const { status, json } = await postForm("/api/lead", { ...data, turnstileToken: token });
    setResetSignal((n) => n + 1);
    if (status === 200 && typeof json.downloadUrl === "string") {
      setState({ kind: "done", url: json.downloadUrl });
      window.location.assign(json.downloadUrl);
      return;
    }
    if (status === 200) {
      setState({ kind: "error", message: "Something went wrong. Please try again." });
      return;
    }
    if (status === 422 && json.errors) {
      setErrors(json.errors as Errors<LeadFields>);
      setState({ kind: "idle" });
      return;
    }
    const message =
      typeof json.message === "string" ? json.message : "We couldn't reach the server. Check your connection and try again.";
    setState({ kind: "error", message });
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-label="Download the IAAC overview" className="relative space-y-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-3">
        <TextField id={id("name")} name="name" label="Name" required autoComplete="name" error={errors.name} />
        <TextField id={id("email")} name="email" label="Work email" type="email" required autoComplete="email" error={errors.email} />
        <TextField id={id("company")} name="company" label="Company" required autoComplete="organization" error={errors.company} />
      </div>
      <Turnstile onToken={setToken} resetSignal={resetSignal} />
      {state.kind === "error" && (
        <p role="alert" className="text-sm text-danger">
          {state.message} You can also email{" "}
          <a href={`mailto:${site.email}?subject=IAAC%20overview`} className="underline underline-offset-4">
            {site.email}
          </a>
          .
        </p>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={state.kind === "sending"} className="w-full sm:w-auto">
          <Download aria-hidden className="size-4" />
          {state.kind === "sending" ? "Sending…" : "Download the overview"}
        </Button>
        <p className="text-xs text-fg-subtle">PDF, 19 pages. We&apos;ll send you a short confirmation. No spam.</p>
      </div>
    </form>
  );
}
