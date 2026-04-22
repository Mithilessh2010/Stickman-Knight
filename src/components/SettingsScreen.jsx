import React, { useState, useContext } from 'react';
import { DEFAULT_KEYBINDS, saveKeybinds, getKeyName } from '../game/keybinds';
import { KeybindsContext } from '../contexts/KeybindsContext';

const ACTION_LABELS = {
  left: 'Move Left',
  right: 'Move Right',
  jump: 'Jump',
  basic: 'Basic Attack',
  ability1: 'Ability 1',
  ability2: 'Ability 2',
  ultimate: 'Ultimate'
};

export default function SettingsScreen({ onClose }) {
  const { keybinds, setKeybinds } = useContext(KeybindsContext);
  const [rebinding, setRebinding] = useState(null);
  const [tempKeybinds, setTempKeybinds] = useState(keybinds);

  const handleRebindStart = (action) => {
    setRebinding(action);
  };

  const handleKeyDown = (e) => {
    if (!rebinding) return;
    e.preventDefault();
    const code = e.code;
    if (code === 'Escape') {
      setRebinding(null);
      return;
    }
    // Set this key as the primary key for the action
    const updated = { ...tempKeybinds, [rebinding]: [code] };
    setTempKeybinds(updated);
    setRebinding(null);
  };

  const handleReset = () => {
    setTempKeybinds(DEFAULT_KEYBINDS);
  };

  const handleSave = () => {
    setKeybinds(tempKeybinds);
    saveKeybinds(tempKeybinds);
    onClose();
  };

  React.useEffect(() => {
    if (rebinding) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [rebinding, tempKeybinds]);

  return (
    <div className="screen">
      <div className="settings-card">
        <h2 style={{ marginTop: 0 }}>Settings</h2>

        <div className="settings-section">
          <h3>Keybinds</h3>
          <div className="keybinds-list">
            {Object.entries(ACTION_LABELS).map(([action, label]) => (
              <div key={action} className="keybind-row">
                <div className="keybind-label">{label}</div>
                <button
                  className={`keybind-button ${rebinding === action ? 'rebinding' : ''}`}
                  onClick={() => handleRebindStart(action)}
                >
                  {rebinding === action ? 'Press a key...' : getKeyName(tempKeybinds[action][0])}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="settings-buttons">
          <button className="btn ghost" onClick={handleReset}>Reset to Defaults</button>
          <button className="btn" onClick={handleSave}>Save Changes</button>
          <button className="btn ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
