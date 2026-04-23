import React, { useEffect, useRef } from 'react';
import { ARENA_W, ARENA_H } from '../game/constants.js';
import { createWorld, tick, applyPlayerInput } from '../game/engine.js';
import { updateAI } from '../game/ai.js';
import { renderWorld } from '../game/render.js';
import { createInput } from '../game/input.js';
import { audioManager } from '../game/audio.js';
import HUD from './HUD.jsx';

export default function GameScreen({ playerChar, enemyChar, onGameOver, keybinds, tournament, stage = 'rooftop', paused = false }) {
  const canvasRef = useRef(null);
  const worldRef = useRef(null);
  const inputRef = useRef(null);
  const pausedRef = useRef(paused);
  const [, force] = React.useReducer((x) => x + 1, 0);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const world = createWorld(playerChar, enemyChar);
    worldRef.current = world;

    const input = createInput(keybinds);
    inputRef.current = input;

    // Start background music
    audioManager.playMusic('battle_theme');

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = ARENA_W;
    canvas.height = ARENA_H;

    let raf;
    let acc = 0;
    let last = performance.now();
    const STEP = 1000 / 60;
    let hudTimer = 0;
    let ended = false;

    const loop = (now) => {
      const dt = Math.min(64, now - last);
      last = now;
      if (!pausedRef.current) {
        acc += dt;
        while (acc >= STEP) {
          applyPlayerInput(world, input);
          updateAI(world, world.enemy, world.player);
          tick(world);
          acc -= STEP;
          hudTimer += 1;
          if (world.winner && !ended) {
            ended = true;
            setTimeout(() => onGameOver(world.winner), 700);
          }
        }
      } else {
        acc = 0;
      }
      renderWorld(ctx, world, stage, now / 16);
      if (hudTimer > 3) { hudTimer = 0; force(); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      input.destroy();
      inputRef.current = null;
      audioManager.stopMusic();
    };
  }, [playerChar, enemyChar, onGameOver]);

  return (
    <div className="game-wrap">
      <canvas ref={canvasRef} className="game-canvas" style={canvasStyle} />
      <HUD player={worldRef.current?.player} enemy={worldRef.current?.enemy} keybinds={keybinds} />
    </div>
  );
}

const canvasStyle = {
  width: 'min(100vw, calc(100vh * 16 / 9))',
  height: 'min(100vh, calc(100vw * 9 / 16))',
  margin: 'auto',
  position: 'absolute',
  inset: 0,
};
