import { useLayoutEffect, useRef } from 'react';
import { animatePickerIn } from '../anim';
import type { Difficulty } from '../game/types';
import styles from './DifficultyPicker.module.css';

interface DifficultyPickerProps {
  title?: string;
  onConfirm: (difficulty: Difficulty) => void;
}

interface Option {
  value: Difficulty;
  name: string;
  stars: number;
  hue: number;
  tilt: number;
}

// tilts are deliberately small + fixed so the cards feel hand-placed without
// jittering on re-render. one leans right, two lean left — asymmetric.
const OPTIONS: Option[] = [
  { value: 'easy', name: 'Easy', stars: 1, hue: 145, tilt: -2.2 },
  { value: 'medium', name: 'Medium', stars: 2, hue: 275, tilt: 1.8 },
  { value: 'hard', name: 'Hard', stars: 3, hue: 25, tilt: -2.6 },
];

export function DifficultyPicker({
  title = 'Choose your opponent',
  onConfirm,
}: DifficultyPickerProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useLayoutEffect(() => {
    if (!cardRef.current) return;
    const opts = optionRefs.current.filter((o): o is HTMLButtonElement => !!o);
    animatePickerIn(cardRef.current, opts);
  }, []);

  return (
    <div className={styles.picker} ref={cardRef}>
      <h2 className={styles.pickerTitle}>{title}</h2>
      <div className={styles.pickerOptions} aria-label="difficulty">
        {OPTIONS.map((opt, i) => (
          <button
            key={opt.value}
            ref={el => {
              optionRefs.current[i] = el;
            }}
            type="button"
            className={styles.optCard}
            style={
              {
                '--accent-hue': opt.hue,
                '--tilt': `${opt.tilt}deg`,
              } as React.CSSProperties
            }
            onClick={() => onConfirm(opt.value)}
          >
            <span className={styles.optCardName}>{opt.name}</span>
            <span className={styles.optCardStars} aria-label={`${opt.stars} of 3`}>
              {[1, 2, 3].map(n => (
                <span
                  key={n}
                  className={`${styles.optCardStar} ${n <= opt.stars ? styles.optCardStarOn : styles.optCardStarOff}`}
                  aria-hidden="true"
                >
                  ★
                </span>
              ))}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
