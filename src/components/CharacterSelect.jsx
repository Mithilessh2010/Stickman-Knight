import React, { useEffect, useRef } from 'react';
import { CHARACTERS } from '../game/characters.js';
import { drawStickmanPortrait } from '../game/render.js';

const HP_MIN = 78, HP_MAX = 140;
const SPD_MIN = 2.6, SPD_MAX = 4.2;
const RNG_MIN = 48, RNG_MAX = 92;

function StatBar({ label, value, min, max }) {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min))) * 100;
  return (
    <div style={{ width: 80, marginBottom: 3 }}>
      <div style={{ fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 2 }}>{label}</div>
      <div style={{ width: 80, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent)', borderRadius: 2 }} />
      </div>
    </div>
  );
}

function Portrait({ charId }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
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
  return <canvas ref={ref} width={140} height={160} />;
}

export default function CharacterSelect({ onSelect }) {
  const ids = Object.keys(CHARACTERS);
  return (
    <div className="screen">
      <h1 className="title" style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', marginBottom: 4 }}>Choose Your Fighter</h1>
      <div className="subtitle" style={{ marginTop: 8, marginBottom: 0 }}>Pick a duelist · AI takes the opponent</div>
      <div className="select-grid">
        {ids.map((id) => {
          const c = CHARACTERS[id];
          return (
            <div key={id} className="char-card" onClick={() => onSelect(id)}>
              <Portrait charId={id} />
              <div className="role">{c.role}</div>
              <h3>{c.name}</h3>
              <p>{c.tagline}</p>
              <div style={{ marginTop: 4 }}>
                <StatBar label="HP" value={c.maxHp} min={HP_MIN} max={HP_MAX} />
                <StatBar label="SPD" value={c.speed} min={SPD_MIN} max={SPD_MAX} />
                <StatBar label="RNG" value={c.basic.range} min={RNG_MIN} max={RNG_MAX} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
