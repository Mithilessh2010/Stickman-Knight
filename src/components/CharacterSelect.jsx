import React, { useEffect, useRef, useState } from 'react';
import { CHARACTERS } from '../game/characters.js';
import { drawStickmanPortrait } from '../game/render.js';
import { audioManager } from '../game/audio.js';

const HP_MIN = 78, HP_MAX = 140;
const SPD_MIN = 2.5, SPD_MAX = 4.2;

function StatBar({ label, value, min, max, color = '#00e5ff' }) {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min))) * 100;
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 5, fontWeight: 700 }}>{label}</div>
      <div style={{ width: '100%', height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2, boxShadow: `0 0 6px ${color}88`, transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1)' }} />
      </div>
    </div>
  );
}

function Portrait({ charId }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    let raf, t = 0;
    const loop = () => { t++; ctx.clearRect(0, 0, c.width, c.height); drawStickmanPortrait(ctx, CHARACTERS[charId], c.width / 2, c.height - 16, t); raf = requestAnimationFrame(loop); };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [charId]);
  const ch = CHARACTERS[charId];
  return <canvas ref={ref} width={160} height={210} style={{ filter: `drop-shadow(0 0 16px ${ch.color}66)` }} />;
}

const CHAR_ICONS = { sword: '⚔', spear: '🔱', mage: '✦', brute: '👊', assassin: '◈', archer: '◎', elemental: '🔥', summoner: '◉', paladin: '✙', berserker: '⚡', gunslinger: '◆', necromancer: '☽' };

export default function CharacterSelect({ onSelect, onSettings }) {
  const ids = Object.keys(CHARACTERS);
  const [selected, setSelected] = useState(ids[0]);
  const ch = CHARACTERS[selected];

  const abilities = [ch.basic, ch.ability1, ch.ability2, ch.ultimate];
  const abilityLabels = ['Basic', 'Ability 1', 'Ability 2', 'Ultimate'];

  return (
    <div className="screen" style={{ justifyContent: 'flex-start', padding: 0, overflow: 'hidden' }}>
      {/* Header bar */}
      <div style={{
        width: '100%', padding: '16px 28px',
        background: 'rgba(6,6,8,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backdropFilter: 'blur(10px)', flexShrink: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 32, letterSpacing: '0.04em', lineHeight: 1 }}>SELECT FIGHTER</span>
          <span style={{ fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{ids.length} available</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn ghost" onClick={() => { audioManager.playUIClick(); onSettings(); }} style={{ padding: '7px 14px', fontSize: 11 }} onMouseEnter={() => audioManager.playUIHover()}>⚙ Settings</button>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', width: '100%' }}>

        {/* Left — grid */}
        <div style={{ width: 'clamp(260px, 28vw, 380px)', borderRight: '1px solid rgba(255,255,255,0.06)', overflowY: 'auto', padding: '20px 16px', flexShrink: 0 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.25em', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>Fighters</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {ids.map((id) => {
              const c = CHARACTERS[id];
              const isSelected = id === selected;
              return (
                <div key={id} onClick={() => { setSelected(id); audioManager.playUIClick(); }}
                  onMouseEnter={() => audioManager.playUIHover()}
                  className={`char-card${isSelected ? ' selected' : ''}`}
                  style={{ '--char-color': c.color, padding: '12px 8px' }}>
                  <div style={{ fontSize: 20, marginBottom: 4, color: isSelected ? c.color : 'var(--text-dim)', filter: isSelected ? `drop-shadow(0 0 6px ${c.color})` : 'none', transition: 'all 0.2s' }}>
                    {CHAR_ICONS[id] || '•'}
                  </div>
                  <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: isSelected ? c.color : 'var(--text)', transition: 'color 0.2s', textAlign: 'center' }}>
                    {c.name.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: 8, color: 'var(--text-dim)', marginTop: 1, letterSpacing: '0.05em' }}>{c.role}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center — portrait */}
        <div style={{ flex: '0 0 auto', width: 'clamp(200px, 22vw, 280px)', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}>
          {/* Color accent bg */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: `radial-gradient(ellipse at bottom, ${ch.color}10 0%, transparent 70%)`, pointerEvents: 'none' }} />
          <div style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: ch.color, marginBottom: 12, fontWeight: 700, textShadow: `0 0 14px ${ch.color}88` }}>
            {ch.role}
          </div>
          <Portrait charId={selected} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: '0.05em', marginTop: 8, color: '#fff' }}>{ch.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4, lineHeight: 1.4, textAlign: 'center', maxWidth: 200 }}>{ch.tagline}</div>

          {/* Stats */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
            <StatBar label="Health" value={ch.maxHp} min={HP_MIN} max={HP_MAX} color={ch.color} />
            <StatBar label="Speed" value={ch.speed} min={SPD_MIN} max={SPD_MAX} color={ch.accent} />
          </div>
        </div>

        {/* Right — abilities + confirm */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 9, letterSpacing: '0.25em', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: 16, fontWeight: 700 }}>Abilities</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {abilities.map((ab, i) => {
              const isUlt = i === 3;
              const cdSec = (ab.cooldown / 60).toFixed(1);
              return (
                <div key={i} style={{
                  padding: '14px 16px',
                  background: isUlt ? 'rgba(255,149,0,0.05)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isUlt ? 'rgba(255,149,0,0.2)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: 3,
                  borderLeft: `3px solid ${isUlt ? '#ff9500' : ch.color}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: isUlt ? '#ff9500' : ch.color, fontWeight: 700 }}>{abilityLabels[i]}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '0.05em' }}>{ab.name}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', display: 'flex', gap: 16 }}>
                    {ab.damage && <span>DMG: <span style={{ color: 'var(--text)', fontWeight: 700 }}>{ab.damage}</span></span>}
                    <span>CD: <span style={{ color: 'var(--text)', fontWeight: 700 }}>{cdSec}s</span></span>
                    <span style={{ textTransform: 'capitalize' }}>{ab.type?.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: 24 }}>
            <button className="btn primary"
              onClick={() => { audioManager.playUIClick(); onSelect(selected); }}
              onMouseEnter={() => audioManager.playUIHover()}
              style={{ width: '100%', padding: '16px', fontSize: 16, letterSpacing: '0.22em' }}>
              Fight as {ch.name.split(' ')[0]}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
