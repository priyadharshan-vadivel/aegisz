"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/cn";

type Props = {
  text: string;
  as?: "h1" | "h2" | "p";
  id?: string;
  className?: string;
};

/**
 * Scroll-linked statement: each word brightens from fg-subtle to fg as the section passes.
 * It's a colour blend, not opacity, so text meets AA contrast at every point (including SSR).
 */
export function WordReveal({ text, as: Tag = "h2", id, className }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");

  if (reduce) {
    return (
      <Tag id={id} className={className}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag id={id} ref={ref as never} className={cn(className)} aria-label={text}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </Tag>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const mix = useTransform(progress, range, [0, 100], { clamp: true });
  const color = useTransform(mix, (v) => `color-mix(in oklab, var(--color-fg) ${v}%, var(--color-fg-subtle))`);
  return (
    <motion.span aria-hidden style={{ color }}>
      {children}{" "}
    </motion.span>
  );
}
