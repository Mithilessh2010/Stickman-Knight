import React from 'react';
import { CHARACTERS } from '../game/characters.js';

function BracketMatch({ match, isPlayer, round, position }) {
  if (!match) return null;

  const playerChar = match.player ? CHARACTERS[match.player] : null;
  const opponentChar = match.opponent ? CHARACTERS[match.opponent] : null;
  const winner = match.winner;

  return (
    <div
      style={{
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid var(--panel-border)',
        borderRadius: 8,
        padding: 8,
        marginBottom: 12,
        minWidth: 140,
        fontSize: 11,
        backdropFilter: 'blur(4px)'
      }}
    >
      {playerChar && (
        <div
          style={{
            padding: '6px 8px',
            background: winner === match.player ? 'rgba(52, 211, 153, 0.2)' : 'rgba(0,0,0,0.2)',
            borderLeft: winner === match.player ? '3px solid #34d399' : 'none',
            borderRadius: 4,
            marginBottom: 4,
            fontWeight: winner === match.player ? 700 : 400,
            color: winner === match.player ? '#34d399' : 'var(--text-dim)'
          }}
        >
          {playerChar.name}
        </div>
      )}
      {opponentChar && (
        <div
          style={{
            padding: '6px 8px',
            background: winner === match.opponent ? 'rgba(52, 211, 153, 0.2)' : 'rgba(0,0,0,0.2)',
            borderLeft: winner === match.opponent ? '3px solid #34d399' : 'none',
            borderRadius: 4,
            fontWeight: winner === match.opponent ? 700 : 400,
            color: winner === match.opponent ? '#34d399' : 'var(--text-dim)'
          }}
        >
          {opponentChar.name}
        </div>
      )}
    </div>
  );
}

export default function TournamentBracket({ tournament }) {
  if (!tournament) return null;

  const { bracket, round } = tournament;

  return (
    <div
      style={{
        position: 'absolute',
        right: 20,
        top: 20,
        background: 'rgba(20, 24, 34, 0.85)',
        border: '1px solid var(--panel-border)',
        borderRadius: 12,
        padding: 16,
        maxWidth: 280,
        backdropFilter: 'blur(8px)',
        maxHeight: 'calc(100vh - 60px)',
        overflowY: 'auto'
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12, color: 'var(--accent)' }}>
        Round {round} of 4
      </div>

      {bracket.round1.length > 0 && (
        <div>
          <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 8, marginTop: 12 }}>
            Quarterfinals
          </div>
          {bracket.round1.map((match, i) => (
            <BracketMatch key={`r1-${i}`} match={match} round={1} position={i} />
          ))}
        </div>
      )}

      {bracket.round2.some(m => m.player) && (
        <div>
          <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 8, marginTop: 12 }}>
            Semifinals
          </div>
          {bracket.round2.map((match, i) => (
            <BracketMatch key={`r2-${i}`} match={match} round={2} position={i} />
          ))}
        </div>
      )}

      {bracket.round3.some(m => m.player) && (
        <div>
          <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 8, marginTop: 12 }}>
            Finals
          </div>
          {bracket.round3.map((match, i) => (
            <BracketMatch key={`r3-${i}`} match={match} round={3} position={i} />
          ))}
        </div>
      )}

      {bracket.round4.some(m => m.player) && (
        <div>
          <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8, marginTop: 12 }}>
            Champion
          </div>
          {bracket.round4.map((match, i) => (
            <BracketMatch key={`r4-${i}`} match={match} round={4} position={i} />
          ))}
        </div>
      )}
    </div>
  );
}
