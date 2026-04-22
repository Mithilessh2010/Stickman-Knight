import React, { useEffect, useRef, useContext } from 'react';
import { CHARACTERS } from '../game/characters.js';
import { drawStickmanPortrait } from '../game/render.js';
import { getDisplayKey } from '../game/keybinds.js';
import { audioManager } from '../game/audio.js';
import { KeybindsContext } from '../contexts/KeybindsContext.js';

const BG_CHARS = [
  { id: 'brute',   x: 0.12, y: 0.72, scale: 2.2, facing: 1 },
  { id: 'mage',    x: 0.50, y: 0.66, scale: 2.8, facing: 1 },
  { id: 'assassin',x: 0.88, y: 0.72, scale: 2.0, facing: -1 },
];

export default function StartScreen({ onStart, onSettings, onHelp, onCredits, onTournament }) {
  const canvasRef = useRef(null);
  const { keybinds } = useContext(KeybindsContext) || { keybinds: null };

  useEffect(() => {
    audioManager.playMusic('menu_theme');
    return () => audioManager.stopMusic();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') { audioManager.playUIClick(); onStart(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onStart]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf, t = 0;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const loop = () => {
      t++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      BG_CHARS.forEach(({ id, x, y, scale, facing }) => {
        const ch = CHARACTERS[id];
        const px = x * canvas.width, py = y * canvas.height;
        ctx.save();
        ctx.globalAlpha = 0.07;
        ctx.translate(px, py); ctx.scale(scale * facing, scale); ctx.translate(-px, -py);
        drawStickmanPortrait(ctx, ch, px, py, t + id.length * 30);
        ctx.restore();
      });
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <div className="screen" style={{ justifyContent: 'center', gap: 0 }}>
      {/* Bg canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />

      {/* Settings button */}
      <button className="btn ghost" onClick={() => { audioManager.playUIClick(); onSettings(); }}
        style={{ position: 'absolute', top: 20, right: 20, padding: '8px 14px', fontSize: 12, zIndex: 10 }}
        onMouseEnter={() => audioManager.playUIHover()}>
        ⚙
      </button>

      {/* Center content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>

        {/* Eyebrow */}
        <div style={{ fontSize: 11, letterSpacing: '0.55em', textTransform: 'uppercase', color: 'rgba(0,229,255,0.6)', marginBottom: 16, fontWeight: 700 }}>
          · 1 VS 1 ·
        </div>

        {/* Main title */}
        <h1 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: 'clamp(80px, 14vw, 168px)',
          lineHeight: 0.88,
          margin: 0,
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
          color: '#fff',
        }}>
          STICKMAN
        </h1>
        <h1 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: 'clamp(80px, 14vw, 168px)',
          lineHeight: 0.88,
          margin: 0,
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
          color: '#00e5ff',
          textShadow: '0 0 40px rgba(0,229,255,0.4), 0 0 80px rgba(0,229,255,0.15)',
        }}>
          ARENA
        </h1>

        {/* Divider */}
        <div style={{ width: 60, height: 1, background: 'rgba(255,255,255,0.15)', margin: '28px auto' }} />

        {/* Press to play */}
        <div className="start-prompt" onClick={() => { audioManager.playUIClick(); onStart(); }}
          style={{ cursor: 'pointer', marginBottom: 36 }}>
          Press Space to Enter
        </div>

        {/* Nav buttons */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn primary" onClick={() => { audioManager.playUIClick(); onStart(); }}
            style={{ padding: '12px 40px', fontSize: 15 }} onMouseEnter={() => audioManager.playUIHover()}>
            Quick Play
          </button>
          <button className="btn" onClick={() => { audioManager.playUIClick(); onTournament(); }}
            style={{ fontSize: 13 }} onMouseEnter={() => audioManager.playUIHover()}>
            Tournament
          </button>
          <button className="btn ghost" onClick={() => { audioManager.playUIClick(); onHelp(); }}
            style={{ fontSize: 13 }} onMouseEnter={() => audioManager.playUIHover()}>
            Controls
          </button>
        </div>

        {/* Controls hint */}
        {keybinds && (
          <div className="controls-hint" style={{ marginTop: 40 }}>
            <span>{getDisplayKey('left', keybinds)}</span><span>{getDisplayKey('right', keybinds)}</span> Move &nbsp;·&nbsp;
            <span>{getDisplayKey('jump', keybinds)}</span> Jump &nbsp;·&nbsp;
            <span>{getDisplayKey('basic', keybinds)}</span> Attack &nbsp;·&nbsp;
            <span>{getDisplayKey('ultimate', keybinds)}</span> Ultimate
          </div>
        )}
      </div>

      {/* Bottom tag */}
      <div style={{ position: 'absolute', bottom: 20, left: 0, right: 0, fontSize: 10, color: 'rgba(255,255,255,0.12)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
        Stickman Duel Arena
      </div>
    </div>
  );
}
