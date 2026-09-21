"use client";
/**
 * HeroIntro.tsx — Cinematic Landing Introduction
 * 
 * Animation sequence:
 *  t=0.0  Dark screen. Scan line sweeps.
 *  t=0.3  Car (3D if WebGL OK, CSS fallback image otherwise) blasts from LEFT→RIGHT
 *  t=0.4  Letters materialise behind the car one by one
 *  t=3.0  Car exits right. Title fully visible.
 *  t=3.2  Red flash + section shake
 *  t=3.5  Title ROCKETS up at violent speed
 *  t=3.9  Black curtain wipe → transitions to next section
 */

import {
  useRef, useEffect, useState, useCallback,
} from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";

/* Three.js canvas — loaded only on client, with no SSR */
const CarScene = dynamic(
  () => import("./CarScene").then((m) => m.CarScene),
  { ssr: false }
);

/* ── Letter data ─────────────────────────────────────────── */
const W1 = "CHALLENGES";
const W2 = "CHAMPIONSHIPS";
/* Ampersand as a separator */
const CHARS = [...W1.split(""), "＆", ...W2.split("")];
const N = CHARS.length; // 24 chars total

/* Each letter's left-vw position (spread 5→95vw) */
const LETTER_POS = CHARS.map((_, i) => 5 + (i / (N - 1)) * 90);

/* Map vw position 0-100 to 3D x  (-22 to +22) */
const vw2x = (vw: number) => -22 + (vw / 100) * 44;

/* Car 3D-x progress trigger per letter */
const TRIGGERS = LETTER_POS.map(vw2x);

