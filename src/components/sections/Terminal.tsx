"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { VerdictBadge } from "@/components/ui/Badge";
import { terminalDemo, type Verdict } from "@/content/iaac";
import { cn } from "@/lib/cn";

type Line = { cmd: string; typed: number; verdict?: Verdict; reason: string };

const TYPE_MS = 45;
const VERDICT_DELAY_MS = 450;
const HOLD_MS = 1400;
const RESET_MS = 3200;

/** Animated IAAC terminal. Screen readers get a static list; reduced motion shows the final state. */
export function Terminal({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [lines, setLines] = useState<Line[]>([]);

  useEffect(() => {
    if (reduce) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) => new Promise<void>((r) => timers.push(setTimeout(r, ms)));

    async function run() {
      while (!cancelled) {
        setLines([]);
        for (const item of terminalDemo) {
          setLines((prev) => [...prev, { cmd: item.cmd, typed: 0, reason: item.reason }]);
          for (let i = 1; i <= item.cmd.length; i++) {
            await wait(TYPE_MS);
            if (cancelled) return;
            setLines((prev) => prev.map((l, idx) => (idx === prev.length - 1 ? { ...l, typed: i } : l)));
          }
          await wait(VERDICT_DELAY_MS);
          if (cancelled) return;
          setLines((prev) => prev.map((l, idx) => (idx === prev.length - 1 ? { ...l, verdict: item.verdict } : l)));
          await wait(HOLD_MS);
        }
        await wait(RESET_MS);
      }
    }
    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [reduce]);

  // Server render, no-JS and reduced motion all show the finished transcript.
  const shown: Line[] =
    reduce || lines.length === 0
      ? terminalDemo.map((t) => ({ cmd: t.cmd, typed: t.cmd.length, verdict: t.verdict, reason: t.reason }))
      : lines;

  return (
    <figure className={cn("overflow-hidden rounded-lg border border-border bg-surface shadow-card", className)}>
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span aria-hidden className="size-2.5 rounded-full bg-border-strong" />
        <span aria-hidden className="size-2.5 rounded-full bg-border-strong" />
        <span aria-hidden className="size-2.5 rounded-full bg-border-strong" />
        <figcaption className="ml-2 font-mono text-xs text-fg-subtle">root@prod-01 · IAAC enforcing</figcaption>
      </div>

      {/* Static, accessible version */}
      <ul className="sr-only">
        {terminalDemo.map((t) => (
          <li key={t.cmd}>
            Command {t.cmd}: {t.verdict}. {t.reason}.
          </li>
        ))}
      </ul>

      <div aria-hidden className="min-h-[15rem] space-y-4 p-4 font-mono text-[0.8rem] leading-relaxed sm:p-5 sm:text-sm">
        {shown.map((l, i) => {
          const typing = l.typed < l.cmd.length || (!l.verdict && i === shown.length - 1);
          return (
            <div key={l.cmd}>
              <div className="flex gap-2">
                <span className="shrink-0 text-fg-subtle">#</span>
                <span className="min-w-0 break-all text-fg">
                  {l.cmd.slice(0, l.typed)}
                  {typing && <span className="ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] animate-pulse bg-fg-muted" />}
                </span>
              </div>
              {l.verdict && (
                <div className="mt-1.5 flex flex-wrap items-center gap-2 pl-4">
                  <span className="text-fg-subtle">iaac →</span>
                  <VerdictBadge verdict={l.verdict} />
                  <span className="text-fg-muted">{l.reason}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </figure>
  );
}
