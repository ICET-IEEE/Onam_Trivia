"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { hashFlag } from "@/lib/crypto";
import { normalizeAnswer } from "@/lib/normalization";

interface AnswerSubmissionProps {
  challengeId: string;
  points: number;
  chapterNumber: string;
}

export function AnswerSubmission({ challengeId, points, chapterNumber }: AnswerSubmissionProps) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const [message, setMessage] = useState("");
  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setMessage("");

    if (!answer.trim()) {
      setMessage("Please enter an answer.");
      setLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setMessage("You must be logged in to submit an answer.");
        setLoading(false);
        return;
      }

      // Ensure user profile exists in database with valid full_name
      const { data: existingProf } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .maybeSingle();

      const metaName = user.user_metadata?.full_name;
      const validProfileName = (existingProf?.full_name && existingProf.full_name !== 'Challenger') ? existingProf.full_name : null;
      const finalFullName = validProfileName || metaName || user.email?.split('@')[0] || 'Player';

      if (!existingProf || existingProf.full_name !== finalFullName) {
        await supabase.from('profiles').upsert({
          id: user.id,
          full_name: finalFullName,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });
      }

      // Check if user has already solved this challenge
      const { data: existingSolve } = await supabase
        .from('user_solves')
        .select('id')
        .eq('user_id', user.id)
        .eq('challenge_id', challengeId)
        .maybeSingle();

      if (existingSolve) {
        setResult("correct");
        setMessage("🎉 You have already solved this challenge! Redirecting back to challenges...");
        setAnswer("");
        setTimeout(() => {
          router.replace(`/chapters/${chapterNumber}`);
          router.refresh();
        }, 1500);
        setLoading(false);
        return;
      }

      // Normalize and hash the submitted answer
      const normalizedAnswer = normalizeAnswer(answer);
      const answerHash = await hashFlag(normalizedAnswer);

      // Fetch all accepted answer hashes for this challenge
      const { data: answers } = await supabase
        .from('challenge_answers')
        .select('answer_hash')
        .eq('challenge_id', challengeId);

      if (!answers || answers.length === 0) {
        setMessage("No valid answers configured for this challenge.");
        setLoading(false);
        return;
      }

      // Check if the submitted answer matches any of the accepted answers
      const isCorrect = answers.some(a => a.answer_hash === answerHash);

      if (isCorrect) {
        // Record solve and award points
        const { error: solveError } = await supabase
          .from('user_solves')
          .insert([{
            user_id: user.id,
            challenge_id: challengeId,
            points_awarded: points,
          }]);

        if (solveError) {
          console.error("Error storing solve:", solveError);
        }

        setResult("correct");
        setMessage(`🎉 Correct! You earned ${points} points! Redirecting back to challenges...`);
        setAnswer("");

        // Redirect back to challenges list page after 1.5s
        setTimeout(() => {
          router.replace(`/chapters/${chapterNumber}`);
          router.refresh();
        }, 1500);
      } else {
        setResult("incorrect");
        setMessage("❌ Incorrect. Try again!");
      }
    } catch (error) {
      console.error("Error checking answer:", error);
      setMessage("An error occurred. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="pt-8 border-t border-ivory-line">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-kingdom-green flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h10M4 14h6M4 18h4" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold tracking-widest text-ink-faint uppercase">Submit Your Answer</p>
          <p className="text-xs text-ink-faint mt-0.5">Enter the flag or answer you&apos;ve discovered</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative group">
          <input
            id="challenge-answer-input"
            type="text"
            placeholder="Enter the flag or answer…"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={loading || result === "correct"}
            className={`w-full rounded-xl border px-5 py-4 text-ink text-sm placeholder-ink-faint focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              result === "correct"
                ? "border-kingdom-green/40 bg-kingdom-green/5"
                : result === "incorrect"
                ? "border-rust/40 bg-rust/5 focus:border-rust/60"
                : "border-ivory-line bg-ivory/60 focus:border-gold focus:bg-white focus:shadow-[0_0_0_3px_rgba(184,137,43,0.08)]"
            }`}
          />
        </div>
        <button
          id="challenge-submit-btn"
          type="submit"
          disabled={loading || result === "correct"}
          className="bg-kingdom-green hover:bg-kingdom-green-light text-ivory font-semibold px-8 py-4 rounded-xl transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-px active:translate-y-0 text-sm"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
              </svg>
              Checking…
            </span>
          ) : (
            "Submit Flag"
          )}
        </button>
      </form>

      {/* Feedback */}
      {message && (
        <div
          className={`mt-4 flex items-start gap-3 p-4 rounded-xl text-sm font-medium transition-all ${
            result === "correct"
              ? "bg-kingdom-green/8 border border-kingdom-green/20 text-kingdom-green"
              : result === "incorrect"
              ? "bg-rust/8 border border-rust/20 text-rust"
              : "bg-ink/5 border border-ink/10 text-ink-soft"
          }`}
        >
          {result === "correct" ? (
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : result === "incorrect" ? (
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : null}
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}