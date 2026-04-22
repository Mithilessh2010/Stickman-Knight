import { GROUND_Y, CANVAS_W, CANVAS_H, CHAR_COLORS } from './constants.js'
import { drawParticles } from './particles.js'

// ---- Stickman drawing helpers ----

function drawStickman(ctx, fighter, animFrame) {
  const { x, y, width, height, facing, charId, state, attackPhase, hitFlash, dead, armored, berserk, frozen } = fighter
  const col = CHAR_COLORS[charId]
  const cx = x + width / 2
  const groundY = y + height

  ctx.save()

  // Hit flash
  if (hitFlash > 0 && hitFlash % 2 === 0) {
    ctx.filter = 'brightness(10)'
  }

  const color = frozen > 0 ? '#88eeff' : berserk > 0 ? '#ff2222' : col.primary

  // Idle bob
  const bob = state === 'idle' ? Math.sin(animFrame * 0.18) * 2 : 0
  const runLean = state !== 'attack' && Math.abs(fighter.vx) > 0.5 ? facing * 8 : 0

  // Death angle
  let deathAngle = 0
  if (dead) {
    deathAngle = facing * Math.min(Math.PI / 2, (Date.now() % 10000) * 0.005)
  }

  ctx.translate(cx, groundY)
  ctx.rotate(deathAngle)

  // Shadow
  if (!dead) {
    ctx.beginPath()
    ctx.ellipse(0, 2, width * 0.7, 5, 0, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.fill()
  }

  // Glow aura
  if (berserk > 0 || armored > 0) {
    ctx.beginPath()
    ctx.arc(0, -height * 0.5, height * 0.55, 0, Math.PI * 2)
    ctx.fillStyle = berserk > 0 ? 'rgba(255,30,30,0.12)' : 'rgba(200,200,255,0.12)'
    ctx.fill()
  }

  const h = height
  const headR = h * 0.14
  const bodyLen = h * 0.32
  const legLen = h * 0.3
  const armLen = h * 0.22

  const headY = -h + headR + bob
  const neckY = headY + headR
  const hipY = neckY + bodyLen
  const lw = charId === 'brute' ? 4 : 3

  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  // Running leg animation
  const runCycle = animFrame * 0.35
  let lLegAngle = 0, rLegAngle = 0
  let lArmSwing = 0, rArmSwing = 0

  if (Math.abs(fighter.vx) > 0.5) {
    lLegAngle = Math.sin(runCycle) * 0.55
    rLegAngle = -Math.sin(runCycle) * 0.55
    lArmSwing = -Math.sin(runCycle) * 0.4
    rArmSwing = Math.sin(runCycle) * 0.4
  } else if (!fighter.onGround) {
    lLegAngle = 0.3; rLegAngle = -0.1
  }

  // Attack swing animation
  let attackSwing = 0
  if (state === 'attack') {
    if (attackPhase === 'windUp') attackSwing = -facing * 0.6
    else if (attackPhase === 'active') attackSwing = facing * 1.0
    else attackSwing = facing * 0.2
  }

  // Legs
  ctx.strokeStyle = color
  ctx.lineWidth = lw

  // Left leg
  const lKneeX = Math.sin(lLegAngle) * legLen * 0.5
  const lKneeY = legLen * 0.5
  const lFootX = lKneeX + Math.sin(lLegAngle * 0.7) * legLen * 0.5
  const lFootY = legLen
  ctx.beginPath()
  ctx.moveTo(0, hipY)
  ctx.lineTo(lKneeX - 4, lKneeY + hipY)
  ctx.lineTo(lFootX - 6, lFootY + hipY)
  ctx.stroke()

  // Right leg
  const rKneeX = Math.sin(rLegAngle) * legLen * 0.5
  const rKneeY = legLen * 0.5
  const rFootX = rKneeX + Math.sin(rLegAngle * 0.7) * legLen * 0.5
  const rFootY = legLen
  ctx.beginPath()
  ctx.moveTo(0, hipY)
  ctx.lineTo(rKneeX + 4, rKneeY + hipY)
  ctx.lineTo(rFootX + 6, rFootY + hipY)
  ctx.stroke()

  // Body
  ctx.beginPath()
  ctx.moveTo(0, neckY)
  ctx.lineTo(0, hipY)
  ctx.lineWidth = lw + (charId === 'brute' ? 2 : 0)
  ctx.stroke()
  ctx.lineWidth = lw

  // Arms  
  const baseArmAngle = facing * (Math.PI * 0.25) + attackSwing
  const lArmAngle = baseArmAngle + lArmSwing - 0.3
  const rArmAngle = baseArmAngle + rArmSwing + 0.3

  const armMidY = neckY + armLen * 0.4

  // Weapon arm (dominant)
  const wAX = Math.cos(rArmAngle) * armLen * facing
  const wAY = Math.sin(Math.abs(rArmAngle)) * armLen
  const wElbowX = wAX * 0.5
  const wElbowY = armMidY + wAY * 0.3
  const wHandX = wAX
  const wHandY = armMidY + wAY * 0.6

  ctx.beginPath()
  ctx.moveTo(0, armMidY)
  ctx.lineTo(wElbowX, wElbowY)
  ctx.lineTo(wHandX, wHandY)
  ctx.stroke()

  // Off arm
  const oAX = -Math.cos(lArmAngle) * armLen * facing * 0.7
  const oElbowX = oAX * 0.5
  const oElbowY = armMidY + 4
  const oHandX = oAX
  const oHandY = armMidY + 10

  ctx.beginPath()
  ctx.moveTo(0, armMidY)
  ctx.lineTo(oElbowX, oElbowY)
  ctx.lineTo(oHandX, oHandY)
  ctx.stroke()

  // Draw weapon
  drawWeapon(ctx, charId, wHandX, wHandY, facing, attackSwing, color, armLen, state, attackPhase, animFrame)

  // Head
  ctx.beginPath()
  ctx.arc(0, headY, headR, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Eyes
  const eyeDir = facing > 0 ? 1 : -1
  ctx.beginPath()
  ctx.arc(eyeDir * headR * 0.4, headY - headR * 0.1, headR * 0.18, 0, Math.PI * 2)
  ctx.fillStyle = '#080c14'
  ctx.fill()

  // Character-specific hat/marker
  drawCharMarker(ctx, charId, 0, headY - headR, headR, color, facing, animFrame)

  ctx.restore()
}

function drawWeapon(ctx, charId, hx, hy, facing, swing, color, armLen, state, attackPhase, animFrame) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.shadowBlur = 10
  ctx.shadowColor = color
  const active = state === 'attack' && attackPhase === 'active'

  if (charId === 'sword') {
    const bladeLen = 34
    ctx.lineWidth = active ? 4 : 3
    ctx.beginPath()
    ctx.moveTo(hx, hy)
    ctx.lineTo(hx + facing * bladeLen, hy - 12)
    ctx.stroke()
    // Guard
    ctx.beginPath()
    ctx.moveTo(hx + facing * 8, hy - 4)
    ctx.lineTo(hx + facing * 8, hy - 16)
    ctx.lineWidth = 2
    ctx.stroke()
  } else if (charId === 'spear') {
    const spearLen = 55
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(hx - facing * 15, hy + 8)
    ctx.lineTo(hx + facing * spearLen, hy - 10)
    ctx.stroke()
    // Tip
    ctx.lineWidth = active ? 5 : 3
    ctx.beginPath()
    ctx.moveTo(hx + facing * spearLen, hy - 10)
    ctx.lineTo(hx + facing * (spearLen + 12), hy - 18)
    ctx.stroke()
  } else if (charId === 'mage') {
    // Staff
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(hx, hy)
    ctx.lineTo(hx + facing * 10, hy - 38)
    ctx.stroke()
    // Orb at tip
    ctx.beginPath()
    ctx.arc(hx + facing * 10, hy - 40, active ? 7 : 5, 0, Math.PI * 2)
    ctx.fillStyle = active ? '#fff' : color
    ctx.fill()
  } else if (charId === 'brute') {
    // Hammer
    const hammerX = hx + facing * 28
    const hammerY = hy - 8
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(hx, hy)
    ctx.lineTo(hammerX, hammerY)
    ctx.stroke()
    // Head
    ctx.lineWidth = active ? 12 : 9
    ctx.beginPath()
    ctx.moveTo(hammerX, hammerY - 10)
    ctx.lineTo(hammerX, hammerY + 6)
    ctx.stroke()
  }
  ctx.restore()
}

function drawCharMarker(ctx, charId, cx, topY, headR, color, facing, animFrame) {
  ctx.save()
  ctx.fillStyle = color
  ctx.strokeStyle = color
  ctx.shadowBlur = 8
  ctx.shadowColor = color

  if (charId === 'sword') {
    // Plume
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(cx, topY - 2)
    ctx.lineTo(cx + facing * 10, topY - 12 + Math.sin(animFrame * 0.2) * 2)
    ctx.stroke()
  } else if (charId === 'spear') {
    // Crest
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(cx - 6, topY - 2)
    ctx.lineTo(cx + 6, topY - 2)
    ctx.lineTo(cx, topY - 10)
    ctx.closePath()
    ctx.fill()
  } else if (charId === 'mage') {
    // Pointed hat
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(cx - headR * 0.9, topY)
    ctx.lineTo(cx + headR * 0.9, topY)
    ctx.lineTo(cx, topY - headR * 1.4)
    ctx.closePath()
    ctx.fill()
  } else if (charId === 'brute') {
    // Horns
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(cx - headR * 0.7, topY)
    ctx.lineTo(cx - headR * 1.1, topY - headR * 0.8)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(cx + headR * 0.7, topY)
    ctx.lineTo(cx + headR * 1.1, topY - headR * 0.8)
    ctx.stroke()
  }
  ctx.restore()
}

// ---- Arena / Background ----
function drawArena(ctx, W, H, shakeX, shakeY) {
  ctx.save()
  ctx.translate(shakeX, shakeY)

  // Sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, H)
  sky.addColorStop(0, '#060a12')
  sky.addColorStop(1, '#0d1628')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, W, H)

  // Grid floor
  ctx.strokeStyle = 'rgba(0,200,255,0.06)'
  ctx.lineWidth = 1
  for (let x = 0; x < W; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, GROUND_Y); ctx.lineTo(x + 40, H); ctx.stroke()
  }

  // Platform
  const grad = ctx.createLinearGradient(0, GROUND_Y, 0, GROUND_Y + 10)
  grad.addColorStop(0, '#00c8ff')
  grad.addColorStop(1, 'rgba(0,200,255,0.1)')
  ctx.fillStyle = grad
  ctx.fillRect(0, GROUND_Y, W, 8)
  ctx.shadowBlur = 20
  ctx.shadowColor = '#00c8ff'
  ctx.fillRect(0, GROUND_Y, W, 3)
  ctx.shadowBlur = 0

  // Side pillars
  ctx.strokeStyle = 'rgba(0,200,255,0.15)'
  ctx.lineWidth = 1
  for (let i = 0; i < 5; i++) {
    const px = (W / 4) * i
    ctx.beginPath()
    ctx.moveTo(px, 0)
    ctx.lineTo(px, GROUND_Y)
    ctx.stroke()
  }

  // Ambient orbs
  const t = Date.now() * 0.001
  ;[[W * 0.2, 120, '#a855f7'], [W * 0.8, 150, '#00c8ff'], [W * 0.5, 80, '#ff6b35']].forEach(([ox, oy, c]) => {
    const grd = ctx.createRadialGradient(ox, oy + Math.sin(t) * 10, 0, ox, oy, 80)
    grd.addColorStop(0, c.replace(')', ',0.08)').replace('rgb', 'rgba'))
    grd.addColorStop(1, 'transparent')
    ctx.fillStyle = grd
    ctx.beginPath()
    ctx.arc(ox, oy + Math.sin(t) * 10, 80, 0, Math.PI * 2)
    ctx.fill()
  })

  ctx.restore()
}

// ---- Projectile drawing ----
function drawProjectiles(ctx, fighters) {
  fighters.forEach(f => {
    f.projectiles.forEach(p => {
      ctx.save()
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.shadowBlur = 20
      ctx.shadowColor = p.color
      ctx.fill()
      ctx.restore()
    })
  })
}

// ---- Meteor indicator ----
function drawMeteorIndicator(ctx, mx, color) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.setLineDash([6, 4])
  ctx.beginPath()
  ctx.moveTo(mx, 0)
  ctx.lineTo(mx, GROUND_Y)
  ctx.globalAlpha = 0.4
  ctx.stroke()
  ctx.restore()
}

// ---- Main render ----
export function render(ctx, state) {
  const { W, H, fighters, particles, shakeX, shakeY, meteor } = state
  ctx.clearRect(0, 0, W, H)

  drawArena(ctx, W, H, shakeX || 0, shakeY || 0)

  ctx.save()
  ctx.translate(shakeX || 0, shakeY || 0)

  if (meteor) drawMeteorIndicator(ctx, meteor.x, '#ff6b35')

  drawParticles(ctx, particles)
  drawProjectiles(ctx, fighters)
  fighters.forEach(f => drawStickman(ctx, f, f.animFrame))

  ctx.restore()
}
