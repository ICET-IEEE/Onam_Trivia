"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell, FormField } from "@/components/AuthShell";
import { Button } from "@/components/Button";
import { createClient } from "@/lib/supabase/client";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Invalid admin credentials.");
      setLoading(false);
      return;
    }

    // Check role
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile?.role === "admin") {
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      await supabase.auth.signOut();
      setError("You do not have administrator access.");
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Admin Panel"
      subtitle="Sign in to manage the trial."
      footer={<></>}
    >
      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        {error && (
          <div className="rounded-lg bg-rust/10 p-3 text-sm font-medium text-rust">
            {error}
          </div>
        )}
        <FormField
          label="Admin ID"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="admin@example.com"
        />
        <FormField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Authenticating..." : "Enter Admin Panel"}
        </Button>
      </form>
    </AuthShell>
  );
}
