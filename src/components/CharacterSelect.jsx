import React, { useState } from 'react'

const CHARACTERS = [
  {
    id: 'sword',
    name: 'Sword Fighter',
    title: 'THE DUELIST',
    color: '#ff6b35',
    glow: 'rgba(255,107,53,0.6)',
    desc: 'Master of precise strikes. Swift combos and a devastating counter-attack make this warrior dangerous at close range.',
    stats: { power: 7, speed: 8, range: 5, defense: 6 },
    abilities: ['Quick Slash', 'Blade Dash', 'Counter Stance'],
    ultimate: 'Flurry of Five',
    icon: '⚔️',
  },
  {
    id: 'spear',
    name: 'Spear Fighter',
    title: 'THE LANCER',
    color: '#4ecdc4',
    glow: 'rgba(78,205,196,0.6)',
    desc: 'Dominates distance with superior reach. Piercing thrusts and a spinning sweep keep enemies at bay.',
    stats: { power: 7, speed: 6, range: 9, defense: 5 },
    abilities: ['Long Thrust', 'Spinning Sweep', 'Vault Kick'],
    ultimate: 'Spear Storm',
    icon: '🔱',
  },
  {
    id: 'mage',
    name: 'Mage',
    title: 'THE ARCANIST',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.6)',
    desc: 'Bends reality with arcane power. Projectiles, teleports, and a screen-wide nova make every duel unpredictable.',
    stats: { power: 9, speed: 5, range: 10, defense: 3 },
    abilities: ['Arcane Bolt', 'Blink', 'Frost Nova'],
    ultimate: 'Meteor Strike',
    icon: '🔮',
  },
  {
    id: 'brute',
    name: 'Brute',
    title: 'THE CRUSHER',
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.6)',
    desc: 'Pure destructive force. Massive damage, ground slams, and an unstoppable charge crush anything in the way.',
    stats: { power: 10, speed: 4, range: 4, defense: 9 },
    abilities: ['Heavy Smash', 'Ground Slam', 'Shoulder Charge'],
    ultimate: 'Berserker Rage',
    icon: '🪨',
  },
]

function StatBar({ value, color }) {
  return (
    <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
      <div style={{ width: `${value * 10}%`, height: '100%', background: color, borderRadius: 3, boxShadow: `0 0 8px ${color}`, transition: 'width 0.4s ease' }} />
    </div>
  )
}

export default function CharacterSelect({ onSelect, onBack }) {
  const [hovered, setHovered] = useState(null)
  const [selected, setSelected] = useState(null)
  const active = hovered || selected || CHARACTERS[0]

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#080c14', padding: '24px 32px', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={onBack} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', fontFamily: "'Rajdhani',sans-serif", fontSize: 14, padding: '6px 16px', cursor: 'pointer', letterSpacing: '0.1em' }}>← BACK</button>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, letterSpacing: '0.15em', color: '#fff' }}>SELECT YOUR WARRIOR</div>
        <div style={{ marginLeft: 'auto', fontFamily: "'Share Tech Mono',monospace", fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>4 CHARACTERS AVAILABLE</div>
      </div>
      <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(0,200,255,0.5), transparent)' }} />

      <div style={{ flex: 1, display: 'flex', gap: 24, minHeight: 0 }}>
        {/* Character cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 220 }}>
          {CHARACTERS.map(c => (
            <div
              key={c.id}
              onMouseEnter={() => setHovered(c)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelected(c)}
              style={{
                padding: '14px 18px', cursor: 'pointer', border: `1px solid ${active?.id === c.id ? c.color : 'rgba(255,255,255,0.08)'}`,
                background: active?.id === c.id ? `rgba(${hexToRgb(c.color)},0.1)` : 'rgba(255,255,255,0.03)',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: active?.id === c.id ? `0 0 20px ${c.glow}` : 'none',
              }}
            >
              <div style={{ fontSize: 28 }}>{c.icon}</div>
              <div>
                <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 17, color: active?.id === c.id ? c.color : '#ccc', letterSpacing: '0.05em' }}>{c.name}</div>
                <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>{c.title}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {active && (
          <div style={{ flex: 1, border: `1px solid rgba(${hexToRgb(active.color)},0.3)`, background: `rgba(${hexToRgb(active.color)},0.05)`, padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 52, color: active.color, lineHeight: 1, textShadow: `0 0 30px ${active.glow}` }}>{active.name}</div>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', marginTop: 4 }}>{active.title}</div>
            </div>
            <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: 480 }}>{active.desc}</div>

            {/* Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', marginBottom: 4 }}>COMBAT STATS</div>
              {Object.entries(active.stats).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.5)', width: 64, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{k}</div>
                  <StatBar value={v} color={active.color} />
                  <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 12, color: active.color, width: 24 }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Abilities */}
            <div>
              <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', marginBottom: 10 }}>ABILITIES</div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {active.abilities.map((ab, i) => (
                  <div key={i} style={{ padding: '6px 14px', border: `1px solid rgba(${hexToRgb(active.color)},0.4)`, fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, fontSize: 14, color: active.color, letterSpacing: '0.06em', background: `rgba(${hexToRgb(active.color)},0.08)` }}>
                    {['Q', 'E', 'R'][i]} · {ab}
                  </div>
                ))}
                <div style={{ padding: '6px 14px', border: '1px solid rgba(255,220,0,0.5)', fontFamily: "'Rajdhani',sans-serif", fontWeight: 700, fontSize: 14, color: '#ffd700', letterSpacing: '0.06em', background: 'rgba(255,220,0,0.08)' }}>
                  F · {active.ultimate}
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <button
                onClick={() => onSelect(active.id)}
                style={{
                  fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, letterSpacing: '0.15em',
                  padding: '16px 64px', background: active.color, color: '#080c14',
                  border: 'none', cursor: 'pointer', boxShadow: `0 0 30px ${active.glow}`,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.target.style.transform = 'scale(1.04)'; e.target.style.boxShadow = `0 0 50px ${active.glow}` }}
                onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = `0 0 30px ${active.glow}` }}
              >
                FIGHT AS {active.name.toUpperCase()}
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em', textAlign: 'center' }}>
        WASD / ARROWS: MOVE · J/Z: ATTACK · Q E R: ABILITIES · F: ULTIMATE
      </div>
    </div>
  )
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}
