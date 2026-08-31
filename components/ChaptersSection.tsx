import { createClient } from "@/lib/supabase/server";
import { ChapterCard } from "./ChapterCard";
import { Reveal } from "./Reveal";

export async function ChaptersSection() {
  const supabase = await createClient();
  const { data: chapters } = await supabase.from('chapters').select('*').order('chapter_number', { ascending: true });
  const safeChapters = chapters || [];

  return (
    <section className="section-pad bg-ivory-deep/50 py-24 sm:py-28" id="how-it-works">
      <div className="container-max">
        <Reveal>
          <div className="mb-12 max-w-2xl">
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl mb-4">
              FIRST TO COMPLETE. FIRST TO CLAIM.
            </h2>
            <p className="text-ink-soft leading-relaxed sm:whitespace-nowrap">
              The prize will be awarded to the first 2 participants who successfully complete all challenges.
            </p>
            <p>
              Some clues won't be found here. Check the{" "}
              <a
                href="https://www.instagram.com/ieee.icet/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-kingdom-green  decoration-gold hover:text-gold transition-colors"
              >
                @ieee.icet
              </a>{" "}
              Instagram stories for hidden hints and additional intel.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {safeChapters.length > 0 ? (
            safeChapters.map((chapter, i) => (
              <Reveal key={chapter.chapter_number} delay={i * 100}>
                <ChapterCard chapter={chapter} />
              </Reveal>
            ))
          ) : (
            <div className="col-span-2 text-center py-16">
              <p className="text-ink-soft text-lg">No chapters have been created yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
