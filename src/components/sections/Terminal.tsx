"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { VerdictBadge } from "@/components/ui/Badge";
import { terminalDemo, type Verdict } from "@/content/iaac";
import { spring } from "@/styles/motion";
import { cn } from "@/lib/cn";

type Line = { cmd: string; typed: number; verdict?: Verdict; reason: string };

const TYPE_MS = 42;
const VERDICT_DELAY_MS = 420;
const LIVE_MS = 1100;
const HOLD_MS = 1500;
const RESET_MS = 3000;

const finished: Line[] = terminalDemo.map((t) => ({ cmd: t.cmd, typed: t.cmd.length, verdict: t.verdict, reason: t.reason }));

type TerminalProps = {
  className?: string;
  /** Still transcript, no animation (used inside bento tiles). */
  still?: boolean;
  /** Wrap in the radial glow that pulses with each verdict. */
  lit?: boolean;
};

/** Animated IAAC terminal. Screen readers get a static list; reduced motion shows the final state. */
export function Terminal({ className, still, lit }: TerminalProps) {
  const reduce = useReducedMotion();
  const animate = !still && !reduce;
  const [lines, setLines] = useState<Line[]>([]);
  const [live, setLive] = useState<number | null>(null);

  useEffect(() => {
    if (!animate) return;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) => new Promise<void>((r) => timers.push(setTimeout(r, ms)));
    const patchLast = (p: Partial<Line>) =>
      setLines((prev) => prev.map((l, i) => (i === prev.length - 1 ? { ...l, ...p } : l)));

    async function run() {
      while (!cancelled) {
        setLines([]);
        for (const [idx, item] of terminalDemo.entries()) {
          setLines((prev) => [...prev, { cmd: item.cmd, typed: 0, reason: item.reason }]);
          for (let i = 1; i <= item.cmd.length; i++) {
            await wait(TYPE_MS);
            if (cancelled) return;
            patchLast({ typed: i });
          }
          await wait(VERDICT_DELAY_MS);
          if (cancelled) return;
          patchLast({ verdict: item.verdict });
          setLive(idx);
          await wait(LIVE_MS);
          if (cancelled) return;
          setLive(null);
          await wait(HOLD_MS - LIVE_MS > 0 ? HOLD_MS - LIVE_MS : 0);
        }
        await wait(RESET_MS);
      }
    }
    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [animate]);

  // Server render, no-JS, still and reduced motion all show the finished transcript.
  const shown = !animate || lines.length === 0 ? finished : lines;

  const frame = (
    <figure
      className={cn(
        "overflow-hidden rounded-lg border border-border-strong bg-surface text-left",
        lit ? "shadow-lit" : "shadow-tile",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span aria-hidden className="size-2.5 rounded-full bg-border-strong" />
        <span aria-hidden className="size-2.5 rounded-full bg-border-strong" />
        <span aria-hidden className="size-2.5 rounded-full bg-border-strong" />
        <figcaption className="ml-2 truncate font-mono text-[0.75rem] text-fg-subtle">root@prod-01 — IAAC enforcing</figcaption>
      </div>

      <ul className="sr-only">
        {terminalDemo.map((t) => (
          <li key={t.cmd}>
            Command {t.cmd}: {t.verdict}. {t.reason}.
          </li>
        ))}
      </ul>

      <div
        aria-hidden
        className={cn(
          "space-y-5 font-mono leading-relaxed",
          still ? "p-5 text-[0.75rem]" : "min-h-[17rem] p-5 text-[0.8125rem] sm:p-7 sm:text-[0.9375rem]",
        )}
      >
        {shown.map((l, i) => {
          const typing = animate && (l.typed < l.cmd.length || (!l.verdict && i === shown.length - 1));
          return (
            <div key={l.cmd}>
              <div className="flex gap-2.5">
                <span className="shrink-0 text-fg-subtle">#</span>
                <span className="min-w-0 break-all text-fg">
                  {l.cmd.slice(0, l.typed)}
                  {typing && (
                    <span className="ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-accent [animation:caret_1s_steps(1)_infinite]" />
                  )}
                </span>
              </div>
              {l.verdict && (
                <div className="mt-2 flex flex-wrap items-center gap-2.5 pl-5">
                  <span className="text-fg-subtle">iaac →</span>
                  <motion.span
                    initial={animate ? { scale: 0.6, opacity: 0 } : false}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={spring}
                    className="inline-flex"
                  >
                    <VerdictBadge verdict={l.verdict} live={live === i} />
                  </motion.span>
                  <span className="text-fg-muted">{l.reason}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </figure>
  );

  if (!lit) return frame;
  return (
    <div className="glow" style={{ ["--glow-on" as string]: live !== null ? 1 : 0 }}>
      {frame}
    </div>
  );
}
