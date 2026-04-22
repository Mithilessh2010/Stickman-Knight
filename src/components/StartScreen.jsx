import React, { useEffect, useRef, useContext } from 'react';
import { CHARACTERS } from '../game/characters.js';
import { drawStickmanPortrait } from '../game/render.js';
import { getDisplayKey } from '../game/keybinds.js';
import { audioManager } from '../game/audio.js';
import { KeybindsContext } from '../contexts/KeybindsContext.js';

const SILHOUETTE_CHARS = ['brute', 'mage', 'assassin'];
const SILHOUETTE_POSITIONS = [
  { x: 0.15, y: 0.62, scale: 1.8 },
  { x: 0.5, y: 0.58, scale: 2.2 },
  { x: 0.85, y: 0.62, scale: 1.6 }
];

export default function StartScreen({ onStart, onSettings, onTournament }) {
  const canvasRef = useRef(null);
  const { keybinds } = useContext(KeybindsContext) || { keybinds: null };

  useEffect(() => {
    // Play menu music
    audioManager.playMusic('menu_theme');
    return () => audioManager.stopMusic();
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        audioManager.playUIClick();
        onStart();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onStart]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf, t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      t += 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.globalAlpha = 0.06;

      SILHOUETTE_POSITIONS.forEach((pos, i) => {
        const ch = CHARACTERS[SILHOUETTE_CHARS[i]];
        const px = pos.x * canvas.width;
        const py = pos.y * canvas.height;
        ctx.save();
        ctx.translate(px, py);
        ctx.scale(pos.scale, pos.scale);
        ctx.translate(-px, -py);
        drawStickmanPortrait(ctx, ch, px, py, t + i * 40);
        ctx.restore();
      });

      ctx.restore();
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="screen">
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          pointerEvents: 'none', zIndex: 0
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 className="title">Stickman<br />Arena</h1>
        <div className="subtitle" style={{ marginTop: 20 }}>1v1 Fighting Game</div>
        <div className="start-prompt" onClick={() => { audioManager.playUIClick(); onStart(); }} style={{ cursor: 'pointer', marginTop: 50 }}>
          Press Space to Play
        </div>
        <div style={{ marginTop: 20, display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button className="btn" onClick={() => { audioManager.playUIClick(); onTournament(); }} style={{ fontSize: 12 }}>
            Tournament
          </button>
        </div>
        {keybinds && (
          <div className="controls-hint" style={{ marginTop: 40 }}>
            <span>{getDisplayKey('left', keybinds)}</span><span>{getDisplayKey('right', keybinds)}</span> Move &nbsp;·&nbsp;
            <span>{getDisplayKey('jump', keybinds)}</span> Jump &nbsp;·&nbsp;
            <span>{getDisplayKey('basic', keybinds)}</span> Hit &nbsp;·&nbsp;
            <span>{getDisplayKey('ultimate', keybinds)}</span> Ultimate
          </div>
        )}
        <button
          className="btn ghost"
          onClick={() => { audioManager.playUIClick(); onSettings(); }}
          style={{
            position: 'absolute', top: 24, right: 24,
            padding: '8px 14px', fontSize: 11
          }}
        >
          ⚙
        </button>
      </div>
    </div>
  );
}
