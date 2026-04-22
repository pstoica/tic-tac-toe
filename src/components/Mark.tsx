import { useLayoutEffect, useRef } from 'react';
import { animateMarkGhosts, animateMarkGrow, animateMarkIn } from '../anim';
import type { Mark as MarkType } from '../game/types';

interface MarkProps {
  mark: MarkType;
  cx: number;
  cy: number;
  size?: number;
}

const X_PATHS = (cx: number, cy: number, s: number): string[] => {
  const h = s / 2;
  // stroke-dashoffset reveals from each path's start point toward its end.
  // starting one diagonal at top-left (drawing down-right) and the other at
  // bottom-left (drawing up-right) means the two pens cross through the
  // center rather than both streaking down from the top.
  return [
    `M ${cx - h} ${cy - h} L ${cx + h} ${cy + h}`,   // ↘ top-left → bottom-right
    `M ${cx - h} ${cy + h} L ${cx + h} ${cy - h}`,   // ↗ bottom-left → top-right
  ];
};

const O_PATHS = (cx: number, cy: number, s: number): string[] => {
  const r = s / 2;
  return [
    `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0`,
  ];
};

const GHOST_COUNT = 12;

// ghosts can always use a single combined silhouette — they don't need
// per-segment draw-in, only opacity fades at a frozen pose.
const GHOST_PATH = (mark: MarkType, cx: number, cy: number, s: number): string => {
  if (mark === 'O') return O_PATHS(cx, cy, s)[0]!;
  const h = s / 2;
  return `M ${cx - h} ${cy - h} L ${cx + h} ${cy + h} M ${cx + h} ${cy - h} L ${cx - h} ${cy + h}`;
};

export function Mark({ mark, cx, cy, size = 56 }: MarkProps) {
  const groupRef = useRef<SVGGElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const ghostRefs = useRef<(SVGPathElement | null)[]>([]);

  useLayoutEffect(() => {
    if (groupRef.current) animateMarkGrow(groupRef.current);
    const paths = pathRefs.current.filter((p): p is SVGPathElement => !!p);
    if (paths.length) animateMarkIn(paths);
    const ghosts = ghostRefs.current.filter((g): g is SVGPathElement => !!g);
    if (ghosts.length) animateMarkGhosts(ghosts);
  }, []);

  const ds = mark === 'X' ? X_PATHS(cx, cy, size) : O_PATHS(cx, cy, size);
  const ghostD = GHOST_PATH(mark, cx, cy, size);

  return (
    <g ref={groupRef} className={`mark mark--${mark}`}>
      <g className="mark-ghosts">
        {Array.from({ length: GHOST_COUNT }, (_, i) => (
          <path
            key={i}
            ref={el => { ghostRefs.current[i] = el; }}
            className="mark__ghost"
            d={ghostD}
            style={{ '--ghost-hue': (i * (360 / GHOST_COUNT)) % 360 } as React.CSSProperties}
          />
        ))}
      </g>
      {ds.map((d, i) => (
        <path
          key={i}
          ref={el => { pathRefs.current[i] = el; }}
          className="mark__path"
          d={d}
        />
      ))}
    </g>
  );
}
