import { ArrowDown, ArrowRight, Cpu, Eye, Gavel, LayoutDashboard } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { VerdictBadge } from "@/components/ui/Badge";
import { Todo } from "@/components/ui/Todo";
import { iaac } from "@/content/iaac";
import { cn } from "@/lib/cn";

const stepIcons = { see: Eye, judge: Gavel, decide: Cpu };

/** see → judge → allow/block/review */
export function StepFlow() {
  return (
    <ol className="grid gap-4 lg:grid-cols-3">
      {iaac.steps.map((s, i) => {
        const Icon = stepIcons[s.key as keyof typeof stepIcons];
        return (
          <li key={s.key} className="relative">
            <Card className="h-full">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-fg-subtle">0{i + 1}</span>
                <Icon className="size-5 text-accent" aria-hidden />
              </div>
              <h3 className="mt-4 text-lg font-medium text-fg">{s.title}</h3>
              <p className="mt-2 text-fg-muted">{s.body}</p>
              {s.key === "decide" && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <VerdictBadge verdict="allow" />
                  <VerdictBadge verdict="block" />
                  <VerdictBadge verdict="review" />
                </div>
              )}
            </Card>
            {i < iaac.steps.length - 1 && (
              <>
                <ArrowRight
                  aria-hidden
                  className="absolute top-1/2 -right-3.5 z-10 hidden size-5 -translate-y-1/2 text-fg-subtle lg:block"
                />
                <ArrowDown aria-hidden className="mx-auto mt-4 size-5 text-fg-subtle lg:hidden" />
              </>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Plane({
  title,
  where,
  points,
  icon: Icon,
  className,
}: {
  title: string;
  where: string;
  points: string[];
  icon: typeof Cpu;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-border bg-surface p-6", className)}>
      <div className="flex items-center gap-3">
        <Icon className="size-5 text-accent" aria-hidden />
        <h3 className="text-lg font-medium text-fg">{title}</h3>
      </div>
      <p className="mt-1 font-mono text-xs text-fg-subtle">{where}</p>
      <ul className="mt-5 space-y-2.5 text-sm text-fg-muted">
        {points.map((p) => (
          <li key={p} className="flex gap-2.5">
            <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-fg-subtle" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Enforcement plane on each host, connected to the control plane. HTML, not an image, so it reflows. */
export function ArchitectureDiagram() {
  const { enforcement, control } = iaac.architecture;
  return (
    <figure>
      <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
        <Plane {...control} icon={LayoutDashboard} />
        <div aria-hidden className="flex items-center justify-center py-1 lg:px-2">
          <div className="flex flex-col items-center gap-1 font-mono text-[0.7rem] text-fg-subtle lg:flex-row">
            <span className="hidden h-px w-8 bg-border-strong lg:block" />
            <span className="h-6 w-px bg-border-strong lg:hidden" />
            <span className="px-1 whitespace-nowrap">policy ⇄ decisions</span>
            <span className="hidden h-px w-8 bg-border-strong lg:block" />
            <span className="h-6 w-px bg-border-strong lg:hidden" />
          </div>
        </div>
        <Plane {...enforcement} icon={Cpu} />
      </div>
      <figcaption className="mt-4 text-sm text-fg-subtle">
        The enforcement plane makes every decision on the host; the control plane holds policy, approvals and audit.
      </figcaption>
      <Todo className="mt-4">
        Engineering to confirm which capabilities sit in which plane, and whether to show data flows. Diagram is
        illustrative.
      </Todo>
    </figure>
  );
}
