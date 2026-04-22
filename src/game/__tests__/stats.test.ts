import { beforeEach, describe, expect, it } from 'vitest';
import {
  EMPTY_STATS,
  appendResult,
  clearStats,
  loadStats,
  saveStats,
  type GameRecord,
  type Stats,
} from '../stats';

// in-memory localStorage shim so these tests can run under node without jsdom
class MemoryStorage {
  private store = new Map<string, string>();
  getItem(k: string) {
    return this.store.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.store.set(k, v);
  }
  removeItem(k: string) {
    this.store.delete(k);
  }
  clear() {
    this.store.clear();
  }
}

beforeEach(() => {
  // fresh storage per test so we don't leak state
  (globalThis as unknown as { localStorage: MemoryStorage }).localStorage = new MemoryStorage();
});

const record = (result: GameRecord['result'], i = 0): GameRecord => ({
  result,
  difficulty: 'smart',
  at: `2026-04-22T00:00:${String(i).padStart(2, '0')}.000Z`,
});

describe('appendResult', () => {
  it('increments the right counter and appends to history', () => {
    let s: Stats = EMPTY_STATS;
    s = appendResult(s, record('win'));
    s = appendResult(s, record('loss', 1));
    s = appendResult(s, record('draw', 2));
    expect(s.wins).toBe(1);
    expect(s.losses).toBe(1);
    expect(s.draws).toBe(1);
    expect(s.history).toHaveLength(3);
  });

  it('caps history at 30 entries, keeping the most recent', () => {
    let s: Stats = EMPTY_STATS;
    for (let i = 0; i < 35; i++) s = appendResult(s, record('win', i));
    expect(s.wins).toBe(35);
    expect(s.history).toHaveLength(30);
    // first five should have been trimmed; history[0] is record 5
    expect(s.history[0]?.at.endsWith(':05.000Z')).toBe(true);
  });

  it('does not mutate the input', () => {
    const before: Stats = { ...EMPTY_STATS, history: [] };
    const after = appendResult(before, record('win'));
    expect(before.wins).toBe(0);
    expect(before.history).toHaveLength(0);
    expect(after).not.toBe(before);
  });
});

describe('persistence', () => {
  it('loadStats returns EMPTY_STATS when nothing is stored', () => {
    expect(loadStats()).toEqual(EMPTY_STATS);
  });

  it('saveStats then loadStats roundtrips', () => {
    const s = appendResult(EMPTY_STATS, record('draw'));
    saveStats(s);
    expect(loadStats()).toEqual(s);
  });

  it('clearStats wipes persisted state', () => {
    saveStats(appendResult(EMPTY_STATS, record('win')));
    clearStats();
    expect(loadStats()).toEqual(EMPTY_STATS);
  });

  it('loadStats tolerates malformed storage', () => {
    globalThis.localStorage.setItem('tictactoe:stats:v1', '{not valid json');
    expect(loadStats()).toEqual(EMPTY_STATS);
  });
});
