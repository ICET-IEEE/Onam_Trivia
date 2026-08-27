import { Lock, CheckCircle2, ArrowUpRight } from "lucide-react";
import { Chapter } from "@/lib/types";

export function ChapterCard({ chapter }: { chapter: Chapter }) {
  const isLocked = chapter.status === "locked";
  const isCompleted = chapter.status === "completed";

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border p-8 transition-all duration-300 ${
        isLocked
          ? "border-ivory-line bg-ivory-deep/40"
          : "border-gold/30 bg-white shadow-[0_18px_44px_-30px_rgba(18,58,44,0.4)] hover:-translate-y-1 hover:border-gold"
      }`}
    >
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full ${
          isLocked ? "bg-ink/[0.02]" : "bg-gold/[0.08]"
        }`}
      />

      <div className="relative">
        <div className="flex items-center justify-between">
          <span
            className={`font-display text-4xl ${
              isLocked ? "text-ink-faint" : "text-kingdom-green"
            }`}
          >
            {chapter.number}
          </span>
          {isCompleted ? (
            <span className="flex items-center gap-1.5 rounded-full bg-kingdom-green-pale px-3 py-1 text-xs font-semibold text-kingdom-green">
              <CheckCircle2 className="h-3.5 w-3.5" /> Completed
            </span>
          ) : isLocked ? (
            <span className="flex items-center gap-1.5 rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold text-ink-faint">
              <Lock className="h-3.5 w-3.5" /> Locked
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-dim">
              Available
            </span>
          )}
        </div>

        <h3 className={`mt-5 text-2xl ${isLocked ? "text-ink-soft" : "text-ink"}`}>
          {chapter.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          {chapter.description}
        </p>

        <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs">
          <div className="flex items-center gap-1.5">
            <dt className="font-semibold uppercase tracking-wide text-ink-faint">
              Difficulty
            </dt>
            <dd className="text-ink-soft">{chapter.difficulty}</dd>
          </div>
          <div className="flex items-center gap-1.5">
            <dt className="font-semibold uppercase tracking-wide text-ink-faint">
              Type
            </dt>
            <dd className="text-ink-soft">{chapter.type}</dd>
          </div>
        </dl>
      </div>

      {!isLocked && (
        <div className="relative mt-8 flex items-center gap-1.5 text-sm font-semibold text-kingdom-green">
          Enter chapter
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      )}
    </div>
  );
}
