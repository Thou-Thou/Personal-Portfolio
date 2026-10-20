"use client";

import { useEffect, useRef, useState } from "react";

type Shape = "morpho" | "swallowtail" | "round";
type Colors = [wing1: string, wing2: string, edge: string, spots: string];
type Kind = {
  name: string;
  shape: Shape;
  size: number; // px
  flap: number; // seconds per wing beat
  speed: number; // max speed
  follow: boolean; // circles the cursor when it moves
  shy?: boolean; // flies away from the cursor instead
  light: Colors;
  dark: Colors;
};

/* ---------- Customize the butterflies here ---------- */
// Phones show only the first three.
export const butterflies: Kind[] = [
  {
    name: "Blue morpho", shape: "morpho", size: 46, flap: 0.26, speed: 3.6, follow: true,
    light: ["#2563EB", "#22D3EE", "#0B1736", "#FFFFFF"],
    dark: ["#60A5FA", "#A5F3FC", "#BAE6FD", "#E0F2FE"],
  },
  {
    name: "Monarch", shape: "swallowtail", size: 52, flap: 0.34, speed: 2.8, follow: true,
    light: ["#F97316", "#FACC15", "#1C1917", "#FFF7ED"],
    dark: ["#FB923C", "#FDE68A", "#FED7AA", "#FFF7ED"],
  },
  {
    name: "Violet", shape: "round", size: 34, flap: 0.2, speed: 4.2, follow: true,
    light: ["#7C3AED", "#EC4899", "#1E1B4B", "#FDF4FF"],
    dark: ["#A78BFA", "#F9A8D4", "#E9D5FF", "#FDF4FF"],
  },
  {
    name: "Emerald", shape: "morpho", size: 40, flap: 0.24, speed: 3.4, follow: true,
    light: ["#059669", "#34D399", "#022C22", "#ECFDF5"],
    dark: ["#34D399", "#A7F3D0", "#A7F3D0", "#ECFDF5"],
  },
  {
    name: "Shy rose", shape: "swallowtail", size: 42, flap: 0.28, speed: 4, follow: false, shy: true,
    light: ["#E11D48", "#FB7185", "#1F0A10", "#FFF1F2"],
    dark: ["#FB7185", "#FECDD3", "#FECDD3", "#FFF1F2"],
  },
  {
    name: "Sky", shape: "round", size: 28, flap: 0.18, speed: 4.6, follow: true,
    light: ["#0EA5E9", "#BAE6FD", "#0C4A6E", "#FFFFFF"],
    dark: ["#7DD3FC", "#F0F9FF", "#E0F2FE", "#FFFFFF"],
  },
];

// Left-wing outlines (mirrored for the right wing); the body sits at x = 50
const shapes: Record<Shape, { wings: string[]; spots: [number, number, number][] }> = {
  morpho: {
    wings: ["M50 40C41 12 13 2 6 16c-5 12 12 25 44 28z", "M50 44C31 45 13 56 19 70c6 12 25 2 31-22z"],
    spots: [[17, 17, 4], [25, 63, 3]],
  },
  swallowtail: {
    wings: ["M50 40C44 18 24 4 4 8c2 14 14 30 46 34z", "M50 44C36 46 24 54 26 64c1 6-2 14-6 20 8-2 14-8 16-14 4 2 10-2 14-26z"],
    spots: [[14, 12, 3], [31, 61, 2.5]],
  },
  round: {
    wings: ["M50 41C40 20 16 16 12 30c-3 11 13 17 38 14z", "M50 44C36 46 22 54 26 65c4 8 18 2 24-21z"],
    spots: [[22, 29, 3.5], [33, 59, 2.2]],
  },
};

const vars = (k: Kind) =>
  ({
    "--l1": k.light[0], "--l2": k.light[1], "--le": k.light[2], "--ls": k.light[3],
    "--d1": k.dark[0], "--d2": k.dark[1], "--de": k.dark[2], "--ds": k.dark[3],
    "--flap": `${k.flap}s`,
    width: k.size, height: k.size * 0.84, marginLeft: -k.size / 2, marginTop: -k.size * 0.42,
  }) as React.CSSProperties;

function ButterflySvg({ kind, id }: { kind: Kind; id: string }) {
  const { wings, spots } = shapes[kind.shape];
  const wing = (
    <>
      {wings.map((d) => <path key={d} d={d} fill={`url(#${id})`} />)}
      {spots.map(([cx, cy, r]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} className="spot" />)}
    </>
  );
  return (
    <svg viewBox="0 0 100 84">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" style={{ stopColor: "var(--c1)" }} />
          <stop offset="1" style={{ stopColor: "var(--c2)" }} />
        </linearGradient>
      </defs>
      <g className="wing">{wing}</g>
      <g className="wing right">{wing}</g>
      <path className="antenna" d="M48.5 30Q44 17 38 12M51.5 30Q56 17 62 12" />
      <circle className="bf-body" cx="38" cy="12" r="2" />
      <circle className="bf-body" cx="62" cy="12" r="2" />
      <circle className="bf-body" cx="50" cy="31" r="3.4" />
      <ellipse className="bf-body" cx="50" cy="47" rx="2.8" ry="15" />
    </svg>
  );
}

