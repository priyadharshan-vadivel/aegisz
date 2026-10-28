import { cn } from "@/lib/cn";
import { HONEYPOT } from "@/lib/forms";

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
