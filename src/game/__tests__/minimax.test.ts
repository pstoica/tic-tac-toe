import { describe, expect, it } from 'vitest';
import { EMPTY_BOARD, evaluate, opposite, play } from '../board';
import { bestMove } from '../minimax';
import type { Board, Cell, Mark } from '../types';

const mk = (cells: string): Board => {
  const ls = cells.replace(/\s+/g, '').split('');
  if (ls.length !== 9) throw new Error(`expected 9 cells, got ${ls.length}`);
  return ls.map((c): Cell => (c === 'X' ? 'X' : c === 'O' ? 'O' : null)) as unknown as Board;
};

describe('bestMove', () => {
  it('takes the winning move when available', () => {
    // X has two in a row across the top; index 2 finishes it.
    const board = mk('XX. OO. ...');
    expect(bestMove(board, 'X')).toBe(2);
  });

  it('blocks an immediate opponent win', () => {
    // O threatens the top row at index 2; X has no winning move of its own,
    // so the only correct play is to block.
    const board = mk('OO. X.. ...');
    expect(bestMove(board, 'X')).toBe(2);
  });

  it('prefers a quicker win over a slower one (depth tie-break)', () => {
    // X to move. Index 2 is an immediate win on the top row;
    // any other move just wastes a tempo. A non-depth-aware minimax
    // would tie these as "both lead to a win" and might pick wrong.
    const board = mk('XX. .O. .O.');
    expect(bestMove(board, 'X')).toBe(2);
  });

  it('perfect vs. perfect is always a draw', () => {
    let board: Board = EMPTY_BOARD;
    let turn: Mark = 'X';
    for (let i = 0; i < 9; i++) {
      const o = evaluate(board);
      if (o.kind !== 'ongoing') break;
      board = play(board, bestMove(board, turn), turn);
      turn = opposite(turn);
    }
    expect(evaluate(board)).toEqual({ kind: 'draw' });
  });
});
