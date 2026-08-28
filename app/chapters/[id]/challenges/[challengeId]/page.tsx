import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default async function ChallengeDetailPage({ 
  params 
}: { 
  params: { id: string, challengeId: string } 
}) {
  const supabase = await createClient();

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
    .select('id, title, description, question, type, difficulty, points, image_url, hint, order_number')
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
                  <p className="whitespace-pre-wrap">{challenge.question}</p>
                </div>

                {challenge.image_url && (
                  <div className="mt-8 rounded-xl overflow-hidden border border-ivory-line shadow-sm">
                    <p className="text-xs text-red-500 p-2 break-all">DEBUG URL: {challenge.image_url}</p>
                    <img 
                      src={challenge.image_url} 
                      alt={challenge.title}
                      className="w-full h-auto max-h-[500px] object-contain bg-ivory-deep/30"
                    />
                  </div>
                )}

                {challenge.hint && (
                  <div className="mt-8 p-6 bg-gold/5 border border-gold/20 rounded-xl">
                    <h4 className="text-sm font-bold tracking-wider text-gold uppercase mb-2">Hint</h4>
                    <p className="text-ink-soft">{challenge.hint}</p>
                  </div>
                )}

                <div className="mt-12 pt-8 border-t border-ink/10">
                  <label className="block text-sm font-bold text-ink mb-3 uppercase tracking-wider">
                    Submit Answer
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input 
                      type="text" 
                      placeholder="Enter the flag..."
                      className="flex-1 rounded-xl border border-ivory-line bg-ivory/50 px-5 py-4 text-ink focus:border-gold focus:bg-white focus:outline-none transition-colors"
                    />
                    <button className="bg-gold hover:bg-gold-deep text-white px-8 py-4 rounded-xl font-medium transition-colors whitespace-nowrap">
                      Submit Flag
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
