export function createParticle(x, y, color, opts = {}) {
  const angle = opts.angle !== undefined ? opts.angle : Math.random() * Math.PI * 2
  const speed = opts.speed !== undefined ? opts.speed : Math.random() * 5 + 1
  return {
    x, y,
    vx: Math.cos(angle) * speed + (opts.vx || 0),
    vy: Math.sin(angle) * speed + (opts.vy || 0),
    color,
    alpha: 1,
    size: opts.size || Math.random() * 4 + 2,
    decay: opts.decay || Math.random() * 0.04 + 0.02,
    gravity: opts.gravity !== undefined ? opts.gravity : 0.15,
    shrink: opts.shrink || 0.95,
    type: opts.type || 'circle',
  }
}

export function createHitBurst(x, y, color) {
  return Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2
    return createParticle(x, y, color, {
      angle,
      speed: Math.random() * 6 + 2,
      size: Math.random() * 5 + 2,
      decay: 0.04,
      gravity: 0.1,
    })
  })
}

export function createSlashTrail(x, y, dir, color) {
  return Array.from({ length: 8 }, () =>
    createParticle(x, y, color, {
      angle: dir > 0 ? Math.PI * 0.1 : Math.PI * 0.9,
      speed: Math.random() * 4 + 2,
      decay: 0.06,
      size: Math.random() * 3 + 1,
      gravity: 0,
    })
  )
}

export function createMeteorParticles(x, y) {
  return Array.from({ length: 25 }, () =>
    createParticle(x, y, Math.random() > 0.5 ? '#ff6b35' : '#ffd700', {
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 10 + 4,
      size: Math.random() * 6 + 3,
      decay: 0.025,
      gravity: 0.2,
    })
  )
}

export function createSparkle(x, y, color) {
  return Array.from({ length: 6 }, () =>
    createParticle(x, y, color, {
      speed: Math.random() * 3 + 1,
      size: Math.random() * 2 + 1,
      decay: 0.05,
      gravity: 0,
    })
  )
}

export function updateParticles(particles) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.x += p.vx
    p.y += p.vy
    p.vy += p.gravity
    p.alpha -= p.decay
    p.size *= p.shrink
    if (p.alpha <= 0 || p.size < 0.3) particles.splice(i, 1)
  }
}

export function drawParticles(ctx, particles) {
  particles.forEach(p => {
    ctx.save()
    ctx.globalAlpha = Math.max(0, p.alpha)
    ctx.fillStyle = p.color
    ctx.shadowBlur = 8
    ctx.shadowColor = p.color
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  })
}