// A small swarm that wanders the screen; most circle the cursor, the shy one keeps away.
export default function Butterflies() {
  const [count, setCount] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setCount(window.matchMedia("(max-width: 640px)").matches ? 3 : butterflies.length);
  }, []);

  useEffect(() => {
    if (!count) return;
    const root = document.documentElement;
    const rand = Math.random;
    const pick = () => ({ x: 40 + rand() * (window.innerWidth - 80), y: 60 + rand() * (window.innerHeight - 120) });

    const flock = refs.current.slice(0, count).map((el, i) => ({
      el: el!, kind: butterflies[i], target: pick(), lastSpark: 0,
      x: window.innerWidth * (0.15 + 0.7 * rand()), y: window.innerHeight * (0.15 + 0.6 * rand()),
      vx: rand() * 2 - 1, vy: rand() * 2 - 1, angle: 0,
    }));
    let pointer: { x: number; y: number; t: number } | null = null;
    let last = performance.now();
    let frame = 0;

    const onPointer = (e: PointerEvent) => (pointer = { x: e.clientX, y: e.clientY, t: performance.now() });

    const spark = (x: number, y: number, color: string) => {
      const s = document.createElement("i");
      s.className = "spark";
      s.style.left = `${x + (rand() - 0.5) * 10}px`;
      s.style.top = `${y + (rand() - 0.5) * 10}px`;
      s.style.setProperty("--spark", color);
      document.body.appendChild(s);
      setTimeout(() => s.remove(), 1000);
    };

    const tick = (t: number) => {
      const dt = Math.min(48, t - last) / 16.67;
      last = t;
      const dark = getComputedStyle(root).colorScheme === "dark";
      const active = pointer && t - pointer.t < 2500 ? pointer : null;

      flock.forEach((b, i) => {
        let tx = b.target.x;
        let ty = b.target.y;
        const near = active ? Math.hypot(b.x - active.x, b.y - active.y) : Infinity;

        if (active && b.kind.shy && near < 170) {
          tx = b.x + (b.x - active.x) * 3; // flee
          ty = b.y + (b.y - active.y) * 3;
        } else if (active && b.kind.follow) {
          const r = 55 + i * 26; // each circles at its own distance
          tx = active.x + Math.cos(t / 700 + i * 1.7) * r;
          ty = active.y - 30 + Math.sin(t / 550 + i * 1.3) * r * 0.7;
        } else if (Math.hypot(tx - b.x, ty - b.y) < 50) {
          b.target = pick();
        }

        b.vx += (tx - b.x) * 0.0017 * dt;
        b.vy += (ty - b.y) * 0.0017 * dt + Math.sin(t / 160 + i * 2) * 0.06;

        // Keep a little personal space
        for (const o of flock) {
          if (o === b) continue;
          const d = Math.hypot(b.x - o.x, b.y - o.y);
          if (d > 0 && d < 60) {
            const push = ((60 - d) / 60) * 0.3 * dt;
            b.vx += ((b.x - o.x) / d) * push;
            b.vy += ((b.y - o.y) / d) * push;
          }
        }

        b.vx *= 0.965;
        b.vy *= 0.965;
        const speed = Math.hypot(b.vx, b.vy);
        if (speed > b.kind.speed) {
          b.vx = (b.vx / speed) * b.kind.speed;
          b.vy = (b.vy / speed) * b.kind.speed;
        }
        b.x = Math.max(10, Math.min(window.innerWidth - 10, b.x + b.vx * dt));
        b.y = Math.max(10, Math.min(window.innerHeight - 10, b.y + b.vy * dt));

        // Turn smoothly toward the direction of travel (the drawing faces up)
        const heading = (Math.atan2(b.vy, b.vx) * 180) / Math.PI + 90;
        b.angle += ((((heading - b.angle + 540) % 360) - 180) * 0.08) * dt;
        b.el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) rotate(${b.angle}deg)`;

        if (dark && t - b.lastSpark > 150) {
          b.lastSpark = t;
          spark(b.x, b.y, b.kind.dark[1]);
        }
      });
      frame = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    // Twirl when the theme changes
    const themeWatch = new MutationObserver(() =>
      flock.forEach(({ el }, i) => {
        el.classList.remove("twirl");
        void el.offsetWidth;
        el.style.setProperty("--twirl-delay", `${i * 60}ms`);
        el.classList.add("twirl");
      })
    );
    themeWatch.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      themeWatch.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count]);

  return (
    <div className="butterflies" aria-hidden="true">
      {butterflies.slice(0, count).map((kind, i) => (
        <div className="bf" key={kind.name} ref={(el) => { refs.current[i] = el; }} style={vars(kind)}>
          <ButterflySvg kind={kind} id={`bf-grad-${i}`} />
        </div>
      ))}
    </div>
  );
}
