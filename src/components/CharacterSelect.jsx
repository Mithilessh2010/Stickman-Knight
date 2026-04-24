import React, { useEffect, useRef, useState } from 'react';
import { CHARACTERS } from '../game/characters.js';
import { drawStickmanPortrait } from '../game/render.js';
import { audioManager } from '../game/audio.js';

const HP_MIN = 78;
const HP_MAX = 150;
const SPD_MIN = 2.5;
const SPD_MAX = 4.3;

function StatBar({ label, value, min, max, color }) {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min))) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <span style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700 }}>
          {label}
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>
          {value}
        </span>
      </div>
      <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: color,
          boxShadow: `0 0 10px ${color}88`,
          transition: 'width 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        }} />
      </div>
    </div>
  );
}

function FighterPortrait({ charId, width = 200, height = 240, baseline = 18 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let raf;
    let t = 0;

    const loop = () => {
      t += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawStickmanPortrait(ctx, CHARACTERS[charId], canvas.width / 2, canvas.height - baseline, t);
      raf = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(raf);
  }, [charId, baseline]);

  const ch = CHARACTERS[charId];

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      style={{ filter: `drop-shadow(0 0 16px ${ch.color}66)` }}
    />
  );
}

function QuickPlayCharCard({ charId, selected, onSelect }) {
  const ch = CHARACTERS[charId];

  return (
    <div
      className={`char-card${selected ? ' selected' : ''}`}
      onClick={() => {
        onSelect(charId);
        audioManager.playUIClick();
      }}
      onMouseEnter={() => audioManager.playUIHover()}
      style={{ '--char-color': ch.color, padding: '12px 8px', gap: 6, minHeight: 168 }}
    >
      <FighterPortrait charId={charId} width={108} height={120} baseline={12} />
      <div style={{ fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: selected ? ch.color : 'var(--text-dim)', fontWeight: 700 }}>
        {ch.role}
      </div>
      <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: selected ? ch.color : 'var(--text)' }}>
        {ch.name}
      </div>
    </div>
  );
}

