import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill font-medium whitespace-nowrap transition-[background-color,color,border-color,transform] duration-[var(--ae-dur-fast)] ease-out-expo active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "shine bg-cta text-cta-fg",
  secondary: "border border-border-strong text-fg hover:border-fg-subtle hover:bg-surface-2",
  ghost: "text-fg-muted hover:text-fg",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3.5 text-[0.8125rem]",
  md: "h-11 px-6 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type LinkButtonProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">;

export function LinkButton({ href, variant, size, className, children, ...rest }: LinkButtonProps) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)} {...rest}>
      <span className="relative z-[2] inline-flex items-center gap-2">{children}</span>
    </Link>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size };

export function Button({ variant, size, className, type = "button", children, ...rest }: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...rest}>
      <span className="relative z-[2] inline-flex items-center gap-2">{children}</span>
    </button>
  );
}

/** Quiet text link with an arrow that nudges on hover. */
export function ArrowLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-1.5 font-medium text-accent-ink hover:underline underline-offset-4", className)}
    >
      {children}
      <span aria-hidden className="transition-transform duration-[var(--ae-dur-fast)] ease-out-expo group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}
