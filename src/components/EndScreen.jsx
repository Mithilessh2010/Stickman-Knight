import React, { useEffect, useState } from 'react';
import { CHARACTERS } from '../game/characters.js';
import { audioManager } from '../game/audio.js';

export default function EndScreen({ result, onRestart, onHome, isTournament, tournamentWinner }) {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    // Trigger animation on mount
    setAnimationPhase(1);
    if (result === 'player') {
      audioManager.playVictory();
    } else {
      audioManager.playDefeat();
    }
  }, [result]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        audioManager.playUIClick();
        onRestart();
      }
      if (e.code === 'Escape') {
        audioManager.playUIClick();
        onHome();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onRestart, onHome]);

  const win = result === 'player';
  const isChampion = tournamentWinner === 'player';

  if (isTournament && isChampion && result === 'player') {
    return (
      <div className="screen" style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.1), rgba(125,211,252,0.05))' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: animationPhase > 0 ? 'fadeIn 0.6s ease-out' : 'none',
        }}>
          <div style={{
            textAlign: 'center',
            padding: '60px 80px',
            background: 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(251,191,36,0.05))',
            border: '2px solid rgba(251,191,36,0.4)',
            borderRadius: 12,
            backdropFilter: 'blur(8px)',
            boxShadow: '0 0 40px rgba(251,191,36,0.3)',
          }}>
            <div style={{
              fontSize: 14,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: '#fbbf24',
              marginBottom: 16,
            }}>
              🏆 Tournament Champion 🏆
            </div>
            <h1 style={{
              fontSize: 72,
              fontWeight: 900,
              margin: '0 0 24px 0',
              background: 'linear-gradient(135deg, #fbbf24, #fb923c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 20px rgba(251,191,36,0.3))',
            }}>
              YOU ARE CHAMPION
            </h1>
            <div style={{
              fontSize: 14,
              color: 'var(--text-dim)',
              marginBottom: 32,
              lineHeight: 1.6,
              maxWidth: 400,
            }}>
              You have conquered the arena and proven yourself as the greatest fighter of all time!
            </div>
            <button
              className="btn"
              onClick={() => { audioManager.playUIClick(); onHome(); }}
              style={{
                padding: '14px 40px',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.1em',
                boxShadow: '0 0 20px rgba(251,191,36,0.4)',
              }}
              onMouseEnter={() => audioManager.playUIHover()}
            >
              Return to Main Menu
            </button>
          </div>
        </div>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  const label = isTournament ? (win ? 'Round Won!' : 'Eliminated') : 'Match Result';
  const winText = isTournament ? (win ? 'You advance to the next round!' : 'Your tournament run ends here.') : 'You stand victorious in the arena.';
  const loseText = isTournament ? 'Your tournament run ends here.' : 'Defeat in the arena.';

  return (
    <div className="screen" style={{
      background: win
        ? 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(125,211,252,0.05))'
        : 'linear-gradient(135deg, rgba(248,113,113,0.1), rgba(125,211,252,0.05))',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: animationPhase > 0 ? 'slideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
      }}>
        <div style={{
          textAlign: 'center',
          padding: '50px 70px',
          background: win
            ? 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))'
            : 'linear-gradient(135deg, rgba(248,113,113,0.15), rgba(248,113,113,0.05))',
          border: `2px solid ${win ? 'rgba(34,197,94,0.4)' : 'rgba(248,113,113,0.4)'}`,
          borderRadius: 12,
          backdropFilter: 'blur(8px)',
          boxShadow: win ? '0 0 40px rgba(34,197,94,0.3)' : '0 0 40px rgba(248,113,113,0.3)',
          maxWidth: 500,
        }}>
          <div style={{
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: win ? '#34d399' : '#f87171',
            marginBottom: 12,
          }}>
            {label}
          </div>
          <h1 style={{
            fontSize: 64,
            fontWeight: 900,
            margin: '0 0 20px 0',
            color: win ? '#34d399' : '#f87171',
            textShadow: win
              ? '0 0 30px rgba(52,211,153,0.4)'
              : '0 0 30px rgba(248,113,113,0.4)',
          }}>
            {win ? '✓ VICTORY' : '✗ DEFEAT'}
          </h1>
          <div style={{
            fontSize: 13,
            color: 'var(--text-dim)',
            marginBottom: 32,
            lineHeight: 1.6,
          }}>
            {win ? winText : loseText}
          </div>

          <div style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
          }}>
            <button
              className="btn"
              onClick={() => { audioManager.playUIClick(); onRestart(); }}
              style={{
                padding: '12px 32px',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.1em',
                boxShadow: win ? '0 0 20px rgba(34,197,94,0.4)' : '0 0 20px rgba(248,113,113,0.4)',
              }}
              onMouseEnter={() => audioManager.playUIHover()}
            >
              {isTournament ? (win ? 'NEXT MATCH' : 'MAIN MENU') : 'REMATCH'}
            </button>
            {!isTournament && (
              <button
                className="btn ghost"
                onClick={() => { audioManager.playUIClick(); onHome(); }}
                style={{ padding: '12px 32px', fontSize: 13 }}
                onMouseEnter={() => audioManager.playUIHover()}
              >
                Main Menu
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
