import Link from "next/link";
import { ReactNode } from "react";
import { Insignia } from "./Insignia";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-kingdom-green p-12 text-ivory lg:flex">
        <Link href="/" className="flex items-center gap-3">
          <Insignia className="h-8 w-8" animated={false} />
          <span className="font-display text-lg">Maveli&rsquo;s Trial</span>
        </Link>

        <div className="relative flex flex-1 items-center justify-center">
          <Insignia className="w-full max-w-sm animate-float opacity-90" />
        </div>

        <p className="max-w-sm text-sm leading-relaxed text-ivory/65">
          &ldquo;Three steps were asked. A kingdom was given. Every trial begins
          with a single step forward.&rdquo;
        </p>
      </div>

      <div className="flex items-center justify-center section-pad py-16">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-10 flex items-center gap-2.5 lg:hidden">
            <Insignia className="h-8 w-8" animated={false} />
            <span className="font-display text-lg text-ink">Maveli&rsquo;s Trial</span>
          </Link>

          <h1 className="text-3xl sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-ink-soft">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-8 text-center text-sm text-ink-soft">{footer}</div>
        </div>
      </div>
    </div>
  );
}

import { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function FormField({
  label,
  id: customId,
  ...props
}: FormFieldProps) {
  const id = customId || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        name={id}
        className="rounded-xl border border-ivory-line bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-gold focus:outline-none"
        {...props}
      />
    </div>
  );
}
