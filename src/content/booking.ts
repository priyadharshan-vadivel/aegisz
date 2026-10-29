/*
 * Cal.id booking. Every "Book a demo" CTA and the /contact cards link here; nothing is embedded.
 * Only the events below are public. Never add the Investor Meeting event to the site.
 */

/** The public Cal.id page that lists the events. Used until an event's own URL is known. */
export const bookingProfileUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "https://cal.id/priyadharshan-aegisz";

export type BookingEvent = {
  id: "walkthrough" | "partnership";
  title: string;
  body: string;
  /** Minutes. Each chip links to the event with ?duration=N. */
  durations: number[];
  /** The event's own Cal.id URL, or null to fall back to the profile page. */
  url: string | null;
};

export const bookingEvents: BookingEvent[] = [
  {
    id: "walkthrough",
    title: "Product Walkthrough",
    body: "A guided IAAC walkthrough for your team.",
    durations: [15, 30],
    // TODO: paste the exact Product Walkthrough event URL from cal.id/priyadharshan-aegisz.
    url: null,
  },
  {
    id: "partnership",
    title: "Partnership Call",
    body: "Explore reselling, integration or collaboration.",
    durations: [15, 30],
    // TODO: paste the exact Partnership Call event URL from cal.id/priyadharshan-aegisz.
    url: null,
  },
];

/** Link to an event, optionally preselecting a duration (Cal's ?duration= on multi-length events). */
export function eventUrl(event: BookingEvent, duration?: number) {
  if (!event.url) return bookingProfileUrl;
  return duration ? `${event.url}?duration=${duration}` : event.url;
}

export const walkthrough = bookingEvents.find((e) => e.id === "walkthrough")!;
