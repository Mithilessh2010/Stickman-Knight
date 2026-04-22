import React from 'react';
import { audioManager } from '../game/audio.js';

export default function CreditsScreen({ onClose }) {
  return (
    <div className="screen" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', overflow: 'auto' }}>
      <div className="settings-card" style={{ maxWidth: 700 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Credits</h2>
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

        <div style={{ lineHeight: 2, color: 'var(--text-dim)', textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 900, background: 'linear-gradient(135deg, #7dd3fc, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 8 }}>
            STICKMAN KNIGHT
          </div>
          <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.1em', marginBottom: 24 }}>
            A 2D Fighting Game Experience
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', marginTop: 24, marginBottom: 12 }}>Development</h3>
          <div style={{ fontSize: 12, marginBottom: 20 }}>
            <div><strong>Game Design & Programming:</strong> Stickman Knight Team</div>
            <div><strong>Physics & Combat Engine:</strong> Custom Canvas-based implementation</div>
            <div><strong>Character Design:</strong> 12 uniquely balanced fighters</div>
            <div><strong>UI/UX Design:</strong> Modern, accessible interface</div>
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', marginTop: 24, marginBottom: 12 }}>Technology</h3>
          <div style={{ fontSize: 12, marginBottom: 20 }}>
            <div>Built with <strong>React 18</strong> and <strong>Vite</strong></div>
            <div>Rendered with <strong>HTML5 Canvas</strong> 2D API</div>
            <div>Web Audio API for sound</div>
            <div>Deployed on <strong>Vercel</strong></div>
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', marginTop: 24, marginBottom: 12 }}>Special Thanks</h3>
          <div style={{ fontSize: 12, marginBottom: 20 }}>
            <div>Thanks to all playtesters and feedback providers</div>
            <div>Community for inspiration and support</div>
            <div>Rajdhani font for beautiful typography</div>
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', marginTop: 24, marginBottom: 12 }}>Version Info</h3>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 20 }}>
            <div>Version: 1.0.0</div>
            <div>Release Date: 2024</div>
            <div>All Rights Reserved</div>
          </div>

          <div style={{
            padding: 12,
            background: 'rgba(52,211,153,0.1)',
            border: '1px solid rgba(52,211,153,0.2)',
            borderRadius: 6,
            fontSize: 11,
            lineHeight: 1.5,
            marginTop: 20,
          }}>
            🎮 <strong>Thank you for playing Stickman Knight!</strong> Enjoy epic battles and master your favorite fighters. May your combos be devastating and your victories glorious!
          </div>
        </div>

        <button
          className="btn"
          onClick={() => { audioManager.playUIClick(); onClose(); }}
          style={{ width: '100%', marginTop: 20 }}
          onMouseEnter={() => audioManager.playUIHover()}
        >
          Back
        </button>
      </div>
    </div>
  );
}
