import React, { useRef, useEffect } from 'react';
import { CHARACTERS } from '../game/characters.js';
import { drawStickmanPortrait } from '../game/render.js';
import { createTournament } from '../game/tournament.js';
import { audioManager } from '../game/audio.js';

const CHAR_ICONS = {
  sword:'⚔',spear:'🔱',mage:'✦',brute:'👊',assassin:'◈',
  archer:'◎',elemental:'🔥',summoner:'◉',paladin:'✙',
  berserker:'⚡',gunslinger:'◆',necromancer:'☽'
};

function TournamentCharCard({ charId, selected, onSelect }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d');
    let raf, t = charId.length * 13;
    const draw = () => {
      t++;
      ctx.clearRect(0,0,c.width,c.height);
      drawStickmanPortrait(ctx, CHARACTERS[charId], c.width/2, c.height-12, t);
    };
    if (!selected) {
      draw();
      return undefined;
    }
    const loop = () => { draw(); raf = requestAnimationFrame(loop); };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [charId, selected]);

  const ch = CHARACTERS[charId];
  return (
    <div
      className={`char-card${selected ? ' selected' : ''}`}
      onClick={() => { onSelect(charId); audioManager.playUIClick(); }}
      onMouseEnter={() => audioManager.playUIHover()}
      style={{ '--char-color': ch.color, padding: '10px 8px', gap: 4 }}
    >
      <canvas ref={canvasRef} width={100} height={110}
        style={{ filter: selected ? `drop-shadow(0 0 10px ${ch.color}88)` : 'none', transition: 'filter 0.2s' }} />
      <div style={{ fontSize: 8, letterSpacing:'0.18em', textTransform:'uppercase', color: selected ? ch.color : 'var(--text-dim)', fontWeight:700 }}>{ch.role}</div>
      <div style={{ fontSize: 11, fontWeight:800, letterSpacing:'0.05em', textTransform:'uppercase', color: selected ? ch.color : 'var(--text)' }}>{ch.name.split(' ')[0]}</div>
    </div>
  );
}

export default function TournamentScreen({ onStart, onBack }) {
  const [selectedChar, setSelectedChar] = React.useState(null);
  const ids = Object.keys(CHARACTERS);

  return (
    <div className="screen" style={{ justifyContent:'flex-start', padding:0 }}>
      {/* Header */}
      <div style={{
        width:'100%', padding:'16px 28px',
        background:'rgba(6,6,8,0.95)',
        borderBottom:'1px solid rgba(255,255,255,0.07)',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        backdropFilter:'blur(10px)', flexShrink:0,
      }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:14 }}>
          <span style={{ fontFamily:'var(--font-display)', fontSize:32, letterSpacing:'0.04em' }}>TOURNAMENT</span>
          <span style={{ fontSize:11, color:'var(--text-dim)', letterSpacing:'0.15em', textTransform:'uppercase' }}>Single Elimination · 4 Rounds</span>
        </div>
        <button className="btn ghost" onClick={() => { audioManager.playUIClick(); onBack?.(); }}
          style={{ padding:'7px 14px', fontSize:11 }} onMouseEnter={() => audioManager.playUIHover()}>
          ← Back
        </button>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'24px 28px', width:'100%' }}>
        {/* Tournament info strip */}
        <div style={{
          display:'flex', gap:16, marginBottom:24,
          padding:'14px 18px',
          background:'rgba(255,149,0,0.05)',
          border:'1px solid rgba(255,149,0,0.15)',
          borderLeft:'3px solid #ff9500',
          borderRadius:2,
        }}>
          {['Quarterfinals','Semifinals','Finals','Grand Final'].map((r,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ width:20, height:20, borderRadius:'50%', border:`1px solid rgba(255,149,0,${0.3+i*0.18})`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:900, color:'#ff9500' }}>{i+1}</div>
              <span style={{ fontSize:11, color:'var(--text-dim)', letterSpacing:'0.08em' }}>{r}</span>
              {i<3 && <span style={{ color:'rgba(255,255,255,0.1)', fontSize:12 }}>›</span>}
            </div>
          ))}
          <div style={{ marginLeft:'auto', fontSize:11, color:'#ff9500', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase' }}>
            🏆 Champion Crown
          </div>
        </div>

        {/* Select label */}
        <div style={{ fontSize:9, letterSpacing:'0.25em', color:'var(--text-dim)', textTransform:'uppercase', marginBottom:14, fontWeight:700 }}>
          Choose Your Fighter
        </div>

        {/* Grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(110px, 1fr))', gap:10, maxWidth:900 }}>
          {ids.map(id => (
            <TournamentCharCard key={id} charId={id} selected={selectedChar===id} onSelect={setSelectedChar} />
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop:28, display:'flex', alignItems:'center', gap:16 }}>
          <button className="btn primary"
            onClick={() => { if (!selectedChar) return; audioManager.playUIClick(); onStart(createTournament(selectedChar)); }}
            onMouseEnter={() => audioManager.playUIHover()}
            style={{
              padding:'15px 48px', fontSize:16,
              opacity: selectedChar ? 1 : 0.35,
              cursor: selectedChar ? 'pointer' : 'not-allowed',
              background:'#ff9500', borderColor:'#ff9500',
            }}>
            Enter Tournament
          </button>
          {!selectedChar && (
            <span style={{ fontSize:12, color:'var(--text-dim)', letterSpacing:'0.1em' }}>← Select a fighter first</span>
          )}
          {selectedChar && (
            <span style={{ fontSize:12, color:'#ff9500', letterSpacing:'0.08em' }}>
              Fighting as <strong>{CHARACTERS[selectedChar].name}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
