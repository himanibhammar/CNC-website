/**
 * Hero stage composition data.
 *
 * Every floating fragment in the hero is placed by hand rather than randomised,
 * so the composition stays balanced: nothing lands on the subject's face, the
 * near-field pieces stay out of the headline's reading path, and the depth
 * layers read as three distinct focal planes.
 */

/** Focal plane a fragment lives on. Drives blur, scale and parallax weight. */
export type ShardDepth = "far" | "mid" | "near";

export interface Shard {
  id: string;
  depth: ShardDepth;
  /** Horizontal position, % of stage width (0 = left edge). */
  x: number;
  /** Vertical position, % of stage height (0 = top edge). */
  y: number;
  /** Width in px at a 1440px reference viewport; scaled fluidly at runtime. */
  size: number;
  /** Height as a multiple of `size`. */
  ratio: number;
  /** In-plane rotation, degrees. */
  rotate: number;
  /** Out-of-plane tilt, degrees — gives each plate real thickness. */
  tiltX: number;
  tiltY: number;
  /** Index into SHARD_SHAPES. */
  shape: number;
  /** Use the darker alloy ramp (fragments on the void side catch less light). */
  dark?: boolean;
  /** Seconds for one idle drift cycle. */
  drift: number;
  /** Idle drift travel in px. */
  travel: number;
  /** Stagger offset for the drift loop, seconds. */
  delay: number;
}

/** Irregular milled-fragment silhouettes. */
export const SHARD_SHAPES = [
  "polygon(0% 22%, 58% 0%, 100% 28%, 82% 100%, 18% 88%)",
  "polygon(4% 0%, 100% 14%, 92% 82%, 26% 100%, 0% 46%)",
  "polygon(0% 40%, 44% 0%, 100% 18%, 88% 76%, 30% 100%)",
  "polygon(12% 0%, 100% 32%, 74% 100%, 0% 72%)",
  "polygon(0% 12%, 86% 0%, 100% 62%, 40% 100%, 6% 70%)",
  "polygon(8% 6%, 96% 0%, 100% 48%, 62% 96%, 0% 64%)",
] as const;

/**
 * Per-plane rendering treatment. Depth is expressed purely as defocus, scale
 * and opacity — the same cues a real lens gives you — which keeps the transform
 * pipeline free for animation.
 */
export const DEPTH_TREATMENT: Record<
  ShardDepth,
  { blur: number; opacity: number }
> = {
  // Dust-scale debris deep behind the subject — heavily diffused.
  far: { blur: 4, opacity: 0.32 },
  // The readable layer: sharp, sits between headline and subject.
  mid: { blur: 0.4, opacity: 0.82 },
  // Out-of-focus foreground crossing the lens — sells the depth of field.
  near: { blur: 11, opacity: 0.5 },
};

export const SHARDS: Shard[] = [
  // ---- far plane -----------------------------------------------------------
  { id: "f1", depth: "far", x: 11, y: 19, size: 46, ratio: 0.42, rotate: -18, tiltX: 24, tiltY: -30, shape: 0, dark: true, drift: 13, travel: 22, delay: 0 },
  { id: "f2", depth: "far", x: 79, y: 14, size: 38, ratio: 0.5, rotate: 34, tiltX: -18, tiltY: 26, shape: 2, drift: 15, travel: 18, delay: 1.4 },
  { id: "f3", depth: "far", x: 26, y: 68, size: 52, ratio: 0.38, rotate: 8, tiltX: 30, tiltY: 14, shape: 4, dark: true, drift: 17, travel: 26, delay: 2.9 },
  { id: "f4", depth: "far", x: 88, y: 58, size: 44, ratio: 0.46, rotate: -26, tiltX: -22, tiltY: -18, shape: 1, drift: 12, travel: 20, delay: 0.8 },
  { id: "f5", depth: "far", x: 57, y: 12, size: 30, ratio: 0.55, rotate: 52, tiltX: 16, tiltY: 34, shape: 3, drift: 16, travel: 16, delay: 3.6 },
  { id: "f6", depth: "far", x: 41, y: 82, size: 34, ratio: 0.44, rotate: -40, tiltX: -28, tiltY: 20, shape: 5, dark: true, drift: 14, travel: 24, delay: 2.1 },

  // ---- mid plane -----------------------------------------------------------
  { id: "m1", depth: "mid", x: 6, y: 44, size: 132, ratio: 0.3, rotate: -12, tiltX: 18, tiltY: -38, shape: 1, dark: true, drift: 9, travel: 34, delay: 0.3 },
  { id: "m2", depth: "mid", x: 72, y: 26, size: 158, ratio: 0.28, rotate: 7, tiltX: -14, tiltY: 32, shape: 3, drift: 11, travel: 40, delay: 1.9 },
  { id: "m3", depth: "mid", x: 17, y: 71, size: 96, ratio: 0.36, rotate: 28, tiltX: 26, tiltY: 18, shape: 0, dark: true, drift: 10, travel: 30, delay: 3.2 },
  { id: "m4", depth: "mid", x: 84, y: 72, size: 118, ratio: 0.32, rotate: -34, tiltX: -20, tiltY: -26, shape: 4, drift: 12, travel: 36, delay: 0.9 },
  { id: "m5", depth: "mid", x: 63, y: 84, size: 78, ratio: 0.4, rotate: 46, tiltX: 22, tiltY: 28, shape: 2, drift: 8.5, travel: 26, delay: 2.4 },
  { id: "m6", depth: "mid", x: 31, y: 30, size: 70, ratio: 0.38, rotate: -52, tiltX: -30, tiltY: 16, shape: 5, dark: true, drift: 13, travel: 28, delay: 4.1 },

  // ---- near plane (foreground, out of focus) -------------------------------
  { id: "n1", depth: "near", x: -4, y: 60, size: 260, ratio: 0.26, rotate: -22, tiltX: 14, tiltY: -34, shape: 3, dark: true, drift: 7, travel: 52, delay: 0 },
  { id: "n2", depth: "near", x: 90, y: 8, size: 228, ratio: 0.3, rotate: 16, tiltX: -24, tiltY: 30, shape: 1, drift: 8, travel: 46, delay: 1.6 },
  { id: "n3", depth: "near", x: 46, y: 96, size: 192, ratio: 0.28, rotate: -8, tiltX: 32, tiltY: 12, shape: 0, dark: true, drift: 6.5, travel: 40, delay: 3 },
  { id: "n4", depth: "near", x: 78, y: 92, size: 164, ratio: 0.34, rotate: 38, tiltX: -18, tiltY: -28, shape: 4, drift: 9, travel: 44, delay: 2.2 },
];

/**
 * Parallax weight per layer, in px of travel at the extremes of the pointer.
 * Values climb with proximity to the camera so the whole stage resolves like a
 * real multi-plane rig rather than a flat image sliding around.
 */
export const PARALLAX_DEPTH = {
  atmosphere: 10,
  headline: 16,
  subject: 30,
  hud: 6,
} as const;
