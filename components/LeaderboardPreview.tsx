import { Crown } from "lucide-react";
import { leaderboard } from "@/lib/data";
import { Reveal } from "./Reveal";
import Link from "next/link";

export function LeaderboardPreview() {
  return (
    <section className="section-pad py-24 sm:py-28">
      <div className="container-max">
        <Reveal className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="eyebrow">Standings</span>
            <h2 className="mt-4 text-4xl sm:text-5xl">The Kingdom Watches.</h2>
          </div>
          <Link
            href="/leaderboard"
            className="text-sm font-semibold text-kingdom-green underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
          >
            View Full Leaderboard &rarr;
          </Link>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-10 overflow-hidden rounded-2xl border border-ivory-line bg-white">
            <p className="border-b border-ivory-line bg-ivory-deep/60 px-6 py-2.5 text-center text-[0.7rem] font-semibold uppercase tracking-wider text-ink-faint">
              Placeholder data &mdash; standings will update once the trial begins
            </p>
            <ul>
              {leaderboard.map((entry) => (
                <li
                  key={entry.rank}
                  className={`flex items-center justify-between gap-4 px-6 py-4 sm:px-8 ${
                    entry.rank !== leaderboard.length ? "border-b border-ivory-line" : ""
                  } ${entry.rank <= 3 ? "bg-gold/[0.04]" : ""}`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full font-display text-base ${
                        entry.rank === 1
                          ? "bg-gold text-ivory"
                          : entry.rank <= 3
                          ? "bg-gold/15 text-gold-dim"
                          : "bg-ivory-deep text-ink-faint"
                      }`}
                    >
                      {entry.rank}
                    </span>
                    <span className="flex items-center gap-2 font-medium text-ink">
                      {entry.team}
                      {entry.rank === 1 && <Crown className="h-4 w-4 text-gold" />}
                    </span>
                  </div>
                  <span className="font-display text-lg text-kingdom-green">
                    {entry.score}
                    <span className="ml-1 text-xs font-body text-ink-faint">pts</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
