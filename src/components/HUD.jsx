import React from 'react';
import { getDisplayKey } from '../game/keybinds.js';

function AbilityIcon({ keyLabel, label, cd, isUlt }) {
  const ready = cd <= 0;
  return (
    <div className={`ability-icon ${isUlt ? 'ult' : ''} ${ready ? 'ready' : ''}`}>
      <div className="key">{keyLabel}</div>
      <div className="label">{label}</div>
      {!ready && <div className="cd-mask">{Math.ceil(cd / 60)}</div>}
    </div>
  );
}

export default function HUD({ player, enemy, keybinds }) {
  if (!player || !enemy || !keybinds) return null;
  const pPct = Math.max(0, player.hp / player.character.maxHp) * 100;
  const ePct = Math.max(0, enemy.hp / enemy.character.maxHp) * 100;
  return (
    <div className="hud">
      <div className="hud-row">
        <div className="hud-side">
          <div className="fighter-name"><strong>You</strong>{player.character.name}</div>
          <div className="hp-bar"><div className="fill" style={{ width: `${pPct}%` }} /></div>
          <div className="abilities">
            <AbilityIcon keyLabel={getDisplayKey('basic', keybinds)} label={player.character.basic.name} cd={player.cooldowns.basic} />
            <AbilityIcon keyLabel={getDisplayKey('ability1', keybinds)} label={player.character.ability1.name} cd={player.cooldowns.ability1} />
            <AbilityIcon keyLabel={getDisplayKey('ability2', keybinds)} label={player.character.ability2.name} cd={player.cooldowns.ability2} />
            <AbilityIcon keyLabel={getDisplayKey('ultimate', keybinds)} label={player.character.ultimate.name} cd={player.cooldowns.ultimate} isUlt />
          </div>
        </div>
        <div className="hud-side right">
          <div className="fighter-name">{enemy.character.name}<strong style={{ marginLeft: 8 }}>AI</strong></div>
          <div style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent)', textAlign: 'right' }}>{enemy.character.role}</div>
          <div className="hp-bar right"><div className="fill" style={{ width: `${ePct}%` }} /></div>
        </div>
      </div>
    </div>
  );
}
