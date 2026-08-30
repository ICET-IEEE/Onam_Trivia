import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminDashboardClient } from "./AdminDashboardClient";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/admin");
  }

  const { data: chapters } = await supabase
    .from("chapters")
    .select("*")
    .order("chapter_number", { ascending: true });

  // Fetch all profiles (exclude admins if you want, or just get everyone)
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, role, mobile_number, email, college_id, created_at");

  const { data: colleges } = await supabase
    .from("colleges")
    .select("id, name");

  const { data: solves } = await supabase
    .from("user_solves")
    .select("user_id, challenge_id, points_awarded, solved_at");

  const { data: challenges } = await supabase
    .from("challenges")
    .select("id, chapter_id, title, order_number")
    .eq("is_published", true);

  const totalChallenges = challenges ? challenges.length : 0;
  const totalChapters = chapters ? chapters.length : 0;

  // Group challenges by chapter
  const challengesByChapter: Record<string, string[]> = {};
  if (challenges) {
    challenges.forEach((c) => {
      if (!challengesByChapter[c.chapter_id]) challengesByChapter[c.chapter_id] = [];
      challengesByChapter[c.chapter_id].push(c.id);
    });
  }

  const usersProgressMap: Record<string, any> = {};

  if (profiles) {
    profiles.forEach((p) => {
      if (p.role !== "admin") {
        usersProgressMap[p.id] = {
          userId: p.id,
          name: (p.full_name && p.full_name !== "Challenger") ? p.full_name : "Player",
          score: 0,
          solvedSet: new Set<string>(),
          mobileNumber: p.mobile_number,
          email: p.email,
          collegeId: p.college_id,
          createdAt: p.created_at,
          latestSolveTime: 0,
        };
      }
    });
  }

  if (solves) {
    solves.forEach((s) => {
      if (usersProgressMap[s.user_id]) {
        usersProgressMap[s.user_id].score += s.points_awarded || 0;
        usersProgressMap[s.user_id].solvedSet.add(s.challenge_id);
        const time = new Date(s.solved_at).getTime();
        if (time > usersProgressMap[s.user_id].latestSolveTime) {
          usersProgressMap[s.user_id].latestSolveTime = time;
        }
      }
    });
  }

  const usersProgress = Object.values(usersProgressMap).map((u) => {
    let chaptersCompleted = 0;
    if (chapters) {
      chapters.forEach((ch) => {
        const chapterChalls = challengesByChapter[ch.id] || [];
        if (chapterChalls.length > 0) {
          const allSolved = chapterChalls.every((cId) => u.solvedSet.has(cId));
          if (allSolved) chaptersCompleted++;
        }
      });
    }

    const userCollege = colleges?.find((c) => c.id === u.collegeId);

    return {
      userId: u.userId,
      name: u.name,
      score: u.score,
      challengesSolved: u.solvedSet.size,
      totalChallenges,
      chaptersCompleted,
      totalChapters,
      mobileNumber: u.mobileNumber,
      email: u.email,
      collegeName: userCollege ? userCollege.name : null,
      createdAt: u.createdAt,
      latestSolveTime: u.latestSolveTime,
    };
  }).sort((a, b) => b.score - a.score);

  const firstSolvers: any[] = [];
  if (challenges && solves && profiles && chapters) {
    challenges.forEach((c) => {
      const challengeSolves = solves.filter(s => s.challenge_id === c.id);
      const chapter = chapters.find(ch => ch.id === c.chapter_id);
      const chapterNumber = chapter ? chapter.chapter_number : "?";
      
      if (challengeSolves.length > 0) {
        challengeSolves.sort((a, b) => new Date(a.solved_at).getTime() - new Date(b.solved_at).getTime());
        const firstSolve = challengeSolves[0];
        const user = profiles.find(p => p.id === firstSolve.user_id);
        
        const solvers = challengeSolves.map(s => {
          const solverProfile = profiles.find(p => p.id === s.user_id);
          const solverCollege = solverProfile && solverProfile.college_id ? colleges?.find(c => c.id === solverProfile.college_id) : null;
          return {
            userName: (solverProfile && solverProfile.full_name && solverProfile.full_name !== "Challenger") ? solverProfile.full_name : "Player",
            collegeName: solverCollege ? solverCollege.name : null,
            solvedAt: s.solved_at
          };
        });

        firstSolvers.push({
          challengeId: c.id,
          challengeTitle: c.title,
          chapterNumber,
          orderNumber: c.order_number,
          userName: (user && user.full_name && user.full_name !== "Challenger") ? user.full_name : "Player",
          solvedAt: firstSolve.solved_at,
          solvers
        });
      } else {
        firstSolvers.push({
          challengeId: c.id,
          challengeTitle: c.title,
          chapterNumber,
          orderNumber: c.order_number,
          userName: null,
          solvedAt: null,
          solvers: []
        });
      }
    });
  }

  // Sort firstSolvers by chapter number and then by challenge order_number
  firstSolvers.sort((a, b) => {
    const numA = parseInt(a.chapterNumber) || 0;
    const numB = parseInt(b.chapterNumber) || 0;
    if (numA !== numB) return numA - numB;
    const orderA = a.orderNumber || 0;
    const orderB = b.orderNumber || 0;
    if (orderA !== orderB) return orderA - orderB;
    return a.challengeTitle.localeCompare(b.challengeTitle);
  });

  return <AdminDashboardClient initialChapters={chapters || []} initialUsersProgress={usersProgress} initialFirstSolvers={firstSolvers} />;
}
