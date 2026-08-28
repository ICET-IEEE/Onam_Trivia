import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChallengeManagerClient } from "./ChallengeManagerClient";

export default async function AdminChapterChallengesPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect("/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/admin");
  }

  // Fetch Chapter
  const { data: chapter } = await supabase
    .from("chapters")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!chapter) {
    notFound();
  }

  // Fetch Challenges for this chapter
  const { data: challenges } = await supabase
    .from("challenges")
    .select("*")
    .eq("chapter_id", chapter.id)
    .order("order_number", { ascending: true });

  return (
    <ChallengeManagerClient 
      chapter={chapter} 
      initialChallenges={challenges || []} 
    />
  );
}
