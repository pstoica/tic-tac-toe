import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Board } from './components/Board';
import { DifficultyPicker } from './components/DifficultyPicker';
import { EndScreen } from './components/EndScreen';
import { StatsBar } from './components/StatsBar';
import { animateBrandHues } from './anim';
import { EMPTY_BOARD, evaluate, opposite, play } from './game/board';
import { CpuPlayer, HumanPlayer, type Player } from './game/players';
import { appendResult, clearStats, EMPTY_STATS, loadStats, saveStats, type GameResult } from './game/stats';
import type { Board as BoardType, Difficulty, Mark, Outcome } from './game/types';

type Phase =
  | { kind: 'pick' }
  | { kind: 'playing'; difficulty: Difficulty; gameId: number }
  | { kind: 'finished'; difficulty: Difficulty; result: GameResult };

const HUMAN_MARK: Mark = 'X';
const CPU_MARK: Mark = 'O';

export function App() {
  const [phase, setPhase] = useState<Phase>({ kind: 'pick' });
  const [stats, setStats] = useState(() => loadStats());

  const startGame = useCallback((difficulty: Difficulty) => {
    setPhase({ kind: 'playing', difficulty, gameId: Date.now() });
  }, []);

  const finishGame = useCallback((difficulty: Difficulty, result: GameResult) => {
    setStats(prev => {
      const next = appendResult(prev, { result, difficulty, at: new Date().toISOString() });
      saveStats(next);
      return next;
    });
    setPhase({ kind: 'finished', difficulty, result });
  }, []);

  const resetHistory = useCallback(() => {
    clearStats();
    setStats(EMPTY_STATS);
  }, []);

  return (
    <div className="app">
      <div className="stage">
        <div className="stage__top">
          <Brand />
          <StatsBar stats={stats} onReset={resetHistory} />
        </div>

        <div className="stage__main">
          {phase.kind === 'pick' && (
            <DifficultyPicker onConfirm={startGame} />
          )}

          {phase.kind === 'playing' && (
            <GameSession
              key={phase.gameId}
              difficulty={phase.difficulty}
              onFinish={result => finishGame(phase.difficulty, result)}
            />
          )}

          {phase.kind === 'finished' && (
            <EndScreen
              result={phase.result}
              difficulty={phase.difficulty}
              onReplay={startGame}
            />
          )}
        </div>
      </div>
    </div>
  );
}

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

function Brand() {
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

interface GameSessionProps {
  difficulty: Difficulty;
  onFinish: (result: GameResult) => void;
}

function GameSession({ difficulty, onFinish }: GameSessionProps) {
  const [board, setBoard] = useState<BoardType>(EMPTY_BOARD);
  const [current, setCurrent] = useState<Mark>(HUMAN_MARK);
  const [busy, setBusy] = useState(false);

  const players = useMemo<Record<Mark, Player>>(() => ({
    X: new HumanPlayer(HUMAN_MARK, 'You'),
    O: new CpuPlayer(CPU_MARK, difficulty, 'CPU'),
  }), [difficulty]);

  const outcome: Outcome = useMemo(() => evaluate(board), [board]);
  const finishedRef = useRef(false);

  useEffect(() => {
    if (outcome.kind !== 'ongoing') return;
    const player = players[current];
    const ac = new AbortController();

    setBusy(player.kind === 'cpu');

    player.chooseMove(board, ac.signal).then(idx => {
      setBoard(prev => {
        if (prev[idx] !== null) return prev;
        return play(prev, idx, current);
      });
      setCurrent(opposite(current));
      setBusy(false);
    }).catch(err => {
      if ((err as Error).name !== 'AbortError') console.error(err);
    });

    return () => ac.abort();
  }, [board, current, outcome.kind, players]);

  useEffect(() => {
    if (outcome.kind === 'ongoing' || finishedRef.current) return;
    finishedRef.current = true;
    const result: GameResult =
      outcome.kind === 'draw' ? 'draw'
      : outcome.winner === HUMAN_MARK ? 'win'
      : 'loss';
    const t = window.setTimeout(() => onFinish(result), 1300);
    return () => window.clearTimeout(t);
  }, [outcome, onFinish]);

  const handleCellClick = useCallback((idx: number) => {
    const human = players[HUMAN_MARK] as HumanPlayer;
    if (current !== HUMAN_MARK) return;
    if (board[idx] !== null) return;
    human.submit(idx);
  }, [board, current, players]);

  return (
    <Board
      board={board}
      outcome={outcome}
      current={current}
      busy={busy}
      onCellClick={handleCellClick}
    />
  );
}
