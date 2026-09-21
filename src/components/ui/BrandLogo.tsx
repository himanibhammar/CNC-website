"use client";

import Image from "next/image";
import { BRAND } from "@/lib/brand";
import { clsx } from "clsx";

interface BrandLogoProps {
  /** Display variant */
  variant?: "nav" | "hero" | "footer" | "card";
  /** Additional custom classes */
  className?: string;
  /** Priority loading flag */
  priority?: boolean;
}

/**
 * BrandLogo provides an abstraction layer over the official C&C artwork.
 * When a transparent PNG/SVG is supplied in the future, updating BRAND.logo
 * will cleanly update the entire site without component-level refactoring.
 */
export function BrandLogo({
  variant = "nav",
  className,
  priority = false,
}: BrandLogoProps) {
  const isLight = BRAND.logo.isLightBackground;

  // Dimensions per variant
  const dimensions = {
    nav: { width: 36, height: 33, wrapper: "w-9 h-8" },
    card: { width: 64, height: 58, wrapper: "w-16 h-14" },
    footer: { width: 88, height: 80, wrapper: "w-22 h-20" },
    hero: { width: 480, height: 438, wrapper: "w-72 sm:w-96 md:w-[440px] aspect-[1312/1199]" },
  }[variant];

  return (
    <div
      className={clsx(
        "relative flex items-center justify-center overflow-hidden select-none",
        dimensions.wrapper,
        className
      )}
    >
      <Image
        src={BRAND.logo.src}
        alt={BRAND.logo.alt}
        width={dimensions.width}
        height={dimensions.height}
        priority={priority}
        className={clsx(
          "object-contain transition-all duration-300",
          // For light-background JPEG in a dark environment:
          // Invert + screen blend renders crisp, glowing white technical linework on dark backgrounds
          isLight && "invert mix-blend-screen brightness-125 contrast-125"
        )}
      />
    </div>
  );
}
