import { Crown, Trophy } from "lucide-react";
import { Reveal } from "./Reveal";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function LeaderboardPreview() {
  const supabase = await createClient();

  const { data: profilesData } = await supabase
    .from("profiles")
    .select("id, full_name, role");

  const { data: solvesData } = await supabase
    .from("user_solves")
    .select("user_id, points_awarded, solved_at, challenge_id");

  const { count: totalChallenges } = await supabase
    .from("challenges")
    .select("id", { count: "exact", head: true })
    .eq("is_published", true);

  const profiles = profilesData || [];
  const solves = solvesData || [];
  const total = totalChallenges || 0;

  const userMap: Record<string, { name: string; score: number; latestSolveTime: number; solvedSet: Set<string> }> = {};

  profiles.forEach((p) => {
    if (p.role !== "admin") {
      const validName = p.full_name && p.full_name !== "Challenger" ? p.full_name : "";
      userMap[p.id] = {
        name: validName,
        score: 0,
        latestSolveTime: 0,
        solvedSet: new Set(),
      };
    }
  });

  solves.forEach((s) => {
    if (!userMap[s.user_id]) {
      userMap[s.user_id] = {
        name: "",
        score: 0,
        latestSolveTime: 0,
        solvedSet: new Set(),
      };
    }
    const entry = userMap[s.user_id];
    entry.score += s.points_awarded || 0;
    entry.solvedSet.add(s.challenge_id);
    const time = new Date(s.solved_at).getTime();
    if (time > entry.latestSolveTime) {
      entry.latestSolveTime = time;
    }
  });

  const leaderboardList = Object.entries(userMap)
    .filter(([_, data]) => data.score > 0 || (data.name && data.name !== "Challenger"))
    .map(([userId, data]) => ({
      userId,
      rank: 0,
      name: data.name || "Player",
      score: data.score,
      latestSolveTime: data.latestSolveTime,
      completedAll: total > 0 ? data.solvedSet.size === total : false,
    }))
    .sort((a, b) => {
      if (a.completedAll !== b.completedAll) {
        return a.completedAll ? -1 : 1;
      }
      if (b.score !== a.score) return b.score - a.score;
      if (a.latestSolveTime && b.latestSolveTime) return a.latestSolveTime - b.latestSolveTime;
      return a.name.localeCompare(b.name);
    })
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }))
    .slice(0, 5);

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
              Live Standings
            </p>

            {leaderboardList.length === 0 ? (
              <div className="p-8 text-center">
                <Trophy className="w-8 h-8 text-gold/60 mx-auto mb-2" />
                <p className="text-sm text-ink-soft">
                  No active participants on the leaderboard right now.
                </p>
                <Link 
                  href="/chapters"
                  className="mt-3 inline-block text-xs font-semibold text-gold hover:underline"
                >
                  Start the trial &rarr;
                </Link>
              </div>
            ) : (
              <ul>
                {leaderboardList.map((entry) => (
                  <li
                    key={entry.userId}
                    className={`flex items-center justify-between gap-4 px-6 py-4 sm:px-8 ${
                      entry.rank !== leaderboardList.length ? "border-b border-ivory-line" : ""
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
                        {entry.name}
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
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
