import React, { useEffect } from 'react';
import { CHARACTERS } from '../game/characters.js';

export default function EndScreen({ result, onRestart, onHome, isTournament, tournamentWinner }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') onRestart();
      if (e.code === 'Escape') onHome();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onRestart, onHome]);

  const win = result === 'player';
  const isChampion = tournamentWinner === 'player';

  if (isTournament && isChampion && result === 'player') {
    return (
      <div className="screen">
        <div className="end-card win" style={{ padding: '80px 100px' }}>
          <div className="subtitle">Tournament Complete</div>
          <h2 style={{ fontSize: 72 }}>🏆 Champion!</h2>
          <div style={{ color: 'var(--good)', letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 13 }}>
            You have conquered the arena!
          </div>
          <div className="btn-row">
            <button className="btn" onClick={onHome}>Main Menu</button>
          </div>
        </div>
      </div>
    );
  }

  const label = isTournament ? (win ? 'Round Won' : 'Eliminated') : 'Match Result';
  const winText = isTournament ? (win ? 'Advancing to next round.' : 'Your tournament run ends here.') : 'You stand alone in the arena.';
  const loseText = isTournament ? 'Your tournament run ends here.' : 'The arena claims another.';

  return (
    <div className="screen">
      <div className={`end-card ${win ? 'win' : 'lose'}`}>
        <div className="subtitle">{label}</div>
        <h2>{win ? 'Victory' : 'Defeat'}</h2>
        <div style={{ color: 'var(--text-dim)', letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 13 }}>
          {win ? winText : loseText}
        </div>
        <div className="btn-row">
          <button className="btn" onClick={onRestart}>{isTournament ? (win ? 'Next Match' : 'Main Menu') : 'Rematch'}</button>
          {!isTournament && <button className="btn ghost" onClick={onHome}>Main Menu</button>}
        </div>
      </div>
    </div>
  );
}
