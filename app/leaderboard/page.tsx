import { Crown, Medal, Trophy } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  score: number;
  progress: number;
  lastSolved: string;
  latestSolveTime: number;
}

export default async function LeaderboardPage() {
  const supabase = await createClient();

  // Fetch profiles
  const { data: profilesData } = await supabase
    .from("profiles")
    .select("id, full_name, role");

  // Fetch solves
  const { data: solvesData } = await supabase
    .from("user_solves")
    .select("user_id, points_awarded, challenge_id, solved_at");

  // Fetch total published challenges count
  const { count: totalChallenges } = await supabase
    .from("challenges")
    .select("id", { count: "exact", head: true })
    .eq("is_published", true);

  const profiles = profilesData || [];
  const solves = solvesData || [];
  const total = totalChallenges || 0;

  // Build user score map
  const userMap: Record<string, {
    name: string;
    score: number;
    solvedSet: Set<string>;
    latestSolveTime: number;
    latestSolveText: string;
  }> = {};

  profiles.forEach((p) => {
    if (p.role !== "admin") {
      const validName = p.full_name && p.full_name !== "Challenger" ? p.full_name : "";
      userMap[p.id] = {
        name: validName,
        score: 0,
        solvedSet: new Set(),
        latestSolveTime: 0,
        latestSolveText: "-",
      };
    }
  });

  solves.forEach((s) => {
    if (!userMap[s.user_id]) {
      userMap[s.user_id] = {
        name: "",
        score: 0,
        solvedSet: new Set(),
        latestSolveTime: 0,
        latestSolveText: "-",
      };
    }
    const entry = userMap[s.user_id];
    entry.score += s.points_awarded || 0;
    entry.solvedSet.add(s.challenge_id);
    const time = new Date(s.solved_at).getTime();
    if (time > entry.latestSolveTime) {
      entry.latestSolveTime = time;
      entry.latestSolveText = new Date(s.solved_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  });

  const leaderboardList: LeaderboardEntry[] = Object.entries(userMap)
    .filter(([_, data]) => data.score > 0 || (data.name && data.name !== "Challenger"))
    .map(([userId, data]) => ({
      userId,
      rank: 0,
      name: data.name || "Player",
      score: data.score,
      progress: total > 0 ? Math.round((data.solvedSet.size / total) * 100) : 0,
      lastSolved: data.latestSolveText,
      latestSolveTime: data.latestSolveTime,
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.latestSolveTime && b.latestSolveTime) return a.latestSolveTime - b.latestSolveTime;
      return a.name.localeCompare(b.name);
    })
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

  const activePlayers = leaderboardList.filter(item => item.score > 0);
  const topThree = activePlayers.slice(0, 3);
  const first = topThree[0] || null;
  const second = topThree[1] || null;
  const third = topThree[2] || null;

  return (
    <>
      <Navbar />
      <main className="section-pad py-14 sm:py-20 min-h-[80vh]">
        <div className="container-max">
          <span className="eyebrow">Standings</span>
          <h1 className="mt-4 text-4xl sm:text-5xl">Kingdom Leaderboard</h1>
          <p className="mt-2 max-w-lg text-ink-soft">
            Live standings updated in real time as challengers complete trials.
          </p>

          {leaderboardList.length === 0 ? (
            <div className="mt-12 text-center bg-white rounded-2xl border border-ivory-line p-12 max-w-xl mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-display font-bold text-ink mb-2">No Participants Right Now</h2>
              <p className="text-ink-soft">
                There are no active participants on the leaderboard right now. Be the first to solve a challenge and claim your place at the top!
              </p>
            </div>
          ) : (
            <>
              {/* Top 3 podium */}
              {topThree.length > 0 && (
                <div className="mt-12 grid gap-4 sm:grid-cols-3">
                  {[second, first, third].map((entry, idx) => {
                    if (!entry) return <div key={idx} className="hidden sm:block" />;
                    return (
                      <div
                        key={entry.userId}
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
                        <p className="mt-2 text-lg font-medium text-ink">{entry.name}</p>
                        <p className="mt-1 text-sm font-semibold text-kingdom-green">{entry.score} pts</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Table */}
              <div className="mt-10 overflow-x-auto rounded-2xl border border-ivory-line bg-white">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-ivory-line text-xs font-semibold uppercase tracking-wide text-ink-faint">
                      <th className="px-6 py-4">Rank</th>
                      <th className="px-6 py-4">Challenger</th>
                      <th className="px-6 py-4">Score</th>
                      <th className="px-6 py-4">Progress</th>
                      <th className="px-6 py-4">Last Solved</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardList.map((entry) => (
                      <tr key={entry.userId} className="border-b border-ivory-line last:border-0 hover:bg-ivory/30 transition-colors">
                        <td className="px-6 py-4 font-display text-base text-kingdom-green">
                          #{entry.rank}
                        </td>
                        <td className="px-6 py-4 font-medium text-ink">{entry.name}</td>
                        <td className="px-6 py-4 font-semibold text-kingdom-green">{entry.score} pts</td>
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
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
