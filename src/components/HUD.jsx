import React from 'react';
import { getDisplayKey } from '../game/keybinds.js';

function AbilityIcon({ ability, keyLabel, cd, isUlt }) {
  const ready = cd <= 0;
  const cdSec = Math.ceil(cd / 60);

  // Generate simple ability icon based on ability type
  const getAbilitySymbol = (type) => {
    const symbols = {
      melee: '⚔',
      projectile: '→',
      dashStrike: '→',
      charge: '▶',
      teleport: '◈',
      nova: '◉',
      slam: '⬇',
      spin: '◯',
      shield: '🛡',
      aura: '◆',
      judgment: '✦',
      cleave: '∿',
      buffStack: '↑',
      carnage: '✕',
      roll: '↻',
      rapidFire: '⤺',
      execution: '✓',
      curse: '✗',
      explosion: '⊗',
      scythe: '𒀭',
    };
    return symbols[type] || '•';
  };

  return (
    <div style={{
      position: 'relative',
      width: isUlt ? 64 : 48,
      height: isUlt ? 64 : 48,
      borderRadius: 8,
      background: isUlt
        ? 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(251,191,36,0.1))'
        : 'rgba(125,211,252,0.1)',
      border: `2px solid ${isUlt ? (ready ? 'rgba(251,191,36,0.8)' : 'rgba(251,191,36,0.3)') : (ready ? 'rgba(125,211,252,0.6)' : 'rgba(125,211,252,0.3)')}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: ready ? (isUlt ? '0 0 12px rgba(251,191,36,0.4)' : '0 0 8px rgba(125,211,252,0.3)') : 'none',
      transition: 'all 0.2s',
      cursor: 'default',
    }}>
      {/* Ability Symbol */}
      <div style={{
        fontSize: isUlt ? 28 : 20,
        fontWeight: 700,
        color: isUlt ? '#fbbf24' : '#7dd3fc',
        textAlign: 'center',
        lineHeight: 1,
      }}>
        {getAbilitySymbol(ability.type)}
      </div>

      {/* Key Label */}
      <div style={{
        position: 'absolute',
        bottom: 4,
        fontSize: 8,
        fontWeight: 700,
        color: isUlt ? '#fbbf24' : '#7dd3fc',
        letterSpacing: '0.05em',
      }}>
        {keyLabel}
      </div>

      {/* Cooldown Overlay */}
      {!ready && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: isUlt ? 20 : 14,
          fontWeight: 700,
        }}>
          {cdSec}
        </div>
      )}

      {/* Ready Indicator */}
      {ready && (
        <div style={{
          position: 'absolute',
          top: -6,
          right: -6,
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: isUlt ? '#fbbf24' : '#34d399',
          border: '2px solid rgba(0,0,0,0.8)',
          fontSize: 10,
          lineHeight: '14px',
          textAlign: 'center',
          color: '#000',
          fontWeight: 700,
        }}>
          ✓
        </div>
      )}
    </div>
  );
}

export default function HUD({ player, enemy, keybinds }) {
  if (!player || !enemy || !keybinds) return null;

  const pPct = Math.max(0, player.hp / player.character.maxHp) * 100;
  const ePct = Math.max(0, enemy.hp / enemy.character.maxHp) * 100;

  // Determine health bar color
  const getHpColor = (pct) => {
    if (pct > 60) return '#34d399'; // green
    if (pct > 30) return '#fbbf24'; // yellow
    return '#f87171'; // red
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      fontSize: 'clamp(10px, 1vw, 14px)',
      fontFamily: '"Rajdhani", system-ui, sans-serif',
    }}>
      {/* Player Side (Top Left) */}
      <div style={{
        position: 'absolute',
        top: 16,
        left: 16,
        width: 'clamp(220px, 25vw, 320px)',
      }}>
        {/* Fighter Name & Portrait */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 50,
            height: 50,
            borderRadius: 6,
            background: `linear-gradient(135deg, ${player.character.color}22, ${player.character.accent}22)`,
            border: `2px solid ${player.character.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            fontWeight: 700,
            color: player.character.color,
            flexShrink: 0,
          }}>
            {player.character.name[0]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: player.character.color, marginBottom: 2 }}>
              {player.character.name}
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-dim)', fontWeight: 600 }}>
              {player.character.role}
            </div>
          </div>
        </div>

        {/* Health Bar */}
        <div style={{
          width: '100%',
          height: 24,
          background: 'rgba(0,0,0,0.4)',
          border: `1px solid ${getHpColor(pPct)}`,
          borderRadius: 4,
          overflow: 'hidden',
          marginBottom: 12,
          position: 'relative',
          boxShadow: `inset 0 0 8px ${getHpColor(pPct)}40`,
        }}>
          <div style={{
            width: `${pPct}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${getHpColor(pPct)}, ${getHpColor(pPct)}aa)`,
            transition: 'width 0.1s',
            boxShadow: `0 0 8px ${getHpColor(pPct)}80`,
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
            color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            pointerEvents: 'none',
          }}>
            {Math.ceil(player.hp)} / {player.character.maxHp}
          </div>
        </div>

        {/* Abilities */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
        }}>
          <AbilityIcon
            ability={player.character.basic}
            keyLabel={getDisplayKey('basic', keybinds)}
            cd={player.cooldowns.basic}
          />
          <AbilityIcon
            ability={player.character.ability1}
            keyLabel={getDisplayKey('ability1', keybinds)}
            cd={player.cooldowns.ability1}
          />
          <AbilityIcon
            ability={player.character.ability2}
            keyLabel={getDisplayKey('ability2', keybinds)}
            cd={player.cooldowns.ability2}
          />
          <AbilityIcon
            ability={player.character.ultimate}
            keyLabel={getDisplayKey('ultimate', keybinds)}
            cd={player.cooldowns.ultimate}
            isUlt
          />
        </div>
      </div>

      {/* Enemy Side (Top Right) */}
      <div style={{
        position: 'absolute',
        top: 16,
        right: 16,
        width: 'clamp(220px, 25vw, 320px)',
        textAlign: 'right',
      }}>
        {/* Fighter Name & Portrait */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexDirection: 'row-reverse' }}>
          <div style={{
            width: 50,
            height: 50,
            borderRadius: 6,
            background: `linear-gradient(135deg, ${enemy.character.color}22, ${enemy.character.accent}22)`,
            border: `2px solid ${enemy.character.color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            fontWeight: 700,
            color: enemy.character.color,
            flexShrink: 0,
          }}>
            {enemy.character.name[0]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: enemy.character.color, marginBottom: 2 }}>
              {enemy.character.name}
            </div>
            <div style={{ fontSize: 9, color: 'var(--text-dim)', fontWeight: 600 }}>
              {enemy.character.role}
            </div>
          </div>
        </div>

        {/* Health Bar */}
        <div style={{
          width: '100%',
          height: 24,
          background: 'rgba(0,0,0,0.4)',
          border: `1px solid ${getHpColor(ePct)}`,
          borderRadius: 4,
          overflow: 'hidden',
          marginBottom: 12,
          position: 'relative',
          boxShadow: `inset 0 0 8px ${getHpColor(ePct)}40`,
        }}>
          <div style={{
            width: `${ePct}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${getHpColor(ePct)}aa, ${getHpColor(ePct)})`,
            transition: 'width 0.1s',
            boxShadow: `0 0 8px ${getHpColor(ePct)}80`,
            marginLeft: 'auto',
          }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
            color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            pointerEvents: 'none',
          }}>
            {Math.ceil(enemy.hp)} / {enemy.character.maxHp}
          </div>
        </div>
      </div>
    </div>
  );
}
