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
    <section id={id} aria-labelledby={labelledBy} className={cn("py-section", tone === "surface" && "bg-surface", className)}>
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
    <div className={cn("max-w-4xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="label mb-5">{eyebrow}</p>}
      <Tag id={id} className={cn("text-fg", Tag === "h1" ? "text-h1" : "text-h2")}>
        {title}
      </Tag>
      {body && (
        <div className={cn("mt-6 max-w-measure text-lead text-fg-muted", align === "center" && "mx-auto")}>{body}</div>
      )}
    </div>
  );
}
