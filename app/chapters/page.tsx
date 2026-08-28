import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChapterCard } from "@/components/ChapterCard";
import { createClient } from "@/lib/supabase/server";

export default async function ChaptersPage() {
  const supabase = await createClient();

  const { data: chapters } = await supabase.from('chapters').select('*').order('chapter_number', { ascending: true });
  const safeChapters = chapters || [];
  
  return (
    <>
      <Navbar />
      <main className="section-pad pb-24 pt-32 sm:pt-40">
        <div className="container-max">
          <div className="inline-flex items-center gap-2 rounded-full border border-rust/20 bg-rust/5 px-3 py-1 mb-6">
            <span className="h-2 w-2 rounded-full bg-rust animate-pulse-slow"></span>
            <span className="text-xs font-bold tracking-[0.2em] text-rust uppercase">Trial Logs</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-ink mb-6 max-w-2xl">
            The King's Chronicles
          </h1>
          <p className="text-lg text-ink-soft max-w-xl leading-relaxed">
            Delve into the history and legends of Mahabali. These chapters hold the keys to understanding your quest and uncovering hidden clues.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {safeChapters.map((chapter) => (
              <div key={chapter.chapter_number} className="flex flex-col gap-3">
                <ChapterCard chapter={chapter} />
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
