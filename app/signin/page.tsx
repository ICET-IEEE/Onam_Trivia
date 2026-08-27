"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { AuthShell, FormField } from "@/components/AuthShell";
import { Button } from "@/components/Button";
import { createClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/");
  }

  return (
    <AuthShell
      title="Welcome Back, Challenger."
      subtitle="The kingdom remembers those who return."
      footer={
        <>
          Don&rsquo;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-kingdom-green hover:text-gold-dim">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSignIn} className="flex flex-col gap-5">
        <FormField 
          label="Email" 
          type="email" 
          placeholder="you@kingdom.com" 
          autoComplete="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormField
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-end">
          <Link href="#" className="text-xs font-medium text-ink-soft hover:text-kingdom-green">
            Forgot password?
          </Link>
        </div>
        
        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" className="mt-1 w-full" disabled={loading}>
          {loading ? "Entering..." : "Enter the Kingdom"}
        </Button>
      </form>
    </AuthShell>
  );
}
