"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { dur, easeOutExpo } from "@/styles/motion";

// The first page load renders without a transition so the server HTML (and LCP) is visible
// immediately; only later client-side navigations fade/rise in.
let firstLoad = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const animate = !firstLoad;
  useEffect(() => {
    firstLoad = false;
  }, []);
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: dur.base, ease: easeOutExpo }}
    >
      {children}
    </motion.div>
  );
}
