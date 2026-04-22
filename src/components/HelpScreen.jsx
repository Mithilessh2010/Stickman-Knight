import React from 'react';
import { audioManager } from '../game/audio.js';

export default function HelpScreen({ onClose }) {
  return (
    <div className="screen" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', overflow: 'auto' }}>
      <div className="settings-card" style={{ maxWidth: 700 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>How to Play</h2>
          <button
            onClick={onClose}
            onMouseEnter={() => audioManager.playUIHover()}
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

        <div style={{ lineHeight: 1.8, color: 'var(--text-dim)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', marginTop: 16, marginBottom: 8 }}>🎮 Basic Controls</h3>
          <div style={{ fontSize: 12, marginBottom: 16 }}>
            <div><strong>Arrow Keys / WASD:</strong> Move left and right</div>
            <div><strong>Space / W / Up:</strong> Jump</div>
            <div><strong>J:</strong> Basic Attack (configurable)</div>
            <div><strong>K:</strong> Ability 1 (configurable)</div>
            <div><strong>L:</strong> Ability 2 (configurable)</div>
            <div><strong>U:</strong> Ultimate (configurable)</div>
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', marginTop: 16, marginBottom: 8 }}>⚡ Combat System</h3>
          <div style={{ fontSize: 12, marginBottom: 16 }}>
            <div><strong>Health Bar:</strong> Your fighter's remaining health. Reach 0 HP to lose.</div>
            <div><strong>Cooldowns:</strong> Abilities need time to recharge. Numbers show seconds remaining.</div>
            <div><strong>Ultimate:</strong> Your most powerful ability. Charge it for maximum impact!</div>
            <div><strong>Knockback:</strong> Heavy hits send your opponent flying. Position yourself wisely.</div>
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', marginTop: 16, marginBottom: 8 }}>🏆 Game Modes</h3>
          <div style={{ fontSize: 12, marginBottom: 16 }}>
            <div><strong>Quick Match:</strong> Choose a character and battle a random AI opponent.</div>
            <div><strong>Tournament:</strong> Compete against 11 other fighters in a 4-round bracket. Win all matches to become champion!</div>
            <div><strong>Training:</strong> Practice against a stationary dummy (coming soon).</div>
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', marginTop: 16, marginBottom: 8 }}>🎯 Character Types</h3>
          <div style={{ fontSize: 12, marginBottom: 16 }}>
            <div><strong>Rushdown:</strong> Fast, aggressive fighters. Attack quickly and overwhelm opponents.</div>
            <div><strong>Zoner:</strong> Ranged specialists. Keep distance and control the battlefield.</div>
            <div><strong>Tank:</strong> Heavy hitters with lots of health. Trade mobility for power.</div>
            <div><strong>Trap/Control:</strong> Unique mechanics like stealth, summons, or debuffs.</div>
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', marginTop: 16, marginBottom: 8 }}>💡 Tips & Tricks</h3>
          <div style={{ fontSize: 12, marginBottom: 16 }}>
            <div>✓ Learn each character's strengths and weaknesses through practice.</div>
            <div>✓ Master spacing—stay just out of range of your opponent's attacks.</div>
            <div>✓ Use the arena to your advantage. Stay away from corners if possible.</div>
            <div>✓ Save your ultimate for critical moments to finish fights.</div>
            <div>✓ Combos deal massive damage when executed correctly.</div>
            <div>✓ Mix up your attacks so opponents can't predict your strategy.</div>
          </div>

          <div style={{
            padding: 12,
            background: 'rgba(125,211,252,0.1)',
            border: '1px solid rgba(125,211,252,0.2)',
            borderRadius: 6,
            fontSize: 11,
            lineHeight: 1.5,
            marginTop: 20,
          }}>
            <strong>Need help?</strong> Check the Settings to customize your controls for optimal gameplay!
          </div>
        </div>

        <button
          className="btn"
          onClick={() => { audioManager.playUIClick(); onClose(); }}
          style={{ width: '100%', marginTop: 20 }}
          onMouseEnter={() => audioManager.playUIHover()}
        >
          Got It!
        </button>
      </div>
    </div>
  );
}
