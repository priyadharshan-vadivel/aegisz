"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { MotionValue } from "framer-motion";

/*
 * The intent shield. Low-poly, instanced, untextured (~3k triangles).
 *  - server nodes + links: the protected estate
 *  - translucent fresnel shield: IAAC
 *  - command particles: harmful ones (block colour) stop at the shield and ripple;
 *    safe ones (allow colour) pass through to the nodes
 *  - hash-chain ring: the audit trail, drawn in as the story progresses
 * `progress` (0..1) drives the three story stages: form → judge → lock.
 */

const NODES = 42;
const CORE_R = 1.45;
const SHIELD_R = 2.1;
const PARTICLES = 28;
const RIPPLES = 8;
const CHAIN = 30;
const CHAIN_R = 2.55;

type Palette = { fg: THREE.Color; subtle: THREE.Color; line: THREE.Color; allow: THREE.Color; block: THREE.Color; dark: boolean };

function readPalette(): Palette {
  const root = document.documentElement;
  const cs = getComputedStyle(root);
  const c = (n: string) => new THREE.Color(cs.getPropertyValue(n).trim() || "#ffffff");
  return {
    fg: c("--ae-fg"),
    subtle: c("--ae-fg-subtle"),
    line: c("--ae-border-strong"),
    allow: c("--ae-allow"),
    block: c("--ae-block"),
    dark: root.dataset.theme !== "light",
  };
}

function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const stage = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

function randomDir(r: () => number, out = new THREE.Vector3()) {
  const u = r() * 2 - 1;
  const t = r() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  return out.set(s * Math.cos(t), s * Math.sin(t) * 0.75, u);
}

/* ---------------- estate: nodes + links ---------------- */

function useEstate() {
  return useMemo(() => {
    const r = seeded(7);
    const pts: THREE.Vector3[] = [];
    while (pts.length < NODES) {
      const v = new THREE.Vector3(r() * 2 - 1, (r() * 2 - 1) * 0.8, r() * 2 - 1).multiplyScalar(CORE_R);
      if (v.length() <= CORE_R) pts.push(v);
    }
    const seen = new Set<string>();
    const seg: number[] = [];
    pts.forEach((p, i) => {
      pts
        .map((q, j) => ({ j, d: p.distanceTo(q) }))
        .filter((x) => x.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, 2)
        .forEach(({ j }) => {
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (seen.has(key)) return;
          seen.add(key);
          seg.push(p.x, p.y, p.z, pts[j].x, pts[j].y, pts[j].z);
        });
    });
    return { pts, links: new Float32Array(seg) };
  }, []);
}

function Estate({ palette }: { palette: Palette }) {
  const { pts, links } = useEstate();
  const ref = useRef<THREE.InstancedMesh>(null);
  useEffect(() => {
    const m = new THREE.Matrix4();
    pts.forEach((p, i) => ref.current!.setMatrixAt(i, m.makeTranslation(p.x, p.y, p.z)));
    ref.current!.instanceMatrix.needsUpdate = true;
  }, [pts]);
  return (
    <group>
      <instancedMesh ref={ref} args={[undefined, undefined, NODES]}>
        <boxGeometry args={[0.065, 0.065, 0.065]} />
        <meshBasicMaterial color={palette.fg} transparent opacity={0.9} />
      </instancedMesh>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[links, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={palette.subtle} transparent opacity={0.35} />
      </lineSegments>
    </group>
  );
}

/* ---------------- shield ---------------- */

const fresnelVertex = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const fresnelFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float f = pow(1.0 - abs(dot(vN, vV)), 2.6);
    gl_FragColor = vec4(uColor, f * uOpacity);
  }
