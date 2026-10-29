import { Handshake, MonitorPlay } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { bookingEvents, eventUrl, type BookingEvent } from "@/content/booking";

/* Native booking cards for the public Cal.id events. Each link opens Cal.id in a new tab. */

const icons: Record<BookingEvent["id"], typeof Handshake> = { walkthrough: MonitorPlay, partnership: Handshake };

const chip =
  "inline-flex min-h-11 items-center rounded-pill border border-border-strong px-4 font-mono text-sm text-fg transition-colors duration-[var(--ae-dur-fast)] hover:border-fg-subtle hover:bg-surface-2";

export function BookingCards() {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {bookingEvents.map((e) => {
        const Icon = icons[e.id];
        return (
          <li key={e.id} className="card-glow flex flex-col rounded-tile border border-border-strong bg-surface p-6 sm:p-9">
            <Icon aria-hidden className="size-6 text-accent-ink" strokeWidth={1.5} />
            <h2 id={`book-${e.id}`} className="mt-8 text-h3 text-fg sm:text-h2 lg:text-h3">
              {e.title}
            </h2>
            <p className="mt-3 max-w-[40ch] text-fg-muted">{e.body}</p>
            <ul aria-label={`${e.title} lengths`} className="mt-8 flex flex-wrap gap-2">
              {e.durations.map((d) => (
                <li key={d}>
                  <a
                    href={eventUrl(e, d)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${e.title}, ${d} minutes (opens in a new tab)`}
                    className={chip}
                  >
                    {d} min
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-10">
              <LinkButton href={eventUrl(e)} className="w-full sm:w-auto">
                Schedule<span className="sr-only"> a {e.title}</span>
              </LinkButton>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