function AbilityRow({ label, ability, color, isUlt }) {
  const cooldown = (ability.cooldown / 60).toFixed(1);

  return (
    <div style={{
      padding: '12px 14px',
      background: isUlt ? 'rgba(255,149,0,0.05)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${isUlt ? 'rgba(255,149,0,0.22)' : 'rgba(255,255,255,0.07)'}`,
      borderLeft: `3px solid ${isUlt ? '#ff9500' : color}`,
      borderRadius: 3,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: isUlt ? '#ff9500' : color, fontWeight: 700 }}>
          {label}
        </span>
        <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
          {ability.name}
        </span>
      </div>
      <div style={{ marginTop: 5, fontSize: 11, color: 'var(--text-dim)', display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {ability.damage && <span>DMG {ability.damage}</span>}
        <span>CD {cooldown}s</span>
        <span style={{ textTransform: 'capitalize' }}>{ability.type?.replace(/([A-Z])/g, ' $1').trim()}</span>
      </div>
    </div>
  );
}

export default function CharacterSelect({ onSelect, onSettings, onBack }) {
  const ids = Object.keys(CHARACTERS);
  const [selected, setSelected] = useState(ids[0]);
  const ch = CHARACTERS[selected];
  const groupedIds = ids.reduce((groups, id) => {
    const key = CHARACTERS[id].archetype || 'Specialists';
    if (!groups[key]) groups[key] = [];
    groups[key].push(id);
    return groups;
  }, {});
  const abilities = [
    { label: 'Basic', ability: ch.basic, isUlt: false },
    { label: 'Ability 1', ability: ch.ability1, isUlt: false },
    { label: 'Ability 2', ability: ch.ability2, isUlt: false },
    { label: 'Ultimate', ability: ch.ultimate, isUlt: true },
  ];

  return (
    <div className="screen" style={{ justifyContent: 'flex-start', padding: 0 }}>
      <div style={{
        width: '100%',
        padding: '16px 28px',
        background: 'rgba(6,6,8,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        backdropFilter: 'blur(10px)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 32, letterSpacing: '0.04em' }}>QUICK PLAY</span>
          <span style={{ fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Pick a fighter, then choose a stage
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button
            className="btn ghost"
            onClick={() => { audioManager.playUIClick(); onBack?.(); }}
            style={{ padding: '7px 14px', fontSize: 11 }}
            onMouseEnter={() => audioManager.playUIHover()}
          >
            ← Back
          </button>
          <button
            className="btn ghost"
            onClick={() => { audioManager.playUIClick(); onSettings?.(); }}
            style={{ padding: '7px 14px', fontSize: 11 }}
            onMouseEnter={() => audioManager.playUIHover()}
          >
            Settings
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', width: '100%' }}>
        <div style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 24,
          padding: '14px 18px',
          background: 'rgba(0,229,255,0.05)',
          border: '1px solid rgba(0,229,255,0.15)',
          borderLeft: '3px solid var(--accent)',
          borderRadius: 2,
        }}>
          {[
            ['Single Match', 'Jump straight into a one-off fight'],
            ['Random Rival', 'A new opponent is chosen each run'],
            ['Stage Pick Next', 'Choose the arena after your fighter'],
          ].map(([title, copy]) => (
            <div key={title} style={{ minWidth: 180, flex: '1 1 180px', textAlign: 'left' }}>
              <div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700, marginBottom: 4 }}>
                {title}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.45 }}>
                {copy}
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 9, letterSpacing: '0.25em', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 14, fontWeight: 700 }}>
          Choose Your Fighter
        </div>

        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 600px', minWidth: 'min(100%, 320px)', display: 'grid', gap: 18 }}>
            {Object.entries(groupedIds).map(([group, groupIds]) => (
              <section key={group}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 9, letterSpacing: '0.22em', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                    {group}
                  </span>
                  <span style={{ height: 1, flex: 1, background: 'rgba(255,255,255,0.07)' }} />
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', fontWeight: 700 }}>
                    {groupIds.length}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(112px, 1fr))', gap: 10 }}>
                  {groupIds.map((id) => (
                    <QuickPlayCharCard
                      key={id}
                      charId={id}
                      selected={selected === id}
                      onSelect={setSelected}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div style={{
            flex: '0 1 360px',
            width: 'min(100%, 360px)',
            marginLeft: 'auto',
            padding: '20px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              inset: 'auto 0 0 0',
              height: '38%',
              background: `radial-gradient(ellipse at bottom, ${ch.color}12 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: ch.color, fontWeight: 700, textShadow: `0 0 12px ${ch.color}66` }}>
                {ch.role}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 10px' }}>
                <FighterPortrait charId={selected} />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, lineHeight: 0.95, letterSpacing: '0.04em' }}>
                {ch.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.5, marginTop: 8 }}>
                {ch.tagline}
              </div>

              <div style={{ display: 'grid', gap: 12, marginTop: 20 }}>
                <StatBar label="Weight" value={ch.maxHp} min={HP_MIN} max={HP_MAX} color={ch.color} />
                <StatBar label="Speed" value={ch.speed} min={SPD_MIN} max={SPD_MAX} color={ch.accent} />
              </div>

              <div style={{ fontSize: 9, letterSpacing: '0.22em', color: 'var(--text-dim)', textTransform: 'uppercase', marginTop: 20, marginBottom: 12, fontWeight: 700 }}>
                Move List
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {abilities.map(({ label, ability, isUlt }) => (
                  <AbilityRow
                    key={label}
                    label={label}
                    ability={ability}
                    color={ch.color}
                    isUlt={isUlt}
                  />
                ))}
              </div>

              <button
                className="btn primary"
                onClick={() => { audioManager.playUIClick(); onSelect(selected); }}
                onMouseEnter={() => audioManager.playUIHover()}
                style={{ width: '100%', marginTop: 22, padding: '15px 18px', fontSize: 15 }}
              >
                Continue to Stage Select
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
