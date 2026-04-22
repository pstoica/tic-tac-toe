import { useLayoutEffect, useRef, useState } from 'react';
import { animatePickerIn } from '../anim';
import type { Difficulty } from '../game/types';

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
  { value: 'easy',    name: 'Easy',    stars: 1, hue: 145, tilt: -2.2 },
  { value: 'smart',   name: 'Smart',   stars: 2, hue: 275, tilt:  1.8 },
  { value: 'perfect', name: 'Perfect', stars: 3, hue: 25,  tilt: -2.6 },
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
    <div className="picker" ref={cardRef}>
      <h2 className="picker__title">{title}</h2>
      <div className="picker__options" role="radiogroup" aria-label="difficulty">
        {OPTIONS.map((opt, i) => {
          const isSelected = selected === opt.value;
          return (
            <button
              key={opt.value}
              ref={el => { optionRefs.current[i] = el; }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              className={`opt-card${isSelected ? ' opt-card--selected' : ''}`}
              style={{
                '--accent-hue': opt.hue,
                '--tilt': `${opt.tilt}deg`,
              } as React.CSSProperties}
              onClick={() => setSelected(opt.value)}
            >
              <span className="opt-card__name">{opt.name}</span>
              <span className="opt-card__stars" aria-label={`${opt.stars} of 3`}>
                {[1, 2, 3].map(n => (
                  <span
                    key={n}
                    className={`opt-card__star opt-card__star--${n <= opt.stars ? 'on' : 'off'}`}
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
        className="btn btn--block"
        style={{ '--btn-hue': accentHue } as React.CSSProperties}
        onClick={() => onConfirm(selected)}
      >
        {ctaLabel}
      </button>
    </div>
  );
}
