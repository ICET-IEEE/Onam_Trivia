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
          router.push(`/chapters/${chapterNumber}`);
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
          router.push(`/chapters/${chapterNumber}`);
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
    <div className="mt-12 pt-8 border-t border-ink/10">
      <label className="block text-sm font-bold text-ink mb-3 uppercase tracking-wider">
        Submit Answer
      </label>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input 
          type="text" 
          placeholder="Enter the flag..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={loading || result === "correct"}
          className="flex-1 rounded-xl border border-ivory-line bg-ivory/50 px-5 py-4 text-ink focus:border-gold focus:bg-white focus:outline-none transition-colors disabled:opacity-50"
        />
        <button 
          type="submit"
          disabled={loading || result === "correct"}
          className="bg-gold hover:bg-gold-deep text-white px-8 py-4 rounded-xl font-medium transition-colors whitespace-nowrap disabled:opacity-50"
        >
          {loading ? "Checking..." : "Submit Flag"}
        </button>
      </form>
      
      {message && (
        <div className={`mt-4 p-4 rounded-lg text-sm font-medium ${
          result === "correct" 
            ? "bg-kingdom-green/10 text-kingdom-green" 
            : result === "incorrect"
            ? "bg-rust/10 text-rust"
            : "bg-ink/5 text-ink-soft"
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}