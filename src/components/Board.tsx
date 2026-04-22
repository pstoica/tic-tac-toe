import { useEffect, useLayoutEffect, useRef } from 'react';
import { animateBoardIn, dimNonWinningMarks, highlightWinningMarks } from '../anim';
import type { Board as BoardType, Mark as MarkType, Outcome } from '../game/types';
import { Mark } from './Mark';
import styles from './Board.module.css';

interface BoardProps {
  board: BoardType;
  outcome: Outcome;
  current: MarkType;
  busy: boolean;
  onCellClick: (index: number) => void;
}

const VIEW = 300;
const CELL = VIEW / 3;

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

  const winningSet = outcome.kind === 'win' ? new Set<number>(outcome.line) : null;

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

  return (
    <div className={styles.boardWrap}>
      {/* always rendered so it reserves layout space — hidden when the game ends */}
      <div
        className={`${styles.turn}${outcome.kind === 'ongoing' ? '' : ` ${styles.turnHidden}`}`}
        style={{ '--turn-hue': current === 'X' ? 25 : 235 } as React.CSSProperties}
        aria-live="polite"
        aria-hidden={outcome.kind !== 'ongoing'}
      >
        <span className={styles.turnToken} aria-hidden="true">
          <svg className={styles.turnGlyph} viewBox="-10 -10 20 20">
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
            <span className={styles.turnDots} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </>
        ) : (
          <>YOUR TURN</>
        )}
      </div>
      <svg
        className={styles.board}
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        role="grid"
        aria-label="tic tac toe board"
      >
        {/* cells */}
        {Array.from({ length: 9 }, (_, i) => {
          const x = (i % 3) * CELL;
          const y = Math.floor(i / 3) * CELL;
          const cellValue = board[i];
          const disabled = !!cellValue || outcome.kind !== 'ongoing' || busy;
          return (
            <g
              key={i}
              ref={el => {
                cellRefs.current[i] = el;
              }}
            >
              <rect
                className={styles.cellBg}
                x={x + 6}
                y={y + 6}
                rx={10}
                ry={10}
                width={CELL - 12}
                height={CELL - 12}
              />
              {!disabled && (
                <rect
                  className={styles.cellHit}
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

        {/* grid lines — full span of the viewBox */}
        <line
          ref={el => {
            gridRefs.current[0] = el;
          }}
          className={styles.boardGridLine}
          x1={CELL}
          y1={0}
          x2={CELL}
          y2={VIEW}
        />
        <line
          ref={el => {
            gridRefs.current[1] = el;
          }}
          className={styles.boardGridLine}
          x1={CELL * 2}
          y1={0}
          x2={CELL * 2}
          y2={VIEW}
        />
        <line
          ref={el => {
            gridRefs.current[2] = el;
          }}
          className={styles.boardGridLine}
          x1={0}
          y1={CELL}
          x2={VIEW}
          y2={CELL}
        />
        <line
          ref={el => {
            gridRefs.current[3] = el;
          }}
          className={styles.boardGridLine}
          x1={0}
          y1={CELL * 2}
          x2={VIEW}
          y2={CELL * 2}
        />

        {/* marks — each wrapped in its own nested <svg> with overflow:hidden
            so its viewport clips anything outside the tile (ghost particle
            trails). the mark is positioned at the center of the inner
            viewport, not in board-level coordinates. */}
        {board.map((cell, i) => {
          if (!cell) return null;
          const x = (i % 3) * CELL;
          const y = Math.floor(i / 3) * CELL;
          const inner = CELL - 12;
          const center = inner / 2;
          return (
            <svg
              key={`mark-${i}-${cell}`}
              x={x + 6}
              y={y + 6}
              width={inner}
              height={inner}
              viewBox={`0 0 ${inner} ${inner}`}
              style={{ overflow: 'hidden' }}
            >
              <g
                ref={el => {
                  markRefs.current[i] = el;
                }}
                className={styles.markCell}
              >
                <Mark
                  mark={cell}
                  cx={center}
                  cy={center}
                  size={52}
                  winning={winningSet?.has(i) ?? false}
                />
              </g>
            </svg>
          );
        })}
      </svg>
    </div>
  );
}
