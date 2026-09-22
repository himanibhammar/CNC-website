"use client";

import { forwardRef, useEffect, useState } from "react";
import { BRAND } from "@/lib/brand";

/**
 * Telemetry chrome framing the stage.
 *
 * The reference frames its hero inside a spare, instrument-like interface. Here
 * that becomes an engineering readout: corner brackets, a calibration rail and
 * a running clock. It is decorative and hidden from assistive tech — the real
 * content sits in the headline and the calls to action.
 */
export const HeroHud = forwardRef<HTMLDivElement>(function HeroHud(
  _props,
  ref
) {
  const clock = useStageClock();

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[70] hidden select-none md:block"
    >
      <CornerBrackets />

      {/* Top left — stage identity */}
      <div className="absolute left-8 top-9 flex items-center gap-3 lg:left-12">
        <span className="h-[5px] w-[5px] rounded-full bg-sky-400 shadow-[0_0_10px_2px_rgba(56,189,248,0.8)]" />
        <span className="font-mono text-[10px] tracking-[0.34em] text-neutral-400">
          STAGE 01
        </span>
        <span className="hidden h-[1px] w-10 bg-white/20 lg:block" />
        <span className="hidden font-mono text-[10px] tracking-[0.34em] text-neutral-600 lg:block">
          THE SEAM
        </span>
      </div>

      {/* Top right — running clock */}
      <div className="absolute right-8 top-9 flex items-center gap-3 lg:right-12">
        <span className="font-mono text-[10px] tracking-[0.34em] text-neutral-600">
          LIVE
        </span>
        <span className="h-[1px] w-10 bg-white/20" />
        <span className="font-mono text-[10px] tabular-nums tracking-[0.28em] text-neutral-400">
          {clock}
        </span>
      </div>

      {/* Left rail — calibration ticks */}
      <div className="absolute left-8 top-1/2 hidden -translate-y-1/2 flex-col items-start gap-[7px] lg:left-12 lg:flex">
        {Array.from({ length: 13 }).map((_, i) => (
          <span
            key={i}
            className="block h-[1px] bg-white/25"
            style={{
              width: i % 4 === 0 ? 18 : 8,
              opacity: i % 4 === 0 ? 0.75 : 0.3,
            }}
          />
        ))}
      </div>

      {/* Bottom left — mission strip */}
      <div className="absolute bottom-9 left-8 max-w-[260px] lg:left-12">
        <span className="hud-rule mb-3 block h-[1px] w-full" />
        <p className="font-mono text-[10px] leading-relaxed tracking-[0.2em] text-neutral-500">
          EST. 2026 — {BRAND.shortName} EVENT DOMAIN
          <br />
          HACKATHONS / CHAMPIONSHIPS / CHALLENGES
        </p>
      </div>

      {/* Bottom right — scroll cue */}
      <div className="absolute bottom-9 right-8 flex items-center gap-4 lg:right-12">
        <span className="font-mono text-[10px] tracking-[0.34em] text-neutral-500">
          SCROLL
        </span>
        <span className="relative block h-12 w-[2px] overflow-hidden rounded-full bg-white/10">
          <span className="animate-cue absolute inset-x-0 top-0 block h-4 rounded-full bg-gradient-to-b from-transparent via-sky-300 to-transparent" />
        </span>
      </div>
    </div>
  );
});

function CornerBrackets() {
  const corners = [
    "left-6 top-6 border-l border-t lg:left-9 lg:top-9",
    "right-6 top-6 border-r border-t lg:right-9 lg:top-9",
    "left-6 bottom-6 border-b border-l lg:left-9 lg:bottom-9",
    "right-6 bottom-6 border-b border-r lg:right-9 lg:bottom-9",
  ];

  return (
    <>
      {corners.map((position) => (
        <span
          key={position}
          className={`absolute h-5 w-5 border-white/20 ${position}`}
        />
      ))}
    </>
  );
}

/**
 * Renders a placeholder on the server and starts ticking only after mount, so
 * the markup matches on hydration.
 */
function useStageClock() {
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(
        [now.getHours(), now.getMinutes(), now.getSeconds()]
          .map((unit) => String(unit).padStart(2, "0"))
          .join(":")
      );
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return clock;
}
