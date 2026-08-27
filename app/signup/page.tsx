import Link from "next/link";
import { AuthShell, FormField } from "@/components/AuthShell";
import { Button } from "@/components/Button";

export default function SignUpPage() {
  return (
    <AuthShell
      title="Enter the Trial."
      subtitle="Create an account to begin your ascent."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-kingdom-green hover:text-gold-dim">
            Sign in
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-2.5">
        <FormField label="Full Name" type="text" placeholder="Your name" autoComplete="name" />
        <FormField label="Email" type="email" placeholder="you@kingdom.com" autoComplete="email" />
        <FormField label="Mobile Number" type="tel" placeholder="+91 98765 43210" autoComplete="tel"/>

        <FormField
          label="Password"
          type="password"
          placeholder="Create a password"
          autoComplete="new-password"
        />
        <FormField
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
        />

        <Button variant="primary" className="mt-2 w-full">
          Create Your Account
        </Button>
      </form>
    </AuthShell>
  );
}
