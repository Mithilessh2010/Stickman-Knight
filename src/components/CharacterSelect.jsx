import React, { useEffect, useRef } from 'react';
import { CHARACTERS } from '../game/characters.js';
import { drawStickmanPortrait } from '../game/render.js';

function Portrait({ charId }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext('2d');
    let raf, t = 0;
    const loop = () => {
      t += 1;
      ctx.clearRect(0, 0, c.width, c.height);
      drawStickmanPortrait(ctx, CHARACTERS[charId], c.width / 2, c.height - 20, t);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [charId]);
  return <canvas ref={ref} width={170} height={190} />;
}

export default function CharacterSelect({ onSelect }) {
  const ids = ['sword', 'spear', 'mage', 'brute'];
  return (
    <div className="screen">
      <h1 className="title" style={{ fontSize: 'clamp(32px, 4.5vw, 56px)' }}>Choose Your Fighter</h1>
      <div className="subtitle">Pick a duelist · AI takes the rest</div>
      <div className="select-grid">
        {ids.map((id) => {
          const c = CHARACTERS[id];
          return (
            <div key={id} className="char-card" onClick={() => onSelect(id)}>
              <Portrait charId={id} />
              <div className="role">{c.role}</div>
              <h3>{c.name}</h3>
              <p>{c.tagline}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
