"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { AuthShell, FormField } from "@/components/AuthShell";
import { Button } from "@/components/Button";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!mobileNumber.trim()) {
      setError("Please enter your mobile number.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,

      options: {
        data: {
          full_name: fullName.trim(),
          mobile_number: mobileNumber.trim(),
        },

        // emailRedirectTo: `${window.location.origin}/auth/confirm?next=/dashboard`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess("Account created successfully!");

    setTimeout(() => {
      router.push("/");
    }, 2000);
  }

  return (
    <AuthShell
      title="Enter the Trial."
      subtitle="Create an account to begin your ascent."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold text-kingdom-green hover:text-gold-dim"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSignUp} className="flex flex-col gap-2.5">
        <FormField
          label="Full Name"
          type="text"
          placeholder="Your name"
          autoComplete="name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
        />

        <FormField
          label="Email"
          type="email"
          placeholder="you@kingdom.com"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <FormField
          label="Mobile Number"
          type="tel"
          placeholder="+91 98765 43210"
          autoComplete="tel"
          value={mobileNumber}
          onChange={(event) => setMobileNumber(event.target.value)}
        />

        <FormField
          label="Password"
          type="password"
          placeholder="Create a password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <FormField
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />

        {error && (
          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {success && (
          <p className="mt-2 text-sm text-kingdom-green">
            {success}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          className="mt-2 w-full"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create Your Account"}
        </Button>
      </form>
    </AuthShell>
  );
}
