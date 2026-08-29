"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { AuthShell, FormField } from "@/components/AuthShell";
import { CollegeCombobox } from "@/components/CollegeCombobox";
import { Button } from "@/components/Button";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const [collegeName, setCollegeName] = useState("");
  const [collegeId, setCollegeId] = useState<string | null>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    // =========================================================
    // 1. VALIDATION
    // =========================================================

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

    if (!collegeName.trim() || !collegeId) {
      setError(
        "Please select your college or add a new college."
      );
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // =======================================================
      // 2. CREATE SUPABASE AUTH ACCOUNT
      // =======================================================

      console.log("Creating Supabase Auth account...");

      const {
        data: signUpData,
        error: signUpError,
      } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            mobile_number: mobileNumber.trim(),
          },
        },
      });

      if (signUpError) {
        console.error(
          "AUTH SIGNUP ERROR:",
          signUpError
        );

        throw new Error(signUpError.message);
      }

      if (!signUpData.user) {
        throw new Error(
          "Account could not be created. Please try again."
        );
      }

      console.log(
        "Auth user created:",
        signUpData.user.id
      );

      // =======================================================
      // 3. CHECK ACTIVE SESSION
      // =======================================================

      const {
        data: sessionData,
      } = await supabase.auth.getSession();

      console.log(
        "Current session:",
        sessionData.session
      );

      /*
       * Since you currently do NOT want email verification,
       * the user should have an active session here.
       *
       * If this is null, check:
       *
       * Supabase
       * → Authentication
       * → Providers
       * → Email
       * → Confirm email = OFF
       */

      if (!sessionData.session) {
        throw new Error(
          "Account was created, but no active session is available. Please disable email confirmation in Supabase Authentication settings."
        );
      }

      // =======================================================
      // 4. FIND OR CREATE COLLEGE
      // =======================================================

      let finalCollegeId: string | null = null;

      // -------------------------------------------------------
      // Existing college selected
      // -------------------------------------------------------

      if (
        collegeId &&
        collegeId !== "NEW_COLLEGE"
      ) {
        console.log(
          "Using existing college:",
          collegeId
        );

        finalCollegeId = collegeId;
      }

      // -------------------------------------------------------
      // New college entered
      // -------------------------------------------------------

      else {
        const normalizedName = collegeName
          .trim()
          .toLowerCase()
          .replace(/\s+/g, " ");

        console.log(
          "Looking for college:",
          normalizedName
        );

        // First check if it already exists.
        const {
          data: existingCollege,
          error: existingCollegeError,
        } = await supabase
          .from("colleges")
          .select("id, name")
          .eq(
            "normalized_name",
            normalizedName
          )
          .maybeSingle();

        if (existingCollegeError) {
          console.error(
            "COLLEGE LOOKUP ERROR:",
            existingCollegeError
          );

          throw new Error(
            `Could not check college: ${existingCollegeError.message}`
          );
        }

        // -----------------------------------------------------
        // Existing college found
        // -----------------------------------------------------

        if (existingCollege) {
          console.log(
            "Existing college found:",
            existingCollege
          );

          finalCollegeId = existingCollege.id;
        }

        // -----------------------------------------------------
        // College does not exist → create it
        // -----------------------------------------------------

        else {
          console.log(
            "College does not exist. Creating..."
          );

          const {
            data: newCollege,
            error: newCollegeError,
          } = await supabase
            .from("colleges")
            .insert({
              name: collegeName.trim(),
              normalized_name: normalizedName,
              is_verified: false,
            })
            .select("id, name")
            .single();

          // ---------------------------------------------------
          // Unique constraint / race condition
          // ---------------------------------------------------

          if (
            newCollegeError?.code === "23505"
          ) {
            console.log(
              "College was created by another user. Finding it..."
            );

            const {
              data: duplicateCollege,
              error: duplicateError,
            } = await supabase
              .from("colleges")
              .select("id, name")
              .eq(
                "normalized_name",
                normalizedName
              )
              .single();

            if (duplicateError) {
              console.error(
                "DUPLICATE COLLEGE LOOKUP ERROR:",
                duplicateError
              );

              throw new Error(
                `Could not find existing college: ${duplicateError.message}`
              );
            }

            finalCollegeId =
              duplicateCollege.id;
          }

          // ---------------------------------------------------
          // Other database error
          // ---------------------------------------------------

          else if (newCollegeError) {
            console.error(
              "COLLEGE CREATE ERROR:",
              newCollegeError
            );

            throw new Error(
              `Could not create college: ${newCollegeError.message}`
            );
          }

          // ---------------------------------------------------
          // Successfully created
          // ---------------------------------------------------

          else if (newCollege) {
            console.log(
              "New college created:",
              newCollege
            );

            finalCollegeId = newCollege.id;
          }
        }
      }

      // =======================================================
      // 5. MAKE SURE WE HAVE A COLLEGE ID
      // =======================================================

      if (!finalCollegeId) {
        throw new Error(
          "Could not determine your college. Please try again."
        );
      }

      console.log(
        "FINAL COLLEGE ID:",
        finalCollegeId
      );

      // =======================================================
      // 6. CREATE / UPDATE PROFILE
      // =======================================================

      console.log(
        "Saving profile..."
      );

      const {
        error: profileError,
      } = await supabase
        .from("profiles")
        .upsert(
          {
            id: signUpData.user.id,
            full_name: fullName.trim(),
            mobile_number: mobileNumber.trim(),
            college_id: finalCollegeId,
            role: "player",
          },
          {
            onConflict: "id",
          }
        );

      if (profileError) {
        console.error(
          "PROFILE SAVE ERROR:",
          profileError
        );

        throw new Error(
          `Could not save profile: ${profileError.message}`
        );
      }

      console.log(
        "Profile saved successfully."
      );

      // =======================================================
      // 7. SUCCESS
      // =======================================================

      setSuccess(
        "Account created successfully!"
      );

      setLoading(false);

      setTimeout(() => {
        router.push("/");
      }, 1500);
    } catch (err) {
      console.error(
        "COMPLETE SIGNUP ERROR:",
        err
      );

      setLoading(false);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }
    }
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
      <form
        onSubmit={handleSignUp}
        className="flex flex-col gap-2.5"
      >
        {/* Full Name */}
        <FormField
          label="Full Name"
          type="text"
          placeholder="Your name"
          autoComplete="name"
          value={fullName}
          onChange={(event) =>
            setFullName(event.target.value)
          }
        />

        {/* Email */}
        <FormField
          label="Email"
          type="email"
          placeholder="you@kingdom.com"
          autoComplete="email"
          value={email}
          onChange={(event) =>
            setEmail(event.target.value)
          }
        />

        {/* Mobile */}
        <FormField
          label="Mobile Number"
          type="tel"
          placeholder="+91 98765 43210"
          autoComplete="tel"
          value={mobileNumber}
          onChange={(event) =>
            setMobileNumber(event.target.value)
          }
        />

        {/* College */}
        <CollegeCombobox
          value={collegeName}
          collegeId={collegeId}
          onChange={(name, id) => {
            setCollegeName(name);
            setCollegeId(id);
          }}
        />

        {/* Password */}
        <FormField
          label="Password"
          type="password"
          placeholder="Create a password"
          autoComplete="new-password"
          value={password}
          onChange={(event) =>
            setPassword(event.target.value)
          }
        />

        {/* Confirm Password */}
        <FormField
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) =>
            setConfirmPassword(
              event.target.value
            )
          }
        />

        {/* Error */}
        {error && (
          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Success */}
        {success && (
          <p className="mt-2 text-sm text-kingdom-green">
            {success}
          </p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="primary"
          className="mt-2 w-full"
          disabled={loading}
        >
          {loading
            ? "Creating Account..."
            : "Create Your Account"}
        </Button>
      </form>
    </AuthShell>
  );
}