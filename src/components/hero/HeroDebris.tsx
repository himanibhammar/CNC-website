"use client";

import { clsx } from "clsx";
import { DEPTH_TREATMENT, SHARD_SHAPES, SHARDS, type ShardDepth } from "./hero-config";

interface HeroDebrisProps {
  /**
   * Focal plane to render. Planes mount separately so the headline and subject
   * can be interleaved between them in the z-stack — that interleaving is what
   * makes the composition read as space rather than as stacked images.
   */
  plane: ShardDepth;
  className?: string;
}

/**
 * Machined fragments suspended around the subject.
 *
 * Each shard is a clipped polygon filled with a multi-stop alloy ramp, tilted
 * out of plane so it catches that ramp at an angle. A specular sliver runs
 * along its lit edge, occlusion pools underneath, and a soft shadow sits behind
 * it — together those are what separate "floating metal" from "grey triangle".
 *
 * The DOM is deliberately three levels deep:
 *   anchor      — static placement, never touched by animation
 *   [data-shard] — the GSAP target (drift, entrance, parallax)
 *   orient      — static rotation and blur, so the blurred raster can be cached
 */
export function HeroDebris({ plane, className }: HeroDebrisProps) {
  const treatment = DEPTH_TREATMENT[plane];
  const shards = SHARDS.filter((shard) => shard.depth === plane);

  return (
    <div
      aria-hidden="true"
      data-debris-plane={plane}
      className={clsx("pointer-events-none absolute inset-0", className)}
      style={{ opacity: treatment.opacity }}
    >
      {shards.map((shard) => (
        <div
          key={shard.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${shard.x}%`,
            top: `${shard.y}%`,
            width: `clamp(${Math.round(shard.size * 0.42)}px, ${(
              (shard.size / 1440) *
              100
            ).toFixed(2)}vw, ${Math.round(shard.size * 1.15)}px)`,
            aspectRatio: `1 / ${shard.ratio}`,
          }}
        >
          <div
            data-shard={shard.id}
            data-drift={shard.drift}
            data-travel={shard.travel}
            data-delay={shard.delay}
            className="h-full w-full will-change-transform"
          >
            <div
              className="relative h-full w-full"
              style={{
                transform: `rotate(${shard.rotate}deg) rotateX(${shard.tiltX}deg) rotateY(${shard.tiltY}deg)`,
                filter: treatment.blur ? `blur(${treatment.blur}px)` : undefined,
              }}
            >
              {/* Cast shadow, thrown down and away from the key light */}
              <div
                className="absolute inset-0 translate-x-[-6%] translate-y-[10%]"
                style={{
                  clipPath: SHARD_SHAPES[shard.shape],
                  background: "rgba(0,0,0,0.7)",
                  filter: "blur(6px)",
                }}
              />

              {/* Alloy body */}
              <div
                className={clsx(
                  "absolute inset-0",
                  shard.dark ? "shard-face-dark" : "shard-face"
                )}
                style={{ clipPath: SHARD_SHAPES[shard.shape] }}
              />

              {/* Specular sliver along the lit edge */}
              <div
                className="absolute inset-0 mix-blend-screen"
                style={{
                  clipPath: SHARD_SHAPES[shard.shape],
                  background:
                    "linear-gradient(118deg, transparent 0%, transparent 42%, rgba(226,240,255,0.55) 49%, rgba(255,255,255,0.9) 51%, rgba(180,210,255,0.3) 55%, transparent 64%)",
                }}
              />

              {/* Ambient occlusion pooling on the underside */}
              <div
                className="absolute inset-0"
                style={{
                  clipPath: SHARD_SHAPES[shard.shape],
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 46%)",
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
