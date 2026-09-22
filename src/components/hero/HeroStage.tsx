"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { HeroAtmosphere } from "./HeroAtmosphere";
import { HeroDebris } from "./HeroDebris";
import { HeroHud } from "./HeroHud";
import { PARALLAX_DEPTH } from "./hero-config";

/** GSAP wants layout effects; SSR wants none. */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * HERO — "THE SEAM"
 *
 * The brand is a duality, so the stage is too: a void on the left (the
 * challenge) meeting a blown-out key light on the right (the championship).
 * The brand artwork stands exactly on the seam, in front of a monumental
 * headline it partially eclipses, with machined debris suspended across three
 * focal planes around it.
 *
 * Three motion systems run on it:
 *   1. a choreographed entrance,
 *   2. continuous pointer parallax weighted by depth,
 *   3. a pinned scroll sequence that pushes the camera in and blows the
 *      composition out into light as the next section arrives.
 */
export function HeroStage() {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<HTMLDivElement>(null);
  const atmosphereRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const ampersandRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        pinned: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { motion, pinned, reduced } = context.conditions as {
          motion: boolean;
          pinned: boolean;
          reduced: boolean;
        };

        const shards = gsap.utils.toArray<HTMLElement>("[data-shard]");
        const planes = {
          far: stageRef.current?.querySelector<HTMLElement>('[data-debris-plane="far"]'),
          mid: stageRef.current?.querySelector<HTMLElement>('[data-debris-plane="mid"]'),
          near: stageRef.current?.querySelector<HTMLElement>('[data-debris-plane="near"]'),
        };

        if (reduced) {
          // Honour the preference completely: show the finished composition.
          gsap.set(
            [
              atmosphereRef.current,
              eyebrowRef.current,
              subjectRef.current,
              ctaRef.current,
              hudRef.current,
              ...shards,
            ],
            { opacity: 1, clearProps: "transform" }
          );
          gsap.set([line1Ref.current, line2Ref.current], { yPercent: 0 });
          return;
        }

        if (!motion) return;

        /* ---------------------------------------------------------------
           1. Entrance — the rig powers up, then the subject resolves.
           ------------------------------------------------------------- */
        gsap.set(atmosphereRef.current, { opacity: 0, scale: 1.18 });
        gsap.set(eyebrowRef.current, { opacity: 0, y: 18 });
        gsap.set([line1Ref.current, line2Ref.current], { yPercent: 118 });
        gsap.set(ampersandRef.current, { opacity: 0, scale: 0.45, rotate: -18 });
        gsap.set(ctaRef.current, { opacity: 0, y: 26 });
        gsap.set(hudRef.current, { opacity: 0 });
        gsap.set(shards, { opacity: 0, scale: 0.35 });

        const intro = gsap.timeline({
          defaults: { ease: "power3.out" },
          delay: 0.1,
        });

        intro
          .to(atmosphereRef.current, {
            opacity: 1,
            scale: 1,
            duration: 2.1,
            ease: "power2.out",
          })
          .to(
            [line1Ref.current, line2Ref.current],
            { yPercent: 0, duration: 1.5, stagger: 0.12, ease: "expo.out" },
            0.32
          )
          .to(
            shards,
            {
              opacity: 1,
              scale: 1,
              duration: 1.6,
              ease: "power2.out",
              stagger: { each: 0.045, from: "random" },
            },
            0.72
          )
          .to(
            ampersandRef.current,
            {
              opacity: 1,
              scale: 1,
              rotate: 0,
              duration: 1.1,
              ease: "back.out(2.2)",
            },
            1.15
          )
          .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 1.2 }, 1.25)
          .to(ctaRef.current, { opacity: 1, y: 0, duration: 1.2 }, 1.45)
          .to(hudRef.current, { opacity: 1, duration: 1.4 }, 1.5);

        /* ---------------------------------------------------------------
           2. Idle drift — nothing in a vacuum sits perfectly still.
           ------------------------------------------------------------- */
        shards.forEach((shard) => {
          const drift = Number(shard.dataset.drift ?? 10);
          const travel = Number(shard.dataset.travel ?? 30);
          const delay = Number(shard.dataset.delay ?? 0);

          gsap.to(shard, {
            y: travel,
            x: travel * 0.35,
            rotation: travel * 0.12,
            duration: drift,
            delay,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });

        /* ---------------------------------------------------------------
           3. Pointer parallax — depth-weighted, interpolated, never snappy.
           ------------------------------------------------------------- */
        const parallax = [
          { el: atmosphereRef.current, depth: PARALLAX_DEPTH.atmosphere },
          { el: line1Ref.current?.parentElement ?? null, depth: PARALLAX_DEPTH.headline },
          { el: line2Ref.current?.parentElement ?? null, depth: PARALLAX_DEPTH.headline * 1.15 },
          { el: hudRef.current, depth: PARALLAX_DEPTH.hud },
          { el: planes.far ?? null, depth: 8 },
          { el: planes.mid ?? null, depth: 24 },
          { el: planes.near ?? null, depth: 58 },
        ].filter((layer): layer is { el: HTMLElement; depth: number } =>
          Boolean(layer.el)
        );

        const movers = parallax.map(({ el, depth }) => ({
          depth,
          x: gsap.quickTo(el, "x", { duration: 1.1, ease: "power3" }),
          y: gsap.quickTo(el, "y", { duration: 1.1, ease: "power3" }),
        }));

        const camera = {
          rotY: gsap.quickTo(cameraRef.current, "rotationY", {
            duration: 1.4,
            ease: "power3",
          }),
          rotX: gsap.quickTo(cameraRef.current, "rotationX", {
            duration: 1.4,
            ease: "power3",
          }),
        };

        const handlePointer = (event: PointerEvent) => {
          const nx = (event.clientX / window.innerWidth - 0.5) * 2;
          const ny = (event.clientY / window.innerHeight - 0.5) * 2;

          movers.forEach(({ depth, x, y }) => {
            x(-nx * depth);
            y(-ny * depth * 0.6);
          });

          camera.rotY(nx * 1.7);
          camera.rotX(-ny * 1.1);
        };

        if (pinned) {
          window.addEventListener("pointermove", handlePointer, { passive: true });
        }

        /* ---------------------------------------------------------------
           4. Scroll — the camera pushes in, the type parts around the
              subject, and the key light blows the frame out to white.
           ------------------------------------------------------------- */
        if (pinned) {
          const exit = gsap.timeline({
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              pin: stageRef.current,
              anticipatePin: 1,
            },
            defaults: { ease: "none" },
          });

          exit
            // UI elements fade out early
            .to(eyebrowRef.current, { opacity: 0, y: -50, duration: 0.2 }, 0)
            .to(ctaRef.current, { opacity: 0, y: 70, duration: 0.25 }, 0)
            .to(hudRef.current, { opacity: 0, duration: 0.25 }, 0)
            // Type parts around the subject like a curtain
            .to(line1Ref.current, { xPercent: -35, duration: 0.5 }, 0)
            .to(line2Ref.current, { xPercent: 35, duration: 0.5 }, 0)
            .to(
              [line1Ref.current, line2Ref.current],
              { opacity: 0, duration: 0.35 },
              0.35
            )
            // Debris streaks past the lens
            .to(planes.near ?? {}, { scale: 2.1, opacity: 0, duration: 0.8 }, 0.2)
            .to(planes.mid ?? {}, { scale: 1.45, opacity: 0, duration: 0.8 }, 0.2)
            .to(planes.far ?? {}, { scale: 1.15, opacity: 0, duration: 0.8 }, 0.2)
            // Key light bloom transitions
            .to(
              atmosphereRef.current,
              { scale: 1.6, duration: 0.8 },
              0.2
            )
            .to(atmosphereRef.current, { opacity: 0, duration: 0.4 }, 0.6);
        }

        return () => {
          window.removeEventListener("pointermove", handlePointer);
        };
      },
      stageRef
    );

    // Layout settles only once the display face and artwork have landed.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const refreshTimer = window.setTimeout(refresh, 900);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(refreshTimer);
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[180vh] md:h-[220vh]"
      aria-label={`${BRAND.name} — cinematic introduction`}
    >
      <div
        ref={stageRef}
        className="hero-stage relative h-screen w-full overflow-hidden"
      >
        {/* ---- 00 · lighting rig ------------------------------------- */}
        <HeroAtmosphere ref={atmosphereRef} />

        <div
          ref={cameraRef}
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* ---- 01 · far debris ------------------------------------- */}
          <HeroDebris plane="far" className="z-[10]" />

          {/* ---- 02 · monumental headline ---------------------------- */}
          <div className="absolute inset-x-0 top-[26vh] z-[20] md:top-[27vh]">
            <h1 className="hero-display sr-only">{BRAND.name}</h1>
            <div aria-hidden="true" className="px-[3vw]">
              <span className="hero-line-mask">
                <span
                  ref={line1Ref}
                  className="hero-display block whitespace-nowrap will-change-transform"
                  style={{ fontSize: "min(16.6vw, 25vh)" }}
                >
                  <span className="hero-display-fill">CHALLENGES</span>
                  <span ref={ampersandRef} className="hero-amp">
                    &amp;
                  </span>
                </span>
              </span>

              <span className="hero-line-mask">
                <span
                  ref={line2Ref}
                  className="hero-display hero-display-fill block whitespace-nowrap will-change-transform"
                  style={{ fontSize: "min(14.6vw, 22vh)" }}
                >
                  CHAMPIONSHIPS
                </span>
              </span>
            </div>
          </div>

          {/* ---- 03 · mid debris (between type and subject) ---------- */}
          <HeroDebris plane="mid" className="z-[30]" />

          {/* ---- 04 · near debris (foreground, out of focus) --------- */}
          <HeroDebris plane="near" className="z-[50]" />
        </div>

        {/* ---- 06 · eyebrow ------------------------------------------ */}
        <div
          ref={eyebrowRef}
          className="absolute inset-x-0 top-[17vh] z-[60] flex justify-center px-6 md:top-[18vh]"
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="h-[1px] w-6 bg-white/25 sm:w-12" />
            <p className="font-mono text-[9px] tracking-[0.3em] text-neutral-400 sm:text-[11px] sm:tracking-[0.42em]">
              {BRAND.tagline}
            </p>
            <span className="h-[1px] w-6 bg-white/25 sm:w-12" />
          </div>
        </div>

        {/* ---- 07 · calls to action ---------------------------------- */}
        <div
          ref={ctaRef}
          className="absolute inset-x-0 bottom-[6vh] z-[60] flex flex-col items-center gap-5 px-6 sm:flex-row sm:justify-center sm:gap-7"
        >
          <Link href={BRAND.routes.events} className="hero-cta group">
            <span>EXPLORE CHAMPIONSHIPS</span>
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>

          <Link href={BRAND.routes.about} className="hero-cta-ghost group">
            <span>THE MANIFESTO</span>
            <span
              className="block h-[1px] w-5 bg-current transition-all duration-300 group-hover:w-8"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* ---- 07 · telemetry chrome --------------------------------- */}
        <HeroHud ref={hudRef} />
      </div>
    </section>
  );
}
