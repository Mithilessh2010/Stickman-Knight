const KEY_MAP = {
  KeyA: 'left', ArrowLeft: 'left',
  KeyD: 'right', ArrowRight: 'right',
  KeyW: 'jump', ArrowUp: 'jump', Space: 'jump',
  KeyJ: 'basic',
  KeyK: 'ability1',
  KeyL: 'ability2',
  KeyU: 'ultimate'
};

export function createInput() {
  const state = {
    left: false, right: false, jump: false,
    basic: false, ability1: false, ability2: false, ultimate: false
  };
  const pressed = new Set();

  const onDown = (e) => {
    const a = KEY_MAP[e.code];
    if (!a) return;
    e.preventDefault();
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
