import { useMemo } from 'react';
import styles from './Background.module.css';

interface Shape {
  type: 'X' | 'O';
  left: number;
  top: number;
  size: number;
  rotate: number;
  hue: number;
  opacity: number;
  floatDelay: number;
  floatDuration: number;
}

const COLS = 3;
const ROWS = 4;
const TOTAL = COLS * ROWS;
const MARGIN_PCT = 8;

const rand = (min: number, max: number): number => min + Math.random() * (max - min);

/* jittered-grid placement so shapes stay spaced out — each cell gets one
   shape positioned inside it with a small inset margin, size / rotation /
   hue rolled per shape. animation phase is randomized so the float cycle
   is out of sync across shapes. */
function buildShapes(): Shape[] {
  const cellW = 100 / COLS;
  const cellH = 100 / ROWS;
  return Array.from({ length: TOTAL }, (_, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const left = col * cellW + rand(MARGIN_PCT, cellW - MARGIN_PCT);
    const top = row * cellH + rand(MARGIN_PCT, cellH - MARGIN_PCT);
    return {
      type: Math.random() < 0.5 ? 'X' : 'O',
      left,
      top,
      size: rand(48, 150),
      rotate: rand(-35, 35),
      hue: Math.floor(rand(0, 360)),
      opacity: rand(0.055, 0.11),
      floatDelay: -rand(0, 9000),
      floatDuration: rand(8500, 13500),
    };
  });
}

export function Background() {
  // lock positions at mount so a re-render doesn't re-roll the layout
  const shapes = useMemo(() => buildShapes(), []);

  return (
    <div className={styles.bg} aria-hidden="true">
      {shapes.map((s, i) => (
        <div
          key={i}
          className={styles.shape}
          style={
            {
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              opacity: s.opacity,
              animationDelay: `${s.floatDelay}ms`,
              animationDuration: `${s.floatDuration}ms`,
              '--shape-color': `oklch(72% 0.14 ${s.hue})`,
            } as React.CSSProperties
          }
        >
          <svg
            viewBox="-50 -50 100 100"
            style={{ transform: `rotate(${s.rotate}deg)` }}
          >
            {s.type === 'X' ? (
              <path
                d="M -30 -30 L 30 30 M 30 -30 L -30 30"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              <circle
                cx="0"
                cy="0"
                r="28"
                stroke="currentColor"
                strokeWidth="10"
                fill="none"
              />
            )}
          </svg>
        </div>
      ))}
    </div>
  );
}
