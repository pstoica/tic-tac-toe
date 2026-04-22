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
  hue: number;
}

const OPTIONS: Option[] = [
  { value: 'easy',    name: 'Easy',    hue: 145 },
  { value: 'smart',   name: 'Smart',   hue: 275 },
  { value: 'perfect', name: 'Perfect', hue: 25  },
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
              className={`picker__option${isSelected ? ' picker__option--selected' : ''}`}
              style={{ '--accent-hue': opt.hue } as React.CSSProperties}
              onClick={() => setSelected(opt.value)}
            >
              <span className="picker__pip" />
              <span>{opt.name}</span>
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
