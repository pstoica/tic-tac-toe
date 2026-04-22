import { useLayoutEffect, useRef } from 'react';
import { animateWinSlash } from '../anim';

interface WinSlashProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function WinSlash({ x1, y1, x2, y2 }: WinSlashProps) {
  const a = useRef<SVGLineElement>(null);
  const b = useRef<SVGLineElement>(null);

  useLayoutEffect(() => {
    if (a.current && b.current) animateWinSlash(a.current, b.current);
  }, []);

  // extend past the cell centers so the slash reaches beyond the mark edges
  // (mark half-width is ~26; 36 pushes the line ~10 past the marks on each end)
  const extend = 36;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const sx = x1 - ux * extend;
  const sy = y1 - uy * extend;
  const ex = x2 + ux * extend;
  const ey = y2 + uy * extend;
  const mx = (sx + ex) / 2;
  const my = (sy + ey) / 2;

  return (
    <g className="win-slash-group">
      <line ref={a} className="win-slash" x1={mx} y1={my} x2={sx} y2={sy} />
      <line ref={b} className="win-slash" x1={mx} y1={my} x2={ex} y2={ey} />
    </g>
  );
}
