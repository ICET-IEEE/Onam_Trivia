import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChallengeImage } from "@/components/ChallengeImage";
import { AnswerSubmission } from "@/components/AnswerSubmission";

export default async function ChallengeDetailPage({ 
  params 
}: { 
  params: { id: string, challengeId: string } 
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  // Authentication check must happen before any database queries
  if (!user) {
    redirect("/signin");
  }

  // Fetch chapter
  const { data: chapter } = await supabase
    .from('chapters')
    .select('*')
    .eq('chapter_number', params.id)
    .single();

  if (!chapter || chapter.status === "locked" || !chapter.is_published) {
    notFound();
  }

  // Fetch challenge (RLS prevents viewing unpublished challenges)
  const { data: challenge } = await supabase
    .from('challenges')
    .select('id, title, description, question, type, difficulty, points, image_url, audio_url, hint, order_number')
    .eq('id', params.challengeId)
    .eq('chapter_id', chapter.id)
    .single();

  if (!challenge) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="section-pad py-14 sm:py-20 min-h-[80vh]">
        <div className="container-max">
          <div className="max-w-3xl mx-auto">
            <Link 
              href={`/chapters/${params.id}`}
              className="text-sm font-medium text-ink-soft hover:text-ink transition-colors mb-6 inline-block"
            >
              &larr; Back to Chapter
            </Link>
            
            <div className="flex items-center gap-4 text-sm text-ink-soft mb-4">
              <span className="font-semibold text-rust">
                Challenge {String(challenge.order_number).padStart(2, '0')}
              </span>
              <span>•</span>
              <span className="font-semibold text-kingdom-green">{challenge.points} pts</span>
              <span>•</span>
              <span className="capitalize">{challenge.difficulty}</span>
              <span>•</span>
              <span className="capitalize">{challenge.type.replace('_', ' ')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-display font-bold text-ink">
              {challenge.title}
            </h1>

            <div className="mt-8 bg-white rounded-2xl p-8 sm:p-12 border border-gold/20 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                {challenge.description && (
                  <p className="text-lg text-ink-soft leading-relaxed mb-8 border-b border-ink/10 pb-8">
                    {challenge.description}
                  </p>
                )}

                <div className="prose prose-lg text-ink max-w-none">
                  <h2 className="text-2xl font-display font-bold text-ink mb-4">The Challenge</h2>
                  {challenge.question && <p className="whitespace-pre-wrap">{challenge.question}</p>}
                </div>

                {challenge.image_url && (
                  <ChallengeImage imageUrl={challenge.image_url} title={challenge.title} />
                )}

                {challenge.audio_url && (
                  <div className="mt-8 rounded-xl overflow-hidden border border-ivory-line shadow-sm">
                    <div className="p-4 bg-ivory-deep/30">
                      <audio controls className="w-full">
                        <source src={challenge.audio_url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </div>
                )}

                {challenge.hint && (
                  <div className="mt-8 p-6 bg-gold/5 border border-gold/20 rounded-xl">
                    <h4 className="text-sm font-bold tracking-wider text-gold uppercase mb-2">Hint</h4>
                    <p className="text-ink-soft">{challenge.hint}</p>
                  </div>
                )}

                <AnswerSubmission 
                  challengeId={challenge.id} 
                  points={challenge.points} 
                  chapterNumber={params.id} 
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
