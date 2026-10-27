import { Building2, Factory, Landmark, Server } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ClosingCta } from "@/components/sections/home";
import { industries, industriesIntro, regulatedNote } from "@/content/industries";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Industries",
  description:
    "AegisZ serves government, banking and insurance, SaaS and technology, and critical infrastructure: organisations where a single misused privileged command can become a board-level or national-level event.",
  path: "/industries",
});

const icons: Record<string, typeof Landmark> = {
  government: Landmark,
  bfsi: Building2,
  saas: Server,
  "critical-infrastructure": Factory,
};

export default function IndustriesPage() {
  return (
    <>
      <Section labelledBy="ind-title">
        <SectionHeading id="ind-title" as="h1" eyebrow="Industries" title="Who we serve" body={<p>{industriesIntro}</p>} />
        <nav aria-label="Industries on this page" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {industries.map((i) => (
              <li key={i.slug}>
                <a
                  href={`#${i.slug}`}
                  className="inline-block rounded-md border border-border px-3 py-1.5 text-sm text-fg-muted hover:text-fg"
                >
                  {i.short}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Section>

      {industries.map((ind, idx) => {
        const Icon = icons[ind.slug];
        return (
          <Section key={ind.slug} id={ind.slug} labelledBy={`${ind.slug}-title`} tone={idx % 2 === 0 ? "surface" : "default"}>
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <Icon className="size-6 text-accent" aria-hidden />
                <h2 id={`${ind.slug}-title`} className="mt-4 text-3xl font-semibold text-fg">
                  {ind.name}
                </h2>
                <p className="mt-4 text-lg text-fg-muted">{ind.why}</p>
              </div>
              <div>
                <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-fg-subtle">How AegisZ helps</h3>
                <ul className="mt-4 space-y-3">
                  {ind.points.map((p) => (
                    <li key={p} className="rounded-md border border-border bg-bg px-4 py-3 text-fg">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>
        );
      })}

      <Section labelledBy="reg-title">
        <div className="rounded-lg border border-border p-6">
          <h2 id="reg-title" className="font-medium text-fg">
            Also: {regulatedNote.name}
          </h2>
          <p className="mt-2 text-fg-muted">{regulatedNote.why}</p>
        </div>
      </Section>

      <ClosingCta />
    </>
  );
}
