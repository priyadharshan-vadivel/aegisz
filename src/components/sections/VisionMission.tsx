import { Cpu, Globe, Landmark, Lock, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { WordReveal } from "@/components/motion/WordReveal";
import { company } from "@/content/company";

const icons = { landmark: Landmark, cpu: Cpu, lock: Lock, shield: ShieldCheck, globe: Globe };

/** Vision as an oversized statement, mission as five icon tiles. Shared by Home and /company. */
export function VisionMission({ headingAs = "h2" }: { headingAs?: "h1" | "h2" }) {
  return (
    <>
      <section aria-labelledby="vision-title" className="border-y border-border bg-surface py-section">
        <Container>
          <p className="label mb-10">Our vision</p>
          <WordReveal id="vision-title" as={headingAs} text={company.vision} className="max-w-[22ch] text-statement" />
        </Container>
      </section>

      <section aria-labelledby="mission-title" className="py-section">
        <Container>
          <h2 id="mission-title" className="label mb-10">
            Our mission
          </h2>
          <ol className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">
            {company.mission.map((m, i) => {
              const Icon = icons[m.icon as keyof typeof icons];
              return (
                <Reveal as="li" key={m.title} delay={i * 0.06}>
                  <div className="card-glow group flex h-full min-h-64 flex-col justify-between gap-10 rounded-tile border border-border bg-surface p-7 transition-[border-color,transform] duration-[var(--ae-dur-base)] ease-out-expo hover:-translate-y-0.5 hover:border-border-strong">
                    <div className="flex items-center justify-between">
                      <Icon aria-hidden strokeWidth={1.5} className="size-7 text-fg transition-colors group-hover:text-accent" />
                      <span className="font-mono text-xs text-fg-subtle">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-[1.25rem] leading-tight font-semibold tracking-[-0.02em] text-fg">{m.title}</h3>
                      <p className="mt-3 text-sm text-fg-muted">{m.short}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </Container>
      </section>
    </>
  );
}
