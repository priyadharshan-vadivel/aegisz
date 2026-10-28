import { Building2, Factory, Fingerprint, Landmark, Server } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ClosingCta } from "@/components/sections/home";
import { industries, industriesIntro, regulatedNote } from "@/content/industries";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Industries",
  description:
    "AegisZ serves government, banking and insurance, SaaS and technology, and critical infrastructure: organisations where a single misused privileged command can become a board-level or national-level event.",
  path: "/industries",
});

const icons = { landmark: Landmark, bank: Building2, server: Server, factory: Factory };

export default function IndustriesPage() {
  return (
    <>
      <Section labelledBy="ind-title" className="pt-14 pb-0 sm:pt-20">
        <SectionHeading id="ind-title" as="h1" eyebrow="Industries" title="Who we serve" body={<p>{industriesIntro}</p>} />
      </Section>

      <Section labelledBy="sectors-title">
        <h2 id="sectors-title" className="sr-only">
          Sectors
        </h2>
        <ul className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {industries.map((ind, i) => {
            const Icon = icons[ind.icon];
            return (
              <Reveal as="li" key={ind.slug} delay={(i % 2) * 0.08}>
                <article
                  id={ind.slug}
                  aria-labelledby={`${ind.slug}-title`}
                  className="card-glow group flex h-full min-h-[22rem] scroll-mt-24 flex-col justify-between gap-12 rounded-tile border border-border bg-surface p-8 transition-[border-color,transform] duration-[var(--ae-dur-base)] ease-out-expo hover:-translate-y-0.5 hover:border-border-strong sm:p-10"
                >
                  <Icon aria-hidden strokeWidth={1.25} className="size-10 text-fg transition-colors group-hover:text-accent" />
                  <div>
                    <h3 id={`${ind.slug}-title`} className="text-h2 text-fg">
                      {ind.short}
                    </h3>
                    <p className="mt-4 max-w-[40ch] text-lead text-fg-muted">{ind.need}</p>
                    <ul aria-label={`How AegisZ helps ${ind.short}`} className="mt-8 flex flex-wrap gap-2">
                      {ind.chips.map((c) => (
                        <li key={c} className="rounded-pill border border-border-strong px-3.5 py-1.5 font-mono text-[0.75rem] text-fg">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </Reveal>
            );
          })}
          <Reveal as="li" className="md:col-span-2">
            <div className="flex flex-col gap-5 rounded-tile border border-border p-8 sm:flex-row sm:items-center sm:gap-8 sm:p-10">
              <Fingerprint aria-hidden strokeWidth={1.25} className="size-9 shrink-0 text-fg" />
              <div>
                <h3 className="text-h3 text-fg">{regulatedNote.name}</h3>
                <p className="mt-2 text-fg-muted">{regulatedNote.why}</p>
              </div>
            </div>
          </Reveal>
        </ul>
      </Section>

      <ClosingCta />
    </>
  );
}
