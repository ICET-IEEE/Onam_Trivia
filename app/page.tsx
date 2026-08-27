import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { IntroSection } from "@/components/IntroSection";
import { ChaptersSection } from "@/components/ChaptersSection";
import { ThreeSteps } from "@/components/ThreeSteps";
import { TeamSection } from "@/components/TeamSection";
import { LeaderboardPreview } from "@/components/LeaderboardPreview";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <IntroSection />
        <ChaptersSection />
        <ThreeSteps />
        {/*<TeamSection /> */}
        <LeaderboardPreview />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
