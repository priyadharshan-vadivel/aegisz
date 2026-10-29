"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Honeypot, TextField, inputBase, postForm } from "@/components/forms/fields";
import { Turnstile, turnstileEnabled } from "@/components/forms/Turnstile";
import { interests, validateContact, type ContactFields, type Errors } from "@/lib/forms";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; name: string } | { kind: "error"; message: string };

export function ContactForm() {
  // Preselect from ?interest= after mount, so the form itself stays server-rendered (no layout shift).
  const [interest, setInterest] = useState("");
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("interest");
    if (q && interests.some((i) => i.value === q)) setInterest(q);
  }, []);
  const [errors, setErrors] = useState<Errors<ContactFields>>({});
  const [state, setState] = useState<State>({ kind: "idle" });
  const [token, setToken] = useState<string>();
  const [resetSignal, setResetSignal] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();
  const id = (f: ContactFields) => `${uid}-${f}`;

  function focusFirst(errs: Errors<ContactFields>) {
    const first = Object.keys(errs)[0] as ContactFields | undefined;
    if (first) formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(first))}`)?.focus();
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const data = Object.fromEntries(new FormData(ev.currentTarget));
    const v = validateContact(data);
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
    const { status, json } = await postForm("/api/contact", { ...data, turnstileToken: token });
    setResetSignal((n) => n + 1);
    if (status === 200) {
      setState({ kind: "sent", name: v.data.name });
      return;
    }
    if (status === 422 && json.errors) {
      const errs = json.errors as Errors<ContactFields>;
      setErrors(errs);
      setState({ kind: "idle" });
      focusFirst(errs);
      return;
    }
    const message =
      typeof json.message === "string" ? json.message : "We couldn't reach the server. Check your connection and try again.";
    setState({ kind: "error", message });
  }

  if (state.kind === "sent") {
    return (
      <div role="status" className="rounded-tile border border-allow/60 bg-surface p-8 sm:p-10">
        <CheckCircle2 className="size-7 text-allow" aria-hidden strokeWidth={1.5} />
        <h2 className="mt-6 text-h3 text-fg">Thanks, {state.name}. Your request is in.</h2>
        <p className="mt-2 text-fg-muted">We&apos;ve emailed you a confirmation and will be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-label="Send us a message" className="relative space-y-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField id={id("name")} name="name" label="Name" required autoComplete="name" error={errors.name} />
        <TextField id={id("email")} name="email" label="Work email" type="email" required autoComplete="email" error={errors.email} />
        <TextField id={id("company")} name="company" label="Company" required autoComplete="organization" error={errors.company} />
        <TextField id={id("role")} name="role" label="Role" autoComplete="organization-title" error={errors.role} />
      </div>

      <div>
        <label htmlFor={id("interest")} className="text-sm font-medium text-fg">
          Interested in <span className="text-fg-subtle">(required)</span>
        </label>
        <select
          id={id("interest")}
          name="interest"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          aria-invalid={errors.interest ? true : undefined}
          aria-describedby={errors.interest ? `${id("interest")}-err` : undefined}
          className={cn(inputBase, errors.interest ? "border-danger" : "border-border-strong")}
        >
          <option value="" disabled>
            Choose one
          </option>
          {interests.map((i) => (
            <option key={i.value} value={i.value}>
              {i.label}
            </option>
          ))}
        </select>
        {errors.interest && (
          <p id={`${id("interest")}-err`} className="mt-1.5 text-sm text-danger">
            {errors.interest}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={id("message")} className="text-sm font-medium text-fg">
          Message <span className="text-fg-subtle">(optional)</span>
        </label>
        <textarea
          id={id("message")}
          name="message"
          rows={5}
          maxLength={4000}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? `${id("message")}-err` : undefined}
          placeholder="Your environment, fleet size, compliance needs or timeline"
          className={cn(inputBase, errors.message ? "border-danger" : "border-border-strong")}
        />
        {errors.message && (
          <p id={`${id("message")}-err`} className="mt-1.5 text-sm text-danger">
            {errors.message}
          </p>
        )}
      </div>

      <Turnstile onToken={setToken} resetSignal={resetSignal} />

      {state.kind === "error" && (
        <p role="alert" className="text-sm text-danger">
          {state.message} You can also email{" "}
          <a href={`mailto:${site.email}`} className="underline underline-offset-4">
            {site.email}
          </a>
          .
        </p>
      )}

      <Button type="submit" size="lg" disabled={state.kind === "sending"} className="w-full sm:w-auto">
        {state.kind === "sending" ? "Sending…" : "Send message"}
      </Button>
      <p className="text-xs text-fg-subtle">
        We use these details only to respond to your request. See our{" "}
        <Link href="/privacy" className="underline">
          privacy notice
        </Link>
        .
      </p>
    </form>
  );
}
