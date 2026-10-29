import Link from "next/link";
import { cn } from "@/lib/cn";
import { DEFAULT_COUNTRY_CODE, HONEYPOT, countryCodes } from "@/lib/forms";

export const inputBase =
  "mt-2 block w-full rounded-md border bg-surface px-4 py-3.5 text-fg transition-colors duration-[var(--ae-dur-fast)] placeholder:text-fg-subtle hover:border-fg-subtle focus-visible:border-fg focus-visible:outline-2 focus-visible:outline-offset-0";

type FieldProps = {
  id: string;
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
};

/** Labelled text input with an accessible inline error. */
export function TextField({ id, name, label, error, required, type = "text", autoComplete }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-fg">
        {label} <span className="text-fg-subtle">{required ? "(required)" : "(optional)"}</span>
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(inputBase, error ? "border-danger" : "border-border-strong")}
      />
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** Country-code selector (default +91) plus the number. The server combines them into E.164. */
export function PhoneField({ id, error }: { id: string; error?: string }) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-fg">
        Phone <span className="text-fg-subtle">(required)</span>
      </label>
      <div className="flex gap-2">
        <select
          name="phoneCountry"
          defaultValue={DEFAULT_COUNTRY_CODE}
          aria-label="Country code"
          autoComplete="tel-country-code"
          className={cn(inputBase, "w-32 shrink-0 border-border-strong pr-2")}
        >
          {countryCodes.map((c) => (
            <option key={c.code + c.region} value={c.code}>
              {c.region} {c.code}
            </option>
          ))}
        </select>
        <input
          id={id}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="98765 43210"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          className={cn(inputBase, "min-w-0", error ? "border-danger" : "border-border-strong")}
        />
      </div>
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** Required consent checkbox. The label is the whole tap target. */
export function ConsentField({ id, error }: { id: string; error?: string }) {
  return (
    <div>
      <div className="flex gap-3">
        <input
          id={id}
          name="consent"
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[var(--color-accent)]"
        />
        <label htmlFor={id} className="cursor-pointer text-[0.9375rem] text-fg-muted">
          I agree to AegisZ storing these details to respond to my request, as described in the{" "}
          <Link href="/privacy" className="text-fg underline underline-offset-4">
            privacy notice
          </Link>
          . <span className="text-fg-subtle">(required)</span>
        </label>
      </div>
      {error && (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** Form values as a plain object, plus the page the form was sent from. */
export function formValues(form: HTMLFormElement): Record<string, unknown> {
  return { ...Object.fromEntries(new FormData(form)), sourcePage: window.location.pathname };
}

/** Off-screen field for bots. Hidden from people, screen readers and the tab order. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name={HONEYPOT} tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

/** POST JSON and normalise the response for the forms. */
export async function postForm(url: string, body: Record<string, unknown>) {
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    return { status: res.status, json };
  } catch {
    return { status: 0, json: {} as Record<string, unknown> };
  }
}
