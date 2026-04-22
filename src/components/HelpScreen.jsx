import React from 'react';
import { audioManager } from '../game/audio.js';

const SECTIONS = [
  {
    title: 'Controls',
    color: '#00e5ff',
    items: [
      ['Move', '← → or A D'],
      ['Jump', 'Space / W / ↑'],
      ['Basic Attack', 'J'],
      ['Ability 1', 'K'],
      ['Ability 2', 'L'],
      ['Ultimate', 'U'],
    ],
    note: 'All keys are rebindable in Settings.'
  },
  {
    title: 'Combat',
    color: '#ff9500',
    items: [
      ['Health', 'Reaches 0 → you lose'],
      ['Cooldowns', 'Number = seconds left'],
      ['Knockback', 'Heavy hits send you flying'],
      ['iFrames', 'Brief window of invincibility after a hit'],
      ['Ultimate', 'Most powerful move — save it'],
    ],
  },
  {
    title: 'Modes',
    color: '#00ff9d',
    items: [
      ['Quick Play', 'Pick a fighter, face a random AI'],
      ['Tournament', '4-round bracket · defeat all to be champion'],
    ],
  },
  {
    title: 'Tips',
    color: '#c084fc',
    items: [
      ['Spacing', 'Stay just outside their attack range'],
      ['Timing', 'Attack during their recovery frames'],
      ['Ultimate', 'Save for when they\'re cornered'],
      ['Movement', 'Jump to dodge ground attacks'],
    ],
  },
];

export default function HelpScreen({ onClose }) {
  return (
    <div className="screen" style={{ background:'rgba(0,0,0,0.7)', backdropFilter:'blur(12px)', overflow:'auto', padding:24 }}>
      <div style={{
        background:'rgba(6,6,8,0.98)',
        border:'1px solid rgba(255,255,255,0.07)',
        borderTop:'2px solid #00e5ff',
        borderRadius:3, padding:'32px 36px',
        maxWidth:640, width:'100%',
        boxShadow:'0 30px 80px rgba(0,0,0,0.9)',
      }}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:42, letterSpacing:'0.04em', lineHeight:1 }}>
            HOW TO PLAY
          </div>
          <button onClick={() => { audioManager.playUIClick(); onClose(); }}
            onMouseEnter={() => audioManager.playUIHover()}
            style={{ background:'none', border:'1px solid rgba(255,255,255,0.1)', color:'var(--text-dim)', cursor:'pointer', padding:'6px 12px', borderRadius:2, fontSize:13, fontFamily:'var(--font-ui)', letterSpacing:'0.1em', transition:'all 0.15s' }}
            onMouseOver={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.3)'}
            onMouseOut={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'}>
            ✕ Close
          </button>
        </div>

        {/* Sections */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
          {SECTIONS.map(({ title, color, items, note }) => (
            <div key={title} style={{
              background:'rgba(255,255,255,0.02)',
              border:`1px solid rgba(255,255,255,0.06)`,
              borderLeft:`2px solid ${color}`,
              borderRadius:2, padding:'14px 16px',
            }}>
              <div style={{ fontSize:9, letterSpacing:'0.25em', textTransform:'uppercase', color, fontWeight:700, marginBottom:12 }}>{title}</div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {items.map(([key, val]) => (
                  <div key={key} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:8 }}>
                    <span style={{ fontSize:12, color:'var(--text-dim)', letterSpacing:'0.04em' }}>{key}</span>
                    <span style={{ fontSize:11, fontWeight:700, color:'var(--text)', letterSpacing:'0.06em', textAlign:'right' }}>{val}</span>
                  </div>
                ))}
              </div>
              {note && (
                <div style={{ marginTop:10, paddingTop:10, borderTop:'1px solid rgba(255,255,255,0.06)', fontSize:10, color:'var(--text-dim)', lineHeight:1.4 }}>{note}</div>
              )}
            </div>
          ))}
        </div>

        <button className="btn" onClick={() => { audioManager.playUIClick(); onClose(); }}
          onMouseEnter={() => audioManager.playUIHover()}
          style={{ width:'100%', marginTop:24, padding:'12px' }}>
          Got It
        </button>
      </div>
    </div>
  );
}
