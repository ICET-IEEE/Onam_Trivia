"use client";

import { useState, useEffect } from "react";
import { AnimatedCountdown } from "@/components/ui/animated-countdown";
import { Insignia } from "@/components/Insignia";

const target = new Date("2026-09-02T19:00:00");

export function AnimatedCountdownDemo() {
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    if (Date.now() >= target.getTime()) {
      setIsEnded(true);
    }
  }, []);

  return (
    <div className="flex flex-col md:min-h-[320px] w-full items-center justify-center p-0 md:p-6 gap-6">
      {isEnded ? (
        <Insignia className="w-64 max-w-[80vw] h-auto text-gold animate-float" />
      ) : (
        <AnimatedCountdown 
          targetDate={target} 
          variant="modern" 
          size="lg" 
          onComplete={() => setIsEnded(true)}
        />
      )}
    </div>
  );
}
