import { cn } from "@/lib/cn";

/** 6-column bento on desktop, 2 on tablet, 1 on phones. Size tiles with the span helpers below. */
export function Bento({ as: Tag = "div", className, children }: { as?: "div" | "ul"; className?: string; children: React.ReactNode }) {
  return <Tag className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-6", className)}>{children}</Tag>;
}

export const span = {
  full: "sm:col-span-2 lg:col-span-6",
  twoThirds: "sm:col-span-2 lg:col-span-4",
  half: "sm:col-span-1 lg:col-span-3",
  third: "sm:col-span-1 lg:col-span-2",
  tall: "lg:row-span-2",
} as const;
