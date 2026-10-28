import { cn } from "@/lib/cn";

type CardProps = {
  as?: "div" | "article" | "li";
  className?: string;
  interactive?: boolean;
  children: React.ReactNode;
};

/** Rounded tile. Base unit of every bento grid. */
export function Card({ as: Tag = "div", className, interactive, children }: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-tile border border-border bg-surface p-7 shadow-tile sm:p-8",
        interactive &&
          "transition-[border-color,transform] duration-[var(--ae-dur-base)] ease-out-expo hover:-translate-y-0.5 hover:border-border-strong focus-within:border-border-strong",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
