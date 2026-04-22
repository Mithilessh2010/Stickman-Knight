import React from 'react';
import { CHARACTERS } from '../game/characters.js';

const ROUND_COLORS = ['#00e5ff','#00ff9d','#ffb800','#ff9500'];
const ROUND_NAMES  = ['Quarterfinals','Semifinals','Finals','Grand Final'];

function MatchCard({ match }) {
  if (!match) return null;
  const pCh = match.player ? CHARACTERS[match.player] : null;
  const oCh = match.opponent ? CHARACTERS[match.opponent] : null;

  const Slot = ({ id, ch }) => {
    if (!ch) return (
      <div style={{ padding:'6px 8px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:2, marginBottom:3, fontSize:10, color:'rgba(255,255,255,0.2)', letterSpacing:'0.08em' }}>
        TBD
      </div>
    );
    const won = match.winner === id;
    return (
      <div style={{
        padding:'6px 8px', borderRadius:2, marginBottom:3,
        background: won ? `${ch.color}18` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${won ? ch.color : 'rgba(255,255,255,0.07)'}`,
        borderLeft: `2px solid ${won ? ch.color : 'rgba(255,255,255,0.12)'}`,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        transition:'all 0.2s',
      }}>
        <span style={{ fontSize:10, fontWeight: won ? 800 : 400, color: won ? ch.color : 'var(--text-dim)', letterSpacing:'0.06em', textTransform:'uppercase' }}>
          {ch.name.split(' ')[0]}
        </span>
        {won && <span style={{ fontSize:9, color:ch.color, fontWeight:900 }}>W</span>}
      </div>
    );
  };

  return (
    <div style={{
      background:'rgba(255,255,255,0.02)',
      border:'1px solid rgba(255,255,255,0.07)',
      borderRadius:2, padding:6, marginBottom:8,
    }}>
      <Slot id={match.player} ch={pCh} />
      <Slot id={match.opponent} ch={oCh} />
    </div>
  );
}

export default function TournamentBracket({ tournament }) {
  if (!tournament) return null;
  const { bracket, round } = tournament;

  const rounds = [
    { data: bracket.round1, label:'Quarters', idx:0 },
    { data: bracket.round2, label:'Semis',    idx:1 },
    { data: bracket.round3, label:'Finals',   idx:2 },
    { data: bracket.round4, label:'Crown',    idx:3 },
  ].filter(r => r.data?.some(m => m?.player));

  const color = ROUND_COLORS[Math.min(round-1, 3)];

  return (
    <div style={{
      position:'absolute', right:14, top:14,
      background:'rgba(6,6,8,0.94)',
      border:`1px solid rgba(255,255,255,0.08)`,
      borderTop:`2px solid ${color}`,
      borderRadius:3, padding:12,
      width:180,
      backdropFilter:'blur(16px)',
      maxHeight:'calc(100vh - 80px)',
      overflowY:'auto',
      boxShadow:`0 0 20px ${color}18`,
    }}>
      {/* Header */}
      <div style={{
        fontSize:9, fontWeight:900, letterSpacing:'0.25em',
        textTransform:'uppercase', color, marginBottom:12,
        textAlign:'center', paddingBottom:8,
        borderBottom:'1px solid rgba(255,255,255,0.07)',
        textShadow:`0 0 10px ${color}66`,
      }}>
        Round {round} · {ROUND_NAMES[Math.min(round-1,3)]}
      </div>

      {rounds.map(({ data, label, idx }) => (
        <div key={idx} style={{ marginBottom:10 }}>
          <div style={{
            fontSize:8, letterSpacing:'0.2em', textTransform:'uppercase',
            color: ROUND_COLORS[idx], marginBottom:6, fontWeight:700,
            paddingBottom:4, borderBottom:`1px solid ${ROUND_COLORS[idx]}22`,
          }}>
            {label}
          </div>
          {data.map((m,i) => <MatchCard key={i} match={m} />)}
        </div>
      ))}
    </div>
  );
}
