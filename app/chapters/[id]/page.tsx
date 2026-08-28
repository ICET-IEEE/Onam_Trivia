import { notFound } from "next/navigation";
import { chapters } from "@/lib/data";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Crown, Eye, Layers, Flame, Lock } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  "01": Crown,
  "02": Eye,
  "03": Layers,
  "04": Flame,
};

export default function ChapterPage({ params }: { params: { id: string } }) {
  const chapter = chapters.find((c) => c.number === params.id);

  if (!chapter) {
    notFound();
  }

  const isLocked = chapter.status === "locked";
  const Icon = iconMap[chapter.number] || Crown;

  return (
    <>
      <Navbar />
      <main className="section-pad py-14 sm:py-20 min-h-[80vh]">
        <div className="container-max">
          <div className="max-w-3xl mx-auto">
            <span className="eyebrow">Chapter {chapter.number}</span>
            <h1 className="mt-4 text-4xl sm:text-6xl font-display font-bold text-ink">
              {chapter.title}
            </h1>
            <div className="flex items-center gap-4 mt-6 text-sm text-ink-soft">
              <span className="font-semibold text-kingdom-green">{chapter.difficulty}</span>
              <span>•</span>
              <span>{chapter.type}</span>
              <span>•</span>
              <span>{chapter.challenges} Challenges</span>
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
                        {Array.from({ length: chapter.challenges }).map((_, i) => (
                          <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-ink/10 bg-ivory-deep/30">
                            <span className="font-medium text-ink">Challenge {i + 1}</span>
                            <button className="text-sm font-semibold text-rust hover:text-rust-deep transition-colors">
                              Start Challenge
                            </button>
                          </div>
                        ))}
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
