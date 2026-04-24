import React, { useState } from 'react';
import { audioManager } from '../game/audio.js';
import { STAGE_LIST } from '../game/stage.js';

const STAGES = STAGE_LIST;

export default function StageSelect({ onSelect, onBack, previewOnly = false }) {
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

      <div style={{ flex: 1, overflowY: 'auto', width: '100%', padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
        {/* Stage grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(136px, 1fr))', gap: 10, width: 'clamp(320px, 58vw, 760px)' }}>
          {STAGES.map((s) => {
            const isSel = s.id === selected;
            return (
              <div key={s.id}
                onClick={() => { setSelected(s.id); audioManager.playUIClick(); }}
                onMouseEnter={() => audioManager.playUIHover()}
                style={{
                  minHeight: 118,
                  padding: '14px 10px', cursor: 'pointer', borderRadius: 3,
                  background: isSel ? `${s.color}10` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isSel ? s.color : 'rgba(255,255,255,0.07)'}`,
                  transition: 'all 0.18s', textAlign: 'center',
                  transform: isSel ? 'scale(1.04)' : 'scale(1)',
                  boxShadow: isSel ? `0 0 20px ${s.color}30` : 'none',
                }}>
                <div style={{ fontSize: 24, marginBottom: 7, color: isSel ? s.color : 'var(--text-dim)', filter: isSel ? `drop-shadow(0 0 6px ${s.color})` : 'none', transition: 'all 0.2s' }}>{s.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: isSel ? s.color : 'var(--text)' }}>{s.name}</div>
                <div style={{ fontSize: 9, color: 'var(--text-dim)', letterSpacing: '0.2em', marginTop: 2 }}>{s.tag}</div>
              </div>
            );
          })}
        </div>

        {/* Stage info panel */}
        <div style={{ width: 250, display: 'flex', flexDirection: 'column', gap: 20, position: 'sticky', top: 0 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.3em', color: stage.color, marginBottom: 8, fontWeight: 700, textTransform: 'uppercase', textShadow: `0 0 12px ${stage.color}88` }}>{stage.tag}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, letterSpacing: '0.04em', lineHeight: 1, color: '#fff' }}>{stage.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 10, lineHeight: 1.5 }}>{stage.desc}</div>
          </div>
          <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ height: 120, position: 'relative', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', overflow: 'hidden' }}>
            {stage.platforms.map((p) => (
              <div key={p.id} style={{
                position: 'absolute',
                left: `${(p.x - p.width / 2) / 1280 * 100}%`,
                top: `${(p.y - 300) / 380 * 100}%`,
                width: `${p.width / 1280 * 100}%`,
                height: p.kind === 'solid' ? 12 : 7,
                background: p.kind === 'solid' ? stage.color : 'rgba(255,255,255,0.65)',
                boxShadow: `0 0 12px ${stage.color}55`,
              }} />
            ))}
          </div>
          {!previewOnly && (
            <button className="btn primary"
              onClick={() => { audioManager.playUIClick(); onSelect(selected); }}
              onMouseEnter={() => audioManager.playUIHover()}
              style={{ padding: '15px', fontSize: 15, background: stage.color, borderColor: stage.color }}>
              Fight Here
            </button>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
