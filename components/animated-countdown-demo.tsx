"use client";

import { AnimatedCountdown } from "@/components/ui/animated-countdown";

export function AnimatedCountdownDemo() {
  const target = new Date("2026-09-02T19:00:00");

  return (
    <div className="flex flex-col min-h-[320px] w-full items-center justify-center p-6 gap-6">
      <h2 className="text-2xl md:text-4xl font-bold tracking-[0.2em] text-center uppercase text-ink">
        The hunt begins in
      </h2>
      <AnimatedCountdown targetDate={target} variant="modern" size="lg" />
    </div>
  );
}
