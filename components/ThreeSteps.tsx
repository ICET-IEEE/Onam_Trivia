import { Reveal } from "./Reveal";

const steps = [
  { number: "01", title: "Discover", line: "Find the hidden truth.", height: "h-28" },
  { number: "02", title: "Decode", line: "Connect the clues.", height: "h-40" },
  { number: "03", title: "Ascend", line: "Complete the trial.", height: "h-52" },
];

export function ThreeSteps() {
  return (
    <section className="section-pad py-24 sm:py-32">
      <div className="container-max">
        <Reveal className="text-center">
          <span className="eyebrow justify-center">The Legend</span>
          <h2 className="mt-4 text-4xl sm:text-5xl">Three Steps. One Destiny.</h2>
        </Reveal>

        <div className="mt-20 flex flex-col items-center gap-10 sm:flex-row sm:items-end sm:justify-center sm:gap-6">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 150} className="flex w-full max-w-[220px] flex-col items-center">
              <div className="mb-5 text-center">
                <span className="font-display text-lg text-gold-dim">{step.number}</span>
                <h3 className="mt-1 text-2xl">{step.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{step.line}</p>
              </div>
              <div
                className={`w-full ${step.height} rounded-t-xl bg-gradient-to-b from-gold-light to-gold shadow-[0_20px_40px_-20px_rgba(184,137,43,0.55)] transition-transform duration-500 hover:-translate-y-1`}
              />
            </Reveal>
          ))}
        </div>

        <div className="mx-auto mt-2 h-3 max-w-3xl rounded-full bg-kingdom-green sm:h-4" />
      </div>
    </section>
  );
}
