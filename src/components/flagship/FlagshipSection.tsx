"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FLAGSHIP_EVENTS } from "@/data/flagship-events";
import { Button } from "@/components/ui/Button";
import { clsx } from "clsx";

export function FlagshipSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // References for typography containers for each event
  const infoRefs = useRef<(HTMLDivElement | null)[]>([]);
  // References for image group containers for each event
  const imageGroupRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isMobile || prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const totalEvents = FLAGSHIP_EVENTS.length; // 4
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          pin: stageRef.current,
          anticipatePin: 1,
          onUpdate: (self) => {
            // Compute active index for progress display
            const progress = self.progress;
            const newIndex = Math.min(
              Math.floor(progress * totalEvents),
              totalEvents - 1
            );
            setActiveIndex(newIndex);
          },
        },
      });

      // Initial state: Set Event 0 as fully visible, others hidden
      FLAGSHIP_EVENTS.forEach((_, i) => {
        if (i === 0) {
          gsap.set(infoRefs.current[i], { opacity: 1, y: 0, pointerEvents: "auto" });
          gsap.set(imageGroupRefs.current[i], { opacity: 1, pointerEvents: "auto" });
        } else {
          gsap.set(infoRefs.current[i], { opacity: 0, y: 40, pointerEvents: "none" });
          gsap.set(imageGroupRefs.current[i], { opacity: 0, pointerEvents: "none" });
        }
      });

      // Sequence between events:
      // Event 0 -> Event 1 (Horizontal movement drift)
      // Duration per event segment = 3s
      // Event 0 Hold
      tl.to({}, { duration: 1 })
        // Transition 0 -> 1
        .to(
          infoRefs.current[0],
          { opacity: 0, y: -30, duration: 1, ease: "power2.in" },
          "+=0.2"
        )
        // Move images out horizontally
        .to(
          imageGroupRefs.current[0],
          { opacity: 0, x: -60, duration: 1.2, ease: "power2.inOut" },
          "<"
        )
        // Enter Event 1 info
        .fromTo(
          infoRefs.current[1],
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: "power2.out", pointerEvents: "auto" },
          "-=0.2"
        )
        // Enter Event 1 images from right
        .fromTo(
          imageGroupRefs.current[1],
          { opacity: 0, x: 80 },
          { opacity: 1, x: 0, duration: 1.2, ease: "power2.out", pointerEvents: "auto" },
          "<"
        )

        // Event 1 Hold
        .to({}, { duration: 1 })

        // Transition 1 -> 2 (Vertical / elevation depth movement)
        .to(
          infoRefs.current[1],
          { opacity: 0, y: -30, duration: 1, ease: "power2.in" },
          "+=0.2"
        )
        .to(
          imageGroupRefs.current[1],
          { opacity: 0, y: -70, scale: 0.94, duration: 1.2, ease: "power2.inOut" },
          "<"
        )
        // Enter Event 2 info
        .fromTo(
          infoRefs.current[2],
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: "power2.out", pointerEvents: "auto" },
          "-=0.2"
        )
        // Enter Event 2 images ascending from below
        .fromTo(
          imageGroupRefs.current[2],
          { opacity: 0, y: 70, scale: 1.05 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power2.out", pointerEvents: "auto" },
          "<"
        )

        // Event 2 Hold
        .to({}, { duration: 1 })

        // Transition 2 -> 3 (Scale & compositional movement)
        .to(
          infoRefs.current[2],
          { opacity: 0, y: -30, duration: 1, ease: "power2.in" },
          "+=0.2"
        )
        .to(
          imageGroupRefs.current[2],
          { opacity: 0, scale: 0.9, duration: 1.2, ease: "power2.inOut" },
          "<"
        )
        // Enter Event 3 info
        .fromTo(
          infoRefs.current[3],
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: "power2.out", pointerEvents: "auto" },
          "-=0.2"
        )
        // Enter Event 3 images expanding
        .fromTo(
          imageGroupRefs.current[3],
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out", pointerEvents: "auto" },
          "<"
        )

        // Event 3 Hold
        .to({}, { duration: 1 });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full md:h-[480vh] bg-[#07090e] text-white"
      aria-label="Flagship Events Experience"
    >
      {/* DESKTOP / TABLET PINNED CINEMATIC VIEWPORT */}
      <div
        ref={stageRef}
        className="hidden md:block sticky top-0 h-screen w-full overflow-hidden px-8 lg:px-16"
      >
        {/* Subtle Section Ambience */}
        <div
          className="glow-atmosphere w-[500px] h-[500px] bg-blue-950/20 top-1/4 right-1/4"
          aria-hidden="true"
        />

        {/* Global Flagship Header Bar */}
        <div className="absolute top-24 left-8 lg:left-16 right-8 lg:right-16 flex items-center justify-between border-b border-white/[0.08] pb-4 z-20">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-blue-400">
              FLAGSHIP EVENTS
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500/80" />
            <span className="font-mono text-[11px] tracking-widest text-neutral-400">
              2026 CALENDAR
            </span>
          </div>

          {/* Minimalist Progress Indicator: 01 / 04 */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-widest text-white font-medium">
              0{activeIndex + 1}
            </span>
            <div className="w-16 h-[1px] bg-white/20 relative overflow-hidden">
              <div
                className="h-full bg-blue-400 transition-all duration-300"
                style={{ width: `${((activeIndex + 1) / FLAGSHIP_EVENTS.length) * 100}%` }}
              />
            </div>
            <span className="font-mono text-xs tracking-widest text-neutral-400">
              0{FLAGSHIP_EVENTS.length}
            </span>
          </div>
        </div>

        {/* Main 40/60 Viewport Composition */}
        <div className="relative w-full h-full pt-36 pb-12 flex items-center">
          {/* LEFT 40%: Typography & Event Details (Stacked absolutely per event) */}
          <div className="relative w-full md:w-[42%] lg:w-[38%] h-[480px] z-20 pointer-events-none">
            {FLAGSHIP_EVENTS.map((event, idx) => (
              <div
                key={event.id}
                ref={(el) => {
                  infoRefs.current[idx] = el;
                }}
                className={clsx(
                  "absolute inset-0 flex flex-col justify-center will-change-transform",
                  idx === 0 ? "opacity-100 pointer-events-auto" : "opacity-0"
                )}
              >
                {/* Event Number & Category */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-mono text-xs font-semibold tracking-widest text-blue-400">
                    {event.number}
                  </span>
                  <span className="w-4 h-[1px] bg-white/20" />
                  <span className="font-mono text-[11px] tracking-[0.2em] text-neutral-400 uppercase">
                    {event.category}
                  </span>
                </div>

                {/* Event Title */}
                <h2 className="font-sans text-4xl lg:text-6xl xl:text-7xl font-light tracking-tight text-white uppercase leading-[0.95] mb-6">
                  {event.title}
                </h2>

                {/* Editorial Description */}
                <p className="font-sans text-sm lg:text-base text-neutral-400 leading-relaxed font-light mb-8 max-w-lg">
                  {event.description}
                </p>

                {/* Minimal Editorial CTA */}
                <div className="pointer-events-auto">
                  <Button href={event.href} variant="editorial">
                    EXPLORE EVENT
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT 60%: Art-directed Landscape Photography Composition */}
          <div className="relative w-full md:w-[58%] lg:w-[62%] h-[560px] ml-auto overflow-visible pointer-events-none">
            {FLAGSHIP_EVENTS.map((event, eventIdx) => (
              <div
                key={`gallery-${event.id}`}
                ref={(el) => {
                  imageGroupRefs.current[eventIdx] = el;
                }}
                className={clsx(
                  "absolute inset-0 will-change-transform",
                  eventIdx === 0 ? "opacity-100" : "opacity-0"
                )}
              >
                {event.images.map((img, imgIdx) => (
                  <div
                    key={img.src}
                    style={{
                      left: `${img.layout.x}%`,
                      top: `${img.layout.y}%`,
                      width: `${img.layout.width}%`,
                      zIndex: img.layout.zIndex || 1,
                      transform: `rotate(${img.layout.rotation || 0}deg)`,
                    }}
                    className="absolute aspect-[16/9] rounded-sm overflow-hidden border border-white/[0.12] bg-[#0d111b] shadow-2xl shadow-black/80 transition-transform duration-500 hover:scale-[1.02] pointer-events-auto"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 1200px) 50vw, 35vw"
                      className="object-cover"
                      priority={eventIdx === 0}
                    />
                    {/* Viewfinder corner label */}
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-[2px] border border-white/10 font-mono text-[9px] tracking-widest text-neutral-300 uppercase">
                      {img.caption || `PLATE 0${imgIdx + 1}`}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE ADAPTATION (< md): Clean vertical editorial layout */}
      <div className="md:hidden px-6 py-20 space-y-24">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <span className="font-mono text-xs tracking-[0.25em] text-blue-400 uppercase">
            FLAGSHIP EVENTS
          </span>
          <span className="font-mono text-xs tracking-widest text-neutral-400">
            04 TOTAL
          </span>
        </div>

        {FLAGSHIP_EVENTS.map((event) => (
          <article
            key={`mobile-${event.id}`}
            className="flex flex-col space-y-6 pt-4 border-t border-white/[0.06]"
          >
            {/* Meta & Title */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-blue-400">
                  {event.number}
                </span>
                <span className="w-3 h-[1px] bg-white/20" />
                <span className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase">
                  {event.category}
                </span>
              </div>
              <h2 className="font-sans text-3xl font-light tracking-tight text-white uppercase">
                {event.title}
              </h2>
            </div>

            {/* Primary Landscape Photograph */}
            <div className="relative aspect-[16/9] w-full rounded-sm overflow-hidden border border-white/10 bg-[#0d111b]">
              <Image
                src={event.images[0].src}
                alt={event.images[0].alt}
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md font-mono text-[9px] tracking-widest text-neutral-300">
                {event.images[0].caption}
              </div>
            </div>

            {/* Description */}
            <p className="font-sans text-sm text-neutral-400 leading-relaxed font-light">
              {event.description}
            </p>

            {/* Secondary Thumbnails */}
            <div className="grid grid-cols-2 gap-3">
              {event.images.slice(1).map((subImg) => (
                <div
                  key={subImg.src}
                  className="relative aspect-[16/9] w-full rounded-sm overflow-hidden border border-white/[0.08] bg-[#0d111b]"
                >
                  <Image
                    src={subImg.src}
                    alt={subImg.alt}
                    fill
                    sizes="50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Button href={event.href} variant="editorial" size="sm">
                EXPLORE EVENT
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
