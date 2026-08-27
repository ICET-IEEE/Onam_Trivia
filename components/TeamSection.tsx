import { teamSkills } from "@/lib/data";
import { Reveal } from "./Reveal";

export function TeamSection() {
  return (
    <section className="section-pad bg-kingdom-green py-24 text-ivory sm:py-28">
      <div className="container-max">
        <Reveal>
          <div className="max-w-2xl">
            <span className="eyebrow text-gold-light">Assemble Your Team</span>
            <h2 className="mt-4 text-4xl text-ivory sm:text-5xl">
              Bring Your Skills. Bring Your People.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ivory/75">
              You don&rsquo;t need to be a coder to enter the kingdom. Teams of
              2&ndash;4 players take on the trial together &mdash; mythology
              lovers, puzzle solvers, developers, designers, observant
              thinkers, and curious minds all have a step to take.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {teamSkills.map((skill, i) => (
            <Reveal key={skill.label} delay={i * 100}>
              <div className="flex h-full flex-col items-center rounded-2xl border border-ivory/10 bg-ivory/[0.04] p-6 text-center transition-colors hover:border-gold/40 hover:bg-ivory/[0.07]">
                <span className="text-3xl">{skill.emoji}</span>
                <span className="mt-4 font-display text-lg text-ivory">{skill.label}</span>
                <span className="mt-1.5 text-xs leading-relaxed text-ivory/60">
                  {skill.description}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
