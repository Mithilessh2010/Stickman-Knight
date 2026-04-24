import React from 'react';
import { CHARACTERS } from '../game/characters.js';
import { audioManager } from '../game/audio.js';

const LINES = [
  'You step onto the platform. No crowns here, only knockouts.',
  'The next challenger is waiting above the blast zone.',
  'Momentum matters now. Keep center stage and finish clean.',
  'The crowd goes quiet as the platforms drift into place.',
  'One more rival, one more stock count, one more launch.'
];

export default function StoryIntroScreen({ playerChar, enemyChar, index, total, onContinue, onBack }) {
  const player = CHARACTERS[playerChar];
  const enemy = CHARACTERS[enemyChar];
  const line = LINES[index % LINES.length];

  return (
    <div className="screen" style={{ justifyContent: 'center', padding: 28 }}>
      <div style={{
        width: 'min(720px, 94vw)',
        border: '1px solid rgba(255,255,255,0.09)',
        background: 'rgba(10,10,16,0.94)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.72)',
        padding: 30,
        borderRadius: 3,
        textAlign: 'left',
      }}>
        <div style={{ fontSize: 10, color: enemy.color, letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 800 }}>
          Story Mode · Fight {index + 1}/{total}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'flex-end', marginTop: 18, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 58, lineHeight: 0.92, letterSpacing: '0.04em' }}>
              {enemy.name}
            </div>
            <div style={{ color: 'var(--text-dim)', fontSize: 13, lineHeight: 1.5, marginTop: 10, maxWidth: 430 }}>
              {line}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Your Fighter
            </div>
            <div style={{ color: player.color, fontSize: 18, fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {player.name}
            </div>
          </div>
        </div>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '26px 0' }} />
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button className="btn ghost" onClick={() => { audioManager.playUIClick(); onBack(); }} onMouseEnter={() => audioManager.playUIHover()}>
            Main Menu
          </button>
          <button className="btn primary" onClick={() => { audioManager.playUIClick(); onContinue(); }} onMouseEnter={() => audioManager.playUIHover()}>
            Start Fight
          </button>
        </div>
      </div>
    </div>
  );
}
