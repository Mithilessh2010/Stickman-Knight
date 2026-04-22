import React, { useState } from 'react';
import { audioManager } from '../game/audio.js';

const STAGES = [
  { id: 'rooftop',   name: 'Neon Rooftop',    tag: 'URBAN',      desc: 'City lights and neon signs flicker in the dark.',   color: '#00e5ff', icon: '▣' },
  { id: 'temple',    name: 'Ancient Temple',   tag: 'MYSTIC',     desc: 'Sacred grounds charged with ancient energy.',        color: '#fcd34d', icon: '◈' },
  { id: 'mountain',  name: 'Frozen Peak',      tag: 'ICY',        desc: 'Bitter cold at the top of the world.',               color: '#a5f3fc', icon: '△' },
  { id: 'cyberlab',  name: 'Cyber Lab',        tag: 'DIGITAL',    desc: 'Glitch-ridden digital space. Expect chaos.',         color: '#c084fc', icon: '◉' },
  { id: 'forest',    name: 'Dark Forest',      tag: 'PRIMAL',     desc: 'Ancient trees reclaim the battlefield.',             color: '#34d399', icon: '◆' },
  { id: 'scrapyard', name: 'Scrapyard',        tag: 'WASTELAND',  desc: 'Rusted machines and desert dust.',                   color: '#fb923c', icon: '⊕' },
];

export default function StageSelect({ onSelect, onBack }) {
  const [selected, setSelected] = useState(STAGES[0].id);
  const stage = STAGES.find(s => s.id === selected);

  return (
    <div className="screen" style={{ justifyContent: 'flex-start', padding: 0 }}>
      {/* Header */}
      <div style={{
        width: '100%', padding: '16px 28px',
        background: 'rgba(6,6,8,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backdropFilter: 'blur(10px)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 32, letterSpacing: '0.04em' }}>SELECT STAGE</span>
        </div>
        <button className="btn ghost" onClick={() => { audioManager.playUIClick(); onBack(); }}
          style={{ padding: '7px 14px', fontSize: 11 }} onMouseEnter={() => audioManager.playUIHover()}>
          ← Back
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 40 }}>
        {/* Stage grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, width: 'clamp(320px, 48vw, 560px)' }}>
          {STAGES.map((s) => {
            const isSel = s.id === selected;
            return (
              <div key={s.id}
                onClick={() => { setSelected(s.id); audioManager.playUIClick(); }}
                onMouseEnter={() => audioManager.playUIHover()}
                style={{
                  padding: '18px 14px', cursor: 'pointer', borderRadius: 3,
                  background: isSel ? `${s.color}10` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isSel ? s.color : 'rgba(255,255,255,0.07)'}`,
                  transition: 'all 0.18s', textAlign: 'center',
                  transform: isSel ? 'scale(1.04)' : 'scale(1)',
                  boxShadow: isSel ? `0 0 20px ${s.color}30` : 'none',
                }}>
                <div style={{ fontSize: 28, marginBottom: 8, color: isSel ? s.color : 'var(--text-dim)', filter: isSel ? `drop-shadow(0 0 6px ${s.color})` : 'none', transition: 'all 0.2s' }}>{s.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: isSel ? s.color : 'var(--text)' }}>{s.name}</div>
                <div style={{ fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.2em', marginTop: 2 }}>{s.tag}</div>
              </div>
            );
          })}
        </div>

        {/* Stage info panel */}
        <div style={{ width: 220, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.3em', color: stage.color, marginBottom: 8, fontWeight: 700, textTransform: 'uppercase', textShadow: `0 0 12px ${stage.color}88` }}>{stage.tag}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, letterSpacing: '0.04em', lineHeight: 1, color: '#fff' }}>{stage.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 10, lineHeight: 1.5 }}>{stage.desc}</div>
          </div>
          <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.07)' }} />
          <button className="btn primary"
            onClick={() => { audioManager.playUIClick(); onSelect(selected); }}
            onMouseEnter={() => audioManager.playUIHover()}
            style={{ padding: '15px', fontSize: 15, background: stage.color, borderColor: stage.color }}>
            Fight Here
          </button>
        </div>
      </div>
    </div>
  );
}
