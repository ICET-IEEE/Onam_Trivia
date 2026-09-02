import { redirect } from "next/navigation";
import { Lock, CheckCircle2, Circle, Users, Trophy } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/signin");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  const profileName = (profile?.full_name && profile.full_name !== 'Challenger') ? profile.full_name : null;
  const userName = profileName || user.user_metadata?.full_name || user.email?.split('@')[0] || "Challenger";

  // Fetch user solves
  const { data: userSolves } = await supabase
    .from('user_solves')
    .select('points_awarded, challenge_id')
    .eq('user_id', user.id);

  const solves = userSolves || [];
  const currentScore = solves.reduce((sum, s) => sum + (s.points_awarded || 0), 0);

  // Fetch total published challenges count
  const { count: totalChallenges } = await supabase
    .from('challenges')
    .select('id', { count: 'exact', head: true })
    .eq('is_published', true);

  const total = totalChallenges || 0;
  const distinctSolvedCount = new Set(solves.map(s => s.challenge_id)).size;
  const progressPercent = total > 0 ? Math.round((distinctSolvedCount / total) * 100) : 0;

  const { data: chaptersData } = await supabase
    .from('chapters')
    .select('*')
    .order('chapter_number', { ascending: true })
    .limit(4);
    
  const dashboardChapters = chaptersData || [];

  return (
    <>
      <Navbar />
      <main className="section-pad py-14 sm:py-20">
        <div className="container-max">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow">Player Dashboard</span>
              <h1 className="mt-4 text-4xl sm:text-5xl">Welcome, {userName}.</h1>
              <p className="mt-2 text-ink-soft">Your trial awaits.</p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {/* Overall progress + next challenge */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              <div className="rounded-2xl border border-ivory-line bg-white p-8">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-wide text-ink-faint">
                    Overall Progress
                  </span>
                  <span className="font-display text-2xl text-kingdom-green">{progressPercent}%</span>
                </div>
                <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-ivory-deep">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-kingdom-green p-8 text-ivory">
                <span className="eyebrow text-gold-light">Active Trial</span>
                <h2 className="mt-3 text-2xl text-ivory">Continue Your Quest</h2>
                <p className="mt-1.5 text-sm text-ivory/70">Solve challenges to advance through the trial.</p>
                <Button href="/chapters" variant="primary" className="mt-6 !bg-gold !text-kingdom-green hover:!bg-gold-light" withArrow>
                  Continue Trial
                </Button>
              </div>

              <div className="rounded-2xl border border-ivory-line bg-white p-8">
                <h3 className="text-lg">Chapters</h3>
                <ul className="mt-5 flex flex-col gap-4">
                  {dashboardChapters.map((chapter) => (
                    <li
                      key={chapter.chapter_number}
                      className="flex items-center justify-between gap-4 border-b border-ivory-line pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        {chapter.status === "completed" ? (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-kingdom-green" />
                        ) : chapter.status === "locked" ? (
                          <Lock className="h-5 w-5 shrink-0 text-ink-faint" />
                        ) : (
                          <Circle className="h-5 w-5 shrink-0 text-gold" />
                        )}
                        <div>
                          <p className="font-medium text-ink">
                            Chapter {chapter.chapter_number}: {chapter.title}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-semibold uppercase tracking-wide ${
                          chapter.status === "completed"
                            ? "text-kingdom-green"
                            : chapter.status === "locked"
                            ? "text-ink-faint"
                            : "text-gold-dim"
                        }`}
                      >
                        {chapter.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar: profile + score */}
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border border-ivory-line bg-white p-8">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-ink-faint">
                  <Users className="h-4 w-4" /> Player Profile
                </div>
                <p className="mt-4 font-display text-2xl">{userName}</p>
                <p className="mt-1 text-sm text-ink-soft">{profile?.mobile_number || user.email}</p>
              </div>

              <div className="rounded-2xl border border-ivory-line bg-white p-8">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-ink-faint">
                  <Trophy className="h-4 w-4" /> Current Score
                </div>
                <p className="mt-4 font-display text-4xl text-kingdom-green">{currentScore}</p>
                <p className="text-xs text-ink-faint">points</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
