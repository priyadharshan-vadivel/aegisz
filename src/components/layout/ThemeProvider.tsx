"use client";

import { ThemeProvider as NextThemes } from "next-themes";
import { MotionConfig } from "framer-motion";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemes attribute="data-theme" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </NextThemes>
  );
}
