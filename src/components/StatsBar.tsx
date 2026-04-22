import type { GameResult, Stats } from '../game/stats';

interface StatsBarProps {
  stats: Stats;
}

const TOKEN: Record<GameResult, string> = {
  win:  'W',
  loss: 'L',
  draw: 'D',
};

export function StatsBar({ stats }: StatsBarProps) {
  const recent = stats.history.slice(-12);
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
    </div>
  );
}
