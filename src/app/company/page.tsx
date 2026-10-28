import Image from "next/image";
import { Mail } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/motion/Reveal";
import { VisionMission } from "@/components/sections/VisionMission";
import { ClosingCta, Partners } from "@/components/sections/home";
import { company } from "@/content/company";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Company",
  description:
    "AegisZ is an Indian cybersecurity product company designing, building and owning AI-driven security platforms for enterprise and government.",
  path: "/company",
});

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.84-2.05 3.8-2.05C21.6 8.65 22 11.3 22 14.7V21h-4v-5.6c0-1.34-.02-3.06-1.86-3.06-1.87 0-2.15 1.46-2.15 2.96V21h-4V9Z" />
    </svg>
  );
}

export default function CompanyPage() {
  return (
    <>
      <Section labelledBy="co-title" className="pt-14 pb-0 sm:pt-20">
        <SectionHeading
          id="co-title"
          as="h1"
          eyebrow="Company"
          title="From India, for the world"
          body={<p>{company.overview[0]}</p>}
        />
      </Section>

      <div className="pt-section">
        <VisionMission />
      </div>

      <Section labelledBy="lead-title" tone="surface">
        <SectionHeading
          id="lead-title"
          eyebrow="Leadership"
          title="Founder-led"
          body={<p>Security research, product engineering and go-to-market, under one roof.</p>}
        />
        <ul className="mt-16 grid gap-3 sm:gap-4 md:grid-cols-2">
          {company.leadership.map((l, i) => (
            <Reveal as="li" key={l.name} delay={i * 0.08}>
              <Card interactive className="card-glow flex h-full flex-col gap-8 bg-bg sm:flex-row sm:items-start">
                <div className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-2 sm:w-36">
                  {l.photo ? (
                    <Image src={l.photo} alt={`Portrait of ${l.name}`} fill sizes="144px" className="object-cover" />
                  ) : (
                    <span aria-hidden className="absolute inset-0 grid place-items-center font-mono text-3xl text-fg-subtle">
                      {l.initials}
                    </span>
                  )}
                </div>
                <div className="flex flex-col">
                  <p className="label">{l.role}</p>
                  <h3 className="mt-2 text-h3 text-fg">{l.name}</h3>
                  <p className="mt-3 max-w-[48ch] text-fg-muted">{l.bio}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <a
                      href={`mailto:${l.email}`}
                      className="inline-flex items-center gap-2 rounded-pill border border-border-strong px-3.5 py-1.5 text-sm text-fg transition-colors hover:border-fg-subtle"
                    >
                      <Mail aria-hidden className="size-4" strokeWidth={1.5} />
                      {l.email}
                    </a>
                    {l.linkedin && (
                      <a
                        href={l.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-pill border border-border-strong px-3.5 py-1.5 text-sm text-fg transition-colors hover:border-fg-subtle"
                      >
                        <LinkedInIcon />
                        LinkedIn<span className="sr-only">: {l.name} (opens in a new tab)</span>
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Partners headingId="co-partners-title" />

      <ClosingCta />
    </>
  );
}
