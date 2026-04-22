import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { animateDrawTitle, animateEndCardIn, animateLossTitle, animateWinTitle } from '../anim';
import type { GameResult } from '../game/stats';
import { DifficultyPicker } from './DifficultyPicker';
import type { Difficulty } from '../game/types';
import btn from '../styles/buttons.module.css';
import styles from './EndScreen.module.css';

interface EndScreenProps {
  result: GameResult;
  difficulty: Difficulty;
  onReplay: (difficulty: Difficulty) => void;
}

const TITLES: Record<GameResult, string> = {
  win: 'YOU WIN',
  loss: 'YOU LOSE',
  draw: 'DRAW',
};

const HUE_FOR_RESULT: Record<GameResult, number> = {
  win: 145,
  loss: 25,
  draw: 275,
};

const VARIANT_CLASS: Record<GameResult, string> = {
  win: styles.endWin,
  loss: styles.endLoss,
  draw: styles.endDraw,
};

export function EndScreen({ result, difficulty, onReplay }: EndScreenProps) {
  const [showPicker, setShowPicker] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const chars = useMemo(() => Array.from(TITLES[result]), [result]);

  useLayoutEffect(() => {
    if (cardRef.current) animateEndCardIn(cardRef.current);
  }, []);

  useEffect(() => {
    const els = charRefs.current.filter((c): c is HTMLSpanElement => !!c);
    if (els.length === 0) return;
    if (result === 'win') return animateWinTitle(els);
    if (result === 'loss') return animateLossTitle(els);
    return animateDrawTitle(els);
  }, [result]);

  if (showPicker) {
    return (
      <div className={styles.end} role="dialog" aria-modal="true" aria-label="choose next opponent">
        <DifficultyPicker
          initial={difficulty}
          title="Pick your next opponent"
          ctaLabel="Play again"
          onConfirm={onReplay}
        />
      </div>
    );
  }

  const accentHue = HUE_FOR_RESULT[result];

  return (
    <div
      className={`${styles.end} ${VARIANT_CLASS[result]}`}
      role="dialog"
      aria-modal="true"
      aria-label={TITLES[result]}
    >
      <div className={styles.endCard} ref={cardRef}>
        <h2 className={styles.endTitle} aria-label={TITLES[result]}>
          {chars.map((ch, i) => (
            <span
              key={i}
              ref={el => {
                charRefs.current[i] = el;
              }}
              className={styles.endChar}
              aria-hidden="true"
            >
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </h2>
        <p className={styles.endSub}>
          {result === 'win' && 'clean line — run it back?'}
          {result === 'loss' && 'tough one — try again'}
          {result === 'draw' && 'dead even — rematch?'}
        </p>
        <div className={styles.endActions}>
          <button
            type="button"
            className={`${btn.btn} ${btn.btnBlock}`}
            style={{ '--btn-hue': accentHue } as React.CSSProperties}
            onClick={() => onReplay(difficulty)}
            autoFocus
          >
            Play again
          </button>
          <button
            type="button"
            className={`${btn.btn} ${btn.btnBlock} ${btn.btnGhost}`}
            onClick={() => setShowPicker(true)}
          >
            Change difficulty
          </button>
        </div>
      </div>
    </div>
  );
}
