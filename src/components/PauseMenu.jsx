import React from 'react';
import { audioManager } from '../game/audio.js';

export default function PauseMenu({ onResume, onRestart, onHome }) {
  const buttonStyle = { width: '100%', padding: '13px 20px', fontSize: 14 };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      zIndex: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.58)',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        width: 'min(360px, 90vw)',
        padding: 28,
        background: 'rgba(10,10,16,0.96)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.75)',
        borderRadius: 3,
        textAlign: 'center',
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, letterSpacing: '0.04em', lineHeight: 0.9 }}>
          PAUSED
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.16em', textTransform: 'uppercase', margin: '10px 0 24px' }}>
          Match Options
        </div>
        <div style={{ display: 'grid', gap: 10 }}>
          <button className="btn primary" style={buttonStyle} onClick={() => { audioManager.playUIClick(); onResume(); }} onMouseEnter={() => audioManager.playUIHover()}>
            Resume
          </button>
          <button className="btn" style={buttonStyle} onClick={() => { audioManager.playUIClick(); onRestart(); }} onMouseEnter={() => audioManager.playUIHover()}>
            Restart Match
          </button>
          <button className="btn ghost" style={buttonStyle} onClick={() => { audioManager.playUIClick(); onHome(); }} onMouseEnter={() => audioManager.playUIHover()}>
            Return to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
