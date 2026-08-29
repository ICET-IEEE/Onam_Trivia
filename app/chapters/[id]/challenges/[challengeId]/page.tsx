import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChallengeImage } from "@/components/ChallengeImage";
import { AnswerSubmission } from "@/components/AnswerSubmission";
import {
  Star,
  Zap,
  Flame,
  Crown,
  BookOpen,
  Shield,
  Lightbulb,
  Music,
  Trophy,
} from "lucide-react";

const difficultyConfig: Record<string, { label: string; icon: React.ElementType }> = {
  easy:   { label: "Easy",   icon: Star  },
  medium: { label: "Medium", icon: Zap   },
  hard:   { label: "Hard",   icon: Flame },
  expert: { label: "Expert", icon: Crown },
};

const typeConfig: Record<string, { label: string; icon: React.ElementType }> = {
  text:   { label: "Text",   icon: BookOpen },
  image:  { label: "Image",  icon: Shield   },
  audio:  { label: "Audio",  icon: Music    },
  trivia: { label: "Trivia", icon: Trophy   },
  cipher: { label: "Cipher", icon: Zap      },
};

export default async function ChallengeDetailPage({
  params,
}: {
  params: { id: string; challengeId: string };
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Authentication check must happen before any database queries
  if (!user) {
    redirect("/signin");
  }

  // Fetch chapter
  const { data: chapter } = await supabase
    .from("chapters")
    .select("*")
    .eq("chapter_number", params.id)
    .single();

  if (!chapter || chapter.status === "locked" || !chapter.is_published) {
    notFound();
  }

  // Fetch challenge (RLS prevents viewing unpublished challenges)
  const { data: challenge } = await supabase
    .from("challenges")
    .select(
      "id, title, description, question, type, difficulty, points, image_url, audio_url, hint, order_number"
    )
    .eq("id", params.challengeId)
    .eq("chapter_id", chapter.id)
    .single();

  if (!challenge) {
    notFound();
  }

  const diffKey = (challenge.difficulty || "easy").toLowerCase();
  const diff = difficultyConfig[diffKey] || difficultyConfig.easy;
  const DiffIcon = diff.icon;

  const typeKey = (challenge.type || "text").toLowerCase().replace(/[_\s]/g, "");
  const typeEntry = typeConfig[typeKey] || typeConfig.text;
  const TypeIcon = typeEntry.icon;

  const challengeNum = String(challenge.order_number).padStart(2, "0");

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-ivory">
        {/* ── Immersive Hero Banner ── */}
        <div className="relative bg-kingdom-green overflow-hidden pt-28 pb-16">
          {/* Decorative rings */}
          <div
            className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full border border-gold/10 opacity-60 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full border border-gold/10 opacity-40 pointer-events-none"
            aria-hidden="true"
          />
          {/* Gold radial glow */}
          <div
            className="absolute bottom-0 left-1/4 w-96 h-48 bg-gold/5 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="container-max section-pad relative z-10">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5 animate-fade-up">
              <span className="text-xs font-bold tracking-[0.2em] text-gold uppercase">
                Challenge {challengeNum}
              </span>
              <div className="w-1 h-1 rounded-full bg-ivory/30" />
              <span className="text-xs font-bold tracking-[0.2em] text-ivory/50 uppercase">
                {chapter.title}
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-white leading-tight max-w-3xl mb-8 animate-fade-up"
              style={{ animationDelay: "80ms" }}
            >
              {challenge.title}
            </h1>

            {/* Badge row */}
            <div
              className="flex flex-wrap gap-3 animate-fade-up"
              style={{ animationDelay: "160ms" }}
            >
              {/* Difficulty */}
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/15 text-ivory/80">
                <DiffIcon className="w-3.5 h-3.5" />
                {diff.label}
              </span>

              {/* Type */}
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/15 text-ivory/80">
                <TypeIcon className="w-3.5 h-3.5" />
                {typeEntry.label}
              </span>

              {/* Points */}
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gold/15 border border-gold/30 text-gold">
                <Trophy className="w-3.5 h-3.5" />
                {challenge.points} Points
              </span>
            </div>
          </div>
        </div>

        {/* ── Main Content ── */}
        <main className="container-max section-pad py-14 sm:py-20">
          <div className="max-w-3xl mx-auto space-y-6">


            {/* Challenge Question Card */}
            <div
              className="bg-white rounded-2xl border border-gold/20 shadow-sm overflow-hidden animate-fade-up"
              style={{ animationDelay: "80ms" }}
            >
              {/* Card header */}
              <div className="px-6 sm:px-10 py-5 border-b border-ivory-line bg-ivory-deep/40 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-kingdom-green/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-kingdom-green" />
                </div>
                <h2 className="text-sm font-bold tracking-widest uppercase text-ink-soft">
                  The Challenge
                </h2>
              </div>

              <div className="px-6 sm:px-10 py-8 sm:py-10 space-y-8">
                {/* Question text */}
                {challenge.question && (
                  <p className="text-ink text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-medium">
                    {challenge.question}
                  </p>
                )}

                {/* Image */}
                {challenge.image_url && (
                  <div className="rounded-xl overflow-hidden border border-ivory-line shadow-sm">
                    <ChallengeImage imageUrl={challenge.image_url} title={challenge.title} />
                  </div>
                )}

                {/* Audio */}
                {challenge.audio_url && (
                  <div className="rounded-xl overflow-hidden border border-ivory-line bg-ivory-deep/30">
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-ivory-line">
                      <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                        <Music className="w-4 h-4 text-gold" />
                      </div>
                      <span className="text-sm font-semibold text-ink-soft uppercase tracking-wider">
                        Audio Clue
                      </span>
                    </div>
                    <div className="p-5">
                      <audio controls className="w-full accent-kingdom-green">
                        <source src={challenge.audio_url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </div>
                )}

                {/* Hint */}
                {challenge.hint && (
                  <div className="flex gap-4 p-5 bg-gold/5 border border-gold/20 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Lightbulb className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold tracking-widest text-gold uppercase mb-1.5">
                        Hint
                      </h4>
                      <p className="text-ink-soft text-sm leading-relaxed">
                        {challenge.hint}
                      </p>
                    </div>
                  </div>
                )}

                {/* Answer Submission */}
                <AnswerSubmission
                  challengeId={challenge.id}
                  points={challenge.points}
                  chapterNumber={params.id}
                />
              </div>
            </div>

          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
