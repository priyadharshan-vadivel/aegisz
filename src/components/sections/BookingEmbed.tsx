"use client";

import { useEffect, useRef, useState } from "react";
import { bookingUrl } from "@/content/site";

/*
 * Cal.id inline scheduler. Cal.id serves the standard Cal embed script; it's loaded only when
 * this block nears the viewport. The "Open the scheduler" button above it always works, so if
 * the script is blocked or slow, people can still book.
 */

const EMBED_SRC = "https://cal.id/embed-link/embed.js";
const NS = "aegisz-demo";

type CalApi = ((...args: unknown[]) => void) & { q?: unknown[]; ns?: Record<string, CalApi>; loaded?: boolean };
declare global {
  interface Window {
    Cal?: CalApi;
  }
}

/** The official Cal loader stub: queues calls until embed.js arrives. */
function installCal() {
  if (window.Cal) return window.Cal;
  const push = (api: CalApi, args: unknown) => api.q!.push(args);
  const cal: CalApi = function (...args: unknown[]) {
    if (!cal.loaded) {
      cal.ns = {};
      cal.q = cal.q || [];
      const s = document.createElement("script");
      s.src = EMBED_SRC;
      s.async = true;
      document.head.appendChild(s);
      cal.loaded = true;
    }
    if (args[0] === "init") {
      const api: CalApi = function (...a: unknown[]) {
        push(api, a);
      };
      api.q = [];
      const ns = args[1];
      if (typeof ns === "string") {
        cal.ns![ns] = cal.ns![ns] || api;
        push(cal.ns![ns], args);
        push(cal, ["initNamespace", ns]);
      } else push(cal, args);
      return;
    }
    push(cal, args);
  };
  cal.q = [];
  window.Cal = cal;
  return cal;
}

export function BookingEmbed() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "failed">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setState("loading");
        const url = new URL(bookingUrl);
        const Cal = installCal();
        Cal("init", NS, { origin: url.origin });
        const api = Cal.ns![NS];
        api("inline", {
          elementOrSelector: el,
          calLink: url.pathname.replace(/^\//, ""),
          config: { layout: "month_view", theme: "dark" },
        });
        api("ui", { theme: "dark", hideEventTypeDetails: false, layout: "month_view" });
        api("on", { action: "linkReady", callback: () => setState("ready") });
        api("on", { action: "linkFailed", callback: () => setState("failed") });
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // If Cal never reports ready (blocked, offline, refused to frame), fall back to the button.
  useEffect(() => {
    if (state !== "loading") return;
    const timer = setTimeout(() => setState((s) => (s === "loading" ? "failed" : s)), 10000);
    return () => clearTimeout(timer);
  }, [state]);

  return (
    <div className="relative overflow-hidden rounded-tile border border-border bg-surface">
      {/* Sits above Cal's own centred loader; on failure the box collapses to just this message. */}
      <p role="status" className={state === "failed" ? "p-6 text-fg-muted sm:p-8" : state === "ready" ? "sr-only" : "absolute inset-x-0 top-8 px-6 text-center text-fg-muted"}>
        {state === "failed"
          ? "The scheduler didn't load here. Use the button above to book in a new tab."
          : state === "ready"
            ? "Scheduler loaded."
            : "Loading the scheduler…"}
      </p>
      <div ref={ref} className={state === "failed" ? "hidden" : "min-h-[40rem] w-full overflow-auto"} />
    </div>
  );
}
