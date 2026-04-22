import React, { useRef, useEffect } from 'react';
import { CHARACTERS } from '../game/characters.js';
import { drawStickmanPortrait } from '../game/render.js';
import { createTournament } from '../game/tournament.js';

function TournamentCharCard({ charId, selected, onSelect }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    let raf, t = 0;
    const loop = () => {
      t += 1;
      ctx.clearRect(0, 0, c.width, c.height);
      drawStickmanPortrait(ctx, CHARACTERS[charId], c.width / 2, c.height - 16, t);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [charId]);

  const character = CHARACTERS[charId];

  return (
    <div
      className={`char-card ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(charId)}
      style={{
        border: selected ? '2px solid #34d399' : undefined,
        boxShadow: selected ? '0 0 30px rgba(52, 211, 153, 0.3)' : undefined,
        background: selected ? 'rgba(52, 211, 153, 0.1)' : undefined
      }}
    >
      <canvas ref={canvasRef} width={140} height={160} />
      <div className="role">{character.role}</div>
      <h3>{character.name}</h3>
      <p>{character.tagline}</p>
    </div>
  );
}

export default function TournamentScreen({ onStart }) {
  const [selectedChar, setSelectedChar] = React.useState(null);
  const ids = Object.keys(CHARACTERS);

  const handleStart = () => {
    if (!selectedChar) return;
    const tournament = createTournament(selectedChar);
    onStart(tournament);
  };

  return (
    <div className="screen">
      <h1 className="title" style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', marginBottom: 4 }}>
        Tournament Mode
      </h1>
      <div className="subtitle" style={{ marginTop: 8, marginBottom: 20 }}>
        Single Elimination · 4 Rounds to Victory
      </div>

      <div className="select-grid">
        {ids.map((id) => (
          <TournamentCharCard
            key={id}
            charId={id}
            selected={selectedChar === id}
            onSelect={setSelectedChar}
          />
        ))}
      </div>

      <button
        className="btn"
        onClick={handleStart}
        disabled={!selectedChar}
        style={{
          marginTop: 30,
          opacity: selectedChar ? 1 : 0.5,
          cursor: selectedChar ? 'pointer' : 'not-allowed'
        }}
      >
        Begin Tournament
      </button>
    </div>
  );
}
