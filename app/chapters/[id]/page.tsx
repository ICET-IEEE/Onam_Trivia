import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChallengeLink } from "@/components/ChallengeLink";
import { Crown, Eye, Layers, Flame, Lock, CheckCircle, ChevronRight, ShieldAlert } from "lucide-react";

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

  const { data: { user } } = await supabase.auth.getUser();
  let solvedChallengeIds: Set<string> = new Set();
  if (user) {
    const { data: userSolves } = await supabase
      .from('user_solves')
      .select('challenge_id')
      .eq('user_id', user.id);
    if (userSolves) {
      solvedChallengeIds = new Set(userSolves.map(s => s.challenge_id));
    }
  }

  const { data: challengesData } = await supabase
    .from('challenges')
    .select('*')
    .eq('chapter_id', chapter.id)
    .order('order_number', { ascending: true });

  const challenges = challengesData || [];

  const isLockedByStatus = chapter.status === "locked";
  let isPrevChapterCompleted = true;

  if (chapter.chapter_number > 1) {
    if (!user) {
      isPrevChapterCompleted = false;
    } else {
      const { data: prevChapter } = await supabase
        .from('chapters')
        .select('id')
        .eq('chapter_number', chapter.chapter_number - 1)
        .single();
        
      if (prevChapter) {
        const { data: prevChallenges } = await supabase
          .from('challenges')
          .select('id')
          .eq('chapter_id', prevChapter.id);
          
        if (prevChallenges && prevChallenges.length > 0) {
          isPrevChapterCompleted = prevChallenges.every(c => solvedChallengeIds.has(c.id));
        }
      }
    }
  }

  const isChapterUnlocked = !isLockedByStatus && isPrevChapterCompleted;

  const numStr = String(chapter.chapter_number).padStart(2, '0');
  const Icon = iconMap[numStr] || Crown;
  
  const totalPoints = challenges.reduce((acc, curr) => acc + (curr.points || 0), 0);
  const solvedCount = challenges.filter(c => solvedChallengeIds.has(c.id)).length;

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Dynamic Hero Header */}
        <div className="relative pt-32 pb-20 overflow-hidden bg-kingdom-green text-ivory">
          {/* Subtle spinning background watermark */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/3 opacity-10 pointer-events-none">
            <Icon className="w-[500px] h-[500px] animate-spin-slow text-gold" />
          </div>
          
          <div className="container-max px-6 xl:px-0 relative z-10 animate-fade-up">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-bold tracking-[0.2em] text-gold uppercase">
                Chapter {numStr}
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
              <span className={`text-sm font-bold tracking-widest uppercase ${
                chapter.difficulty === 'Hard' ? 'text-rust-light' : 'text-kingdom-green-pale'
              }`}>
                {chapter.difficulty || "Normal"}
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white mb-4 sm:mb-6 leading-tight">
              {chapter.title}
            </h1>
            
            <p className="text-lg text-ivory/80 max-w-2xl leading-relaxed mb-10">
              {chapter.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border border-white/20">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                <span className="font-medium text-xs sm:text-base">{challenges.length} Challenges</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border border-white/20">
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                <span className="font-medium text-xs sm:text-base">{totalPoints} Points Total</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border border-white/20">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-kingdom-green-pale" />
                <span className="font-medium text-xs sm:text-base">{solvedCount} / {challenges.length} Solved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container-max px-6 xl:px-0 py-16 sm:py-24 relative">
          
          {isLockedByStatus ? (
            <div className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden border border-ink/5 shadow-xl bg-white">
              {/* Blurred background hinting at challenges */}
              <div className="absolute inset-0 opacity-40 blur-xl scale-105 select-none pointer-events-none" aria-hidden="true">
                <div className="p-12 space-y-8">
                   <div className="h-32 bg-ink/5 rounded-2xl"></div>
                   <div className="h-32 bg-ink/5 rounded-2xl"></div>
                   <div className="h-32 bg-ink/5 rounded-2xl"></div>
                </div>
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-white/60 backdrop-blur-md"></div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center py-24 sm:py-32 px-6 text-center animate-fade-up">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-rust/10 flex items-center justify-center text-rust mb-6 sm:mb-8 shadow-inner">
                  <ShieldAlert className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-ink mb-4">Chapter Locked</h2>
                <p className="text-lg sm:text-xl text-ink-soft max-w-lg mx-auto leading-relaxed">
                  This chapter is currently locked by the administrators.
                </p>
                <Link href="/" className="mt-8 sm:mt-10 inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-ink text-white rounded-full font-bold hover:bg-kingdom-green transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 text-sm sm:text-base">
                  Return to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {!isPrevChapterCompleted && (
                <div className="mb-12 bg-rust/5 border border-rust/20 rounded-2xl p-6 text-center animate-fade-up">
                  <div className="w-12 h-12 mx-auto bg-rust/10 rounded-full flex items-center justify-center text-rust mb-4">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-ink mb-2">Complete Previous Chapter</h3>
                  <p className="text-ink-soft">
                    You must complete all challenges in the previous chapter to unlock these trials.
                  </p>
                </div>
              )}
              
              <h2 className="text-3xl font-display font-bold text-ink mb-12 flex items-center gap-4">
                The Path of Trials
                <div className="h-px flex-1 bg-gradient-to-r from-ink/10 to-transparent"></div>
              </h2>
              
              <div className="relative">
                {/* Vertical Line */}
                <div className="absolute top-8 bottom-8 left-6 sm:left-8 md:left-12 w-0.5 bg-ink/10"></div>
                
                <div className="space-y-6 sm:space-y-8 md:space-y-12">
                  {challenges.map((challenge, idx) => {
                    const isSolved = solvedChallengeIds.has(challenge.id);
                    const previousChallenge = idx > 0 ? challenges[idx - 1] : null;
                    const isUnlocked = isChapterUnlocked && (idx === 0 || (previousChallenge && solvedChallengeIds.has(previousChallenge.id)));
                    const isChallengeLocked = !isUnlocked;

                    return (
                      <div key={challenge.id} className="relative flex items-start gap-4 sm:gap-6 md:gap-10 group animate-fade-up" style={{ animationDelay: `${idx * 100}ms` }}>
                        
                        {/* Timeline Node */}
                        <div className="relative z-10 flex-shrink-0 mt-2 sm:mt-0">
                          <div className={`w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center border-4 shadow-sm transition-all duration-500 ${
                            isSolved 
                              ? "bg-kingdom-green border-kingdom-green-pale text-white shadow-kingdom-green/20" 
                              : isChallengeLocked
                              ? "bg-ink/5 border-ink/10 text-ink/30"
                              : "bg-white border-ivory-line text-ink-soft group-hover:border-gold/50 group-hover:text-gold"
                          }`}>
                            {isSolved ? (
                              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
                            ) : isChallengeLocked ? (
                              <Lock className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                            ) : (
                              <span className="font-display text-xl sm:text-2xl md:text-3xl font-bold">{idx + 1}</span>
                            )}
                          </div>
                        </div>

                        {/* Challenge Card */}
                        <div className={`flex-1 bg-white rounded-2xl p-5 sm:p-6 md:p-8 border shadow-sm transition-all duration-300 ${
                          isSolved ? "border-kingdom-green/30 bg-gradient-to-br from-white to-kingdom-green-pale/20 group-hover:-translate-y-1 group-hover:shadow-[0_8px_30px_-12px_rgba(184,137,43,0.2)]" 
                          : isChallengeLocked ? "border-ink/5 opacity-60 grayscale filter"
                          : "border-ink/5 group-hover:-translate-y-1 group-hover:shadow-[0_8px_30px_-12px_rgba(184,137,43,0.2)]"
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-3 mb-2 sm:mb-3">
                                <h3 className={`text-lg sm:text-xl md:text-2xl font-display font-bold text-ink transition-colors ${!isChallengeLocked && "group-hover:text-gold"}`}>
                                  {isChallengeLocked ? `Challenge ${idx + 1}` : challenge.title}
                                </h3>
                                {isSolved && (
                                  <span className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-kingdom-green/10 text-kingdom-green">
                                    Solved ✓
                                  </span>
                                )}
                              </div>
                              <p className="text-sm sm:text-base text-ink-soft leading-relaxed max-w-xl">
                                {isChallengeLocked 
                                  ? (!isPrevChapterCompleted ? "Complete the previous chapter to reveal this trial." : "Complete the previous challenge to reveal this trial.") 
                                  : challenge.description}
                              </p>
                            </div>
                            
                            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 shrink-0 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-ink/5 w-full sm:w-auto">
                              <span className="text-base sm:text-lg font-bold text-rust">{challenge.points} <span className="text-xs sm:text-sm font-normal text-ink-soft">pts</span></span>
                              {isChallengeLocked ? (
                                <button disabled className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold bg-ink/10 text-ink/40 cursor-not-allowed">
                                  Locked
                                  <Lock className="w-4 h-4" />
                                </button>
                              ) : (
                                <ChallengeLink 
                                  challengeId={challenge.id}
                                  chapterId={params.id}
                                  className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                                    isSolved 
                                      ? "bg-kingdom-green-pale text-kingdom-green hover:bg-kingdom-green hover:text-white" 
                                      : "bg-ink text-white hover:bg-kingdom-green hover:shadow-lg"
                                  }`}
                                >
                                  {isSolved ? "Review" : "Start"}
                                  <ChevronRight className="w-4 h-4" />
                                </ChallengeLink>
                              )}
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                  
                  {challenges.length === 0 && (
                    <div className="ml-16 sm:ml-24 md:ml-36 bg-ivory-deep rounded-2xl p-6 md:p-8 border border-ink/5 text-ink-soft text-center animate-fade-up text-sm sm:text-base">
                      No challenges have been revealed on this path yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
