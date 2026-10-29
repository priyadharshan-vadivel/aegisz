import { Mail } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Responsible disclosure",
  description:
    "How to report a security vulnerability in AegisZ products or websites: scope, rules, our response times, coordinated disclosure and safe harbor.",
  path: "/trust",
});

// Draft, pending legal review.
// Bump POLICY_VERSION and LAST_UPDATED whenever the text changes, and keep
// public/.well-known/security.txt in step (Expires must stay under a year away).
const POLICY_VERSION = "1.0";
const LAST_UPDATED = "29 October 2026";

/** Researchers credited for reports. Add { name, href?, note } entries as reports are resolved. */
const acknowledgements: { name: string; href?: string; note?: string }[] = [];

const mail = (
  <a href={`mailto:${site.securityEmail}`} className="text-fg underline underline-offset-4">
    {site.securityEmail}
  </a>
);

const list = (items: React.ReactNode[]) => (
  <ul className="space-y-2.5 border-l border-border-strong pl-5">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

const sections: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "report",
    title: "How to report",
    body: (
      <>
        <p>Email {mail} with:</p>
        {list([
          "a description of the issue and its impact;",
          "the affected product, version or URL;",
          "steps to reproduce, and a proof of concept;",
          "your contact details, and how you'd like to be credited.",
        ])}
        {/* TODO: publish the PGP key (and add an Encryption: line to security.txt). */}
        <p>Want to encrypt your report? Our PGP key is available on request.</p>
      </>
    ),
  },
  {
    id: "in-scope",
    title: "In scope",
    body: list(["aegisz.in and its subdomains", "IAAC: the agent, the control plane and the dashboard"]),
  },
  {
    id: "out-of-scope",
    title: "Out of scope",
    body: list([
      "Third-party services we use: Vercel, Resend, Cal.id, Cloudflare. Report those to the provider.",
      "Partner websites: Metier Genesis, Dedcell Security.",
      "Customer environments.",
      <>
        Findings without a direct security impact, such as:
        <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-fg-subtle marker:text-fg-subtle">
          <li>missing SPF, DKIM or DMARC records</li>
          <li>missing security headers, without a working exploit</li>
          <li>clickjacking on pages with no sensitive actions</li>
          <li>self-XSS</li>
          <li>logout CSRF</li>
          <li>software version disclosure</li>
          <li>rate limiting on non-sensitive endpoints</li>
        </ul>
      </>,
      "Reports from automated scanners that haven't been validated.",
    ]),
  },
  {
    id: "rules",
    title: "Rules of engagement",
    body: list([
      "Don't access, change or delete other people's data. Stop at the minimum needed to prove the issue.",
      "No denial of service, load testing, spam, social engineering or physical attacks.",
      "Don't test against customer environments without their written permission.",
      "Don't keep any data beyond what's needed for your report.",
    ]),
  },
  {
    id: "commitment",
    title: "Our commitment",
    body: list([
      <>
        We acknowledge your report within <strong className="text-fg">3 business days</strong>.
      </>,
      <>
        We send an initial assessment within <strong className="text-fg">10 business days</strong>.
      </>,
      "We keep you updated regularly until the issue is resolved.",
      <>
        If you want, we credit you on our <a href="#acknowledgements" className="text-fg underline underline-offset-4">acknowledgements</a> list.
      </>,
    ]),
  },
  {
    id: "disclosure",
    title: "Coordinated disclosure",
    body: (
      <p>
        Please don&apos;t disclose the issue publicly until it&apos;s fixed, or until 90 days after your report, whichever is
        sooner, unless we agree otherwise.
      </p>
    ),
  },
  {
    id: "safe-harbor",
    title: "Safe harbor",
    body: (
      <>
        <p>We won&apos;t pursue legal action for research that:</p>
        {list([
          "is in good faith;",
          "is within scope and follows the rules above;",
          "avoids privacy violations and service disruption;",
          "is reported to us promptly.",
        ])}
        <p>
          If a third party takes action against you over research that followed this policy, we&apos;ll make it known that
          your actions were authorised.
        </p>
      </>
    ),
  },
  {
    id: "bounty",
    title: "No bug bounty",
    body: <p>We don&apos;t offer monetary rewards at this time. We do offer public credit.</p>,
  },
];

export default function TrustPage() {
  return (
    <Section labelledBy="trust-title" className="pt-14 sm:pt-20">
      <SectionHeading
        id="trust-title"
        as="h1"
        eyebrow="Trust"
        title="Responsible disclosure"
        body={
          <p>
            We build security products, and we welcome good-faith reports about our own security. If you think you&apos;ve
            found a vulnerability in an AegisZ product or website, please tell us.
          </p>
        }
      />

      <a
        href={`mailto:${site.securityEmail}`}
        className="mt-10 flex max-w-measure items-center gap-4 rounded-tile border border-border-strong bg-surface p-6 transition-colors duration-[var(--ae-dur-fast)] hover:border-fg-subtle sm:p-7"
      >
        <Mail aria-hidden className="size-5 shrink-0 text-accent-ink" strokeWidth={1.5} />
        <span>
          <span className="label block">Report a vulnerability</span>
          <span className="mt-1 block text-lead break-all text-fg">{site.securityEmail}</span>
        </span>
      </a>

      <div className="mt-16 max-w-measure space-y-12">
        {sections.map((s, i) => (
          <section key={s.id} id={s.id} aria-labelledby={`trust-${s.id}`}>
            <h2 id={`trust-${s.id}`} className="flex gap-3 text-h3 text-fg">
              <span aria-hidden className="font-mono text-fg-subtle tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              {s.title}
            </h2>
            <div className="mt-4 space-y-4 text-fg-muted">{s.body}</div>
          </section>
        ))}

        <section id="acknowledgements" aria-labelledby="trust-acknowledgements">
          <h2 id="trust-acknowledgements" className="flex gap-3 text-h3 text-fg">
            <span aria-hidden className="font-mono text-fg-subtle tabular-nums">
              {String(sections.length + 1).padStart(2, "0")}
            </span>
            Acknowledgements
          </h2>
          <div className="mt-4 text-fg-muted">
            {acknowledgements.length === 0 ? (
              <p className="rounded-tile border border-dashed border-border-strong p-6">
                No one yet. Be the first: report to {mail}.
              </p>
            ) : (
              list(
                acknowledgements.map((a) => (
                  <>
                    {a.href ? (
                      <a href={a.href} className="text-fg underline underline-offset-4" rel="noopener noreferrer">
                        {a.name}
                      </a>
                    ) : (
                      <span className="text-fg">{a.name}</span>
                    )}
                    {a.note && <> · {a.note}</>}
                  </>
                )),
              )
            )}
          </div>
        </section>

        <p className="text-sm text-fg-subtle">
          Policy version {POLICY_VERSION} · Last updated {LAST_UPDATED} · Machine-readable contact:{" "}
          <a href="/.well-known/security.txt" className="underline underline-offset-4">
            security.txt
          </a>
        </p>
      </div>
    </Section>
  );
}
