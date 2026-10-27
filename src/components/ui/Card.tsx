import { cn } from "@/lib/cn";

type CardProps = {
  as?: "div" | "article" | "li";
  className?: string;
  children: React.ReactNode;
};

export function Card({ as: Tag = "div", className, children }: CardProps) {
  return (
    <Tag className={cn("rounded-lg border border-border bg-surface p-6 shadow-card", className)}>{children}</Tag>
  );
}
