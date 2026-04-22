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
        backdropFilter: 'blur(4px)',
        animation: 'slideUp 0.4s ease-out',
      }}
    >
      {playerChar && (
        <div
          style={{
            padding: '8px',
            background: winner === match.player ? `${playerChar.color}22` : 'rgba(0,0,0,0.2)',
            border: winner === match.player ? `1px solid ${playerChar.color}` : '1px solid rgba(255,255,255,0.1)',
            borderLeft: winner === match.player ? `3px solid ${playerChar.color}` : 'none',
            borderRadius: 4,
            marginBottom: 4,
            fontWeight: winner === match.player ? 700 : 400,
            color: winner === match.player ? playerChar.color : 'var(--text-dim)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: winner === match.player ? `0 0 8px ${playerChar.color}44` : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          <span style={{ fontSize: 10 }}>{playerChar.name.split(' ')[0]}</span>
          {winner === match.player && <span style={{ marginLeft: 'auto' }}>✓</span>}
        </div>
      )}
      {opponentChar && (
        <div
          style={{
            padding: '8px',
            background: winner === match.opponent ? `${opponentChar.color}22` : 'rgba(0,0,0,0.2)',
            border: winner === match.opponent ? `1px solid ${opponentChar.color}` : '1px solid rgba(255,255,255,0.1)',
            borderLeft: winner === match.opponent ? `3px solid ${opponentChar.color}` : 'none',
            borderRadius: 4,
            fontWeight: winner === match.opponent ? 700 : 400,
            color: winner === match.opponent ? opponentChar.color : 'var(--text-dim)',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: winner === match.opponent ? `0 0 8px ${opponentChar.color}44` : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          <span style={{ fontSize: 10 }}>{opponentChar.name.split(' ')[0]}</span>
          {winner === match.opponent && <span style={{ marginLeft: 'auto' }}>✓</span>}
        </div>
      )}
    </div>
  );
}

export default function TournamentBracket({ tournament }) {
  if (!tournament) return null;

  const { bracket, round } = tournament;

  const getRoundColor = (roundNum) => {
    switch (roundNum) {
      case 1: return '#7dd3fc';
      case 2: return '#34d399';
      case 3: return '#fbbf24';
      case 4: return '#fb923c';
      default: return '#7dd3fc';
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        right: 20,
        top: 20,
        background: 'linear-gradient(135deg, rgba(20, 24, 34, 0.95), rgba(20, 24, 34, 0.85))',
        border: '2px solid rgba(125, 211, 252, 0.3)',
        borderRadius: 12,
        padding: 16,
        maxWidth: 300,
        backdropFilter: 'blur(12px)',
        maxHeight: 'calc(100vh - 60px)',
        overflowY: 'auto',
        boxShadow: '0 0 30px rgba(125, 211, 252, 0.1)',
      }}
    >
      <div style={{
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginBottom: 16,
        color: getRoundColor(round),
        textShadow: `0 0 10px ${getRoundColor(round)}44`,
        padding: 8,
        textAlign: 'center',
        borderBottom: `1px solid ${getRoundColor(round)}33`,
      }}>
        🏆 Round {round} of 4
      </div>

      {bracket.round1.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{
            fontSize: 9,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: 8,
            marginTop: 8,
            fontWeight: 700,
            paddingBottom: 4,
            borderBottom: '1px solid rgba(125, 211, 252, 0.2)',
          }}>
            ⚔ Quarterfinals
          </div>
          {bracket.round1.map((match, i) => (
            <BracketMatch key={`r1-${i}`} match={match} round={1} position={i} />
          ))}
        </div>
      )}

      {bracket.round2.some(m => m.player) && (
        <div style={{ marginBottom: 12 }}>
          <div style={{
            fontSize: 9,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#34d399',
            marginBottom: 8,
            marginTop: 8,
            fontWeight: 700,
            paddingBottom: 4,
            borderBottom: '1px solid rgba(52, 211, 153, 0.2)',
          }}>
            ⚡ Semifinals
          </div>
          {bracket.round2.map((match, i) => (
            <BracketMatch key={`r2-${i}`} match={match} round={2} position={i} />
          ))}
        </div>
      )}

      {bracket.round3.some(m => m.player) && (
        <div style={{ marginBottom: 12 }}>
          <div style={{
            fontSize: 9,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#fbbf24',
            marginBottom: 8,
            marginTop: 8,
            fontWeight: 700,
            paddingBottom: 4,
            borderBottom: '1px solid rgba(251, 191, 36, 0.2)',
          }}>
            🔥 Finals
          </div>
          {bracket.round3.map((match, i) => (
            <BracketMatch key={`r3-${i}`} match={match} round={3} position={i} />
          ))}
        </div>
      )}

      {bracket.round4.some(m => m.player) && (
        <div style={{ marginBottom: 8 }}>
          <div style={{
            fontSize: 9,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#fb923c',
            marginBottom: 8,
            marginTop: 8,
            fontWeight: 900,
            paddingBottom: 4,
            borderBottom: '2px solid rgba(251, 146, 60, 0.3)',
            textShadow: '0 0 8px rgba(251, 146, 60, 0.3)',
          }}>
            👑 CHAMPION CROWN
          </div>
          {bracket.round4.map((match, i) => (
            <BracketMatch key={`r4-${i}`} match={match} round={4} position={i} />
          ))}
        </div>
      )}
    </div>
  );
}
