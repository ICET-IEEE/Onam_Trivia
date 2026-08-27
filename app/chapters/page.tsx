import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChapterCard } from "@/components/ChapterCard";
import { chapters } from "@/lib/data";

export default function ChaptersPage() {
  return (
    <>
      <Navbar />
      <main className="section-pad py-14 sm:py-20">
        <div className="container-max">
          <span className="eyebrow">The Trial</span>
          <h1 className="mt-4 text-4xl sm:text-5xl">All Chapters</h1>
          <p className="mt-2 max-w-lg text-ink-soft">
            Four chapters stand between you and the final revelation. Complete
            each to unlock the next.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {chapters.map((chapter) => (
              <div key={chapter.number} className="flex flex-col gap-3">
                <ChapterCard chapter={chapter} />
                <div className="flex items-center justify-between px-2 text-xs text-ink-faint">
                  <span>{chapter.challenges} challenges</span>
                  <span>{chapter.progress}% complete</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
