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
    .select("id, full_name, role, mobile_number, college_id, created_at");

  const { data: colleges } = await supabase
    .from("colleges")
    .select("id, name");

  const { data: solves } = await supabase
    .from("user_solves")
    .select("user_id, challenge_id, points_awarded");

  const { data: challenges } = await supabase
    .from("challenges")
    .select("id, chapter_id")
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
          collegeId: p.college_id,
          createdAt: p.created_at,
        };
      }
    });
  }

  if (solves) {
    solves.forEach((s) => {
      if (usersProgressMap[s.user_id]) {
        usersProgressMap[s.user_id].score += s.points_awarded || 0;
        usersProgressMap[s.user_id].solvedSet.add(s.challenge_id);
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
      collegeName: userCollege ? userCollege.name : null,
      createdAt: u.createdAt,
    };
  }).sort((a, b) => b.score - a.score);

  return <AdminDashboardClient initialChapters={chapters || []} initialUsersProgress={usersProgress} />;
}
