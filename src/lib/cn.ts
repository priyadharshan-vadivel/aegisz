import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge the theme.css type scale so `text-h2` is a size, not a colour,
// and doesn't knock out `text-fg`.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display", "h1", "statement", "h2", "h3", "lead", "body", "label"] }],
    },
  },
});

/** Join classes; later conflicting utilities win (e.g. a passed `border-accent` beats a default `border-border`). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
