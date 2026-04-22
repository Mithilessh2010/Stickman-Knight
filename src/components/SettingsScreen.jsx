import React, { useState, useContext } from 'react';
import { DEFAULT_KEYBINDS, saveKeybinds, getKeyName } from '../game/keybinds';
import { audioManager } from '../game/audio.js';
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

function VolumeSlider({ label, value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <label style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </label>
        <span style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700 }}>
          {Math.round(value * 100)}%
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{
          width: '100%',
          height: 6,
          borderRadius: 3,
          background: 'rgba(255,255,255,0.1)',
          outline: 'none',
          cursor: 'pointer',
          accentColor: 'var(--accent)',
        }}
      />
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <div
      onClick={() => onChange(!value)}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 12px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 6,
        marginBottom: 8,
        cursor: 'pointer',
        border: '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.2s',
      }}
    >
      <label style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer' }}>
        {label}
      </label>
      <div
        style={{
          width: 40,
          height: 24,
          background: value ? 'var(--accent)' : 'rgba(255,255,255,0.2)',
          borderRadius: 12,
          position: 'relative',
          transition: 'all 0.2s',
          boxShadow: value ? '0 0 8px var(--accent-80)' : 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 20,
            height: 20,
            background: '#fff',
            borderRadius: 10,
            top: 2,
            left: value ? 18 : 2,
            transition: 'left 0.2s',
          }}
        />
      </div>
    </div>
  );
}

export default function SettingsScreen({ onClose }) {
  const { keybinds, setKeybinds } = useContext(KeybindsContext);
  const [tab, setTab] = useState('controls'); // controls, audio, display
  const [rebinding, setRebinding] = useState(null);
  const [tempKeybinds, setTempKeybinds] = useState(keybinds);
  const [masterVolume, setMasterVolume] = useState(audioManager.masterVolume);
  const [musicVolume, setMusicVolume] = useState(audioManager.musicVolume);
  const [sfxVolume, setSfxVolume] = useState(audioManager.sfxVolume);
  const [musicEnabled, setMusicEnabled] = useState(audioManager.isMusicEnabled);
  const [sfxEnabled, setSfxEnabled] = useState(audioManager.isSfxEnabled);

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
    audioManager.setMasterVolume(masterVolume);
    audioManager.setMusicVolume(musicVolume);
    audioManager.setSfxVolume(sfxVolume);
    audioManager.setMusicEnabled(musicEnabled);
    audioManager.setSfxEnabled(sfxEnabled);
    onClose();
  };

  React.useEffect(() => {
    if (rebinding) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [rebinding, tempKeybinds]);

  const tabStyle = (active) => ({
    padding: '10px 16px',
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    border: 'none',
    background: 'transparent',
    color: active ? 'var(--accent)' : 'var(--text-dim)',
    cursor: 'pointer',
    borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
    transition: 'all 0.2s',
  });

  return (
    <div className="screen" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
      <div className="settings-card" style={{ maxHeight: '80vh', overflowY: 'auto', maxWidth: 500 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Settings</h2>
          <button
            onClick={onClose}
            style={{
              fontSize: 18,
              border: 'none',
              background: 'none',
              color: 'var(--text-dim)',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 20 }}>
          <button
            onClick={() => setTab('controls')}
            style={tabStyle(tab === 'controls')}
          >
            Controls
          </button>
          <button
            onClick={() => setTab('audio')}
            style={tabStyle(tab === 'audio')}
          >
            Audio
          </button>
          <button
            onClick={() => setTab('display')}
            style={tabStyle(tab === 'display')}
          >
            Display
          </button>
        </div>

        {/* Controls Tab */}
        {tab === 'controls' && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 12 }}>
              Customize your controls
            </div>
            <div className="keybinds-list">
              {Object.entries(ACTION_LABELS).map(([action, label]) => (
                <div key={action} className="keybind-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div className="keybind-label" style={{ fontSize: 12 }}>{label}</div>
                  <button
                    className={`keybind-button ${rebinding === action ? 'rebinding' : ''}`}
                    onClick={() => handleRebindStart(action)}
                    style={{
                      padding: '6px 12px',
                      background: rebinding === action ? 'rgba(255,149,0,0.15)' : 'rgba(0,229,255,0.08)',
                      border: rebinding === action ? '1px solid rgba(255,149,0,0.45)' : '1px solid rgba(0,229,255,0.25)',
                      borderRadius: 4,
                      color: rebinding === action ? '#fbbf24' : 'var(--accent)',
                      cursor: 'pointer',
                      fontSize: 11,
                      fontWeight: 600,
                      minWidth: 100,
                      textAlign: 'center',
                    }}
                  >
                    {rebinding === action ? 'Press a key...' : getKeyName(tempKeybinds[action][0])}
                  </button>
                </div>
              ))}
            </div>
            <button
              className="btn ghost"
              onClick={handleReset}
              style={{ marginTop: 12, width: '100%', textAlign: 'center' }}
            >
              Reset to Defaults
            </button>
          </div>
        )}

        {/* Audio Tab */}
        {tab === 'audio' && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 16 }}>
              Sound settings
            </div>
            <VolumeSlider label="Master Volume" value={masterVolume} onChange={setMasterVolume} />
            <VolumeSlider label="Music Volume" value={musicVolume} onChange={setMusicVolume} />
            <VolumeSlider label="SFX Volume" value={sfxVolume} onChange={setSfxVolume} />
            <div style={{ marginTop: 20 }}>
              <Toggle label="Enable Music" value={musicEnabled} onChange={setMusicEnabled} />
              <Toggle label="Enable SFX" value={sfxEnabled} onChange={setSfxEnabled} />
            </div>
          </div>
        )}

        {/* Display Tab */}
        {tab === 'display' && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 16 }}>
              Visual settings
            </div>
            <div style={{
              padding: 12,
              background: 'rgba(0,229,255,0.08)',
              border: '1px solid rgba(0,229,255,0.15)',
              borderRadius: 6,
              fontSize: 11,
              lineHeight: 1.5,
              color: 'var(--text-dim)',
              marginBottom: 12,
            }}>
              <strong>Coming Soon:</strong> Fullscreen, particle intensity, and screen shake controls will be available in a future update.
            </div>
            <div style={{
              padding: 12,
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 6,
              fontSize: 11,
              lineHeight: 1.5,
              color: 'var(--text-dim)',
            }}>
              💡 <strong>Tip:</strong> Adjust audio and control settings to suit your playstyle for better performance.
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 8, marginTop: 20, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button className="btn ghost" onClick={onClose} style={{ flex: 1 }}>
            Cancel (ESC)
          </button>
          <button className="btn" onClick={handleSave} style={{ flex: 1 }}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
