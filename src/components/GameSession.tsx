import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Board } from './Board';
import { CPU_MARK, HUMAN_MARK } from '../game/constants';
import { EMPTY_BOARD, evaluate, opposite, play } from '../game/board';
import { CpuPlayer, HumanPlayer, type Player } from '../game/players';
import type { GameResult } from '../game/stats';
import type { Board as BoardType, Difficulty, Mark, Outcome } from '../game/types';

interface GameSessionProps {
  difficulty: Difficulty;
  onFinish: (result: GameResult) => void;
  /** fired once when the outcome settles and we start the pre-EndScreen delay */
  onCalculating?: () => void;
}

export function GameSession({ difficulty, onFinish, onCalculating }: GameSessionProps) {
  const [board, setBoard] = useState<BoardType>(EMPTY_BOARD);
  const [current, setCurrent] = useState<Mark>(HUMAN_MARK);

  const players = useMemo<Record<Mark, Player>>(
    () => ({
      X: new HumanPlayer(HUMAN_MARK),
      O: new CpuPlayer(CPU_MARK, difficulty),
    }),
    [difficulty],
  );

  const outcome: Outcome = useMemo(() => evaluate(board), [board]);
  // derived from current + outcome — no need to track it as state
  const busy = players[current].kind === 'cpu' && outcome.kind === 'ongoing';
  const finishedRef = useRef(false);

  useEffect(() => {
    if (outcome.kind !== 'ongoing') return;
    const player = players[current];
    const ac = new AbortController();

    player
      .chooseMove(board, ac.signal)
      .then(idx => {
        setBoard(prev => {
          if (prev[idx] !== null) return prev;
          return play(prev, idx, current);
        });
        setCurrent(opposite(current));
      })
      .catch(err => {
        if ((err as Error).name !== 'AbortError') console.error(err);
      });

    return () => ac.abort();
  }, [board, current, outcome.kind, players]);

  useEffect(() => {
    if (outcome.kind === 'ongoing' || finishedRef.current) return;
    finishedRef.current = true;
    onCalculating?.();
    const result: GameResult =
      outcome.kind === 'draw' ? 'draw' : outcome.winner === HUMAN_MARK ? 'win' : 'loss';
    const t = window.setTimeout(() => onFinish(result), 1300);
    return () => window.clearTimeout(t);
  }, [outcome, onFinish, onCalculating]);

  const handleCellClick = useCallback(
    (idx: number) => {
      const human = players[HUMAN_MARK] as HumanPlayer;
      if (current !== HUMAN_MARK) return;
      if (board[idx] !== null) return;
      human.submit(idx);
    },
    [board, current, players],
  );

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
