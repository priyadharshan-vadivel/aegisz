"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export const interests = [
  { value: "iaac-demo", label: "IAAC demo" },
  { value: "sovereign", label: "Sovereign / air-gapped deployment" },
  { value: "design-services", label: "Security design services" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
] as const;

type Field = "name" | "email" | "company" | "role" | "interest" | "message";
type Errors = Partial<Record<Field, string>>;

// Free-mail domains are rejected for "work email".
const FREE_MAIL = /@(gmail|yahoo|hotmail|outlook|live|icloud|proton|protonmail|aol|rediffmail)\./i;

function validate(data: FormData): Errors {
  const e: Errors = {};
  const get = (k: Field) => String(data.get(k) ?? "").trim();
  if (!get("name")) e.name = "Enter your name.";
  const email = get("email");
  if (!email) e.email = "Enter your work email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address, like name@company.com.";
  else if (FREE_MAIL.test(email)) e.email = "Use your work email address.";
  if (!get("company")) e.company = "Enter your company or organisation.";
  if (!get("interest")) e.interest = "Choose what you're interested in.";
  return e;
}

const inputBase =
  "mt-2 block w-full rounded-md border bg-surface px-4 py-3.5 text-fg transition-colors duration-[var(--ae-dur-fast)] placeholder:text-fg-subtle hover:border-fg-subtle focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-0";

export function ContactForm() {
  // Preselect from ?interest= after mount, so the form itself stays server-rendered (no layout shift).
  const [interest, setInterest] = useState("");
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("interest");
    if (q && interests.some((i) => i.value === q)) setInterest(q);
  }, []);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();
  const id = (f: Field) => `${uid}-${f}`;

  function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const data = new FormData(ev.currentTarget);
    const errs = validate(data);
    setErrors(errs);
    const first = Object.keys(errs)[0] as Field | undefined;
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(id(first))}`)?.focus();
      return;
    }
    // TODO: wire to backend (API route, CRM or email service). Nothing is sent yet.
    setSent(true);
  }

  if (sent) {
    return (
      <div role="status" className="rounded-tile border border-accent bg-surface p-8 sm:p-10">
        <CheckCircle2 className="size-7 text-accent-ink" aria-hidden strokeWidth={1.5} />
        <h2 className="mt-6 text-h3 text-fg">Thanks, we&apos;ve got your details.</h2>
        <p className="mt-1 text-fg-muted">
          We&apos;ll be in touch shortly. {/* TODO: remove this note once the form is wired */}
          <span className="text-fg-subtle">(Preview build: this form isn&apos;t connected yet.)</span>
        </p>
      </div>
    );
  }

  const field = (f: Field, label: string, opts: { required?: boolean; type?: string; autoComplete?: string } = {}) => (
    <div>
      <label htmlFor={id(f)} className="text-sm font-medium text-fg">
        {label} {opts.required ? <span className="text-fg-subtle">(required)</span> : <span className="text-fg-subtle">(optional)</span>}
      </label>
      <input
        id={id(f)}
        name={f}
        type={opts.type ?? "text"}
        autoComplete={opts.autoComplete}
        aria-invalid={errors[f] ? true : undefined}
        aria-describedby={errors[f] ? `${id(f)}-err` : undefined}
        className={cn(inputBase, errors[f] ? "border-danger" : "border-border-strong")}
      />
      {errors[f] && (
        <p id={`${id(f)}-err`} className="mt-1.5 text-sm text-danger">
          {errors[f]}
        </p>
      )}
    </div>
  );

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-label="Book a demo" className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {field("name", "Name", { required: true, autoComplete: "name" })}
        {field("email", "Work email", { required: true, type: "email", autoComplete: "email" })}
        {field("company", "Company", { required: true, autoComplete: "organization" })}
        {field("role", "Role", { autoComplete: "organization-title" })}
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
          placeholder="Your environment, fleet size, compliance needs or timeline"
          className={cn(inputBase, "border-border-strong")}
        />
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto">
        Send request
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
