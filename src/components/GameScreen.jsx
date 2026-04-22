import React, { useEffect, useRef, useState, useCallback } from 'react'
import { GameEngine } from '../game/GameEngine.js'
import { CANVAS_W, CANVAS_H } from '../game/constants.js'
import HUD from './HUD.jsx'

export default function GameScreen({ selectedChar, onGameEnd }) {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const [hudData, setHudData] = useState({ player: null, enemy: null, tick: 0 })
  const [countdown, setCountdown] = useState(3)
  const [started, setStarted] = useState(false)

  // Countdown
  useEffect(() => {
    if (countdown <= 0) { setStarted(true); return }
    const t = setTimeout(() => setCountdown(c => c - 1), 900)
    return () => clearTimeout(t)
  }, [countdown])

  // Start engine after countdown
  useEffect(() => {
    if (!started || !canvasRef.current) return

    const canvas = canvasRef.current
    const engine = new GameEngine(canvas, selectedChar, (result) => {
      onGameEnd(result)
    })
    engineRef.current = engine
    engine.start()

    // HUD polling
    let hudRaf
    function pollHud() {
      if (engineRef.current) {
        setHudData(d => ({ player: engine.player, enemy: engine.enemy, tick: d.tick + 1 }))
      }
      hudRaf = requestAnimationFrame(pollHud)
    }
    pollHud()

    return () => {
      engine.destroy()
      cancelAnimationFrame(hudRaf)
      engineRef.current = null
    }
  }, [started, selectedChar])

  // Responsive canvas scaling
  const [scale, setScale] = useState(1)
  const [canvasStyle, setCanvasStyle] = useState({})

  useEffect(() => {
    function resize() {
      const scaleX = window.innerWidth / CANVAS_W
      const scaleY = window.innerHeight / CANVAS_H
      const s = Math.min(scaleX, scaleY)
      setScale(s)
      setCanvasStyle({
        transform: `scale(${s})`,
        transformOrigin: 'top left',
        position: 'absolute',
        left: (window.innerWidth - CANVAS_W * s) / 2,
        top: (window.innerHeight - CANVAS_H * s) / 2,
      })
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#060a12', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        style={canvasStyle}
      />

      {/* HUD overlay */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <HUD player={hudData.player} enemy={hudData.enemy} tick={hudData.tick} />
      </div>

      {/* Countdown */}
      {!started && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: countdown > 0 ? 'clamp(80px,20vw,180px)' : 'clamp(40px,10vw,100px)',
            color: countdown > 0 ? '#00c8ff' : '#ffd700',
            textShadow: countdown > 0 ? '0 0 60px rgba(0,200,255,0.8)' : '0 0 60px rgba(255,215,0,0.8)',
            letterSpacing: '0.1em',
            animation: 'none',
          }}>
            {countdown > 0 ? countdown : 'FIGHT!'}
          </div>
        </div>
      )}

      {/* Controls reminder */}
      {started && (
        <div style={{
          position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
          fontFamily: "'Share Tech Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.08em', whiteSpace: 'nowrap', pointerEvents: 'none',
        }}>
          WASD/ARROWS: MOVE · SPACE/W: JUMP · J: ATTACK · Q E R: SKILLS · F: ULTIMATE
        </div>
      )}
    </div>
  )
}
