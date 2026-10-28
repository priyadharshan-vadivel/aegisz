"use client";

import { motion, useReducedMotion } from "framer-motion";
import { terminalDemo } from "@/content/iaac";
import { dur, easeOutExpo } from "@/styles/motion";
import { cn } from "@/lib/cn";

/** Three verdict tiles that flip in one after another. BLOCK is the one lit in the accent. */
export function VerdictTriptych({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <ul className={cn("grid gap-3 sm:gap-4 md:grid-cols-3 [perspective:1200px]", className)}>
      {terminalDemo.map((t, i) => {
        const hot = t.verdict === "block";
        return (
          <motion.li
            key={t.cmd}
            initial={reduce ? false : { opacity: 0, rotateX: -35, y: 30 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: dur.slow, delay: i * 0.14, ease: easeOutExpo }}
            className={cn(
              "flex min-h-48 flex-col justify-between rounded-tile border p-7 sm:p-8 md:min-h-64",
              hot ? "border-accent bg-accent text-accent-fg" : "border-border-strong bg-bg text-fg",
            )}
          >
            <p className="font-mono text-[clamp(2.25rem,1rem+3vw,3.5rem)] leading-none font-semibold tracking-[-0.02em] uppercase">
              {t.verdict}
            </p>
            <div className="mt-8 md:mt-10">
              <p className={cn("font-mono text-sm break-all", hot ? "text-accent-fg" : "text-fg")}>
                <span aria-hidden className="opacity-60"># </span>
                {t.cmd}
              </p>
              <p className={cn("mt-2 text-sm", hot ? "text-accent-fg" : "text-fg-muted")}>{t.reason}</p>
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
}
