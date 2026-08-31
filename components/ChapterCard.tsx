import Link from "next/link";
import { Lock, Crown, Eye, Layers, Flame } from "lucide-react";
import { Chapter } from "@/lib/types";

interface ChapterCardProps {
  chapter: Chapter;
}

const iconMap: Record<string, React.ElementType> = {
  "01": Crown,
  "02": Eye,
  "03": Layers,
  "04": Flame,
};

export function ChapterCard({ chapter }: ChapterCardProps) {
  const isLocked = chapter.status === "locked";
  const numStr = String(chapter.chapter_number).padStart(2, '0');
  const Icon = iconMap[numStr] || Crown;

  const cardContent = (
    <div 
      className={`group relative overflow-hidden p-6 md:p-8 rounded-xl border transition-all duration-300 h-full ${
        isLocked 
          ? "bg-ivory-deep/40 border-ivory-line opacity-90" 
          : "bg-white border-gold/40 shadow-sm hover:shadow-[0_8px_30px_-12px_rgba(184,137,43,0.3)] hover:-translate-y-1"
      }`}
    >
      <div className="flex justify-between items-start mb-5 relative z-10">
        <span className="text-xs font-bold tracking-[0.2em] text-rust uppercase mt-2">
          Chapter {numStr}
        </span>
        
        {isLocked ? (
          <div className="w-10 h-10 rounded-full bg-ink/5 flex items-center justify-center text-ink-faint">
            <Lock className="w-4 h-4" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className={`text-2xl md:text-[28px] font-display font-bold mb-3 tracking-tight ${isLocked ? "text-ink-soft/70" : "text-ink"}`}>
          {chapter.title}
        </h3>
        
        <p className={`text-sm leading-relaxed mb-8 ${isLocked ? "text-ink-soft/60" : "text-ink-soft"}`}>
          {chapter.description}
        </p>

        <div className="flex flex-col gap-3 pt-5 border-t border-ink/5">
          <div className="flex justify-end items-center gap-2 text-xs">
            <span className="font-semibold text-ink-faint uppercase tracking-wider">Level:</span>
            <span className={`font-medium ${isLocked ? "text-ink-soft/60" : "text-kingdom-green"}`}>
              {chapter.difficulty || "Normal"}
            </span>
          </div>
        </div>
      </div>
      
      {/* Decorative watermark */}
      <div className={`absolute -bottom-6 -right-6 pointer-events-none transform -rotate-12 transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110 ${isLocked ? "text-ink/[0.03]" : "text-gold/[0.04]"}`}>
        <Icon className="w-40 h-40" />
      </div>
    </div>
  );

  if (isLocked) {
    return cardContent;
  }

  return (
    <Link href={`/chapters/${chapter.chapter_number}`} className="block h-full">
      {cardContent}
    </Link>
  );
}
