import React, { useEffect, useRef } from 'react';
import { CHARACTERS } from '../game/characters.js';
import { drawStickmanPortrait } from '../game/render.js';

const SILHOUETTE_CHARS = ['brute', 'mage', 'assassin'];
const SILHOUETTE_POSITIONS = [
  { x: 0.15, y: 0.62, scale: 1.8 },
  { x: 0.5, y: 0.58, scale: 2.2 },
  { x: 0.85, y: 0.62, scale: 1.6 }
];

export default function StartScreen({ onStart }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') onStart();
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
        <h1 className="title">Stickman<br />Duel Arena</h1>
        <div className="subtitle">A 1v1 fighting game</div>
        <div className="start-prompt" onClick={onStart} style={{ cursor: 'pointer' }}>
          Press Space to Begin
        </div>
        <div className="controls-hint">
          <span>A</span><span>D</span> Move &nbsp;·&nbsp;
          <span>W</span> Jump &nbsp;·&nbsp;
          <span>J</span> Attack &nbsp;·&nbsp;
          <span>K</span> Ability 1 &nbsp;·&nbsp;
          <span>L</span> Ability 2 &nbsp;·&nbsp;
          <span>U</span> Ultimate
        </div>
      </div>
    </div>
  );
}
