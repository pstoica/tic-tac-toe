import { useLayoutEffect, useRef } from 'react';
import { animateBrandHues } from '../anim';

const BRAND_CHARS: ReadonlyArray<{ ch: string; kind: 'letter' | 'dot' }> = [
  { ch: 't', kind: 'letter' },
  { ch: 'i', kind: 'letter' },
  { ch: 'c', kind: 'letter' },
  { ch: '·', kind: 'dot' },
  { ch: 't', kind: 'letter' },
  { ch: 'a', kind: 'letter' },
  { ch: 'c', kind: 'letter' },
  { ch: '·', kind: 'dot' },
  { ch: 't', kind: 'letter' },
  { ch: 'o', kind: 'letter' },
  { ch: 'e', kind: 'letter' },
];

export function Brand() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ref.current) animateBrandHues(ref.current);
  }, []);

  return (
    <div className="brand" ref={ref} aria-label="tictactoe">
      {BRAND_CHARS.map((c, i) => (
        <span
          key={i}
          className={c.kind === 'dot' ? 'brand__dot' : 'brand__letter'}
          aria-hidden="true"
        >
          {c.kind === 'dot' ? '' : c.ch}
        </span>
      ))}
    </div>
  );
}
