import { GROUND_Y, GRAVITY, FLOOR_FRICTION, CHAR_DEFS } from './constants.js'
import { createHitBurst, createSlashTrail, createSparkle } from './particles.js'

export class Fighter {
  constructor(charId, x, facing, isPlayer) {
    const def = CHAR_DEFS[charId]
    this.charId = charId
    this.x = x
    this.y = GROUND_Y - def.height
    this.vx = 0
    this.vy = 0
    this.facing = facing
    this.isPlayer = isPlayer
    this.width = def.width
    this.height = def.height
    this.maxHp = def.maxHp
    this.hp = def.maxHp
    this.speed = def.speed
    this.jumpPower = def.jumpPower
    this.onGround = true
    this.attacks = def.attacks

    // State
    this.state = 'idle' // idle, run, attack, hit, dead, berserk
    this.attackKey = null
    this.attackPhase = 'windUp' // windUp | active | recovery
    this.attackTimer = 0
    this.hitFlash = 0
    this.dead = false
    this.animFrame = 0
    this.animTimer = 0

    // Special states
    this.frozen = 0
    this.armored = 0
    this.armorHp = 0
    this.berserk = 0
    this.counter = false

    // Projectiles owned by this fighter
    this.projectiles = []

    // Cooldowns: map key -> frames remaining
    this.cooldowns = { q: 0, e: 0, r: 0, ult: 0 }

    // Active hitbox this frame
    this.activeHitbox = null
  }

  get centerX() { return this.x + this.width / 2 }
  get centerY() { return this.y + this.height / 2 }
  get isAttacking() { return this.state === 'attack' }
  get isAlive() { return !this.dead }

  startAttack(key, particles) {
    if (this.state === 'attack' || this.frozen > 0 || this.dead) return false
    const atk = this.attacks[key]
    if (!atk) return false
    if (key !== 'basic' && this.cooldowns[key] > 0) return false

    this.state = 'attack'
    this.attackKey = key
    this.attackPhase = 'windUp'
    this.attackTimer = atk.windUp
    this.activeHitbox = null
    this.counter = atk.isCounter || false

    if (key !== 'basic') {
      this.cooldowns[key] = atk.cooldown
    }

    // Special attack initiations
    if (atk.isBlink) {
      const blinkDist = atk.range * this.facing
      this.x += blinkDist
      for (let i = 0; i < 3; i++) {
        particles.push(...createSparkle(this.x + this.width / 2, this.y + this.height / 2, '#a855f7'))
      }
    }
    if (atk.isCharge || atk.dashSpeed) {
      this.vx = (atk.dashSpeed || atk.chargeSpeed) * this.facing
    }
    if (atk.isArmor) {
      this.armored = atk.active
      this.armorHp = atk.armorAmount
    }
    if (atk.isBerserk) {
      this.berserk = atk.active
      this.speed *= 1.5
    }
    return true
  }

