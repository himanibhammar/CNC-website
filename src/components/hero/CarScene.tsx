"use client";
/**
 * CarScene.tsx
 * Three.js canvas — renders the Oracle Red Bull RB19 GLB.
 * Camera is fixed to a SIDE VIEW so the car sweeps left→right
 * like the reference photo.
 */
import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

/* ─── F1 Model ─────────────────────────────────────────────── */
function F1Car({
  xRef,
}: {
  xRef: React.MutableRefObject<number>;
}) {
  const root = useRef<THREE.Group>(null!);
  const { scene } = useGLTF("/3d-models/source/oracle_redbull_rb19.glb");

  /* Apply initial transform once */
  useEffect(() => {
    if (!root.current) return;
    /* Side-on orientation: nose faces +X (right) so car
       naturally sweeps left→right. Adjust if model differs. */
    root.current.rotation.set(0, -Math.PI / 2, 0);
    root.current.scale.setScalar(1.0);
  }, []);

  useFrame(() => {
    if (!root.current) return;
    root.current.position.x = xRef.current;
    root.current.position.y = -1.0;
    /* Subtle tilt while moving for realism */
    root.current.rotation.z = THREE.MathUtils.clamp(
      -xRef.current * 0.004, -0.04, 0.04
    );
  });

  return <primitive ref={root} object={scene} />;
}

/* ─── Cinematic headlights glow ────────────────────────────── */
function HeadlightGlow({ xRef }: { xRef: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.PointLight>(null!);
  useFrame(() => {
    if (!ref.current) return;
    /* Glow sits just ahead of car nose */
    ref.current.position.set(xRef.current + 2.2, -0.6, 0.5);
  });
  return (
    <pointLight
      ref={ref}
      color="#ff3030"
      intensity={12}
      distance={6}
      decay={2}
    />
  );
}

/* ─── Canvas export ─────────────────────────────────────────── */
export interface CarSceneProps {
  xRef: React.MutableRefObject<number>;
  onLoaded: () => void;
}

export function CarScene({ xRef, onLoaded }: CarSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 2.2, 14], fov: 38 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      style={{ background: "#060608" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x060608, 1);
        onLoaded();
      }}
    >
      {/* Atmosphere */}
      <ambientLight intensity={0.6} color="#99bbff" />
      {/* Strong key from upper-right */}
      <directionalLight position={[8, 10, 4]} intensity={5} color="#ffffff" />
      {/* Red rim from below-left (Red Bull livery pop) */}
      <pointLight position={[-6, 2, 6]} intensity={4} color="#ff2020" />
      {/* Blue-indigo fill from back */}
      <pointLight position={[0, 6, -8]} intensity={3} color="#4060ff" />

      <HeadlightGlow xRef={xRef} />
      <F1Car xRef={xRef} />

      <Environment preset="night" />
    </Canvas>
  );
}

useGLTF.preload("/3d-models/source/oracle_redbull_rb19.glb");