`;

function Shield({ palette, form }: { palette: Palette; form: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const edgesMat = useRef<THREE.LineBasicMaterial>(null);
  const uniforms = useMemo(() => ({ uColor: { value: new THREE.Color() }, uOpacity: { value: 0 } }), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(SHIELD_R, 1)), []);
  useEffect(() => {
    uniforms.uColor.value.copy(palette.fg);
  }, [palette, uniforms]);
  useFrame((_, dt) => {
    const f = form.current;
    group.current!.scale.setScalar(0.82 + 0.18 * f);
    group.current!.rotation.y += dt * 0.04;
    uniforms.uOpacity.value = (palette.dark ? 0.55 : 0.35) * (0.35 + 0.65 * f);
    edgesMat.current!.opacity = 0.05 + 0.12 * f;
  });
  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[SHIELD_R, 3]} />
        <shaderMaterial
          vertexShader={fresnelVertex}
          fragmentShader={fresnelFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={palette.dark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial ref={edgesMat} color={palette.fg} transparent opacity={0.1} />
      </lineSegments>
    </group>
  );
}

/* ---------------- commands + ripples ---------------- */

type P = { pos: THREE.Vector3; vel: THREE.Vector3; harmful: boolean };

function Commands({ palette, judge, form }: { palette: Palette; judge: React.RefObject<number>; form: React.RefObject<number> }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const ripples = useRef<(THREE.Mesh | null)[]>([]);
  const life = useRef<number[]>(Array(RIPPLES).fill(1));
  const next = useRef(0);
  const rand = useMemo(() => seeded(11), []);
  const parts = useRef<P[]>([]);
  const m = useMemo(() => new THREE.Matrix4(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const z = useMemo(() => new THREE.Vector3(0, 0, 1), []);

  const spawn = (p: P, initial = false) => {
    // Come in from the right/top/bottom, never across the copy on the left.
    do randomDir(rand, dir);
    while (dir.x < -0.25);
    const r = initial ? 2.6 + rand() * 4 : 5 + rand() * 2;
    p.pos.copy(dir).multiplyScalar(r);
    p.vel.copy(dir).multiplyScalar(-(0.7 + rand() * 0.5));
    p.harmful = rand() < 0.35 + 0.25 * (judge.current ?? 0);
  };

  useEffect(() => {
    parts.current = Array.from({ length: PARTICLES }, () => {
      const p = { pos: new THREE.Vector3(), vel: new THREE.Vector3(), harmful: false };
      spawn(p, true);
      return p;
    });
    parts.current.forEach((p, i) => mesh.current!.setColorAt(i, p.harmful ? palette.block : palette.allow));
    mesh.current!.instanceColor!.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [palette]);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const speed = 0.7 + 0.9 * (judge.current ?? 0);
    const shieldR = SHIELD_R * (0.82 + 0.18 * (form.current ?? 0));
    let recolor = false;
    parts.current.forEach((p, i) => {
      p.pos.addScaledVector(p.vel, dt * speed);
      const r = p.pos.length();
      let changed = false;
      if (p.harmful && r <= shieldR) {
        const k = next.current++ % RIPPLES;
        const ring = ripples.current[k];
        if (ring) {
          ring.position.copy(p.pos);
          ring.quaternion.setFromUnitVectors(z, dir.copy(p.pos).normalize());
          life.current[k] = 0;
        }
        spawn(p);
        changed = true;
      } else if (!p.harmful && r < 0.25) {
        spawn(p);
        changed = true;
      }
      if (changed) {
        mesh.current!.setColorAt(i, p.harmful ? palette.block : palette.allow);
        recolor = true;
      }
      const s = p.harmful ? 1.25 : 1;
      m.makeScale(s, s, s).setPosition(p.pos);
      mesh.current!.setMatrixAt(i, m);
    });
    mesh.current!.instanceMatrix.needsUpdate = true;
    if (recolor) mesh.current!.instanceColor!.needsUpdate = true;

    ripples.current.forEach((ring, k) => {
      if (!ring) return;
      const l = (life.current[k] = Math.min(1, life.current[k] + dt / 0.9));
      ring.scale.setScalar(1 + l * 4);
      (ring.material as THREE.MeshBasicMaterial).opacity = (1 - l) * 0.9;
      ring.visible = l < 1;
    });
  });

  return (
    <group>
      <instancedMesh ref={mesh} args={[undefined, undefined, PARTICLES]}>
        <octahedronGeometry args={[0.04, 0]} />
        <meshBasicMaterial color="#ffffff" />
      </instancedMesh>
      {Array.from({ length: RIPPLES }, (_, k) => (
        <mesh key={k} ref={(el) => void (ripples.current[k] = el)} visible={false}>
          <ringGeometry args={[0.06, 0.085, 24]} />
          <meshBasicMaterial color={palette.block} transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------- audit chain ---------------- */

function AuditChain({ palette, audit }: { palette: Palette; audit: React.RefObject<number> }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  useEffect(() => {
    const o = new THREE.Object3D();
    for (let i = 0; i < CHAIN; i++) {
      const a = (i / CHAIN) * Math.PI * 2;
      o.position.set(Math.cos(a) * CHAIN_R, 0, Math.sin(a) * CHAIN_R);
      o.rotation.set(0, -a, 0);
      o.updateMatrix();
      mesh.current!.setMatrixAt(i, o.matrix);
    }
    mesh.current!.instanceMatrix.needsUpdate = true;
  }, []);
  useFrame((_, dt) => {
    const a = audit.current ?? 0;
    mesh.current!.count = Math.round(a * CHAIN);
    // Spins while it's being written, settles once locked.
    group.current!.rotation.y += dt * 0.25 * (1 - a);
    mat.current!.color.copy(a >= 0.999 ? palette.fg : palette.subtle);
  });
  return (
    <group ref={group} rotation={[0.38, 0, 0.12]}>
      <instancedMesh ref={mesh} args={[undefined, undefined, CHAIN]}>
        <boxGeometry args={[0.035, 0.035, 0.36]} />
        <meshBasicMaterial ref={mat} color={palette.subtle} />
      </instancedMesh>
    </group>
  );
}

/* ---------------- rig ---------------- */

function Rig({ progress, children }: { progress: MotionValue<number>; children: (r: { form: React.RefObject<number>; judge: React.RefObject<number>; audit: React.RefObject<number> }) => React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const form = useRef(0);
  const judge = useRef(0);
  const audit = useRef(0);
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  useFrame(({ size }, dt) => {
    const p = progress.get();
    form.current = stage(p, 0, 0.33);
    judge.current = stage(p, 0.33, 0.66);
    audit.current = stage(p, 0.66, 0.95);
    const g = group.current!;
    const k = 1 - Math.exp(-dt * 3);
    // Subtle cursor parallax, at most ~4°.
    g.rotation.y += (pointer.current.x * 0.07 - g.rotation.y) * k;
    g.rotation.x += (pointer.current.y * 0.05 - g.rotation.x) * k;
    // Sit to the right of the copy on wide screens.
    const targetX = size.width / size.height > 1.25 ? 2.6 : 0;
    g.position.x += (targetX - g.position.x) * k;
  });
  return <group ref={group}>{children({ form, judge, audit })}</group>;
}

export default function IntentShieldScene({ progress, active }: { progress: MotionValue<number>; active: boolean }) {
  const [palette, setPalette] = useState<Palette | null>(null);
  useEffect(() => {
    setPalette(readPalette());
    const mo = new MutationObserver(() => setPalette(readPalette()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
  }, []);
  if (!palette) return null;
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 9], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      aria-hidden
    >
      <Rig progress={progress}>
        {({ form, judge, audit }) => (
          <>
            <Estate palette={palette} />
            <Shield palette={palette} form={form} />
            <Commands palette={palette} judge={judge} form={form} />
            <AuditChain palette={palette} audit={audit} />
          </>
        )}
      </Rig>
    </Canvas>
  );
}
