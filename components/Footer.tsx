import Link from "next/link";
import { Insignia } from "./Insignia";

const links = [
  { href: "/", label: "Home" },
  { href: "/chapters", label: "Chapters" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/signin", label: "Sign In" },
  { href: "/signup", label: "Sign Up" },
];

export function Footer() {
  return (
    <footer className="border-t border-ivory-line section-pad py-14">
      <div className="container-max flex flex-col items-center gap-8 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">
        <div className="flex flex-col items-center gap-3 sm:items-start">
          <div className="flex items-center gap-2.5">
            <Insignia className="h-7 w-7" animated={false} />
            <span className="font-display text-lg text-ink">Maveli&rsquo;s Trial</span>
          </div>
          <p className="max-w-xs text-sm text-ink-soft">
            A Mythology CTF inspired by the legends of Onam.
          </p>
        </div>

        
      </div>

      <p className="container-max mt-10 text-center text-xs uppercase tracking-[0.2em] text-ink-faint sm:text-left">
        Built for curious minds.
      </p>
    </footer>
  );
}
