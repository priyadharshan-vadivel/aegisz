"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Cpu, LayoutDashboard } from "lucide-react";
import { VerdictBadge } from "@/components/ui/Badge";
import { iaac, terminalDemo } from "@/content/iaac";
import { dur, easeOutExpo, spring } from "@/styles/motion";
import { cn } from "@/lib/cn";

/* ------------------------------------------------------------------ */
/* Sticky story: see → judge → allow/block/review                      */
/* ------------------------------------------------------------------ */

const sample = terminalDemo[2]; // docker rm prod-db → review

/** The pinned "product shot". Its state follows the active step. */
function StoryVisual({ step }: { step: number }) {
  return (
    <div className="glow h-full w-full" style={{ ["--glow-on" as string]: step === 2 ? 1 : 0 }}>
      <div aria-hidden className="flex h-full flex-col overflow-hidden rounded-lg border border-border-strong bg-surface font-mono text-sm shadow-lit">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="ml-2 text-[0.75rem] text-fg-subtle">root@prod-01 — IAAC enforcing</span>
        </div>
        <div className="flex flex-1 flex-col gap-6 p-6 sm:p-8">
          <p className="text-fg">
            <span className="text-fg-subtle"># </span>
            {sample.cmd}
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: dur.base, ease: easeOutExpo }}
              className="space-y-3"
            >
              {step === 0 && (
                <>
                  <p className="text-fg-muted">iaac → intercepted before exec</p>
                  <p className="text-fg-subtle">pid 4127 · tty pts/0 · uid 0</p>
                </>
              )}
              {step === 1 && (
                <>
                  <p className="text-fg-muted">iaac → judging intent</p>
                  <p className="text-fg-subtle">rules · MITRE ATT&amp;CK mapped</p>
                  <p className="text-fg-subtle">reasoning · on this server</p>
                  <div className="h-1 overflow-hidden rounded-pill bg-border">
                    <motion.div
                      className="h-full bg-fg-muted"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.2, ease: easeOutExpo }}
                    />
                  </div>
                </>
              )}
              {step === 2 && (
                <>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-fg-subtle">iaac →</span>
                    <motion.span initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={spring} className="inline-flex">
                      <VerdictBadge verdict={sample.verdict} live />
                    </motion.span>
                  </div>
                  <p className="text-fg-muted">{sample.reason}</p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="mt-auto flex gap-2">
            {(["allow", "block", "review"] as const).map((v) => (
              <VerdictBadge key={v} verdict={v} className={cn(step === 2 && v === sample.verdict ? "" : "opacity-40")} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StoryStep({ index, onActive, active }: { index: number; onActive: (i: number) => void; active: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { amount: 0.6 });
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);
  const s = iaac.steps[index];
  return (
    <li ref={ref} className="flex min-h-[80vh] items-center">
      <div className={cn("transition-opacity duration-[var(--ae-dur-slow)]", active ? "opacity-100" : "opacity-30")}>
        <p className="font-mono text-sm text-fg-subtle">{index + 1} / 3</p>
        <h3 className="mt-3 text-h2 text-fg">{s.title}</h3>
        <p className="mt-5 max-w-md text-lead text-fg-muted">{s.body}</p>
      </div>
    </li>
  );
}

/** True once mounted on a wide screen that allows motion. False on the server and first paint. */
function useStickyLayout() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const update = () => setOn(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return on;
}

/**
 * Desktop: visual pinned left, steps scroll right. Mobile / reduced motion: stacked, static.
 * Only one version is ever in the DOM, so screen readers read the steps once. The stacked one is
 * server-rendered (works without JS); wide screens swap to the sticky one after mount.
 */
export function StickyStory() {
  const [active, setActive] = useState(0);
  const sticky = useStickyLayout();
  if (sticky) {
    return (
      <div className="grid grid-cols-2 gap-16">
        <div className="sticky top-[calc(var(--ae-header-h)+4rem)] h-[min(32rem,calc(100vh-10rem))] self-start">
          <StoryVisual step={active} />
        </div>
        <ol className="-my-[20vh]">
          {iaac.steps.map((s, i) => (
            <StoryStep key={s.key} index={i} active={active === i} onActive={setActive} />
          ))}
        </ol>
      </div>
    );
  }
  return (
    <ol className="grid gap-16">
      {iaac.steps.map((s, i) => (
        <li key={s.key} className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="font-mono text-sm text-fg-subtle">{i + 1} / 3</p>
            <h3 className="mt-3 text-h2 text-fg">{s.title}</h3>
            <p className="mt-4 text-lead text-fg-muted">{s.body}</p>
          </div>
          <div className="h-80">
            <StoryVisual step={i} />
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Architecture: two planes, one connector                             */
/* ------------------------------------------------------------------ */

function Plane({ title, where, points, icon: Icon }: { title: string; where: string; points: string[]; icon: typeof Cpu }) {
  return (
    <div className="rounded-tile border border-border-strong bg-surface p-7 sm:p-9">
      <div className="flex items-center gap-3">
        <Icon className="size-5 text-fg-subtle" aria-hidden strokeWidth={1.5} />
        <h3 className="text-h3 text-fg">{title}</h3>
      </div>
      <p className="label mt-2">{where}</p>
      <ul className="mt-8 space-y-4 text-fg-muted">
        {points.map((p) => (
          <li key={p} className="flex gap-3 border-t border-border pt-4">
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ArchitectureDiagram() {
  const { enforcement, control } = iaac.architecture;
  const reduce = useReducedMotion();
  const draw = reduce ? {} : { initial: { scaleX: 0 }, whileInView: { scaleX: 1 }, viewport: { once: true, amount: 0.6 } };
  const drawY = reduce ? {} : { initial: { scaleY: 0 }, whileInView: { scaleY: 1 }, viewport: { once: true, amount: 0.6 } };
  const t = { duration: 1, ease: easeOutExpo };
  return (
    <figure>
      <div className="grid items-center gap-0 lg:grid-cols-[1fr_8rem_1fr]">
        <Plane {...control} icon={LayoutDashboard} />
        <div aria-hidden className="relative flex h-24 items-center justify-center lg:h-auto">
          <motion.span {...drawY} transition={t} className="absolute inset-y-0 left-1/2 w-px origin-top border-l border-dashed border-accent lg:hidden" />
          <motion.span {...draw} transition={t} className="absolute inset-x-0 top-1/2 hidden h-px origin-left border-t border-dashed border-accent lg:block" />
          <span className="relative rounded-pill border border-border-strong bg-bg px-3 py-1 font-mono text-[0.6875rem] whitespace-nowrap text-fg-muted">
            policy ⇄ decisions
          </span>
        </div>
        <Plane {...enforcement} icon={Cpu} />
      </div>
      <figcaption className="mt-8 max-w-2xl text-fg-subtle">{iaac.architecture.caption}</figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Roadmap: a line that fills as you scroll                            */
/* ------------------------------------------------------------------ */

export function Roadmap() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.5"] });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0.05, 1]);
  return (
    <div className="relative mt-16">
      <div aria-hidden className="absolute top-0 right-0 left-0 hidden h-px bg-border-strong md:block">
        <motion.div className="h-px origin-left bg-accent" style={{ scaleX: reduce ? 1 : scaleX }} />
      </div>
      <ol ref={ref} className="grid gap-10 md:grid-cols-3 md:pt-10">
        {iaac.roadmap.map((r, i) => (
          <li key={r.when} className="relative border-l border-border-strong pl-5 md:border-l-0 md:pl-0">
            <span
              aria-hidden
              className={cn(
                "absolute -top-[2.8rem] left-0 hidden size-2.5 rounded-full md:block",
                i === 0 ? "bg-accent" : "bg-border-strong",
              )}
            />
            <p className="label">{r.when}</p>
            <p className="mt-3 text-h3 font-medium text-fg">{r.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
