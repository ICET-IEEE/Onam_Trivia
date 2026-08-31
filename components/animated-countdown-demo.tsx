"use client";

import { AnimatedCountdown } from "@/components/ui/animated-countdown";

export function AnimatedCountdownDemo() {
  const target = new Date("2026-09-02T19:00:00");

  return (
    <div className="flex min-h-[320px] w-full items-center justify-center p-6">
      <AnimatedCountdown targetDate={target} variant="modern" size="lg" />
    </div>
  );
}
