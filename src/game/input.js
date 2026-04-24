import { DEFAULT_KEYBINDS, buildKeyMap } from './keybinds.js';

export function createInput(keybinds = null) {
  const finalKeybinds = keybinds || DEFAULT_KEYBINDS;
  const KEY_MAP = buildKeyMap(finalKeybinds);

  const state = {
    left: false, right: false, down: false, jump: false,
    basic: false, ability1: false, ability2: false, ultimate: false
  };
  const pressed = new Set();

  const onDown = (e) => {
    const a = KEY_MAP[e.code];
    if (!a) return;
    e.preventDefault();
    if (e.repeat) return;
    state[a] = true;
    pressed.add(a);
  };
  const onUp = (e) => {
    const a = KEY_MAP[e.code];
    if (!a) return;
    e.preventDefault();
    state[a] = false;
  };
  window.addEventListener('keydown', onDown);
  window.addEventListener('keyup', onUp);

  return {
    state,
    consumePressed(action) {
      if (pressed.has(action)) { pressed.delete(action); return true; }
      return false;
    },
    addPressed(action) {
      pressed.add(action);
    },
    destroy() {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    }
  };
}
