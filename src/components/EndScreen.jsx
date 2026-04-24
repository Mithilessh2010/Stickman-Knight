import React, { useEffect, useState } from 'react';
import { audioManager } from '../game/audio.js';

export default function EndScreen({ result, onRestart, onHome, isTournament, tournamentWinner, primaryLabelOverride, subOverride }) {
  const [show, setShow] = useState(false);
  const win = result === 'player';
  const isChampion = isTournament && tournamentWinner === 'player' && win;
  const primaryGoesHome = isChampion || (isTournament && !win);
  const primaryAction = primaryGoesHome ? onHome : onRestart;
  const primaryLabel = primaryLabelOverride || (isChampion ? 'Main Menu' : isTournament ? (win ? 'Next Match →' : 'Main Menu') : 'Rematch');
  const showSecondaryAction = !primaryGoesHome;

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 80);
    if (result === 'player') audioManager.playVictory();
    else audioManager.playDefeat();
    return () => clearTimeout(t);
  }, [result]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') { audioManager.playUIClick(); primaryAction(); }
      if (e.code === 'Escape') { audioManager.playUIClick(); onHome(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [primaryAction, onHome]);

  const accentColor = isChampion ? '#ff9500' : win ? '#00ff9d' : '#ff3355';
  const label = isChampion ? 'CHAMPION' : win ? 'VICTORY' : 'DEFEAT';
  const sub = subOverride || (isChampion ? 'Tournament Conquered' : isTournament ? (win ? 'Advancing to next round' : 'Eliminated from tournament') : (win ? 'Opponent out of stocks' : 'You ran out of stocks'));
  const keyHint = primaryGoesHome ? '[Enter / Space] Main Menu' : '[Enter / Space] Continue · [Esc] Main Menu';

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: `radial-gradient(ellipse at center, ${accentColor}08 0%, transparent 60%)`,
    }}>
      <div style={{
        textAlign: 'center',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
        transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0,
      }}>
        {/* Pre-label */}
        <div style={{ fontSize: 11, letterSpacing: '0.45em', textTransform: 'uppercase', color: accentColor, marginBottom: 12, opacity: 0.8, fontWeight: 700 }}>
          {isTournament ? (isChampion ? '🏆 Tournament' : `Round ${win ? 'Won' : 'Lost'}`) : 'Match Result'}
        </div>

        {/* Big result */}
        <div style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: 'clamp(80px, 14vw, 160px)',
          lineHeight: 0.9,
          color: accentColor,
          letterSpacing: '0.04em',
          textShadow: `0 0 40px ${accentColor}60, 0 0 80px ${accentColor}25`,
        }}>
          {label}
        </div>

        <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 16, marginBottom: 36, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          {sub}
        </div>

        {/* Divider */}
        <div style={{ width: 40, height: 1, background: `${accentColor}50`, marginBottom: 32 }} />

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn primary" onClick={() => { audioManager.playUIClick(); primaryAction(); }}
            onMouseEnter={() => audioManager.playUIHover()}
            style={{ background: accentColor, borderColor: accentColor, padding: '14px 40px', fontSize: 15 }}>
            {primaryLabel}
          </button>
          {showSecondaryAction && (
            <button className="btn ghost" onClick={() => { audioManager.playUIClick(); onHome(); }}
              onMouseEnter={() => audioManager.playUIHover()}
              style={{ padding: '14px 32px', fontSize: 15 }}>
              Main Menu
            </button>
          )}
        </div>

        <div style={{ marginTop: 20, fontSize: 11, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.2em' }}>
          {keyHint}
        </div>
      </div>
    </div>
  );
}
