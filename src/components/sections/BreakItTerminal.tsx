"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { VerdictBadge } from "@/components/ui/Badge";
import { judge, suggestions, type Judgement } from "@/content/simulator";
import { spring } from "@/styles/motion";
import { cn } from "@/lib/cn";

type Entry = Judgement & { id: number; cmd: string };

const MAX_LINES = 4;

/**
 * "Try to break it": visitors type a Linux command and get a simulated verdict.
 * Pure string matching in the browser. Nothing is executed or sent anywhere.
 */
export function BreakItTerminal({ className }: { className?: string }) {
  const [value, setValue] = useState("");
  const [log, setLog] = useState<Entry[]>([]);
  const [live, setLive] = useState<number | null>(null);
  const seq = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const latest = log[log.length - 1];

  useEffect(() => {
    if (live === null) return;
    const t = setTimeout(() => setLive(null), 1100);
    return () => clearTimeout(t);
  }, [live]);

  function run(cmd: string) {
    const j = judge(cmd);
    if (!j) return;
    const id = ++seq.current;
    setLog((prev) => [...prev, { ...j, id, cmd: cmd.trim() }].slice(-MAX_LINES));
    setLive(id);
    setValue("");
  }

  return (
    <div className={cn("glow", className)} style={{ ["--glow-on" as string]: live !== null ? 1 : 0 }}>
      <div className="overflow-hidden rounded-lg border border-border-strong bg-surface text-left shadow-lit">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span aria-hidden className="size-2.5 rounded-full bg-border-strong" />
          <span aria-hidden className="size-2.5 rounded-full bg-border-strong" />
          <span aria-hidden className="size-2.5 rounded-full bg-border-strong" />
          <span className="ml-2 truncate font-mono text-[0.75rem] text-fg-subtle">try-to-break-it — IAAC simulation</span>
        </div>

        <div className="flex min-h-[15rem] flex-col justify-end gap-4 p-5 font-mono text-[0.8125rem] leading-relaxed sm:p-7 sm:text-[0.9375rem]">
          {log.length === 0 && (
            <p className="text-fg-subtle">Type any Linux command, or pick one below. We&apos;ll show what IAAC would decide.</p>
          )}
          <AnimatePresence initial={false}>
            {log.map((e) => (
              <motion.div key={e.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex gap-2.5">
                  <span aria-hidden className="shrink-0 text-fg-subtle">
                    #
                  </span>
                  <span className="min-w-0 break-all text-fg">{e.cmd}</span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-2.5 pl-5">
                  <span aria-hidden className="text-fg-subtle">
                    iaac →
                  </span>
                  <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={spring} className="inline-flex">
                    <VerdictBadge verdict={e.verdict} live={live === e.id} />
                  </motion.span>
                  <span className="text-fg-muted">{e.reason}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              run(value);
            }}
            className="flex items-center gap-2.5 border-t border-border pt-4"
          >
            <label htmlFor={inputId} className="sr-only">
              Command to test
            </label>
            <span aria-hidden className="text-accent-ink">
              #
            </span>
            <input
              ref={inputRef}
              id={inputId}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              maxLength={200}
              placeholder="rm -rf /"
              className="min-w-0 flex-1 bg-transparent text-fg caret-accent outline-none placeholder:text-fg-subtle focus-visible:outline-none"
            />
            <button
              type="submit"
              className="rounded-sm border border-border-strong px-2.5 py-1 text-[0.75rem] text-fg-muted transition-colors hover:border-fg-subtle hover:text-fg"
            >
              Run
            </button>
          </form>
        </div>
      </div>

      <div className="mt-5">
        <p id={`${inputId}-try`} className="label">
          Try one
        </p>
        <ul aria-labelledby={`${inputId}-try`} className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => {
                  run(s);
                  inputRef.current?.focus();
                }}
                className="rounded-pill border border-border-strong px-3.5 py-1.5 font-mono text-[0.75rem] text-fg transition-colors hover:border-fg-subtle hover:bg-surface-2"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-fg-subtle">
          <span className="font-semibold text-fg-muted">Simulation.</span> The real IAAC uses on-box AI and 240+ MITRE-mapped
          rules. Nothing you type is executed or sent anywhere.
        </p>
      </div>

      {/* Screen-reader announcement of the latest verdict */}
      <p aria-live="polite" className="sr-only">
        {latest ? `${latest.cmd}: ${latest.verdict}. ${latest.reason}.` : ""}
      </p>
    </div>
  );
}
