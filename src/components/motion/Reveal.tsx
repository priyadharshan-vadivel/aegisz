"use client";

import { motion } from "framer-motion";
import { dur, easeOutExpo } from "@/styles/motion";

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  as?: "div" | "li";
  className?: string;
};

/**
 * Fades content up once when it scrolls into view. Under prefers-reduced-motion,
 * MotionConfig (reducedMotion="user") drops the movement and keeps only the fade.
 */
export function Reveal({ children, delay = 0, y = 24, as = "div", className }: RevealProps) {
  const Comp = as === "li" ? motion.li : motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: dur.slow, delay, ease: easeOutExpo }}
    >
      {children}
    </Comp>
  );
}
