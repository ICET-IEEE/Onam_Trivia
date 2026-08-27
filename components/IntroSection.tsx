import { ScrollText, Eye, PuzzleIcon } from "lucide-react";
import { features } from "@/lib/data";
import { Reveal } from "./Reveal";

const icons = {
  scroll: ScrollText,
  eye: Eye,
  puzzle: PuzzleIcon,
};

export function IntroSection() {
  return (
    <section className="section-pad py-24 sm:py-28" id="trial">
      <div className="container-max">
        <Reveal>
          <div className="max-w-2xl">
            <span className="eyebrow">The Premise</span>
            <h2 className="mt-4 text-4xl sm:text-5xl">The Kingdom Awaits.</h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              This is not a traditional coding CTF. Not every challenge needs a
              compiler. Some require memory. Some require observation. Some
              require you to see what others overlook. Players can take part
              regardless of technical background &mdash; the kingdom only asks
              for curiosity.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = icons[feature.icon];
            return (
              <Reveal key={feature.title} delay={i * 120}>
                <div className="group h-full rounded-2xl border border-ivory-line bg-ivory-deep/60 p-8 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_18px_40px_-24px_rgba(18,58,44,0.35)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-kingdom-green text-ivory">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 text-xl">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
