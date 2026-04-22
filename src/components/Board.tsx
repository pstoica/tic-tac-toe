import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { animateBoardIn, dimNonWinningMarks, highlightWinningMarks } from '../anim';
import type { Board as BoardType, Mark as MarkType, Outcome } from '../game/types';
import { Mark } from './Mark';
import { WinSlash } from './WinSlash';

interface BoardProps {
  board: BoardType;
  outcome: Outcome;
  current: MarkType;
  busy: boolean;
  onCellClick: (index: number) => void;
}

const VIEW = 300;
const CELL = VIEW / 3;

const cellCenter = (i: number) => ({
  cx: (i % 3) * CELL + CELL / 2,
  cy: Math.floor(i / 3) * CELL + CELL / 2,
});

export function Board({ board, outcome, current, busy, onCellClick }: BoardProps) {
  const cellRefs = useRef<(SVGGElement | null)[]>([]);
  const gridRefs = useRef<(SVGLineElement | null)[]>([]);
  const markRefs = useRef<(SVGGElement | null)[]>([]);

  // mount: stagger the cells in
  useLayoutEffect(() => {
    const cells = cellRefs.current.filter((c): c is SVGGElement => !!c);
    const lines = gridRefs.current.filter((c): c is SVGLineElement => !!c);
    animateBoardIn(cells, lines);
  }, []);

  // when game ends, dim non-winning marks and pop the winning trio
  useEffect(() => {
    if (outcome.kind !== 'win') return;
    const winSet = new Set(outcome.line);
    const winning: SVGGElement[] = [];
    const losing: SVGGElement[] = [];
    markRefs.current.forEach((el, i) => {
      if (!el) return;
      (winSet.has(i) ? winning : losing).push(el);
    });
    dimNonWinningMarks(losing);
    highlightWinningMarks(winning);
  }, [outcome]);

  const winLine = useMemo(() => {
    if (outcome.kind !== 'win') return null;
    const [a, , c] = outcome.line;
    const A = cellCenter(a);
    const C = cellCenter(c);
    return { x1: A.cx, y1: A.cy, x2: C.cx, y2: C.cy };
  }, [outcome]);

  return (
    <div className="board-wrap">
      {/* always rendered so it reserves layout space — hidden when the game ends */}
      <div
        className={`turn${outcome.kind === 'ongoing' ? '' : ' turn--hidden'}`}
        style={{ '--turn-hue': current === 'X' ? 25 : 235 } as React.CSSProperties}
        aria-live="polite"
        aria-hidden={outcome.kind !== 'ongoing'}
      >
        <span className="turn__token" aria-hidden="true">
          <svg className="turn__glyph" viewBox="-10 -10 20 20">
            {current === 'X' ? (
              <path d="M -5 -5 L 5 5 M 5 -5 L -5 5" />
            ) : (
              <circle cx="0" cy="0" r="5" />
            )}
          </svg>
        </span>
        {busy ? (
          <>
            CPU
            <span className="turn__dots" aria-hidden="true">
              <span /><span /><span />
            </span>
          </>
        ) : (
          <>YOUR TURN</>
        )}
      </div>
      <svg className="board" viewBox={`0 0 ${VIEW} ${VIEW}`} role="grid" aria-label="tic tac toe board">
        {/* per-cell clipPaths so the particle scatter is hard-bounded to the
            placed cell regardless of render size */}
        <defs>
          {Array.from({ length: 9 }, (_, i) => {
            const x = (i % 3) * CELL;
            const y = Math.floor(i / 3) * CELL;
            return (
              <clipPath key={i} id={`cell-clip-${i}`}>
                <rect x={x} y={y} width={CELL} height={CELL} />
              </clipPath>
            );
          })}
        </defs>

        {/* cells */}
        {Array.from({ length: 9 }, (_, i) => {
          const x = (i % 3) * CELL;
          const y = Math.floor(i / 3) * CELL;
          const cellValue = board[i];
          const disabled = !!cellValue || outcome.kind !== 'ongoing' || busy;
          return (
            <g
              key={i}
              ref={el => { cellRefs.current[i] = el; }}
            >
              <rect
                className="cell-bg"
                x={x + 6}
                y={y + 6}
                rx={10}
                ry={10}
                width={CELL - 12}
                height={CELL - 12}
              />
              {!disabled && (
                <rect
                  className="cell-hit"
                  x={x}
                  y={y}
                  width={CELL}
                  height={CELL}
                  role="gridcell"
                  aria-label={`cell ${i + 1}, empty, place ${current}`}
                  tabIndex={0}
                  onClick={() => onCellClick(i)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onCellClick(i);
                    }
                  }}
                />
              )}
            </g>
          );
        })}

        {/* grid lines */}
        <line ref={el => { gridRefs.current[0] = el; }} className="board__grid-line" x1={CELL} y1={10} x2={CELL} y2={VIEW - 10} />
        <line ref={el => { gridRefs.current[1] = el; }} className="board__grid-line" x1={CELL * 2} y1={10} x2={CELL * 2} y2={VIEW - 10} />
        <line ref={el => { gridRefs.current[2] = el; }} className="board__grid-line" x1={10} y1={CELL} x2={VIEW - 10} y2={CELL} />
        <line ref={el => { gridRefs.current[3] = el; }} className="board__grid-line" x1={10} y1={CELL * 2} x2={VIEW - 10} y2={CELL * 2} />

        {/* marks */}
        {board.map((cell, i) => {
          if (!cell) return null;
          const { cx, cy } = cellCenter(i);
          return (
            <g
              key={`mark-${i}-${cell}`}
              ref={el => { markRefs.current[i] = el; }}
              clipPath={`url(#cell-clip-${i})`}
            >
              <Mark mark={cell} cx={cx} cy={cy} size={52} />
            </g>
          );
        })}

        {/* winning slash */}
        {winLine && <WinSlash {...winLine} />}
      </svg>
    </div>
  );
}
