"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// --- Types -----------------------------------------------------------------
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  hue: number;
  life: number;
  maxLife: number;
  type: "dot" | "ring" | "cross";
}

// --- Canvas Particle Engine ------------------------------------------------
function initParticleCanvas(canvas: HTMLCanvasElement): () => void {
  const ctx = canvas.getContext("2d")!;
  let width = 0;
  let height = 0;
  let raf = 0;
  const particles: Particle[] = [];
  const CONNECTION_DIST = 140;
  const MAX_PARTICLES = 220;

  function resize() {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  function spawnParticle(): Particle {
    const types: Particle["type"][] = ["dot", "dot", "dot", "ring", "cross"];
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.4,
      alpha: Math.random() * 0.55 + 0.08,
      hue: Math.random() * 40 + 195,
      life: 0,
      maxLife: Math.random() * 600 + 300,
      type: types[Math.floor(Math.random() * types.length)],
    };
  }

  function drawParticle(p: Particle) {
    const lr = p.life / p.maxLife;
    const a = lr < 0.1 ? (lr / 0.1) * p.alpha : lr > 0.85 ? ((1 - lr) / 0.15) * p.alpha : p.alpha;
    ctx.save();
    ctx.globalAlpha = a;
    if (p.type === "dot") {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${p.hue},90%,72%)`;
      ctx.fill();
    } else if (p.type === "ring") {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
      ctx.strokeStyle = `hsl(${p.hue},80%,65%)`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    } else {
      ctx.strokeStyle = `hsl(${p.hue},85%,68%)`;
      ctx.lineWidth = 0.5;
      const s = p.r * 2.2;
      ctx.beginPath();
      ctx.moveTo(p.x - s, p.y);
      ctx.lineTo(p.x + s, p.y);
      ctx.moveTo(p.x, p.y - s);
      ctx.lineTo(p.x, p.y + s);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.12;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = "hsl(215,80%,65%)";
          ctx.lineWidth = 0.4;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);
    while (particles.length < MAX_PARTICLES) particles.push(spawnParticle());
    drawConnections();
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
      if (p.life >= p.maxLife) particles.splice(i, 1);
      else drawParticle(p);
    }
    raf = requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener("resize", resize);
  tick();
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
  };
}

// --- Circuit SVG corners ----------------------------------------------------
function CircuitTL() {
  return (
    <svg viewBox="0 0 120 120" className="absolute top-0 left-0 w-28 md:w-40 opacity-[0.18] pointer-events-none" fill="none">
      <path d="M0 60 H40 V20 H80 V0" stroke="#38bdf8" strokeWidth="1" />
      <path d="M0 90 H25 V55 H55 V35 H100 V0" stroke="#6366f1" strokeWidth="0.6" />
      <circle cx="40" cy="20" r="3" fill="#38bdf8" />
      <circle cx="80" cy="0" r="2" fill="#6366f1" />
      <rect x="37" y="17" width="6" height="6" stroke="#38bdf8" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

function CircuitBR() {
  return (
    <svg viewBox="0 0 120 120" className="absolute bottom-0 right-0 w-28 md:w-40 opacity-[0.18] pointer-events-none rotate-180" fill="none">
      <path d="M0 60 H40 V20 H80 V0" stroke="#38bdf8" strokeWidth="1" />
      <path d="M0 90 H25 V55 H55 V35 H100 V0" stroke="#6366f1" strokeWidth="0.6" />
      <circle cx="40" cy="20" r="3" fill="#38bdf8" />
      <circle cx="80" cy="0" r="2" fill="#6366f1" />
      <rect x="37" y="17" width="6" height="6" stroke="#38bdf8" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

function CircuitTR() {
  return (
    <svg viewBox="0 0 120 120" className="absolute top-0 right-0 w-28 md:w-40 opacity-[0.12] pointer-events-none" style={{ transform: "scaleX(-1)" }} fill="none">
      <path d="M0 60 H40 V20 H80 V0" stroke="#6366f1" strokeWidth="1" />
      <path d="M0 90 H25 V55 H55 V35 H100 V0" stroke="#38bdf8" strokeWidth="0.6" />
      <circle cx="40" cy="20" r="3" fill="#6366f1" />
    </svg>
  );
}

// --- HUD corner brackets + side strips ------------------------------------
function HudOverlay() {
  return (
    <>
      <div className="absolute top-6 left-6 pointer-events-none opacity-30">
        <div className="w-8 h-8 border-l border-t border-blue-400/60" />
      </div>
      <div className="absolute top-6 right-6 pointer-events-none opacity-30">
        <div className="w-8 h-8 border-r border-t border-blue-400/60" />
      </div>
      <div className="absolute bottom-6 left-6 pointer-events-none opacity-30">
        <div className="w-8 h-8 border-l border-b border-cyan-400/50" />
      </div>
      <div className="absolute bottom-6 right-6 pointer-events-none opacity-30">
        <div className="w-8 h-8 border-r border-b border-cyan-400/50" />
      </div>
      <div className="absolute left-6 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:flex flex-col items-center gap-3 opacity-20">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-blue-400 to-transparent" />
        <span className="font-mono text-[8px] tracking-[0.4em] text-blue-300 uppercase" style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}>
          C&C // 2025
        </span>
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-blue-400 to-transparent" />
      </div>
      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:flex flex-col items-center gap-3 opacity-20">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-indigo-400 to-transparent" />
        <span className="font-mono text-[8px] tracking-[0.4em] text-indigo-300 uppercase" style={{ writingMode: "vertical-lr" }}>
          ENGINEERING
        </span>
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-indigo-400 to-transparent" />
      </div>
    </>
  );
}

// --- 3D Logo + orbit rings --------------------------------------------------
function Logo3DRing() {
  return (
    <div className="relative flex items-center justify-center" style={{ perspective: "900px" }}>
      <div className="absolute rounded-full" style={{ width: 420, height: 420, background: "conic-gradient(from 0deg, transparent 60%, rgba(56,189,248,0.15) 70%, rgba(99,102,241,0.2) 80%, transparent 90%)", animation: "cc-spin 12s linear infinite", border: "1px solid rgba(56,189,248,0.08)" }} />
      <div className="absolute rounded-full" style={{ width: 340, height: 340, border: "1px solid rgba(99,102,241,0.12)", animation: "cc-spin 18s linear infinite reverse" }} />
      <div className="absolute rounded-full" style={{ width: 280, height: 280, border: "1px dashed rgba(56,189,248,0.1)", animation: "cc-spin 9s linear infinite" }} />
      <div className="absolute rounded-full" style={{ width: 220, height: 220, background: "radial-gradient(ellipse at center, rgba(56,189,248,0.12) 0%, rgba(99,102,241,0.08) 50%, transparent 75%)", filter: "blur(20px)", animation: "cc-pulse 3s ease-in-out infinite alternate" }} />
      {[0, 90, 180, 270].map((deg, i) => (
        <div key={i} className="absolute" style={{ width: 420, height: 420, animation: `cc-spin ${10 + i * 2}s linear infinite` }}>
          <div style={{ position: "absolute", width: i % 2 === 0 ? 5 : 3, height: i % 2 === 0 ? 5 : 3, borderRadius: "50%", background: i % 2 === 0 ? "#38bdf8" : "#818cf8", top: "50%", left: 0, transform: `rotate(${deg}deg) translateX(210px) translateY(-50%)`, boxShadow: `0 0 6px 2px ${i % 2 === 0 ? "#38bdf8" : "#818cf8"}` }} />
        </div>
      ))}
      {/* Logo — circular clip removes rectangular boundary, screen blend + invert removes white bg */}
      <div
        className="relative z-10 will-change-transform"
        style={{ animation: "cc-float 6s ease-in-out infinite" }}
      >
        <Image
          src="/images/logo.png"
          alt="Challenges and Championships"
          width={240}
          height={240}
          priority
          className="object-contain"
          style={{
            mixBlendMode: "screen",
            filter: "invert(1) brightness(1.6) contrast(2.5) drop-shadow(0 0 18px rgba(56,189,248,0.9)) drop-shadow(0 0 36px rgba(99,102,241,0.6))",
            clipPath: "circle(48% at 50% 50%)",
          }}
        />
      </div>
    </div>
  );
}

// --- Split-character word ----------------------------------------------------
function SplitWord({ word, refProp, className = "" }: { word: string; refProp: React.RefObject<HTMLSpanElement | null>; className?: string; }) {
  return (
    <span ref={refProp} className={`inline-block will-change-transform ${className}`}>
      {word.split("").map((char, i) => (
        <span key={i} className="hero-char inline-block will-change-transform" style={{ display: "inline-block" }}>{char}</span>
      ))}
    </span>
  );
}

// --- Main Component ----------------------------------------------------------
export function HeroStage() {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const challengesRef = useRef<HTMLSpanElement>(null);
  const ampRef = useRef<HTMLSpanElement>(null);
  const championshipsRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const metaBarRef = useRef<HTMLDivElement>(null);

  const buildScrollAnim = useCallback(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const challengeChars = challengesRef.current?.querySelectorAll(".hero-char") ?? [];
      const championshipChars = championshipsRef.current?.querySelectorAll(".hero-char") ?? [];
      gsap.set(logoWrapRef.current, { scale: 0.6, opacity: 0, y: 40, rotateY: -25, filter: "blur(8px)" });
      gsap.set(challengeChars, { opacity: 0, y: 60, rotateX: 90, scaleY: 0.3 });
      gsap.set(ampRef.current, { opacity: 0, scale: 2.5, filter: "blur(12px)" });
      gsap.set(championshipChars, { opacity: 0, y: -60, rotateX: -90, scaleY: 0.3 });
      gsap.set(taglineRef.current, { opacity: 0, y: 24 });
      gsap.set(metaBarRef.current, { opacity: 0, scaleX: 0 });
      gsap.set(scrollCueRef.current, { opacity: 1 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          pin: stageRef.current,
          anticipatePin: 1,
        },
      });
      tl
        .to(logoWrapRef.current, { scale: 1, opacity: 1, y: 0, rotateY: 0, filter: "blur(0px)", ease: "power3.out", duration: 2 }, 0)
        .to(scrollCueRef.current, { opacity: 0, duration: 0.6 }, 0.3)
        .to(challengeChars, { opacity: 1, y: 0, rotateX: 0, scaleY: 1, ease: "back.out(1.5)", duration: 1.8, stagger: { each: 0.045, from: "random" } }, 1.4)
        .to(logoWrapRef.current, { y: -55, scale: 0.82, opacity: 0.85, duration: 2, ease: "power2.inOut" }, 2.8)
        .to(ampRef.current, { opacity: 1, scale: 1, filter: "blur(0px)", ease: "expo.out", duration: 1.2 }, 3.5)
        .to(championshipChars, { opacity: 1, y: 0, rotateX: 0, scaleY: 1, ease: "back.out(1.5)", duration: 1.8, stagger: { each: 0.04, from: "random" } }, 4)
        .to(taglineRef.current, { opacity: 1, y: 0, ease: "power2.out", duration: 1.5 }, 5.2)
        .to(metaBarRef.current, { opacity: 1, scaleX: 1, ease: "power2.out", duration: 1 }, 5.4)
        .to([logoWrapRef.current, challengesRef.current, ampRef.current, championshipsRef.current, taglineRef.current], { opacity: 0, y: -50, filter: "blur(4px)", ease: "power2.in", duration: 1.5 }, 6.5);
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const logo = logoWrapRef.current;
    if (!stage || !logo) return;
    function onMove(e: MouseEvent) {
      const r = stage!.getBoundingClientRect();
      const dx = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 8;
      const dy = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * 6;
      gsap.to(logo, { rotateY: dx, rotateX: -dy, duration: 0.9, ease: "power2.out" });
    }
    stage.addEventListener("mousemove", onMove);
    return () => stage.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    return initParticleCanvas(canvasRef.current);
  }, []);

  useEffect(() => {
    return buildScrollAnim() ?? undefined;
  }, [buildScrollAnim]);

  return (
    <>
      <style>{`
        @keyframes cc-spin  { to { transform: rotate(360deg); } }
        @keyframes cc-float { 0%,100% { transform: translateY(0) rotateZ(-0.4deg); } 50% { transform: translateY(-18px) rotateZ(0.4deg); } }
        @keyframes cc-pulse { from { opacity:.6; transform:scale(.95); } to { opacity:1; transform:scale(1.05); } }
        @keyframes cc-shimmer { 0% { opacity:0; transform:translateX(-100%); } 50% { opacity:1; } 100% { opacity:0; transform:translateX(100%); } }
        .hero-title-word { perspective:600px; display:inline-block; }
      `}</style>

      <section ref={containerRef} className="relative w-full h-[300vh] bg-[#05060e]" aria-label="Cinematic Brand Introduction">
        <div ref={stageRef} className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true" />

          <div className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 45%, rgba(30,58,138,0.38) 0%, rgba(15,23,60,0.28) 40%, transparent 75%)" }} />
            <div style={{ position: "absolute", top: "-10%", left: "-5%", width: "45%", height: "55%", background: "radial-gradient(ellipse, rgba(37,99,235,0.14) 0%, transparent 70%)", filter: "blur(60px)" }} />
            <div style={{ position: "absolute", bottom: "-8%", right: "-5%", width: "40%", height: "50%", background: "radial-gradient(ellipse, rgba(79,70,229,0.16) 0%, transparent 70%)", filter: "blur(80px)" }} />
            <div style={{ position: "absolute", top: "15%", right: "8%", width: "22%", height: "22%", background: "radial-gradient(ellipse, rgba(34,211,238,0.08) 0%, transparent 70%)", filter: "blur(40px)" }} />
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(56,189,248,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
            <div style={{ position: "absolute", top: "42%", left: 0, right: 0, height: 1, background: "linear-gradient(90deg, transparent, rgba(56,189,248,0.25), transparent)", animation: "cc-shimmer 4s ease-in-out infinite" }} />
          </div>

          <CircuitTL />
          <CircuitTR />
          <CircuitBR />
          <HudOverlay />

          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 select-none">
            <div ref={logoWrapRef} className="mb-2 will-change-transform" style={{ perspective: "900px" }}>
              <Logo3DRing />
            </div>
            <div className="mt-2 flex flex-col items-center gap-0">
              <div className="hero-title-word">
                <SplitWord word="CHALLENGES" refProp={challengesRef} className="font-sans font-black text-4xl sm:text-6xl md:text-7xl lg:text-[6.5rem] leading-none tracking-tight text-white uppercase" />
              </div>
              <div className="hero-title-word my-1">
                <span ref={ampRef} className="will-change-transform inline-block font-serif italic font-light text-2xl sm:text-4xl md:text-5xl text-blue-400/90" style={{ textShadow: "0 0 30px rgba(56,189,248,0.5), 0 0 80px rgba(99,102,241,0.3)" }}>&amp;</span>
              </div>
              <div className="hero-title-word">
                <SplitWord word="CHAMPIONSHIPS" refProp={championshipsRef} className="font-sans font-black text-4xl sm:text-6xl md:text-7xl lg:text-[6.5rem] leading-none tracking-tight text-white uppercase" />
              </div>
            </div>
            <div ref={taglineRef} className="mt-8 will-change-transform">
              <div ref={metaBarRef} className="will-change-transform origin-left">
                <div className="flex items-center gap-4">
                  <span className="w-12 h-px bg-blue-400/30" />
                  <span className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-blue-300/70 uppercase">Engineering the Next Challenge</span>
                  <span className="w-12 h-px bg-blue-400/30" />
                </div>
              </div>
            </div>
          </div>

          <div ref={scrollCueRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-20">
            <span className="font-mono text-[9px] tracking-[0.45em] uppercase text-neutral-500">Scroll</span>
            <div className="relative w-px h-10 bg-white/10 overflow-hidden">
              <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-400 to-transparent" style={{ height: "50%", animation: "cc-shimmer 1.8s ease-in-out infinite" }} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
