export const CANVAS_W = 900
export const CANVAS_H = 500
export const GROUND_Y = 400
export const GRAVITY = 0.55
export const FLOOR_FRICTION = 0.82

export const CHAR_COLORS = {
  sword: { primary: '#ff6b35', glow: 'rgba(255,107,53,0.8)', trail: '#ff6b35' },
  spear: { primary: '#4ecdc4', glow: 'rgba(78,205,196,0.8)', trail: '#4ecdc4' },
  mage:  { primary: '#a855f7', glow: 'rgba(168,85,247,0.8)', trail: '#a855f7' },
  brute: { primary: '#ef4444', glow: 'rgba(239,68,68,0.8)', trail: '#ef4444' },
}

export const CHAR_DEFS = {
  sword: {
    maxHp: 120,
    speed: 4.8,
    jumpPower: 13,
    width: 28,
    height: 60,
    attacks: {
      basic: { name: 'Quick Slash', windUp: 6, active: 6, recovery: 10, damage: 14, knockback: 5, range: 70, cooldown: 0 },
      q:     { name: 'Blade Dash', windUp: 4, active: 8, recovery: 12, damage: 18, knockback: 8, range: 90, cooldown: 200, dashSpeed: 12 },
      e:     { name: 'Counter Stance', windUp: 4, active: 30, recovery: 8, damage: 28, knockback: 12, range: 75, cooldown: 350, isCounter: true },
      r:     { name: 'Rising Cut', windUp: 5, active: 10, recovery: 14, damage: 22, knockback: 10, range: 65, cooldown: 280 },
      ult:   { name: 'Flurry of Five', windUp: 8, active: 40, recovery: 18, damage: 10, knockback: 4, range: 80, cooldown: 600, hits: 5 },
    }
  },
  spear: {
    maxHp: 110,
    speed: 4.2,
    jumpPower: 12,
    width: 26,
    height: 62,
    attacks: {
      basic: { name: 'Thrust', windUp: 7, active: 7, recovery: 12, damage: 16, knockback: 6, range: 110, cooldown: 0 },
      q:     { name: 'Long Thrust', windUp: 8, active: 8, recovery: 14, damage: 22, knockback: 10, range: 140, cooldown: 220 },
      e:     { name: 'Spinning Sweep', windUp: 10, active: 14, recovery: 16, damage: 18, knockback: 14, range: 100, cooldown: 300, isAoe: true },
      r:     { name: 'Vault Kick', windUp: 5, active: 8, recovery: 10, damage: 12, knockback: 16, range: 80, cooldown: 250, isLauncher: true },
      ult:   { name: 'Spear Storm', windUp: 12, active: 50, recovery: 20, damage: 12, knockback: 6, range: 160, cooldown: 600, hits: 4 },
    }
  },
  mage: {
    maxHp: 90,
    speed: 3.8,
    jumpPower: 14,
    width: 24,
    height: 58,
    attacks: {
      basic: { name: 'Arcane Bolt', windUp: 6, active: 5, recovery: 10, damage: 15, knockback: 5, range: 200, cooldown: 0, isProjectile: true },
      q:     { name: 'Charged Bolt', windUp: 10, active: 6, recovery: 12, damage: 28, knockback: 8, range: 220, cooldown: 250, isProjectile: true },
      e:     { name: 'Blink', windUp: 4, active: 4, recovery: 8, damage: 0, knockback: 0, range: 140, cooldown: 300, isBlink: true },
      r:     { name: 'Frost Nova', windUp: 8, active: 12, recovery: 16, damage: 20, knockback: 12, range: 100, cooldown: 320, isAoe: true, freezeDur: 60 },
      ult:   { name: 'Meteor Strike', windUp: 20, active: 16, recovery: 20, damage: 55, knockback: 20, range: 120, cooldown: 700, isMeteor: true },
    }
  },
  brute: {
    maxHp: 160,
    speed: 3.4,
    jumpPower: 11,
    width: 34,
    height: 64,
    attacks: {
      basic: { name: 'Heavy Smash', windUp: 12, active: 8, recovery: 18, damage: 28, knockback: 14, range: 72, cooldown: 0 },
      q:     { name: 'Ground Slam', windUp: 14, active: 10, recovery: 22, damage: 35, knockback: 18, range: 110, cooldown: 300, isGroundSlam: true },
      e:     { name: 'Shoulder Charge', windUp: 8, active: 16, recovery: 14, damage: 20, knockback: 22, range: 120, cooldown: 280, isCharge: true, chargeSpeed: 10 },
      r:     { name: 'Armor Up', windUp: 6, active: 40, recovery: 10, damage: 0, knockback: 0, range: 0, cooldown: 400, isArmor: true, armorAmount: 15 },
      ult:   { name: 'Berserker Rage', windUp: 10, active: 80, recovery: 20, damage: 0, knockback: 0, range: 0, cooldown: 700, isBerserk: true },
    }
  }
}
