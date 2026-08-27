import { Search, Link as LinkIcon, Flag } from "lucide-react";
import { Reveal } from "./Reveal";

export function ThreeSteps() {
  const steps = [
    {
      number: "01",
      title: "Discover",
      description: "Find the hidden truth.",
      icon: Search,
    },
    {
      number: "02",
      title: "Decode",
      description: "Connect the clues.",
      icon: LinkIcon,
    },
    {
      number: "03",
      title: "Ascend",
      description: "Complete the trial.",
      icon: Flag,
    },
  ];

  return (
    <section className="section-pad py-24 sm:py-32 bg-kingdom-green text-ivory relative overflow-hidden">
      {/* Decorative large numbers in background */}
      <div className="absolute inset-0 flex justify-between items-center opacity-5 pointer-events-none font-display font-extrabold text-[30vw] leading-none overflow-hidden select-none">
        <span className="-ml-12">1</span>
        <span>2</span>
        <span className="-mr-12">3</span>
      </div>

      <div className="container-max relative z-10">
        <Reveal className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-ivory mb-6">
            Three Steps. One Destiny.
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto" />
        </Reveal>

        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[4.5rem] left-[10%] right-[10%] h-[2px] bg-ivory/20" />
            
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Reveal 
                  key={step.number}
                  delay={index * 150}
                  className="flex-1 flex flex-col items-center text-center group"
                >
                  <div className={`
                    w-24 h-24 rounded-full bg-black/20 border-4 border-gold flex items-center justify-center mb-6 relative z-10 transition-transform duration-500 group-hover:scale-110 shadow-[0_0_30px_rgba(184,137,43,0.2)]
                    ${index === 1 ? 'md:-translate-y-4 group-hover:-translate-y-8' : ''}
                    ${index === 2 ? 'md:-translate-y-8 group-hover:-translate-y-12' : ''}
                  `}>
                    <Icon className="w-10 h-10 text-gold" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gold text-kingdom-green flex items-center justify-center font-bold text-sm">
                      {step.number}
                    </div>
                  </div>
                  
                  <div className={`transition-transform duration-500 ${index === 1 ? 'md:-translate-y-4' : ''} ${index === 2 ? 'md:-translate-y-8' : ''}`}>
                    <h3 className="text-2xl font-display font-bold mb-2">{step.title}</h3>
                    <p className="text-ivory/70">{step.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
