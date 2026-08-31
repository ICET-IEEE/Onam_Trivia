import { Sparkles } from "lucide-react";
import { Button } from "./Button";
import { createClient } from "@/lib/supabase/server";
import { AnimatedCountdownDemo } from "./animated-countdown-demo";

export async function Hero() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const beginHref = user ? "/chapters" : "/signup";

  return (
    <section className="relative overflow-hidden section-pad min-h-[calc(100dvh-5rem)] flex items-center justify-center py-10 md:py-20">
      <div className="container-max grid items-center gap-10 lg:gap-16 lg:grid-cols-2 w-full">
        <div className="animate-fade-up">
          <span className="eyebrow rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            Onam &bull; Mythology &bull; Puzzles
          </span>

          <h1 className="mt-7 font-display text-5xl leading-[1.05] text-ink sm:text-6xl lg:text-[4.2rem]">
            Maveli&rsquo;s Trial
          </h1>
          <p className="mt-3 font-display text-xl italic text-kingdom-green sm:text-2xl">
            A Mythology CTF
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
            Step into the legendary age of Mahabali. Solve riddles, uncover hidden
            clues, decode ancient disguises, and complete the Three Steps.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href={beginHref} variant="primary" withArrow>
              Begin the Trial
            </Button>
            <Button href="/#how-it-works" variant="secondary">
              Explore the Game
            </Button>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-md items-center justify-center lg:max-w-none mt-8 md:mt-0">
          <AnimatedCountdownDemo />
        </div>
      </div>

      {/* faint decorative baseline */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
}
