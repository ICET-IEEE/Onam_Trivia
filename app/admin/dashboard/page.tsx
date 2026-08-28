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

  return <AdminDashboardClient initialChapters={chapters || []} />;
}
