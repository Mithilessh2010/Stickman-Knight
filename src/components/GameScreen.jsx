import React, { useEffect, useRef, useCallback } from 'react';
import { ARENA_W, ARENA_H } from '../game/constants.js';
import { createWorld, tick, applyPlayerInput } from '../game/engine.js';
import { updateAI } from '../game/ai.js';
import { renderWorld } from '../game/render.js';
import { createInput } from '../game/input.js';
import { getDisplayKey } from '../game/keybinds.js';
import { audioManager } from '../game/audio.js';
import HUD from './HUD.jsx';
import TournamentBracket from './TournamentBracket.jsx';

const MOVE_BUTTONS = [
  { id: 'left',  label: 'L',    action: 'left',  hold: true },
  { id: 'right', label: 'R',    action: 'right', hold: true },
  { id: 'jump',  label: 'Jump', action: 'jump',  hold: true },
];
const ACTION_BUTTONS = [
  { id: 'basic',    label: 'J', action: 'basic',    hold: false },
  { id: 'ability1', label: 'K', action: 'ability1', hold: false },
  { id: 'ability2', label: 'L', action: 'ability2', hold: false },
  { id: 'ultimate', label: 'U', action: 'ultimate', hold: false, ult: true },
];

const BTN_BASE = {
  width: 56, height: 56, borderRadius: 12,
  background: 'rgba(20,24,34,0.72)',
  border: '1px solid rgba(125,211,252,0.25)',
  color: '#e6ebf5',
  fontFamily: '"Rajdhani",system-ui,sans-serif',
  fontSize: 14, fontWeight: 700,
  letterSpacing: '0.1em', textTransform: 'uppercase',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none',
  backdropFilter: 'blur(4px)', cursor: 'pointer',
};
const BTN_ULT = {
  ...BTN_BASE, width: 64, height: 64,
  border: '1px solid rgba(251,191,36,0.4)', color: '#fbbf24',
};

function TouchControls({ inputRef }) {
  const pointerMap = useRef({});

  const press = useCallback((action) => {
    const inp = inputRef.current;
    if (!inp) return;
    inp.addPressed(action);
  }, [inputRef]);

  const setHeld = useCallback((action, val) => {
    const inp = inputRef.current;
    if (!inp) return;
    inp.state[action] = val;
  }, [inputRef]);

  const makeHandlers = useCallback((btn) => ({
    onPointerDown(e) {
      e.preventDefault();
      pointerMap.current[e.pointerId] = btn;
      e.currentTarget.setPointerCapture(e.pointerId);
      if (btn.hold) setHeld(btn.action, true);
      else press(btn.action);
    },
    onPointerUp(e) {
      e.preventDefault();
      const b = pointerMap.current[e.pointerId];
      if (b && b.hold) setHeld(b.action, false);
      delete pointerMap.current[e.pointerId];
    },
    onPointerCancel(e) {
      e.preventDefault();
      const b = pointerMap.current[e.pointerId];
      if (b && b.hold) setHeld(b.action, false);
      delete pointerMap.current[e.pointerId];
    },
  }), [setHeld, press]);

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      padding: '0 16px 16px', pointerEvents: 'none', zIndex: 10,
    }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', pointerEvents: 'auto' }}>
        {MOVE_BUTTONS.map(btn => (
          <div key={btn.id} style={BTN_BASE} {...makeHandlers(btn)}>{btn.label}</div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', pointerEvents: 'auto' }}>
        {ACTION_BUTTONS.map(btn => (
          <div key={btn.id} style={btn.ult ? BTN_ULT : BTN_BASE} {...makeHandlers(btn)}>{btn.label}</div>
        ))}
      </div>
    </div>
  );
}

export default function GameScreen({ playerChar, enemyChar, onGameOver, keybinds, tournament }) {
  const canvasRef = useRef(null);
  const worldRef = useRef(null);
  const inputRef = useRef(null);
  const [, force] = React.useReducer((x) => x + 1, 0);

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
      renderWorld(ctx, world);
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
      <TouchControls inputRef={inputRef} />
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
