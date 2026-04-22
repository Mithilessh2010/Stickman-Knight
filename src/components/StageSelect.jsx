import React, { useState } from 'react';
import { audioManager } from '../game/audio.js';

const STAGES = [
  {
    id: 'rooftop',
    name: 'Neon Rooftop',
    role: 'FUTURISTIC',
    description: 'A glowing rooftop with city lights. Fast-paced arena.',
    color: '#7dd3fc',
    emoji: '🏙',
  },
  {
    id: 'temple',
    name: 'Ancient Temple',
    role: 'MYSTICAL',
    description: 'Sacred grounds with mystical energy. Balanced arena.',
    color: '#fcd34d',
    emoji: '🏯',
  },
  {
    id: 'mountain',
    name: 'Frozen Mountain',
    role: 'ICY',
    description: 'Snowy peak high in the clouds. Slow but powerful.',
    color: '#a5f3fc',
    emoji: '⛰',
  },
  {
    id: 'cyberlab',
    name: 'Cyber Lab',
    role: 'DIGITAL',
    description: 'Glitchy digital space. Chaotic and unpredictable.',
    color: '#c084fc',
    emoji: '💻',
  },
  {
    id: 'forest',
    name: 'Overgrown Forest',
    role: 'NATURE',
    description: 'Ancient forest reclaiming civilization. Wild arena.',
    color: '#34d399',
    emoji: '🌲',
  },
  {
    id: 'scrapyard',
    name: 'Desert Scrapyard',
    role: 'INDUSTRIAL',
    description: 'Wasteland of forgotten machines. Gritty arena.',
    color: '#fb923c',
    emoji: '🏜',
  },
];

export default function StageSelect({ onSelect, onBack }) {
  const [selected, setSelected] = useState(STAGES[0].id);
  const stage = STAGES.find(s => s.id === selected);

  const handleSelect = (id) => {
    setSelected(id);
    audioManager.playUIClick();
  };

  const handleStart = () => {
    audioManager.playUIClick();
    onSelect(selected);
  };

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ position: 'relative', zIndex: 10, padding: '20px', background: 'rgba(20,24,34,0.8)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(125,211,252,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="title" style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', margin: 0, flex: 1, textAlign: 'center' }}>Select Arena</h1>
        <button
          className="btn ghost"
          onClick={() => { audioManager.playUIClick(); onBack(); }}
          style={{ padding: '8px 14px', fontSize: 11 }}
          onMouseEnter={() => audioManager.playUIHover()}
        >
          ← Back
        </button>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', gap: 32, padding: 24, maxWidth: 1400, margin: '0 auto', alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* Stage Cards Grid */}
        <div style={{ flex: '0 0 auto', minWidth: 300 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-dim)', marginBottom: 12 }}>Available Arenas</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 8 }}>
            {STAGES.map((s) => {
              const isSelected = s.id === selected;
              return (
                <div
                  key={s.id}
                  onClick={() => handleSelect(s.id)}
                  onMouseEnter={() => audioManager.playUIHover()}
                  style={{
                    padding: 12,
                    background: isSelected ? `${s.color}22` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isSelected ? `${s.color}88` : 'rgba(255,255,255,0.15)'}`,
                    borderRadius: 8,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isSelected ? `0 0 16px ${s.color}44` : 'none',
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{s.emoji}</div>
                  <div style={{ fontSize: 8, fontWeight: 700, color: isSelected ? s.color : '#e6ebf5' }}>{s.name.split(' ')[0]}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stage Preview */}
        <div style={{ flex: '1', minWidth: 320 }}>
          <div style={{
            width: '100%',
            height: 280,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${stage.color}22, ${stage.color}08)`,
            border: `2px solid ${stage.color}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 96,
            marginBottom: 20,
            boxShadow: `inset 0 0 20px ${stage.color}20`,
          }}>
            {stage.emoji}
          </div>

          {/* Stage Details */}
          <div style={{ marginBottom: 24 }}>
            <h2 style={{
              fontSize: 28,
              fontWeight: 700,
              margin: '0 0 4px 0',
              color: stage.color,
            }}>
              {stage.name}
            </h2>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: stage.color, marginBottom: 12 }}>
              {stage.role}
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-dim)', marginBottom: 16 }}>
              {stage.description}
            </div>

            {/* Stage Features */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
            }}>
              <div style={{
                padding: 12,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 6,
                border: `1px solid ${stage.color}33`,
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-dim)', marginBottom: 4 }}>Arena Size</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: stage.color }}>Standard (1280x720)</div>
              </div>
              <div style={{
                padding: 12,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 6,
                border: `1px solid ${stage.color}33`,
              }}>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-dim)', marginBottom: 4 }}>Difficulty</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: stage.color }}>All Tiers</div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="btn"
            style={{
              width: '100%',
              padding: '14px 24px',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.1em',
              boxShadow: `0 0 20px ${stage.color}44`,
              background: `linear-gradient(135deg, ${stage.color}33, ${stage.color}11)`,
              borderColor: stage.color,
            }}
            onMouseEnter={() => audioManager.playUIHover()}
          >
            ENTER {stage.name.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}
