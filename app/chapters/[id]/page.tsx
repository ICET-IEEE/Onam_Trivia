import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Crown, Eye, Layers, Flame, Lock } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  "01": Crown,
  "02": Eye,
  "03": Layers,
  "04": Flame,
};

export default async function ChapterPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  const { data: chapter } = await supabase
    .from('chapters')
    .select('*')
    .eq('chapter_number', params.id)
    .single();
  
  if (!chapter) {
    notFound();
  }

  const { data: challengesData } = await supabase
    .from('challenges')
    .select('*')
    .eq('chapter_id', chapter.id)
    .order('created_at', { ascending: true });

  const challenges = challengesData || [];

  const isLocked = chapter.status === "locked";
  const numStr = String(chapter.chapter_number).padStart(2, '0');
  const Icon = iconMap[numStr] || Crown;

  return (
    <>
      <Navbar />
      <main className="section-pad py-14 sm:py-20 min-h-[80vh]">
        <div className="container-max">
          <div className="max-w-3xl mx-auto">
            <span className="eyebrow">Chapter {numStr}</span>
            <h1 className="mt-4 text-4xl sm:text-6xl font-display font-bold text-ink">
              {chapter.title}
            </h1>
            <div className="flex items-center gap-4 mt-6 text-sm text-ink-soft">
              <span className="font-semibold text-kingdom-green">{chapter.difficulty || "Normal"}</span>
              <span>•</span>
              <span>{chapter.type || "Lore"}</span>
              <span>•</span>
              <span>{challenges.length} Challenges</span>
            </div>

            <div className="mt-12 bg-white rounded-2xl p-8 sm:p-12 border border-gold/20 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                {isLocked ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-full bg-ink/5 flex items-center justify-center text-ink-faint mb-6">
                      <Lock className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-ink mb-3">Chapter Locked</h2>
                    <p className="text-ink-soft max-w-md mx-auto">
                      You must complete the previous chapters to unlock {chapter.title}.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-display font-bold text-ink mb-6">Overview</h2>
                    <p className="text-lg text-ink-soft leading-relaxed mb-8">
                      {chapter.description}
                    </p>
                    
                    <div className="mt-8 pt-8 border-t border-ink/10">
                      <h3 className="text-xl font-display font-bold text-ink mb-6">Challenges</h3>
                      {/* This is a placeholder for actual challenges */}
                      <div className="space-y-4">
                        {challenges.map((challenge, i) => (
                          <div key={challenge.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-ink/10 bg-ivory-deep/30 gap-4">
                            <div>
                              <span className="font-medium text-ink block">{challenge.title}</span>
                              <span className="text-sm text-ink-soft">{challenge.description}</span>
                            </div>
                            <div className="flex items-center gap-4 shrink-0">
                              <span className="text-sm font-semibold text-kingdom-green">{challenge.points} pts</span>
                              <Link 
                                href={`/chapters/${params.id}/challenges/${challenge.id}`}
                                className="text-sm font-semibold text-rust hover:text-rust-deep transition-colors"
                              >
                                Start Challenge
                              </Link>
                            </div>
                          </div>
                        ))}
                        {challenges.length === 0 && (
                          <p className="text-ink-soft text-sm">No challenges available yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Decorative watermark */}
              <div className="absolute -bottom-10 -right-10 pointer-events-none transform -rotate-12 opacity-5">
                <Icon className="w-64 h-64 text-gold" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