/* ── Letter component ────────────────────────────────────── */
interface LetterProps { char: string; vw: number; idx: number }
function Letter({ char, vw, idx }: LetterProps) {
  const isAmp = char === "＆";
  return (
    <span
      id={`hi-l${idx}`}
      aria-hidden
      style={{
        position: "absolute",
        left: `${vw}vw`,
        top: "50%",
        transform: "translateY(-50%) translateY(0px)",
        opacity: 0,
        display: "block",
        willChange: "transform, opacity, filter",
        fontFamily: isAmp
          ? "Georgia,'Times New Roman',serif"
          : "'Arial Black',Impact,'Franklin Gothic Medium',sans-serif",
        fontWeight: isAmp ? 400 : 900,
        fontStyle: isAmp ? "italic" : "normal",
        fontSize: isAmp
          ? "clamp(3rem,5.5vw,6.5rem)"
          : "clamp(3.2rem,6.5vw,8rem)",
        color: isAmp ? "#ff1a1a" : "#ffffff",
        lineHeight: 1,
        letterSpacing: isAmp ? "0" : "-0.025em",
        textTransform: isAmp ? "none" : "uppercase",
        textShadow: isAmp
          ? "0 0 30px rgba(255,26,26,0.8), 0 0 70px rgba(255,0,0,0.4)"
          : "0 0 1px rgba(0,0,0,0.9), 0 4px 20px rgba(0,0,0,0.9)",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      {char}
    </span>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export function HeroIntro() {
  const secRef     = useRef<HTMLDivElement>(null);
  const canvasWrap = useRef<HTMLDivElement>(null);
  const letterWrap = useRef<HTMLDivElement>(null);
  const flashRef   = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const scanRef    = useRef<HTMLDivElement>(null);
  const xRef       = useRef<number>(-22);      // drives Three.js car x
  const [loaded, setLoaded] = useState(false);
  const [streaking, setStreaking] = useState(false);
  const revealedRef = useRef<Set<number>>(new Set());

  const onLoaded = useCallback(() => setLoaded(true), []);

  /* ── Main GSAP timeline ─────────────────────────────────── */
  useEffect(() => {
    if (!loaded) return;
    revealedRef.current.clear();

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "none" } });

      /* 0.0 → 0.3s  scan line */
      tl.fromTo(scanRef.current,
        { scaleX: 0, opacity: 0.8 },
        { scaleX: 1, opacity: 0, duration: 0.3, ease: "power2.in" }, 0);

      /* 0.1s — speed streaks appear */
      tl.add(() => setStreaking(true), 0.1);
      tl.add(() => setStreaking(false), 0.7);

      /* 0.25 → 3.1s  Car sweeps left→right */
      tl.to(xRef, {
        current: 24,
        duration: 2.85,
        ease: "power2.in",
        onUpdate() {
          const cx = xRef.current;
          TRIGGERS.forEach((tx, i) => {
            if (cx > tx && !revealedRef.current.has(i)) {
              revealedRef.current.add(i);
              const el = document.getElementById(`hi-l${i}`);
              if (!el) return;
              gsap.fromTo(el,
                { opacity: 0, y: 40, scaleY: 0.2, filter: "blur(8px)" },
                { opacity: 1, y: 0, scaleY: 1, filter: "blur(0px)",
                  duration: 0.25, ease: "back.out(2.5)" });
            }
          });
        },
      }, 0.25);

      /* 3.1s — red camera flash */
      tl.to(flashRef.current, { opacity: 1, duration: 0.05 }, 3.1);
      tl.to(flashRef.current, { opacity: 0, duration: 0.3, ease: "power2.out" }, 3.15);

      /* 3.15s — shake section */
      tl.to(secRef.current, {
        x: 10, duration: 0.04, yoyo: true, repeat: 6, ease: "none",
        onComplete() { gsap.set(secRef.current, { x: 0 }); },
      }, 3.15);

      /* 3.4s — TITLE ROCKETS UP — violent */
      tl.to(letterWrap.current, {
        y: "-200vh",
        scale: 1.06,
        opacity: 0,
        filter: "blur(16px)",
        duration: 0.5,
        ease: "power4.in",
      }, 3.4);

      /* 3.65s — curtain slams down */
      tl.fromTo(curtainRef.current,
        { scaleY: 0, transformOrigin: "top center" },
        {
          scaleY: 1,
          duration: 0.4,
          ease: "power4.in",
          onComplete() {
            /* Snap-scroll to next sibling section */
            const next = secRef.current?.nextElementSibling as HTMLElement | null;
            if (next) next.scrollIntoView({ behavior: "instant" });
            gsap.to(curtainRef.current, { opacity: 0, duration: 0.25, delay: 0.08 });
          },
        }, 3.65);
    }, secRef);

    return () => ctx.revert();
  }, [loaded]);

  return (
    <section
      ref={secRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100svh",
        overflow: "hidden",
        background: "#060608",
      }}
      aria-label="F1 Hero Intro — Challenges and Championships"
    >
      <style>{`
        @keyframes hi-redpulse {
          0%,100%{opacity:.7} 50%{opacity:1}
        }
        @keyframes hi-blueglow {
          0%,100%{opacity:.5} 60%{opacity:.9}
        }
        @keyframes hi-shimmer {
          0%{transform:translateX(-120%)} 100%{transform:translateX(220%)}
        }
        @keyframes hi-streak-fade {
          0%{opacity:0} 20%{opacity:1} 80%{opacity:.6} 100%{opacity:0}
        }
      `}</style>

      {/* ── BACKGROUND LAYER ─────────────────────────────────── */}
      <div style={{position:"absolute",inset:0,zIndex:0,pointerEvents:"none"}} aria-hidden>
        {/* Solid base */}
        <div style={{position:"absolute",inset:0,background:"#060608"}} />
        {/* Red glow — Red Bull livery echo */}
        <div style={{
          position:"absolute",right:"-5%",top:"15%",width:"55%",height:"70%",
          background:"radial-gradient(ellipse,rgba(200,15,15,0.22) 0%,transparent 68%)",
          filter:"blur(90px)",animation:"hi-redpulse 3.5s ease-in-out infinite",
        }}/>
        {/* Indigo/blue glow left */}
        <div style={{
          position:"absolute",left:"-8%",top:"5%",width:"45%",height:"75%",
          background:"radial-gradient(ellipse,rgba(15,35,200,0.18) 0%,transparent 68%)",
          filter:"blur(100px)",animation:"hi-blueglow 4s ease-in-out infinite 0.7s",
        }}/>
        {/* Subtle bottom gradient */}
        <div style={{
          position:"absolute",bottom:0,left:0,right:0,height:"38%",
          background:"linear-gradient(to top,rgba(6,4,18,0.95),transparent)",
        }}/>
        {/* Radial vignette */}
        <div style={{
          position:"absolute",inset:0,
          background:"radial-gradient(ellipse 110% 110% at 50% 50%,transparent 38%,rgba(0,0,0,0.82) 100%)",
        }}/>
      </div>

      {/* ── GRID + TRACK LINES ───────────────────────────────── */}
      <div style={{position:"absolute",inset:0,zIndex:1,pointerEvents:"none"}} aria-hidden>
        {/* Fine grid */}
        <div style={{
          position:"absolute",inset:0,
          backgroundImage:"linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)",
          backgroundSize:"64px 64px",
        }}/>
        {/* Main track line (car drives on this) */}
        <div style={{
          position:"absolute",left:0,right:0,bottom:"28%",height:2,
          background:"linear-gradient(90deg,transparent 0%,rgba(255,30,30,0.55) 15%,rgba(255,255,255,0.18) 50%,rgba(255,30,30,0.55) 85%,transparent 100%)",
        }}/>
        {/* Reflection below track */}
        <div style={{
          position:"absolute",left:0,right:0,bottom:"20%",height:55,
          background:"linear-gradient(to bottom,rgba(255,30,30,0.07),transparent)",
        }}/>
        {/* Tick marks along track */}
        {[8,20,32,44,56,68,80,92].map(x=>(
          <div key={x} style={{
            position:"absolute",bottom:"calc(28% - 8px)",left:`${x}%`,
            width:1,height:10,background:"rgba(255,255,255,0.18)",
          }}/>
        ))}
      </div>

      {/* ── HUD CORNERS ─────────────────────────────────────── */}
      <div style={{position:"absolute",inset:0,zIndex:5,pointerEvents:"none"}} aria-hidden>
        {[
          {top:18,left:18,bl:"2px solid rgba(220,30,30,0.5)",bt:"2px solid rgba(220,30,30,0.5)"},
          {top:18,right:18,br:"2px solid rgba(220,30,30,0.5)",bt:"2px solid rgba(220,30,30,0.5)"},
          {bottom:18,left:18,bl:"2px solid rgba(60,100,255,0.4)",bb:"2px solid rgba(60,100,255,0.4)"},
          {bottom:18,right:18,br:"2px solid rgba(60,100,255,0.4)",bb:"2px solid rgba(60,100,255,0.4)"},
        ].map((s,i)=>(
          <div key={i} style={{
            position:"absolute",width:28,height:28,
            ...s,
          }}/>
        ))}
        {/* Lab/telemetry text top-left */}
        <div style={{
          position:"absolute",top:22,left:22,
          fontFamily:"monospace",fontSize:"0.58rem",letterSpacing:"0.22em",
          color:"rgba(255,40,40,0.45)",textTransform:"uppercase",
        }}>
          RB19 // UNIT 11
        </div>
        {/* Top-right */}
        <div style={{
          position:"absolute",top:22,right:22,
          fontFamily:"monospace",fontSize:"0.58rem",letterSpacing:"0.22em",
          color:"rgba(100,140,255,0.45)",textTransform:"uppercase",
        }}>
          2025 // SEASON
        </div>
      </div>

      {/* ── SPEED STREAKS (CSS-only, no canvas) ─────────────── */}
      {streaking && (
        <div style={{position:"absolute",inset:0,zIndex:3,pointerEvents:"none",overflow:"hidden"}} aria-hidden>
          {Array.from({length:22},(_,i)=>{
            const y = 20 + i*2.9;
            const w = 15+Math.random()*45;
            const x = 5+Math.random()*70;
            const red = i%4===0;
            return (
              <div key={i} style={{
                position:"absolute",
                top:`${y}%`,left:`${x}%`,
                width:`${w}%`,height:red?2:1,
                background:red
                  ? "linear-gradient(90deg,transparent,rgba(255,40,40,0.7),transparent)"
                  : "linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)",
                animation:"hi-streak-fade 0.5s ease forwards",
              }}/>
            );
          })}
        </div>
      )}

      {/* ── SCAN LINE ───────────────────────────────────────── */}
      <div
        ref={scanRef}
        aria-hidden
        style={{
          position:"absolute",inset:0,zIndex:6,pointerEvents:"none",
          background:"linear-gradient(90deg,transparent,rgba(255,40,40,0.18) 50%,transparent)",
          transformOrigin:"left center",
          transform:"scaleX(0)",
        }}
      />

      {/* ── THREE.JS CANVAS (car model) ─────────────────────── */}
      <div
        ref={canvasWrap}
        style={{
          position:"absolute",inset:0,
          zIndex:7,pointerEvents:"none",
        }}
      >
        <CarScene xRef={xRef} onLoaded={onLoaded} />
      </div>

      {/* ── TITLE TEXT (letters positioned absolutely) ───────── */}
      <div
        ref={letterWrap}
        style={{
          position:"absolute",inset:0,
          zIndex:10,pointerEvents:"none",
        }}
        aria-label="Challenges and Championships"
      >
        {CHARS.map((c,i)=>(
          <Letter key={i} char={c} vw={LETTER_POS[i]} idx={i} />
        ))}
      </div>

      {/* ── RED FLASH ───────────────────────────────────────── */}
      <div
        ref={flashRef}
        aria-hidden
        style={{
          position:"absolute",inset:0,zIndex:20,pointerEvents:"none",
          background:"radial-gradient(ellipse at center,rgba(255,50,0,0.65) 0%,rgba(200,0,0,0.35) 50%,transparent 80%)",
          opacity:0,
        }}
      />

      {/* ── CURTAIN WIPE ────────────────────────────────────── */}
      <div
        ref={curtainRef}
        aria-hidden
        style={{
          position:"absolute",inset:0,zIndex:30,
          background:"#060608",
          transform:"scaleY(0)",
          transformOrigin:"top center",
        }}
      />

      {/* ── LOADING OVERLAY ─────────────────────────────────── */}
      {!loaded && (
        <div style={{
          position:"absolute",inset:0,zIndex:40,
          background:"#060608",
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          gap:14,
        }}>
          <div style={{
            position:"relative",width:64,height:3,overflow:"hidden",
            background:"rgba(255,255,255,0.07)",borderRadius:2,
          }}>
            <div style={{
              position:"absolute",top:0,height:"100%",width:"40%",
              background:"linear-gradient(90deg,rgba(255,40,40,0.9),rgba(60,100,255,0.9))",
              borderRadius:2,
              animation:"hi-shimmer 0.9s linear infinite",
            }}/>
          </div>
          <span style={{
            fontFamily:"monospace",fontSize:"0.55rem",letterSpacing:"0.4em",
            color:"rgba(255,255,255,0.25)",textTransform:"uppercase",
          }}>
            LOADING RB19
          </span>
        </div>
      )}
    </section>
  );
}
