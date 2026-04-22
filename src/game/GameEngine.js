import { Fighter } from './Fighter.js'
import { AIController } from './AIController.js'
import { updateParticles, createHitBurst, createMeteorParticles } from './particles.js'
import { render } from './renderer.js'
import { CANVAS_W, CANVAS_H, CHAR_DEFS } from './constants.js'

const AI_CHARS = ['sword', 'spear', 'mage', 'brute']

export class GameEngine {
  constructor(canvas, playerCharId, onEnd) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.onEnd = onEnd
    this.running = false
    this.raf = null

    // Pick a different char for AI
    const aiChars = AI_CHARS.filter(c => c !== playerCharId)
    const aiCharId = aiChars[Math.floor(Math.random() * aiChars.length)]

    this.player = new Fighter(playerCharId, 150, 1, true)
    this.enemy = new Fighter(aiCharId, 700, -1, false)
    this.ai = new AIController(this.enemy, this.player)

    this.particles = []
    this.keys = {}
    this.shakeX = 0
    this.shakeY = 0
    this.shakeMag = 0

    this.meteor = null // { x, y, vy, timer }
    this.gameOverTimer = 0

    this._bindKeys()
  }

  _bindKeys() {
    this._onKeyDown = (e) => {
      this.keys[e.code] = true
      e.preventDefault()

      if (!this.player.dead) {
        if (e.code === 'KeyJ' || e.code === 'KeyZ') this.player.startAttack('basic', this.particles)
        if (e.code === 'KeyQ') this.player.startAttack('q', this.particles)
        if (e.code === 'KeyE') this.player.startAttack('e', this.particles)
        if (e.code === 'KeyR') this.player.startAttack('r', this.particles)
        if (e.code === 'KeyF') {
          if (this.player.startAttack('ult', this.particles)) {
            if (this.player.charId === 'mage') {
              this.meteor = {
                x: this.enemy.centerX,
                y: -40,
                vy: 6,
                timer: 0,
                hit: false,
              }
            }
          }
        }
        if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') this.player.jump()
      }
    }
    this._onKeyUp = (e) => { this.keys[e.code] = false }
    window.addEventListener('keydown', this._onKeyDown)
    window.addEventListener('keyup', this._onKeyUp)
  }

  destroy() {
    window.removeEventListener('keydown', this._onKeyDown)
    window.removeEventListener('keyup', this._onKeyUp)
    if (this.raf) cancelAnimationFrame(this.raf)
  }

  start() {
    this.running = true
    this.loop()
  }

  loop() {
    if (!this.running) return
    this.update()
    this.draw()
    this.raf = requestAnimationFrame(() => this.loop())
  }

  update() {
    // Player movement
    if (!this.player.dead) {
      let dir = 0
      if (this.keys['ArrowLeft'] || this.keys['KeyA']) dir = -1
      if (this.keys['ArrowRight'] || this.keys['KeyD']) dir = 1
      this.player.move(dir)
    }

    // AI
    this.ai.update()

    // Update fighters
    this.player.update(this.particles)
    this.enemy.update(this.particles)

    // Collision detection
    this._resolveAttacks(this.player, this.enemy)
    this._resolveAttacks(this.enemy, this.player)
    this._resolveProjectiles(this.player, this.enemy)
    this._resolveProjectiles(this.enemy, this.player)

    // Meteor
    if (this.meteor && !this.meteor.hit) {
      this.meteor.y += this.meteor.vy
      this.meteor.vy += 0.4
      if (this.meteor.y >= this.enemy.y) {
        this._applyHit(this.player, this.enemy, {
          damage: CHAR_DEFS.mage.attacks.ult.damage,
          knockback: CHAR_DEFS.mage.attacks.ult.knockback,
        })
        this.particles.push(...createMeteorParticles(this.meteor.x, this.enemy.y))
        this._shake(15)
        this.meteor.hit = true
        this.meteor = null
      }
    }

    // Screen shake
    if (this.shakeMag > 0) {
      this.shakeX = (Math.random() - 0.5) * this.shakeMag
      this.shakeY = (Math.random() - 0.5) * this.shakeMag
      this.shakeMag *= 0.85
      if (this.shakeMag < 0.5) { this.shakeMag = 0; this.shakeX = 0; this.shakeY = 0 }
    }

    // Particles
    updateParticles(this.particles)

    // End condition
    if (this.player.dead || this.enemy.dead) {
      this.gameOverTimer++
      if (this.gameOverTimer > 90) {
        this.running = false
        this.onEnd(this.enemy.dead ? 'win' : 'lose')
      }
    }
  }

  _resolveAttacks(attacker, defender) {
    const hb = attacker.activeHitbox
    if (!hb) return
    const def = defender

    const overlap = !(
      hb.x + hb.w < def.x ||
      hb.x > def.x + def.width ||
      hb.y + hb.h < def.y ||
      hb.y > def.y + def.height
    )

    if (!overlap) return

    // Multi-hit limit
    if (hb.hits > 1) {
      if (!hb._hitTargets) hb._hitTargets = new Set()
      const frameKey = Math.floor(attacker.attackTimer / 6)
      const hitId = `${frameKey}`
      if (hb._hitTargets.has(hitId)) return
      hb._hitTargets.add(hitId)
    }

    const dir = attacker.facing
    const kbX = dir * hb.knockback * 1.2
    const kbY = hb.isLauncher ? -10 : hb.isGroundSlam ? -6 : -3

    const result = defender.receiveHit(hb.damage, kbX, kbY, this.particles, attacker.counter)
    if (result === 'hit' || result === 'countered') {
      this._shake(hb.knockback * 0.6)
      if (result === 'countered') {
        // Counter: deal damage back
        attacker.receiveHit(hb.damage * 0.8, -kbX, kbY, this.particles, false)
        this._shake(12)
      }
      // Single-hit attacks remove hitbox after landing
      if (!hb.hits || hb.hits <= 1) {
        attacker.activeHitbox = null
      }
    }
  }

  _resolveProjectiles(shooter, target) {
    for (let i = shooter.projectiles.length - 1; i >= 0; i--) {
      const p = shooter.projectiles[i]
      const hit = (
        p.x + p.size > target.x &&
        p.x - p.size < target.x + target.width &&
        p.y + p.size > target.y &&
        p.y - p.size < target.y + target.height
      )
      if (hit) {
        target.receiveHit(p.damage, p.vx * 0.5, -3, this.particles, false)
        this.particles.push(...createHitBurst(p.x, p.y, p.color))
        this._shake(5)
        shooter.projectiles.splice(i, 1)
      }
    }
  }

  _applyHit(attacker, target, opts) {
    const dir = attacker.facing
    target.receiveHit(opts.damage, dir * opts.knockback, -4, this.particles, false)
  }

  _shake(mag) {
    this.shakeMag = Math.max(this.shakeMag, mag)
  }

  draw() {
    render(this.ctx, {
      W: CANVAS_W,
      H: CANVAS_H,
      fighters: [this.player, this.enemy],
      particles: this.particles,
      shakeX: this.shakeX,
      shakeY: this.shakeY,
      meteor: this.meteor,
    })
  }
}
