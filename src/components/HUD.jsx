import React from 'react';
import { getDisplayKey } from '../game/keybinds.js';

const ABILITY_SYMBOLS = {
  melee: '⚔', projectile: '→', dashStrike: '⇒', charge: '▶▶',
  teleport: '◈', nova: '◉', slam: '▼', spin: '↻',
  shield: '◫', aura: '✦', judgment: '✧', cleave: '∿',
  buffStack: '↑↑', carnage: '✕', roll: '↺', rapidFire: '⤺',
  execution: '⦿', curse: '⊖', explosion: '⊛', scythe: '⌒',
  shadowStep: '◆', smokeBomb: '●', deathMark: '◎', flameDash: '⇝',
  lavaPool: '⊕', eruption: '⊙', summon: '⊞', boneShield: '⊟',
  titan: '⊠', vault: '⤴', backflip: '⤵', rain: '↓↓',
  meteor: '☄', piercingShot: '→→', arrowStorm: '↓', buff: '▲',
};

function Pip({ color, label, ready }) {
  return (
    <div style={{
      width: 5, height: 5, borderRadius: '50%',
      background: ready ? color : 'rgba(255,255,255,0.12)',
      boxShadow: ready ? `0 0 5px ${color}` : 'none',
      transition: 'all 0.2s',
    }} title={label} />
  );
}

function AbilitySlot({ ability, keyLabel, cd, isUlt, charColor }) {
  const ready = cd <= 0;
  const cdSec = Math.ceil(cd / 60);
  const color = isUlt ? '#ff9500' : charColor;
  const size = isUlt ? 56 : 44;

  return (
    <div style={{
      position: 'relative', width: size, height: size,
      borderRadius: 2,
      background: isUlt ? 'rgba(255,149,0,0.07)' : 'rgba(255,255,255,0.04)',
      border: `1px solid ${ready ? (isUlt ? 'rgba(255,149,0,0.6)' : `${charColor}66`) : 'rgba(255,255,255,0.09)'}`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      boxShadow: ready ? `0 0 10px ${color}30` : 'none',
      transition: 'all 0.18s',
      overflow: 'hidden',
    }}>
      {/* Symbol */}
      <div style={{
        fontSize: isUlt ? 22 : 16,
        color: ready ? color : 'rgba(255,255,255,0.25)',
        lineHeight: 1, transition: 'color 0.2s',
        textShadow: ready ? `0 0 8px ${color}` : 'none',
      }}>
        {ABILITY_SYMBOLS[ability.type] || '·'}
      </div>
      {/* Key label */}
      <div style={{ fontSize: 8, fontWeight: 700, color: ready ? color : 'var(--text-dim)', marginTop: 2, letterSpacing: '0.05em', opacity: 0.7 }}>
        {keyLabel}
      </div>

      {/* CD overlay */}
      {!ready && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.68)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: isUlt ? 18 : 14, fontWeight: 900, color: '#fff', borderRadius: 2,
        }}>
          {cdSec}
        </div>
      )}

      {/* Ready glow ping */}
      {ready && (
        <div style={{
          position: 'absolute', top: -2, right: -2,
          width: 8, height: 8, borderRadius: '50%',
          background: isUlt ? '#ff9500' : '#00ff9d',
          boxShadow: `0 0 6px ${isUlt ? '#ff9500' : '#00ff9d'}`,
        }} />
      )}
    </div>
  );
}

function HealthBar({ pct, color, flipped }) {
  const barColor = pct > 60 ? '#00ff9d' : pct > 30 ? '#ffb800' : '#ff3355';
  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <div style={{
        width: '100%', height: 10,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 1, overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: `linear-gradient(${flipped ? '270deg' : '90deg'}, ${barColor}cc, ${barColor})`,
          float: flipped ? 'right' : 'none',
          transition: 'width 0.12s ease-out',
          boxShadow: `0 0 6px ${barColor}60`,
        }} />
      </div>
    </div>
  );
}

export default function HUD({ player, enemy, keybinds }) {
  if (!player || !enemy || !keybinds) return null;
  const pPct = Math.max(0, player.hp / player.character.maxHp) * 100;
  const ePct = Math.max(0, enemy.hp / enemy.character.maxHp) * 100;

  const SideHUD = ({ ent, pct, flipped, abilities, cds }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 'clamp(200px, 22vw, 290px)', alignItems: flipped ? 'flex-end' : 'flex-start' }}>
      {/* Name row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexDirection: flipped ? 'row-reverse' : 'row' }}>
        {/* Avatar pip */}
        <div style={{
          width: 36, height: 36, borderRadius: 2, flexShrink: 0,
          background: `${ent.character.color}18`,
          border: `1px solid ${ent.character.color}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, color: ent.character.color,
          fontWeight: 900, fontFamily: 'var(--font-display)',
          boxShadow: `inset 0 0 10px ${ent.character.color}22`,
        }}>
          {ent.character.name[0]}
        </div>
        <div style={{ textAlign: flipped ? 'right' : 'left' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: ent.character.color, letterSpacing: '0.06em', lineHeight: 1, textTransform: 'uppercase' }}>
            {ent.character.name}
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 1 }}>
            {ent.character.role}
          </div>
        </div>
      </div>

      {/* HP bar + number */}
      <div style={{ width: '100%' }}>
        <HealthBar pct={pct} flipped={flipped} />
        <div style={{ display: 'flex', justifyContent: flipped ? 'flex-end' : 'flex-start', marginTop: 3 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em' }}>
            {Math.ceil(ent.hp)}<span style={{ fontSize: 9, opacity: 0.5 }}>/{ent.character.maxHp}</span>
          </span>
        </div>
      </div>

      {/* Abilities (player only) */}
      {abilities && (
        <div style={{ display: 'flex', gap: 6, flexDirection: flipped ? 'row-reverse' : 'row' }}>
          {abilities.map((ab, i) => (
            <AbilitySlot key={i} ability={ab.def} keyLabel={ab.key} cd={cds[ab.cdKey]} isUlt={i === 3} charColor={ent.character.color} />
          ))}
        </div>
      )}
    </div>
  );

  const playerAbilities = [
    { def: player.character.basic, key: getDisplayKey('basic', keybinds), cdKey: 'basic' },
    { def: player.character.ability1, key: getDisplayKey('ability1', keybinds), cdKey: 'ability1' },
    { def: player.character.ability2, key: getDisplayKey('ability2', keybinds), cdKey: 'ability2' },
    { def: player.character.ultimate, key: getDisplayKey('ultimate', keybinds), cdKey: 'ultimate' },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <SideHUD ent={player} pct={pPct} flipped={false} abilities={playerAbilities} cds={player.cooldowns} />
      <SideHUD ent={enemy} pct={ePct} flipped={true} />
    </div>
  );
}
