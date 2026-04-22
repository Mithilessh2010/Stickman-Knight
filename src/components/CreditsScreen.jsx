import React from 'react';
import { audioManager } from '../game/audio.js';

const ROWS = [
  { label:'Engine', val:'React 18 + HTML5 Canvas' },
  { label:'Build', val:'Vite' },
  { label:'Deployment', val:'Vercel' },
  { label:'Typography', val:'Bebas Neue · Barlow Condensed' },
  { label:'Fighters', val:'12 unique characters' },
  { label:'Version', val:'2.0.0' },
];

export default function CreditsScreen({ onClose }) {
  return (
    <div className="screen" style={{ background:'rgba(0,0,0,0.7)', backdropFilter:'blur(12px)', overflow:'auto', padding:24 }}>
      <div style={{
        background:'rgba(6,6,8,0.98)',
        border:'1px solid rgba(255,255,255,0.07)',
        borderTop:'2px solid #ff9500',
        borderRadius:3, padding:'36px 40px',
        maxWidth:500, width:'100%',
        textAlign:'center',
        boxShadow:'0 30px 80px rgba(0,0,0,0.9)',
      }}>
        {/* Title */}
        <div style={{ fontFamily:'var(--font-display)', fontSize:52, letterSpacing:'0.04em', lineHeight:1, color:'#fff', marginBottom:4 }}>
          STICKMAN
        </div>
        <div style={{ fontFamily:'var(--font-display)', fontSize:52, letterSpacing:'0.04em', lineHeight:1, color:'#ff9500', textShadow:'0 0 30px rgba(255,149,0,0.4)', marginBottom:8 }}>
          ARENA
        </div>
        <div style={{ fontSize:11, color:'var(--text-dim)', letterSpacing:'0.25em', textTransform:'uppercase', marginBottom:32 }}>
          A 2D Fighting Game
        </div>

        {/* Tech table */}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', paddingTop:24, marginBottom:24 }}>
          <div style={{ fontSize:9, letterSpacing:'0.25em', textTransform:'uppercase', color:'#ff9500', marginBottom:14, fontWeight:700 }}>Built With</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {ROWS.map(({ label, val }) => (
              <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'7px 12px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:2 }}>
                <span style={{ fontSize:11, color:'var(--text-dim)', letterSpacing:'0.08em' }}>{label}</span>
                <span style={{ fontSize:11, fontWeight:700, color:'var(--text)' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Thanks */}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', paddingTop:20, marginBottom:24 }}>
          <div style={{ fontSize:9, letterSpacing:'0.25em', textTransform:'uppercase', color:'var(--text-dim)', marginBottom:10, fontWeight:700 }}>Special Thanks</div>
          <div style={{ fontSize:12, color:'var(--text-dim)', lineHeight:1.7 }}>
            All playtesters and the fighting game community.<br/>
            Thank you for playing.
          </div>
        </div>

        <button className="btn" onClick={() => { audioManager.playUIClick(); onClose(); }}
          onMouseEnter={() => audioManager.playUIHover()}
          style={{ width:'100%', padding:'12px' }}>
          Back
        </button>
      </div>
    </div>
  );
}
