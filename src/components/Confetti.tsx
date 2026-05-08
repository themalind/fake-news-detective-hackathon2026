import { useMemo } from "react";
import "./Confetti.scss";

const COLORS = ["#c9a227", "#ede0c4", "#22c55e", "#f97316", "#ef4444", "#facc15", "#a78bfa"];
const SHAPES = ["square", "circle", "rect"] as const;

type Shape = (typeof SHAPES)[number];

type Particle = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  shape: Shape;
  rotate: number;
};

export default function Confetti() {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 65 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.0,
        duration: 2.0 + Math.random() * 1.8,
        size: 6 + Math.random() * 9,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        rotate: Math.random() * 360,
      })),
    []
  );

  return (
    <div className="confetti" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className={`confetti__piece confetti__piece--${p.shape}`}
          style={
            {
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              width: p.shape === "rect" ? `${p.size * 0.45}px` : `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              "--rotate-start": `${p.rotate}deg`,
              "--rotate-end": `${p.rotate + 520}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
