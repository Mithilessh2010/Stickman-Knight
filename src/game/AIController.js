// Simple state-machine AI
export class AIController {
  constructor(fighter, target) {
    this.fighter = fighter
    this.target = target
    this.state = 'approach'
    this.stateTimer = 0
    this.reactionTime = 0
    this.aggressionTimer = 0
  }

  update() {
    const f = this.fighter
    const t = this.target
    if (f.dead || t.dead) return

    const dx = t.centerX - f.centerX
    const dist = Math.abs(dx)
    const def = getAtkDef(f)
    const preferredRange = def.preferredRange
    const attackRange = def.attackRange

    this.stateTimer--
    this.reactionTime--
    this.aggressionTimer--

    // Face target
    if (dx !== 0) f.facing = dx > 0 ? 1 : -1

    // State transitions
    if (this.stateTimer <= 0) {
      if (f.state === 'attack') {
        this.state = 'attack'
      } else if (dist > preferredRange + 40) {
        this.state = 'approach'
        this.stateTimer = 20 + Math.random() * 30
      } else if (dist < preferredRange - 20) {
        this.state = 'retreat'
        this.stateTimer = 15 + Math.random() * 20
      } else {
        this.state = Math.random() < 0.4 ? 'attack' : 'circle'
        this.stateTimer = 20 + Math.random() * 25
      }
    }

    // Execute state
    switch (this.state) {
      case 'approach':
        f.move(dx > 0 ? 1 : -1)
        break
      case 'retreat':
        f.move(dx > 0 ? -1 : 1)
        break
      case 'circle':
        f.move(Math.sin(Date.now() * 0.003) > 0 ? 1 : -1)
        break
      case 'attack':
        f.move(0)
        if (f.state !== 'attack' && this.reactionTime <= 0 && dist < attackRange) {
          this.pickAttack(dist, f, t)
          this.reactionTime = 20 + Math.random() * 30
        }
        if (dist > attackRange) {
          this.state = 'approach'
          this.stateTimer = 15
        }
        break
    }

    // Opportunistic attacks
    if (this.aggressionTimer <= 0 && dist < attackRange && f.state !== 'attack') {
      this.pickAttack(dist, f, t)
      this.aggressionTimer = 40 + Math.random() * 40
    }

    // Jump over projectiles sometimes
    if (t.projectiles.length > 0 && f.onGround && Math.random() < 0.06) {
      f.jump()
    }

    // Occasional jump
    if (f.onGround && Math.random() < 0.008) f.jump()
  }

  pickAttack(dist, f, t) {
    const keys = ['basic', 'q', 'e', 'r', 'ult']
    // Weight towards basic, use abilities sometimes
    const roll = Math.random()
    let key = 'basic'
    if (roll < 0.12 && f.cooldowns.ult === 0) key = 'ult'
    else if (roll < 0.3 && f.cooldowns.r === 0) key = 'r'
    else if (roll < 0.5 && f.cooldowns.e === 0) key = 'e'
    else if (roll < 0.65 && f.cooldowns.q === 0) key = 'q'

    f.startAttack(key, [])
  }
}

function getAtkDef(f) {
  const ranges = {
    sword: { preferredRange: 70, attackRange: 90 },
    spear: { preferredRange: 100, attackRange: 130 },
    mage:  { preferredRange: 160, attackRange: 200 },
    brute: { preferredRange: 60, attackRange: 80 },
  }
  return ranges[f.charId] || { preferredRange: 80, attackRange: 100 }
}
