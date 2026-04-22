import React from 'react'
import { CHAR_COLORS, CHAR_DEFS } from '../game/constants.js'

const ABILITY_KEYS = [
  { key: 'q', label: 'Q', name: '' },
  { key: 'e', label: 'E', name: '' },
  { key: 'r', label: 'R', name: '' },
  { key: 'ult', label: 'F', name: '★' },
]

function HealthBar({ hp, maxHp, color, reversed }) {
  const pct = Math.max(0, hp / maxHp) * 100
  const isLow = pct < 25
  return (
    <div style={{ flex: 1, height: 18, background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        [reversed ? 'right' : 'left']: 0,
        top: 0, height: '100%',
        width: `${pct}%`,
        background: isLow ? `linear-gradient(90deg, #ef4444, #ff6b35)` : color,
        boxShadow: `0 0 12px ${isLow ? '#ef4444' : color}`,
        transition: 'width 0.12s ease',
      }} />
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
        justifyContent: reversed ? 'flex-start' : 'flex-end',
        paddingInline: 6,
        fontFamily: "'Share Tech Mono', monospace", fontSize: 11, color: '#fff',
        textShadow: '0 0 4px #000',
      }}>
        {Math.ceil(hp)}
      </div>
    </div>
  )
}

function AbilityIcon({ label, name, cooldown, maxCooldown, color, isUlt }) {
  const pct = maxCooldown > 0 ? Math.max(0, cooldown / maxCooldown) : 0
  const ready = cooldown === 0
  return (
    <div style={{
      width: isUlt ? 42 : 36, height: isUlt ? 42 : 36,
      border: `1px solid ${ready ? color : 'rgba(255,255,255,0.15)'}`,
      background: ready ? `rgba(${hexToRgbStr(color)},0.15)` : 'rgba(0,0,0,0.4)',
      position: 'relative', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      boxShadow: ready ? `0 0 10px ${color}` : 'none',
      transition: 'all 0.2s',
    }}>
      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: isUlt ? 16 : 14, color: ready ? color : 'rgba(255,255,255,0.3)', lineHeight: 1 }}>
        {isUlt ? '★' : label}
      </div>
      {!ready && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `rgba(0,0,0,${pct * 0.7})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 9, color: 'rgba(255,255,255,0.5)' }}>
            {Math.ceil(cooldown / 60)}s
          </div>
        </div>
      )}
    </div>
  )
}

export default function HUD({ player, enemy, tick }) {
  if (!player || !enemy) return null
  const pColor = CHAR_COLORS[player.charId]?.primary || '#00c8ff'
  const eColor = CHAR_COLORS[enemy.charId]?.primary || '#ef4444'

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      padding: '10px 16px', display: 'flex', alignItems: 'flex-start', gap: 16,
      pointerEvents: 'none', zIndex: 10,
    }}>
      {/* Player side */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, color: pColor, letterSpacing: '0.1em', textShadow: `0 0 12px ${pColor}`, whiteSpace: 'nowrap' }}>
            {player.charId.toUpperCase()}
          </div>
          <HealthBar hp={player.hp} maxHp={player.maxHp} color={pColor} />
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {ABILITY_KEYS.map(a => (
            <AbilityIcon
              key={a.key}
              label={a.label}
              cooldown={player.cooldowns[a.key] || 0}
              maxCooldown={CHAR_DEFS[player.charId]?.attacks[a.key]?.cooldown || 1}
              color={pColor}
              isUlt={a.key === 'ult'}
            />
          ))}
        </div>
      </div>

      {/* VS */}
      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.2em', paddingTop: 4 }}>VS</div>

      {/* Enemy side */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', flexDirection: 'row-reverse' }}>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, color: eColor, letterSpacing: '0.1em', textShadow: `0 0 12px ${eColor}`, whiteSpace: 'nowrap' }}>
            {enemy.charId.toUpperCase()} · CPU
          </div>
          <HealthBar hp={enemy.hp} maxHp={enemy.maxHp} color={eColor} reversed />
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {ABILITY_KEYS.map(a => (
            <AbilityIcon
              key={a.key}
              label={a.label}
              cooldown={enemy.cooldowns[a.key] || 0}
              maxCooldown={CHAR_DEFS[enemy.charId]?.attacks[a.key]?.cooldown || 1}
              color={eColor}
              isUlt={a.key === 'ult'}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function hexToRgbStr(hex) {
  const r = parseInt(hex.slice(1,3),16)
  const g = parseInt(hex.slice(3,5),16)
  const b = parseInt(hex.slice(5,7),16)
  return `${r},${g},${b}`
}
