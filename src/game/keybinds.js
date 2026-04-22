export const DEFAULT_KEYBINDS = {
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  jump: ['KeyW', 'ArrowUp', 'Space'],
  basic: ['KeyJ'],
  ability1: ['KeyK'],
  ability2: ['KeyL'],
  ultimate: ['KeyU']
};

export function buildKeyMap(keybinds) {
  const map = {};
  for (const [action, keys] of Object.entries(keybinds)) {
    keys.forEach(code => { map[code] = action; });
  }
  return map;
}

export function getDisplayKey(action, keybinds) {
  const keys = keybinds[action];
  if (!keys?.length) return '?';
  // Prefer non-arrow, non-special keys for display
  const displayOrder = ['KeyJ', 'KeyK', 'KeyL', 'KeyU', 'KeyA', 'KeyD', 'KeyW'];
  const displayKey = displayOrder.find(k => keys.includes(k));
  if (displayKey) return displayKey.replace('Key', '');
  if (keys[0] === 'Space') return 'Spc';
  if (keys[0].startsWith('Arrow')) return keys[0].replace('Arrow', '');
  return keys[0].replace('Key', '');
}

export function loadKeybinds() {
  try {
    const stored = localStorage.getItem('stickman-keybinds');
    return stored ? JSON.parse(stored) : DEFAULT_KEYBINDS;
  } catch (e) {
    return DEFAULT_KEYBINDS;
  }
}

export function saveKeybinds(keybinds) {
  try {
    localStorage.setItem('stickman-keybinds', JSON.stringify(keybinds));
    return true;
  } catch (e) {
    return false;
  }
}

export function getKeyName(code) {
  const keyNames = {
    'KeyA': 'A', 'KeyB': 'B', 'KeyC': 'C', 'KeyD': 'D', 'KeyE': 'E',
    'KeyF': 'F', 'KeyG': 'G', 'KeyH': 'H', 'KeyI': 'I', 'KeyJ': 'J',
    'KeyK': 'K', 'KeyL': 'L', 'KeyM': 'M', 'KeyN': 'N', 'KeyO': 'O',
    'KeyP': 'P', 'KeyQ': 'Q', 'KeyR': 'R', 'KeyS': 'S', 'KeyT': 'T',
    'KeyU': 'U', 'KeyV': 'V', 'KeyW': 'W', 'KeyX': 'X', 'KeyY': 'Y', 'KeyZ': 'Z',
    'Space': 'Space', 'Enter': 'Enter', 'Tab': 'Tab', 'Escape': 'Esc',
    'ArrowUp': '↑', 'ArrowDown': '↓', 'ArrowLeft': '←', 'ArrowRight': '→',
    'Digit0': '0', 'Digit1': '1', 'Digit2': '2', 'Digit3': '3', 'Digit4': '4',
    'Digit5': '5', 'Digit6': '6', 'Digit7': '7', 'Digit8': '8', 'Digit9': '9',
    'Numpad0': 'Num0', 'Numpad1': 'Num1', 'Numpad2': 'Num2', 'Numpad3': 'Num3',
    'Shift': 'Shift', 'Control': 'Ctrl', 'Alt': 'Alt'
  };
  return keyNames[code] || code;
}
