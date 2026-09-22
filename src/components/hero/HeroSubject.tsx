"use client";

import Image from "next/image";
import { forwardRef } from "react";
import { BRAND } from "@/lib/brand";

/**
 * The hero's physical subject.
 *
 * The supplied brand artwork is a JPEG: grey linework on a solid white field,
 * with no alpha channel. Rather than blending it (which breaks the moment GSAP
 * puts the element in its own stacking context) we key it properly with an SVG
 * filter — luminance is inverted into the alpha channel, so the white field
 * becomes genuinely transparent and the linework becomes a cool white etch.
 *
 * With real alpha in hand, CSS `drop-shadow()` traces the actual silhouette,
 * which is what makes the halo, rim light and contact shadow read as physical.
 */
export const HeroSubject = forwardRef<HTMLDivElement>(function HeroSubject(
  _props,
  ref
) {
  return (
    <div
      ref={ref}
      className="relative flex items-end justify-center will-change-transform"
      style={{ transformStyle: "preserve-3d" }}
    >
      <KeyFilterDefs />

      {/* Backlight bloom — the light source sits behind the subject, so it
          blows out around the silhouette before the artwork itself resolves. */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -z-10 h-[78%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full animate-breathe"
        style={{
          background:
            "radial-gradient(closest-side, rgba(226,240,255,0.5) 0%, rgba(126,178,255,0.26) 38%, rgba(40,86,180,0.1) 62%, transparent 80%)",
          filter: "blur(34px)",
        }}
      />

      <div className="relative w-[clamp(240px,42vw,560px)] aspect-[1312/1199]">
        {/* Base pass: the keyed artwork itself */}
        <Image
          src={BRAND.logo.src}
          alt={BRAND.logo.alt}
          fill
          priority
          quality={95}
          sizes="(max-width: 768px) 70vw, 45vw"
          className="cc-keyed object-contain"
        />

        {/* Specular pass: same silhouette, over-driven, masked by a travelling
            highlight band so light crawls across the etch. Decorative only. */}
        <Image
          src={BRAND.logo.src}
          alt=""
          aria-hidden="true"
          fill
          quality={95}
          sizes="(max-width: 768px) 70vw, 45vw"
          className="cc-specular object-contain"
        />
      </div>

      {/* Contact shadow — grounds the subject on the floor plane. Without it
          the artwork floats and the whole composition stops being believable. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-3 left-1/2 h-[26px] w-[62%] -translate-x-1/2 rounded-[50%]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 52%, transparent 100%)",
          filter: "blur(12px)",
        }}
      />

      {/* Reflected bounce off the floor — faint, short, and flipped. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-1 left-1/2 h-[18%] w-[70%] -translate-x-1/2 opacity-[0.16]"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, rgba(176,212,255,0.7) 0%, transparent 72%)",
          filter: "blur(9px)",
        }}
      />
    </div>
  );
});

/**
 * feColorMatrix flattens every pixel to one cool white and rewrites alpha as
 * `1 - luminance`. feComponentTransfer then applies an S-curve to that alpha:
 * the low end crushes JPEG ringing around the strokes to nothing, the mid-to-
 * high end drives the linework back to near-opaque.
 */
function KeyFilterDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute h-0 w-0"
    >
      <defs>
        <filter id="cc-luma-key" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="
              0 0 0 0 0.87
              0 0 0 0 0.93
              0 0 0 0 1
              -0.3 -0.59 -0.11 0 1"
          />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0 0.34 0.92 1 1" />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
}
