import { chapters } from "@/lib/data";
import { ChapterCard } from "./ChapterCard";
import { Reveal } from "./Reveal";

export function ChaptersSection() {
  return (
    <section className="section-pad bg-ivory-deep/50 py-24 sm:py-28" id="how-it-works">
      <div className="container-max">
        <Reveal>
          <div className="max-w-2xl">
            <span className="eyebrow">How the Trial Works</span>
            <h2 className="mt-4 text-4xl sm:text-5xl">Four Chapters. One Trial.</h2>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {chapters.map((chapter, i) => (
            <Reveal key={chapter.number} delay={i * 100}>
              <ChapterCard chapter={chapter} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
