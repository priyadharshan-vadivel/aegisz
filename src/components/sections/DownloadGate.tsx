"use client";

import { useId, useRef, useState } from "react";
import { MailCheck, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConsentField, Honeypot, PhoneField, TextField, formValues, postForm } from "@/components/forms/fields";
import { Turnstile, turnstileEnabled } from "@/components/forms/Turnstile";
import { validateLead, type Errors, type LeadFields } from "@/lib/forms";
import { site } from "@/content/site";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; email: string } | { kind: "error"; message: string };

const order: LeadFields[] = ["name", "email", "company", "phone", "consent"];

/**
 * "Email me the IAAC overview". The lead is saved and the PDF arrives as a signed link by email
 * (valid 7 days). Nothing downloads on the page.
 */
export function DownloadGate() {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors<LeadFields>>({});
  const [state, setState] = useState<State>({ kind: "idle" });
  const [token, setToken] = useState<string>();
  const [resetSignal, setResetSignal] = useState(0);
  const id = (f: string) => `${uid}-${f}`;

  function focusFirst(errs: Errors<LeadFields>) {
    const first = order.find((f) => errs[f]);
    if (first) formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(first))}`)?.focus();
  }

  if (state.kind === "sent") {
    return (
      <div role="status" className="rounded-tile border border-allow/60 bg-surface p-8 sm:p-10">
        <MailCheck className="size-7 text-allow" aria-hidden strokeWidth={1.5} />
        <h3 className="mt-6 text-h3 text-fg">Check your inbox.</h3>
        <p className="mt-2 text-fg-muted">
          We&apos;ve sent the IAAC overview to <span className="break-all text-fg">{state.email}</span>. The link works for 7
          days.
        </p>
      </div>
    );
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const data = formValues(ev.currentTarget);
    const v = validateLead(data);
    if (!v.ok) {
      setErrors(v.errors);
      focusFirst(v.errors);
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
    if (status === 200) {
      setState({ kind: "sent", email: typeof json.email === "string" ? json.email : v.data.email });
      return;
    }
    if (status === 422 && json.errors) {
      const errs = json.errors as Errors<LeadFields>;
      setErrors(errs);
      setState({ kind: "idle" });
      focusFirst(errs);
      return;
    }
    const message =
      typeof json.message === "string" ? json.message : "We couldn't reach the server. Check your connection and try again.";
    setState({ kind: "error", message });
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-label="Email me the IAAC overview" className="relative space-y-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id={id("name")} name="name" label="Name" required autoComplete="name" error={errors.name} />
        <TextField id={id("email")} name="email" label="Work email" type="email" required autoComplete="email" error={errors.email} />
        <TextField id={id("company")} name="company" label="Company" required autoComplete="organization" error={errors.company} />
        <PhoneField id={id("phone")} error={errors.phone} />
      </div>
      <ConsentField id={id("consent")} error={errors.consent} />
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
          <Send aria-hidden className="size-4" />
          {state.kind === "sending" ? "Sending…" : "Email me the overview"}
        </Button>
        <p className="text-sm text-fg-subtle">PDF, 19 pages, sent as a link that works for 7 days.</p>
      </div>
    </form>
  );
}
