import React, { useEffect, useRef } from 'react'

export default function StartScreen({ onStart }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    let frame = 0
    let raf

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      a: Math.random(),
    }))

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // grid
      ctx.strokeStyle = 'rgba(0,200,255,0.04)'
      ctx.lineWidth = 1
      for (let x = 0; x < canvas.width; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke()
      }
      for (let y = 0; y < canvas.height; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke()
      }
      // particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,200,255,${p.a * 0.6})`
        ctx.fill()
      })
      frame++
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0 }} />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px,10vw,110px)', letterSpacing: '0.08em', color: '#fff', textShadow: '0 0 40px rgba(0,200,255,0.7), 0 0 80px rgba(0,200,255,0.3)', lineHeight: 1 }}>
          STICKMAN
        </div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(36px,7vw,80px)', letterSpacing: '0.2em', color: '#00c8ff', textShadow: '0 0 30px rgba(0,200,255,0.9)', lineHeight: 1, marginBottom: 8 }}>
          DUEL ARENA
        </div>
        <div style={{ width: '100%', height: 2, background: 'linear-gradient(90deg, transparent, #00c8ff, transparent)', marginBottom: 48, boxShadow: '0 0 12px #00c8ff' }} />
        <button
          onClick={onStart}
          style={{
            fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: 22, letterSpacing: '0.15em',
            padding: '16px 56px', background: 'transparent', color: '#00c8ff',
            border: '2px solid #00c8ff', cursor: 'pointer',
            textTransform: 'uppercase', position: 'relative', overflow: 'hidden',
            boxShadow: '0 0 20px rgba(0,200,255,0.3)', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.target.style.background = 'rgba(0,200,255,0.15)'; e.target.style.boxShadow = '0 0 40px rgba(0,200,255,0.6)' }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.boxShadow = '0 0 20px rgba(0,200,255,0.3)' }}
        >
          ENTER ARENA
        </button>
        <div style={{ marginTop: 32, fontFamily: "'Share Tech Mono', monospace", fontSize: 13, color: 'rgba(0,200,255,0.5)', letterSpacing: '0.1em' }}>
          PRESS TO BEGIN · 4 WARRIORS · 1 CHAMPION
        </div>
      </div>
    </div>
  )
}
