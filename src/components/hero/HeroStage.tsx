"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BRAND } from "@/lib/brand";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function HeroStage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);
  const acronymRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          pin: stageRef.current,
          anticipatePin: 1,
        },
      });

      // Initial state
      gsap.set(artworkRef.current, {
        scale: 0.55,
        opacity: 0.7,
        y: 20,
        filter: "blur(2px)",
      });
      gsap.set(acronymRef.current, {
        opacity: 0,
        y: 25,
        scale: 0.9,
      });
      gsap.set(titleRef.current, {
        opacity: 0,
        y: 40,
        scale: 0.95,
      });
      gsap.set(taglineRef.current, {
        opacity: 0,
        y: 20,
      });
      gsap.set(scrollCueRef.current, {
        opacity: 1,
      });

      // Choreographed Timeline Sequence
      // 0 -> 20%: Artwork scales forward, increases sharpness and perspective
      tl.to(
        artworkRef.current,
        {
          scale: 1,
          opacity: 1,
          y: -10,
          filter: "blur(0px)",
          ease: "power2.out",
          duration: 2,
        },
        0
      )
        // Scroll prompt fades out early
        .to(
          scrollCueRef.current,
          {
            opacity: 0,
            duration: 0.8,
          },
          0.2
        )
        // 20 -> 45%: C&C acronym reveals
        .to(
          acronymRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power2.out",
            duration: 1.5,
          },
          1.2
        )
        // 40 -> 75%: Artwork adjusts, CHALLENGES & CHAMPIONSHIPS title enters
        .to(
          artworkRef.current,
          {
            scale: 0.85,
            y: -50,
            opacity: 0.9,
            duration: 2,
            ease: "power1.inOut",
          },
          2.5
        )
        .to(
          acronymRef.current,
          {
            opacity: 0.4,
            y: -10,
            duration: 1.5,
          },
          2.7
        )
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power2.out",
            duration: 2,
          },
          2.8
        )
        // 70 -> 90%: Tagline settles
        .to(
          taglineRef.current,
          {
            opacity: 1,
            y: 0,
            ease: "power2.out",
            duration: 1.5,
          },
          4
        )
        // 90 -> 100%: Subtle transition towards Flagship section
        .to(
          [titleRef.current, taglineRef.current, artworkRef.current, acronymRef.current],
          {
            opacity: 0.15,
            y: -30,
            duration: 1.5,
            ease: "power1.in",
          },
          5.5
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[240vh] bg-[#07090e] text-white"
      aria-label="Cinematic Brand Introduction"
    >
      <div
        ref={stageRef}
        className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden px-6"
      >
        {/* Subtle Atmospheric Lighting */}
        <div
          className="glow-atmosphere w-[600px] h-[600px] bg-blue-900/30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        />
        <div
          className="glow-atmosphere w-[450px] h-[450px] bg-indigo-950/40 top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2"
          aria-hidden="true"
        />

        {/* Hero Composition Stage */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-5xl mx-auto">
          {/* Official C&C Artwork */}
          <div
            ref={artworkRef}
            className="relative mb-6 will-change-transform flex items-center justify-center"
          >
            <BrandLogo variant="hero" priority />
          </div>

          {/* Acronym: C&C */}
          <div
            ref={acronymRef}
            className="font-mono text-sm md:text-base font-medium tracking-[0.4em] uppercase text-blue-400 mb-2 will-change-transform"
          >
            {BRAND.shortName}
          </div>

          {/* Full Brand Title: CHALLENGES & CHAMPIONSHIPS */}
          <div ref={titleRef} className="will-change-transform">
            <h1 className="font-sans text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-neutral-100 leading-[0.95] uppercase">
              CHALLENGES
              <span className="block font-serif italic text-2xl sm:text-4xl md:text-6xl text-blue-400/80 my-1 md:my-2 font-normal">
                &
              </span>
              CHAMPIONSHIPS
            </h1>
          </div>

          {/* Tagline */}
          <div
            ref={taglineRef}
            className="mt-6 sm:mt-8 flex items-center gap-3 will-change-transform"
          >
            <span className="w-8 sm:w-12 h-[1px] bg-white/20" aria-hidden="true" />
            <p className="font-mono text-xs sm:text-sm tracking-[0.25em] text-neutral-300 uppercase">
              {BRAND.tagline}
            </p>
            <span className="w-8 sm:w-12 h-[1px] bg-white/20" aria-hidden="true" />
          </div>
        </div>

        {/* Scroll Indicator Prompt */}
        <div
          ref={scrollCueRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-neutral-400">
            SCROLL TO EXPLORE
          </span>
          <div className="w-1 h-5 rounded-full bg-white/10 overflow-hidden">
            <div className="w-full h-2 bg-blue-400/70 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
