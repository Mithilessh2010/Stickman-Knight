import React, { useEffect, useRef, useState } from 'react';
import { CHARACTERS } from '../game/characters.js';
import { drawStickmanPortrait } from '../game/render.js';
import { audioManager } from '../game/audio.js';

const HP_MIN = 78, HP_MAX = 140;
const SPD_MIN = 2.6, SPD_MAX = 4.2;

function StatBar({ label, value, min, max, color = 'var(--accent)' }) {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min))) * 100;
  return (
    <div style={{ flex: 1, minWidth: 120 }}>
      <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 4, fontWeight: 600 }}>{label}</div>
      <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, boxShadow: `0 0 8px ${color}80` }} />
      </div>
    </div>
  );
}

function DifficultyStars({ character }) {
  // Calculate difficulty based on character stats
  let difficulty = 2; // base
  if (character.speed > 3.5) difficulty += 0.5; // fast = harder
  if (character.maxHp > 120) difficulty -= 0.5; // tank = easier
  const ult = character.ultimate;
  if (ult.damage > 40) difficulty += 0.5; // high damage = harder
  difficulty = Math.max(1, Math.min(3, difficulty));

  const stars = Math.round(difficulty);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[...Array(3)].map((_, i) => (
        <span key={i} style={{ color: i < stars ? '#fbbf24' : 'rgba(255,255,255,0.2)', fontSize: 16 }}>★</span>
      ))}
    </div>
  );
}

function Portrait({ charId }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
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
  return <canvas ref={ref} width={200} height={240} style={{ filter: 'drop-shadow(0 0 20px rgba(125,211,252,0.3))' }} />;
}

function AbilityDisplay({ ability, index, character }) {
  const abilityNames = ['Basic', 'Ability 1', 'Ability 2', 'Ultimate'];
  const cooldownTicks = ability.cooldown;
  const cooldownSec = (cooldownTicks / 60).toFixed(1);

  return (
    <div style={{
      padding: '10px 12px',
      background: 'rgba(125,211,252,0.05)',
      border: `1px solid rgba(${character.color === '#7dd3fc' ? '125,211,252' : '255,255,255'},0.15)`,
      borderRadius: 6,
      marginBottom: 8,
      fontSize: 11
    }}>
      <div style={{ fontWeight: 700, marginBottom: 2, color: '#7dd3fc' }}>{abilityNames[index]}: {ability.name}</div>
      <div style={{ color: 'var(--text-dim)', lineHeight: 1.3, fontSize: 9 }}>
        Damage: {ability.damage || '—'} · Cooldown: {cooldownSec}s
      </div>
    </div>
  );
}

export default function CharacterSelect({ onSelect, onSettings }) {
  const ids = Object.keys(CHARACTERS);
  const [selected, setSelected] = useState(ids[0]);
  const character = CHARACTERS[selected];

  const handleSelect = (id) => {
    setSelected(id);
    audioManager.playUIClick();
  };

  const handleStart = () => {
    audioManager.playUIClick();
    onSelect(selected);
  };

  return (
    <div className="screen" style={{ overflow: 'auto' }}>
      {/* Header */}
      <div style={{ position: 'relative', zIndex: 10, padding: '20px', background: 'rgba(20,24,34,0.8)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(125,211,252,0.2)' }}>
        <h1 className="title" style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', margin: 0, textAlign: 'center' }}>Select Your Fighter</h1>
        <button
          className="btn ghost"
          onClick={onSettings}
          style={{
            position: 'absolute', top: 20, right: 20,
            padding: '8px 14px', fontSize: 11
          }}
          onMouseEnter={() => audioManager.playUIHover()}
        >
          ⚙ Settings
        </button>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', gap: 32, padding: 24, maxWidth: 1400, margin: '0 auto', flexWrap: 'wrap', alignItems: 'flex-start' }}>

        {/* Character Cards Grid */}
        <div style={{ flex: '0 0 auto', minWidth: 280 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-dim)', marginBottom: 12 }}>Available Fighters</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 8 }}>
            {ids.map((id) => {
              const c = CHARACTERS[id];
              const isSelected = id === selected;
              return (
                <div
                  key={id}
                  onClick={() => handleSelect(id)}
                  onMouseEnter={() => audioManager.playUIHover()}
                  style={{
                    padding: 12,
                    background: isSelected ? 'rgba(125,211,252,0.15)' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isSelected ? 'rgba(125,211,252,0.6)' : 'rgba(255,255,255,0.15)'}`,
                    borderRadius: 8,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isSelected ? '0 0 16px rgba(125,211,252,0.4)' : 'none',
                  }}
                >
                  <div style={{ fontSize: 9, fontWeight: 700, marginTop: 4, color: isSelected ? '#7dd3fc' : '#e6ebf5' }}>{c.name.split(' ')[0]}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Character Preview */}
        <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Portrait charId={selected} />
          <button
            onClick={handleStart}
            className="btn"
            style={{
              marginTop: 20,
              padding: '12px 32px',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.1em',
              boxShadow: '0 0 20px rgba(125,211,252,0.4)',
            }}
          >
            READY → FIGHT
          </button>
        </div>

        {/* Character Details */}
        <div style={{ flex: 1, minWidth: 300 }}>
          {/* Name & Role */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px 0', background: `linear-gradient(135deg, ${character.accent}, ${character.color})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {character.name}
            </h2>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: character.color, marginBottom: 8 }}>
              {character.role}
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--text-dim)', marginBottom: 12 }}>
              {character.tagline}
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginRight: 8 }}>Difficulty:</span>
              <DifficultyStars character={character} />
            </div>
          </div>

          {/* Stats */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-dim)', marginBottom: 12 }}>Character Stats</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <StatBar label="Health" value={character.maxHp} min={HP_MIN} max={HP_MAX} color={'#f87171'} />
              <StatBar label="Speed" value={character.speed} min={SPD_MIN} max={SPD_MAX} color={'#34d399'} />
              <StatBar label="Ultimate Power" value={character.ultimate.damage || 30} min={20} max={50} color={'#fbbf24'} />
            </div>
          </div>

          {/* Abilities */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-dim)', marginBottom: 12 }}>Move List</div>
            <AbilityDisplay ability={character.basic} index={0} character={character} />
            <AbilityDisplay ability={character.ability1} index={1} character={character} />
            <AbilityDisplay ability={character.ability2} index={2} character={character} />
            <AbilityDisplay ability={character.ultimate} index={3} character={character} />
          </div>

          {/* Weapon */}
          <div style={{ marginTop: 20, padding: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 6, borderLeft: `3px solid ${character.color}` }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 4 }}>Weapon</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: character.color }}>{character.weapon.toUpperCase()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
