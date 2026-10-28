"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useScroll } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { ShieldPoster } from "./ShieldPoster";
import { cn } from "@/lib/cn";

const Scene = dynamic(() => import("./IntentShieldScene"), { ssr: false });

const story = [
  { title: "See every command", body: "The shield forms around every server, for interactive sessions and background jobs alike." },
  { title: "Judge its intent", body: "Harmful commands stop at the shield. Safe work passes straight through." },
  { title: "Every decision, on the record", body: "Each verdict is written to a tamper-evident, hash-chained audit log." },
];

type Mode = "poster" | "3d";

/** Decide once on the client whether this device should get the live scene. */
function canRun3D() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.innerWidth < 640) return false;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  if ((nav.deviceMemory ?? 8) <= 4 || (nav.hardwareConcurrency ?? 8) <= 4) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Hero + scroll story. A sticky stage holds the 3D shield (or its static poster) while the
 * hero copy and three story captions scroll past; scroll progress drives form → judge → lock.
 */
export function HeroStage({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("poster");
  const [ready, setReady] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useEffect(() => {
    if (!canRun3D()) return;
    setMode("3d");
    // Load three.js only once the page has settled.
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const live = mode === "3d" && ready;

  return (
    <div ref={ref} className="relative">
      {/* Sticky stage behind the copy */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="sticky top-0 h-svh overflow-hidden">
          <div className={cn("absolute inset-0 transition-opacity duration-[var(--ae-dur-slow)]", live ? "opacity-0" : "opacity-100")}>
            {/* Poster: right of the copy on wide screens, faint and below it on small ones. */}
            <div className="flex h-full items-end justify-center opacity-35 sm:items-center sm:justify-end sm:opacity-100">
              <ShieldPoster className="h-[60%] w-auto translate-y-[18%] sm:h-[72%] sm:translate-x-[6%] sm:translate-y-0 lg:translate-x-[2%]" />
            </div>
          </div>
          {live && (
            // Fade the left of the canvas on wide screens so nothing crosses the copy.
            <div className="absolute inset-0 lg:[mask-image:linear-gradient(90deg,transparent_30%,#000_58%)]">
              <Scene progress={scrollYProgress} active={onScreen} />
            </div>
          )}
        </div>
      </div>

      <div className="relative">{children}</div>

      {/* Story captions scroll past the pinned scene */}
      <section aria-label="How IAAC protects a server" className="relative">
        <Container>
          <ol className="pb-section">
            {story.map((s, i) => (
              <li key={s.title} className="flex min-h-[60svh] items-center sm:min-h-[85svh]">
                <div className="max-w-md rounded-tile border border-border bg-bg/80 p-7 backdrop-blur-md sm:p-9">
                  <p className="font-mono text-sm text-fg-subtle">{i + 1} / 3</p>
                  <h2 className="mt-3 text-h2 text-fg">{s.title}</h2>
                  <p className="mt-4 text-lead text-fg-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </div>
  );
}
