import { HeroIntro } from "@/components/hero/HeroIntro";
import { HeroStage } from "@/components/hero/HeroStage";
import { FlagshipSection } from "@/components/flagship/FlagshipSection";
import { ExploreBridge } from "@/components/events/ExploreBridge";

export default function HomePage() {
  return (
    <main className="relative w-full bg-[#07090e] overflow-hidden">
      {/* 00 — F1 Car Intro: Right → Left sweep with title text */}
      <HeroIntro />

      {/* 01 — Cinematic Brand Introduction (scroll-driven) */}
      <HeroStage />

      {/* 02 — Flagship Experience (4 Flagships) */}
      <FlagshipSection />

      {/* 03 — Explore All Events Transition */}
      <ExploreBridge />
    </main>
  );
}
