import { useState } from 'react';
import type { GameResult, Stats } from '../game/stats';

interface StatsBarProps {
  stats: Stats;
  onReset: () => void;
}

const TOKEN: Record<GameResult, string> = {
  win:  'W',
  loss: 'L',
  draw: 'D',
};

export function StatsBar({ stats, onReset }: StatsBarProps) {
  const [confirming, setConfirming] = useState(false);
  const recent = stats.history.slice(-12);
  const hasAny = stats.wins + stats.losses + stats.draws > 0;

  if (confirming) {
    return (
      <div className="stats stats--confirm" role="alertdialog" aria-label="reset history confirmation">
        <span className="stats__confirm-text">Reset history?</span>
        <button
          type="button"
          className="stats__confirm-btn stats__confirm-btn--yes"
          onClick={() => { onReset(); setConfirming(false); }}
          autoFocus
        >
          Yes
        </button>
        <button
          type="button"
          className="stats__confirm-btn stats__confirm-btn--no"
          onClick={() => setConfirming(false)}
        >
          No
        </button>
      </div>
    );
  }

  return (
    <div className="stats" aria-label="win loss record">
      <div className="stats__group">
        <span className="stats__label">W</span>
        <span className="stats__value stats__value--win">{stats.wins}</span>
      </div>
      <div className="stats__group">
        <span className="stats__label">L</span>
        <span className="stats__value stats__value--loss">{stats.losses}</span>
      </div>
      <div className="stats__group">
        <span className="stats__label">D</span>
        <span className="stats__value stats__value--draw">{stats.draws}</span>
      </div>
      {recent.length > 0 && (
        <div className="stats__strip" aria-label="recent games">
          {recent.map((r, i) => (
            <span
              key={i}
              className={`stats__token stats__token--${r.result}`}
              title={r.result}
            >
              {TOKEN[r.result]}
            </span>
          ))}
        </div>
      )}
      {hasAny && (
        <button
          type="button"
          className="stats__reset"
          onClick={() => setConfirming(true)}
          aria-label="reset history"
          title="Reset history"
        >
          <svg className="stats__reset-icon" viewBox="-6 -6 12 12" aria-hidden="true">
            <path d="M -3 -3 L 3 3 M 3 -3 L -3 3" />
          </svg>
        </button>
      )}
    </div>
  );
}
