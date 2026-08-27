import { Crown, Medal } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { leaderboard } from "@/lib/data";

const filters = ["Overall", "Today", "Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4"];

export default function LeaderboardPage() {
  const [first, second, third] = leaderboard;
  const rest = leaderboard.slice(3);

  return (
    <>
      <Navbar />
      <main className="section-pad py-14 sm:py-20">
        <div className="container-max">
          <span className="eyebrow">Standings</span>
          <h1 className="mt-4 text-4xl sm:text-5xl">Kingdom Leaderboard</h1>
          <p className="mt-2 max-w-lg text-ink-soft">
            Mock standings shown for preview purposes &mdash; live scoring
            connects once the trial opens.
          </p>

          {/* Filters */}
          <div className="mt-8 flex flex-wrap gap-2">
            {filters.map((filter, i) => (
              <button
                key={filter}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  i === 0
                    ? "border-kingdom-green bg-kingdom-green text-ivory"
                    : "border-ivory-line text-ink-soft hover:border-gold/50 hover:text-kingdom-green"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Top 3 podium */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[second, first, third].map((entry) => (
              <div
                key={entry.rank}
                className={`flex flex-col items-center rounded-2xl border p-8 text-center ${
                  entry.rank === 1
                    ? "border-gold bg-gold/[0.06] sm:-translate-y-4"
                    : "border-ivory-line bg-white"
                }`}
              >
                {entry.rank === 1 ? (
                  <Crown className="h-7 w-7 text-gold" />
                ) : (
                  <Medal className={`h-6 w-6 ${entry.rank === 2 ? "text-ink-faint" : "text-rust"}`} />
                )}
                <span className="mt-3 font-display text-3xl text-kingdom-green">#{entry.rank}</span>
                <p className="mt-2 text-lg font-medium">{entry.team}</p>
                <p className="mt-1 text-sm text-ink-faint">{entry.score} pts</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="mt-10 overflow-x-auto rounded-2xl border border-ivory-line bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-ivory-line text-xs font-semibold uppercase tracking-wide text-ink-faint">
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Team</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Progress</th>
                  <th className="px-6 py-4">Last Solved</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr key={entry.rank} className="border-b border-ivory-line last:border-0">
                    <td className="px-6 py-4 font-display text-base text-kingdom-green">
                      {entry.rank}
                    </td>
                    <td className="px-6 py-4 font-medium text-ink">{entry.team}</td>
                    <td className="px-6 py-4 text-ink-soft">{entry.score}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-ivory-deep">
                          <div
                            className="h-full rounded-full bg-gold"
                            style={{ width: `${entry.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-ink-faint">{entry.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-ink-soft">{entry.lastSolved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
