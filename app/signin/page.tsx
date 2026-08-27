import Link from "next/link";
import { AuthShell, FormField } from "@/components/AuthShell";
import { Button } from "@/components/Button";

export default function SignInPage() {
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
      <form className="flex flex-col gap-5">
        <FormField label="Email" type="email" placeholder="you@kingdom.com" autoComplete="email" />
        <FormField
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
        />

        <div className="flex justify-end">
          <Link href="#" className="text-xs font-medium text-ink-soft hover:text-kingdom-green">
            Forgot password?
          </Link>
        </div>

        <Button variant="primary" className="mt-1 w-full">
          Enter the Kingdom
        </Button>
      </form>
    </AuthShell>
  );
}
