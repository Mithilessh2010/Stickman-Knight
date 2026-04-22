import React, { useEffect } from 'react';

export default function EndScreen({ result, onRestart, onHome }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') onRestart();
      if (e.code === 'Escape') onHome();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onRestart, onHome]);

  const win = result === 'player';
  return (
    <div className="screen">
      <div className={`end-card ${win ? 'win' : 'lose'}`}>
        <div className="subtitle">Match Result</div>
        <h2>{win ? 'Victory' : 'Defeat'}</h2>
        <div style={{ color: 'var(--text-dim)', letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 13 }}>
          {win ? 'You stand alone in the arena.' : 'The arena claims another.'}
        </div>
        <div className="btn-row">
          <button className="btn" onClick={onRestart}>Rematch</button>
          <button className="btn ghost" onClick={onHome}>Main Menu</button>
        </div>
      </div>
    </div>
  );
}
