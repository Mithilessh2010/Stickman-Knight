import React, { useEffect, useRef } from 'react'

export default function EndScreen({ result, onRestart, onHome }) {
  const isWin = result === 'win'
  const color = isWin ? '#00c8ff' : '#ef4444'
  const glow = isWin ? 'rgba(0,200,255,0.6)' : 'rgba(239,68,68,0.6)'

  const canvasRef = useRef(null)
  useEffect(() => {
    if (!isWin) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      vx: (Math.random() - 0.5) * 3,
      vy: -(Math.random() * 6 + 2),
      color: ['#00c8ff','#ffd700','#a855f7','#4ecdc4'][Math.floor(Math.random()*4)],
      r: Math.random() * 5 + 2,
      life: 1,
      decay: Math.random() * 0.008 + 0.004,
    }))
    let raf
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.life -= p.decay
        if (p.life <= 0) { p.life = 1; p.x = Math.random() * canvas.width; p.y = canvas.height + 10; p.vy = -(Math.random() * 6 + 2) }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2)
        ctx.fillStyle = p.color + Math.floor(p.life * 255).toString(16).padStart(2,'0')
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [isWin])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#080c14' }}>
      {isWin && <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(16px,3vw,26px)', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.4)' }}>
          {isWin ? 'VICTORY' : 'DEFEATED'}
        </div>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 'clamp(64px,14vw,140px)', color, textShadow: `0 0 40px ${glow}, 0 0 80px ${glow}`, lineHeight: 1, letterSpacing: '0.05em' }}>
          {isWin ? 'YOU WIN' : 'GAME OVER'}
        </div>
        <div style={{ width: 200, height: 2, background: `linear-gradient(90deg, transparent, ${color}, transparent)`, boxShadow: `0 0 12px ${color}` }} />
        <div style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: 18, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>
          {isWin ? 'The arena bows to your dominance.' : 'The enemy stands victorious.'}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          <button
            onClick={onRestart}
            style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: '0.15em', padding: '14px 48px', background: color, color: '#080c14', border: 'none', cursor: 'pointer', boxShadow: `0 0 24px ${glow}`, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.target.style.transform = 'scale(1.05)' }}
            onMouseLeave={e => { e.target.style.transform = 'scale(1)' }}
          >
            PLAY AGAIN
          </button>
          <button
            onClick={onHome}
            style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, letterSpacing: '0.15em', padding: '14px 48px', background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.target.style.color = '#fff'; e.target.style.borderColor = 'rgba(255,255,255,0.5)' }}
            onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.5)'; e.target.style.borderColor = 'rgba(255,255,255,0.2)' }}
          >
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  )
}
