import { useLayoutEffect, useRef, useState } from 'react';
import { animatePickerIn } from '../anim';
import type { Difficulty } from '../game/types';
import btn from '../styles/buttons.module.css';
import styles from './DifficultyPicker.module.css';

interface DifficultyPickerProps {
  initial?: Difficulty;
  title?: string;
  ctaLabel?: string;
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
  { value: 'smart', name: 'Smart', stars: 2, hue: 275, tilt: 1.8 },
  { value: 'perfect', name: 'Perfect', stars: 3, hue: 25, tilt: -2.6 },
];

export function DifficultyPicker({
  initial = 'smart',
  title = 'Choose your opponent',
  ctaLabel = 'Start',
  onConfirm,
}: DifficultyPickerProps) {
  const [selected, setSelected] = useState<Difficulty>(initial);
  const cardRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useLayoutEffect(() => {
    if (!cardRef.current) return;
    const opts = optionRefs.current.filter((o): o is HTMLButtonElement => !!o);
    animatePickerIn(cardRef.current, opts);
  }, []);

  const accentHue = OPTIONS.find(o => o.value === selected)?.hue ?? 285;

  return (
    <div className={styles.picker} ref={cardRef}>
      <h2 className={styles.pickerTitle}>{title}</h2>
      <div className={styles.pickerOptions} role="radiogroup" aria-label="difficulty">
        {OPTIONS.map((opt, i) => {
          const isSelected = selected === opt.value;
          return (
            <button
              key={opt.value}
              ref={el => {
                optionRefs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`${styles.optCard}${isSelected ? ` ${styles.optCardSelected}` : ''}`}
              style={
                {
                  '--accent-hue': opt.hue,
                  '--tilt': `${opt.tilt}deg`,
                } as React.CSSProperties
              }
              onClick={() => setSelected(opt.value)}
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
          );
        })}
      </div>
      <button
        type="button"
        className={`${btn.btn} ${btn.btnBlock}`}
        style={{ '--btn-hue': accentHue } as React.CSSProperties}
        onClick={() => onConfirm(selected)}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
