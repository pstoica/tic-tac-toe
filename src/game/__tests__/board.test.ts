import { describe, expect, it } from 'vitest';
import { EMPTY_BOARD, availableMoves, evaluate, opposite, play } from '../board';
import type { Board, Cell } from '../types';

const mk = (cells: string): Board => {
  const ls = cells.replace(/\s+/g, '').split('');
  if (ls.length !== 9) throw new Error(`expected 9 cells, got ${ls.length}`);
  return ls.map((c): Cell => (c === 'X' ? 'X' : c === 'O' ? 'O' : null)) as unknown as Board;
};

describe('opposite', () => {
  it('swaps X and O', () => {
    expect(opposite('X')).toBe('O');
    expect(opposite('O')).toBe('X');
  });
});

describe('play', () => {
  it('returns a new board with the mark placed', () => {
    const next = play(EMPTY_BOARD, 4, 'X');
    expect(next[4]).toBe('X');
    expect(EMPTY_BOARD[4]).toBe(null);
  });

  it('throws when the cell is already occupied', () => {
    const board = play(EMPTY_BOARD, 0, 'X');
    expect(() => play(board, 0, 'O')).toThrow(/occupied/);
  });
});

describe('availableMoves', () => {
  it('returns every empty index', () => {
    expect(availableMoves(EMPTY_BOARD)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('skips occupied indices', () => {
    const board = mk('XO.......');
    expect(availableMoves(board)).toEqual([2, 3, 4, 5, 6, 7, 8]);
  });
});

describe('evaluate', () => {
  it('is ongoing on an empty board', () => {
    expect(evaluate(EMPTY_BOARD)).toEqual({ kind: 'ongoing' });
  });

  it('detects a row win', () => {
    const board = mk('XXX OO. ...');
    const o = evaluate(board);
    expect(o.kind).toBe('win');
    if (o.kind === 'win') {
      expect(o.winner).toBe('X');
      expect(o.line).toEqual([0, 1, 2]);
    }
  });

  it('detects a column win', () => {
    const board = mk('OXX O.. O..');
    const o = evaluate(board);
    expect(o.kind).toBe('win');
    if (o.kind === 'win') {
      expect(o.winner).toBe('O');
      expect(o.line).toEqual([0, 3, 6]);
    }
  });

  it('detects a diagonal win', () => {
    const board = mk('X.O .X. O.X');
    const o = evaluate(board);
    expect(o.kind).toBe('win');
    if (o.kind === 'win') expect(o.line).toEqual([0, 4, 8]);
  });

  it('reports draw on a full board with no winner', () => {
    const board = mk('XOX XOO OXX');
    expect(evaluate(board)).toEqual({ kind: 'draw' });
  });
});
