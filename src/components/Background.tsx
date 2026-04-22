import { useLayoutEffect, useMemo, useRef } from 'react';
import { animateFloatingShape, type FloatingShapeParams } from '../anim';
import styles from './Background.module.css';

interface Shape extends FloatingShapeParams {
  type: 'X' | 'O';
  left: number;
  top: number;
  size: number;
  opacity: number;
}

const COLS = 3;
const ROWS = 5;
const TOTAL = COLS * ROWS;
const MARGIN_PCT = 6;

const rand = (min: number, max: number): number => min + Math.random() * (max - min);

/* jittered-grid placement so shapes stay spaced out. sizes are pulled from
   two bands (small + large) so the mix has real variety; smaller shapes
   get slightly higher opacity so they don't disappear. animation periods
   and amplitudes vary per shape so nothing moves in lockstep. */
function buildShapes(): Shape[] {
  const cellW = 100 / COLS;
  const cellH = 100 / ROWS;
  return Array.from({ length: TOTAL }, (_, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const left = col * cellW + rand(MARGIN_PCT, cellW - MARGIN_PCT);
    const top = row * cellH + rand(MARGIN_PCT, cellH - MARGIN_PCT);
    const small = Math.random() < 0.45;
    const size = small ? rand(26, 72) : rand(90, 168);
    return {
      type: Math.random() < 0.5 ? 'X' : 'O',
      left,
      top,
      size,
      opacity: small ? rand(0.1, 0.16) : rand(0.08, 0.13),
      hue: Math.floor(rand(0, 360)),
      floatAmp: rand(8, 20),
      floatPeriod: rand(5500, 10500),
      rotXAmp: rand(22, 55),
      rotXPeriod: rand(7000, 15000),
      rotYAmp: rand(22, 55),
      rotYPeriod: rand(8500, 17000),
      rotZAmp: rand(12, 36),
      rotZPeriod: rand(9000, 18000),
      huePeriod: rand(22000, 46000),
    };
  });
}

export function Background() {
  // lock positions at mount so re-renders don't re-roll the layout
  const shapes = useMemo(() => buildShapes(), []);
  // one ref array per animated axis — each anime.js animation writes to the
  // transform of exactly one element, so they never fight over the string
  const floatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rotXRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rotYRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rotZRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    shapes.forEach((s, i) => {
      const float = floatRefs.current[i];
      const rotX = rotXRefs.current[i];
      const rotY = rotYRefs.current[i];
      const rotZ = rotZRefs.current[i];
      if (!float || !rotX || !rotY || !rotZ) return;
      animateFloatingShape({ float, rotX, rotY, rotZ }, s);
    });
  }, [shapes]);

  return (
    <div className={styles.bg} aria-hidden="true">
      {shapes.map((s, i) => (
        <div
          key={i}
          className={styles.shapeSlot}
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            opacity: s.opacity,
          }}
        >
          <div
            ref={el => {
              floatRefs.current[i] = el;
            }}
            className={styles.shapeLayer}
          >
            <div
              ref={el => {
                rotXRefs.current[i] = el;
              }}
              className={styles.shapeLayer}
            >
              <div
                ref={el => {
                  rotYRefs.current[i] = el;
                }}
                className={styles.shapeLayer}
              >
                <div
                  ref={el => {
                    rotZRefs.current[i] = el;
                  }}
                  className={styles.shapeLayer}
                >
                  <svg viewBox="-50 -50 100 100">
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
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
