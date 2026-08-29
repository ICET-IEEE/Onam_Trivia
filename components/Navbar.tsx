"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, User, LogOut } from "lucide-react";
import { Insignia } from "./Insignia";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/", label: "Home" },
  { href: "/#trial", label: "The Trial" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/chapters", label: "Chapters" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const metaName = user.user_metadata?.full_name;

        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle();

        const profileName = (profile?.full_name && profile.full_name !== 'Challenger') ? profile.full_name : null;
        const displayName = profileName || metaName || user.email?.split('@')[0] || 'User';

        setUser({
          name: displayName,
          email: user.email
        });

        const nameToSave = profileName || metaName || user.email?.split('@')[0] || 'Player';
        if (!profile || profile.full_name !== nameToSave) {
          await supabase.from('profiles').upsert({
            id: user.id,
            full_name: nameToSave,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });
        }
      }
      setLoading(false);
    }
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const metaName = session.user.user_metadata?.full_name;

        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .maybeSingle();

        const profileName = (profile?.full_name && profile.full_name !== 'Challenger') ? profile.full_name : null;
        const displayName = profileName || metaName || session.user.email?.split('@')[0] || 'User';

        setUser({
          name: displayName,
          email: session.user.email
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    setOpen(false);
    setProfileOpen(false);
  };

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
          {loading ? (
            <div className="h-8 w-8 rounded-full bg-ivory-deep animate-pulse"></div>
          ) : user ? (
            <div className="relative flex items-center" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-ivory-deep/50 border border-ivory-line hover:border-kingdom-green/30 transition-colors"
              >
                <div className="h-7 w-7 rounded-full bg-gold/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-gold" />
                </div>
                <span className="text-sm font-medium text-ink">{user.name}</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-ivory-line bg-ivory p-2 shadow-lg z-50 animate-fade-up">
                  <div className="px-3 py-3 border-b border-ivory-line mb-2">
                    <p className="text-sm font-medium text-ink truncate">{user.name}</p>
                    <p className="text-xs text-ink-soft truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-rust hover:bg-rust/5 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
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
              {loading ? (
                <div className="h-12 rounded-lg bg-ivory-deep animate-pulse"></div>
              ) : user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-ivory-deep/50">
                    <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center">
                      <User className="h-4 w-4 text-gold" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink">{user.name}</p>
                      <p className="text-xs text-ink-soft">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 rounded-lg border border-ivory-line px-4 py-3 text-sm font-semibold text-ink hover:bg-rust/5 hover:text-rust"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
