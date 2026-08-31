import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  withArrow?: boolean;
  className?: string;
  target?: string;
  rel?: string;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-kingdom-green text-ivory hover:bg-kingdom-green-light shadow-[0_1px_0_0_rgba(184,137,43,0.4)_inset]",
  secondary:
    "bg-transparent text-kingdom-green border border-kingdom-green/30 hover:border-gold hover:text-gold-dim",
  ghost: "bg-transparent text-ink hover:text-gold-dim",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-200 ease-out active:scale-[0.98]";

export function Button({
  children,
  variant = "primary",
  withArrow = false,
  className = "",
  href,
  target,
  rel,
  ...rest
}: BaseProps & { href?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = `${base} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} target={target} rel={rel}>
        {children}
        {withArrow && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
      {withArrow && <ArrowRight className="h-4 w-4" />}
    </button>
  );
}
