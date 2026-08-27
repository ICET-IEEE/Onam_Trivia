"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Insignia } from "./Insignia";

const links = [
  { href: "/", label: "Home" },
  { href: "/#trial", label: "The Trial" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/chapters", label: "Chapters" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-ivory-line/80 bg-ivory/90 backdrop-blur-md">
      <div className="container-max section-pad flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Insignia className="h-9 w-9 shrink-0" animated={false} />
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg tracking-wide text-ink">Maveli&rsquo;s Trial</span>
            <span className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold-dim">
              Mythology CTF
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-kingdom-green"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/signin"
            className="text-sm font-semibold text-ink-soft transition-colors hover:text-kingdom-green"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-kingdom-green px-5 py-2.5 text-sm font-semibold text-ivory transition-colors hover:bg-kingdom-green-light"
          >
            Sign Up
          </Link>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory-line text-ink lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ivory-line bg-ivory lg:hidden">
          <nav className="container-max section-pad flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-ink-soft hover:bg-kingdom-green-pale hover:text-kingdom-green"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-ivory-line pt-4">
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className="rounded-full border border-ivory-line px-4 py-3 text-center text-sm font-semibold text-ink"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="rounded-full bg-kingdom-green px-4 py-3 text-center text-sm font-semibold text-ivory"
              >
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