  update(particles) {
    if (this.dead) {
      this.vy += GRAVITY
      this.y += this.vy
      if (this.y > GROUND_Y + 100) this.y = GROUND_Y + 100
      return
    }

    // Timers
    if (this.hitFlash > 0) this.hitFlash--
    if (this.frozen > 0) this.frozen--
    if (this.armored > 0) this.armored--
    if (this.berserk > 0) {
      this.berserk--
      if (this.berserk === 0) this.speed = CHAR_DEFS[this.charId].speed
    }

    // Cooldowns
    for (const k in this.cooldowns) {
      if (this.cooldowns[k] > 0) this.cooldowns[k]--
    }

    // Physics
    if (!this.onGround || this.frozen === 0) {
      this.vy += GRAVITY
    }
    this.x += this.vx
    this.y += this.vy

    // Ground
    const groundY = GROUND_Y - this.height
    if (this.y >= groundY) {
      this.y = groundY
      this.vy = 0
      this.onGround = true
      this.vx *= FLOOR_FRICTION
      if (Math.abs(this.vx) < 0.1) this.vx = 0
    } else {
      this.onGround = false
    }

    // Walls
    if (this.x < 0) { this.x = 0; this.vx = 0 }
    if (this.x + this.width > 900) { this.x = 900 - this.width; this.vx = 0 }

    // Attack state machine
    if (this.state === 'attack') {
      this.attackTimer--
      const atk = this.attacks[this.attackKey]

      if (this.attackPhase === 'windUp' && this.attackTimer <= 0) {
        this.attackPhase = 'active'
        this.attackTimer = atk.active
        // Build hitbox
        if (!atk.isProjectile && !atk.isBlink && !atk.isArmor && !atk.isBerserk) {
          const hx = this.facing > 0 ? this.x + this.width : this.x - atk.range
          this.activeHitbox = {
            x: hx,
            y: this.y + this.height * 0.1,
            w: atk.range,
            h: this.height * 0.8,
            damage: atk.damage + (this.berserk > 0 ? 8 : 0),
            knockback: atk.knockback,
            isGroundSlam: atk.isGroundSlam,
            isAoe: atk.isAoe,
            isLauncher: atk.isLauncher,
            hits: atk.hits || 1,
            hitCount: 0,
          }
          if (atk.isAoe) {
            this.activeHitbox.x = this.centerX - atk.range
            this.activeHitbox.w = atk.range * 2
          }
        }
        // Spawn projectile
        if (atk.isProjectile) {
          this.projectiles.push({
            x: this.centerX, y: this.centerY,
            vx: this.facing * 11,
            vy: 0,
            damage: atk.damage,
            knockback: atk.knockback,
            color: this.charId === 'mage' ? '#a855f7' : '#00c8ff',
            size: this.attackKey === 'q' ? 12 : 8,
            owner: this,
            life: 60,
          })
        }
        // Meteor
        if (atk.isMeteor) {
          this.meteorTarget = null // will be set externally
        }
        // Slash trail particles
        if (!atk.isProjectile && !atk.isBlink && !atk.isArmor && !atk.isBerserk) {
          const cx = this.facing > 0 ? this.x + this.width + 20 : this.x - 20
          particles.push(...createSlashTrail(cx, this.centerY, this.facing, this.charId === 'sword' ? '#ff6b35' : this.charId === 'spear' ? '#4ecdc4' : '#ef4444'))
        }
      } else if (this.attackPhase === 'active' && this.attackTimer <= 0) {
        this.attackPhase = 'recovery'
        this.attackTimer = atk.recovery
        this.activeHitbox = null
      } else if (this.attackPhase === 'recovery' && this.attackTimer <= 0) {
        this.state = 'idle'
        this.attackKey = null
        this.counter = false
      }

      // Multi-hit: keep hitbox active
      if (this.attackPhase === 'active' && this.activeHitbox && this.attacks[this.attackKey].hits > 1) {
        // hitbox persists; damage is applied per check in engine
      }
    }

    // Animation
    this.animTimer++
    if (this.animTimer > 4) {
      this.animTimer = 0
      this.animFrame++
    }

    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i]
      p.x += p.vx
      p.y += p.vy
      p.life--
      if (p.life <= 0 || p.x < 0 || p.x > 900) {
        this.projectiles.splice(i, 1)
      }
    }
  }

  receiveHit(damage, knockbackX, knockbackY, particles, isCounter) {
    if (this.dead) return
    // Counter blocks
    if (this.counter && !isCounter) {
      this.counter = false
      return 'countered'
    }
    // Armor absorbs
    if (this.armored > 0 && this.armorHp > 0) {
      this.armorHp -= damage
      if (this.armorHp <= 0) this.armored = 0
      return 'armored'
    }
    this.hp -= damage
    this.hitFlash = 8
    this.vx += knockbackX
    this.vy += knockbackY
    // Interrupt attack (unless berserk)
    if (this.state === 'attack' && this.berserk === 0) {
      this.state = 'hit'
      this.attackTimer = 10
      this.activeHitbox = null
    }
    particles.push(...createHitBurst(this.centerX, this.centerY, '#fff'))
    if (this.hp <= 0) {
      this.hp = 0
      this.dead = true
      this.state = 'dead'
      this.vy = -8
      this.vx = knockbackX * 1.5
    }
    return 'hit'
  }

  jump() {
    if (this.onGround && !this.dead && this.frozen === 0) {
      this.vy = -this.jumpPower
      this.onGround = false
    }
  }

  move(dir) {
    if (this.dead || this.frozen > 0) return
    if (this.state === 'attack' && this.attackPhase !== 'windUp') return
    this.vx = dir * this.speed
    if (dir !== 0) this.facing = dir
  }
}
