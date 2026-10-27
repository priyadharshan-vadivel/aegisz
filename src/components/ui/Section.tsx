import { cn } from "@/lib/cn";
import { Container } from "./Container";

type SectionProps = {
  id?: string;
  labelledBy?: string;
  tone?: "default" | "surface";
  className?: string;
  children: React.ReactNode;
};

export function Section({ id, labelledBy, tone = "default", className, children }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("py-section", tone === "surface" && "border-y border-border bg-surface", className)}
    >
      <Container>{children}</Container>
    </section>
  );
}

type HeadingProps = {
  id: string;
  eyebrow?: string;
  title: string;
  body?: React.ReactNode;
  as?: "h1" | "h2";
  align?: "start" | "center";
  className?: string;
};

export function SectionHeading({ id, eyebrow, title, body, as: Tag = "h2", align = "start", className }: HeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-fg-subtle">{eyebrow}</p>}
      <Tag
        id={id}
        className={cn(
          "font-semibold text-fg",
          Tag === "h1" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl",
        )}
      >
        {title}
      </Tag>
      {body && <div className="mt-4 text-lg text-fg-muted">{body}</div>}
    </div>
  );
}
