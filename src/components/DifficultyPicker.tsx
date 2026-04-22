import { useLayoutEffect, useRef } from 'react';
import { ensureReady } from '@web-kits/audio';
import { animatePickerIn, animatePickerOut } from '../anim';
import { useGameSounds } from '../audio';
import type { Difficulty } from '../game/types';
import styles from './DifficultyPicker.module.css';
import { Button } from './Button';

interface DifficultyPickerProps {
  title?: string;
  onConfirm: (difficulty: Difficulty) => void;
}

interface Option {
  value: Difficulty;
  name: string;
  stars: number;
  hue: number;
}

const OPTIONS: Option[] = [
  { value: 'easy', name: 'Easy', stars: 1, hue: 145 },
  { value: 'medium', name: 'Medium', stars: 2, hue: 275 },
  { value: 'hard', name: 'Hard', stars: 3, hue: 25 },
];

export function DifficultyPicker({
  title = 'Choose your difficulty',
  onConfirm,
}: DifficultyPickerProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const sounds = useGameSounds();

  useLayoutEffect(() => {
    if (!cardRef.current) return;
    const opts = optionRefs.current.filter((o): o is HTMLButtonElement => !!o);
    animatePickerIn(cardRef.current, opts);
  }, []);

  const onSelect = async (value: Difficulty) => {
    if (!cardRef.current) return;
    // first user gesture — browsers require this before any AudioContext
    // can actually produce sound. fire and forget; the play below will
    // silently no-op if the context isn't ready yet.
    ensureReady();
    sounds.place();
    const opts = optionRefs.current.filter((o): o is HTMLButtonElement => !!o);
    await animatePickerOut(cardRef.current, opts);
    onConfirm(value);
  };

  return (
    <div className={styles.picker} ref={cardRef}>
      <h2 className={styles.pickerTitle}>{title}</h2>
      <div className={styles.pickerOptions} aria-label="difficulty">
        {OPTIONS.map((opt, i) => (
          <Button
            key={opt.value}
            ref={el => {
              optionRefs.current[i] = el;
            }}
            type="button"
            className={styles.optCard}
            onClick={() => onSelect(opt.value)}
            hue={opt.hue}
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
          </Button>
        ))}
      </div>
    </div>
  );
}
